import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "./solana_migration";
import * as idl from "./solana_migration.json";
import { migrate, updateWhitelist, withdrawSourceToken, withdrawTargetToken } from "./calls/index";
import logger from "../logger";

export interface SolanaClientConfig {
    rpcUrl: string;
    wallet?: {
        publicKey: anchor.web3.PublicKey;
        signTransaction: <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(tx: T) => Promise<T>;
        signAllTransactions: <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(txs: T[]) => Promise<T[]>;
    };
}

export class SolanaMigrationClient {
    private connection: anchor.web3.Connection;
    private program: Program<SolanaMigration>;
    private wallet: anchor.Wallet;
    private programId: anchor.web3.PublicKey;

    constructor(config: SolanaClientConfig) {
        // Validate RPC URL
        if (!config.rpcUrl || (!config.rpcUrl.startsWith('http://') && !config.rpcUrl.startsWith('https://'))) {
            throw new Error(`Invalid RPC URL: ${config.rpcUrl}. URL must start with 'http://' or 'https://'`);
        }
        
        logger.info(`[SolanaMigrationClient] Creating connection with RPC URL: ${config.rpcUrl}`);
        this.connection = new anchor.web3.Connection(config.rpcUrl, "confirmed");

        // Get programId from environment variables
        const programIdString = process.env.NEXT_PUBLIC_SOLANA_MIGRATION_PROGRAM_ID;
        if (!programIdString) {
            throw new Error("NEXT_PUBLIC_SOLANA_MIGRATION_PROGRAM_ID environment variable is not set");
        }
        this.programId = new anchor.web3.PublicKey(programIdString);

        // Create wallet adapter - use provided wallet or create a spoofed one
        const walletToUse = config.wallet || this.createSpoofedWallet();
        
        // Initialize the program with AnchorProvider (following the same pattern as your working code)
        const provider = new anchor.AnchorProvider(
            this.connection,
            {
                publicKey: walletToUse.publicKey,
                signTransaction: walletToUse.signTransaction,
                signAllTransactions: walletToUse.signAllTransactions,
            },
            anchor.AnchorProvider.defaultOptions()
        );

        // Store the wallet adapter for later use
        this.wallet = {
            publicKey: walletToUse.publicKey,
            signTransaction: walletToUse.signTransaction,
            signAllTransactions: walletToUse.signAllTransactions,
        } as any; // Type assertion to avoid payer property issues

        // Create IDL with the programId from environment
        const idlWithProgramId = {
            ...idl,
            address: programIdString
        };

        this.program = new Program<SolanaMigration>(
            idlWithProgramId as unknown,
            provider
        );

        logger.info("[SolanaMigrationClient] Initialized", {
            rpcUrl: config.rpcUrl,
            programId: this.programId.toString(),
            walletAddress: this.wallet.publicKey.toString(),
        });
        
        // Test the connection
        this.testConnection();
    }

    private async testConnection() {
        try {
            const version = await this.connection.getVersion();
            logger.info("[SolanaMigrationClient] RPC connection test successful", {
                version: version['solana-core']
            });
        } catch (error) {
            logger.error("[SolanaMigrationClient] RPC connection test failed:", error);
            throw new Error(`Failed to connect to RPC endpoint: ${error}`);
        }
    }

    private createSpoofedWallet() {
        const keypair = anchor.web3.Keypair.generate();
        return {
            publicKey: keypair.publicKey,
            signTransaction: async <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(tx: T): Promise<T> => {
                if (tx instanceof anchor.web3.Transaction) {
                    tx.partialSign(keypair);
                } else if (tx instanceof anchor.web3.VersionedTransaction) {
                    tx.sign([keypair]);
                }
                return tx;
            },
            signAllTransactions: async <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(txs: T[]): Promise<T[]> => {
                return txs.map((tx) => {
                    if (tx instanceof anchor.web3.Transaction) {
                        tx.partialSign(keypair);
                    } else if (tx instanceof anchor.web3.VersionedTransaction) {
                        tx.sign([keypair]);
                    }
                    return tx;
                });
            },
        };
    }


    async executeMigration(params: {
        authority: anchor.web3.PublicKey;
        amount: string;
        limitAmount: string;
        proof: Buffer[];
    }): Promise<string> {
        try {
            logger.info("[SolanaMigrationClient] Executing migration", {
                authority: params.authority.toString(),
                amount: params.amount,
                limitAmount: params.limitAmount,
            });

            const transactionHash = await migrate({
                program: this.program,
                authority: params.authority,
                amount: new anchor.BN(params.amount),
                limitAmount: new anchor.BN(params.amount),
                proof: params.proof,
            });

            logger.info("[SolanaMigrationClient] Migration completed", {
                transactionHash,
                authority: params.authority.toString(),
            });

            return transactionHash;
        } catch (error) {
            logger.error("[SolanaMigrationClient] Migration failed:", error);
            throw error;
        }
    }


    async updateWhitelist(params: {
        authority: anchor.Wallet;
        root: number[];
    }): Promise<string> {
        try {
            logger.info("[SolanaMigrationClient] Updating whitelist", {
                authority: params.authority.publicKey.toString(),
                rootLength: params.root.length,
            });

            const transactionHash = await updateWhitelist({
                program: this.program,
                authority: params.authority,
                root: params.root,
            });

            logger.info("[SolanaMigrationClient] Whitelist updated", {
                transactionHash,
                authority: params.authority.publicKey.toString(),
            });

            return transactionHash;
        } catch (error) {
            logger.error("[SolanaMigrationClient] Whitelist update failed:", error);
            throw error;
        }
    }


    async withdrawSourceToken(params: {
        authority: anchor.web3.PublicKey;
        receiveAta: anchor.web3.PublicKey;
    }): Promise<string> {
        try {
            logger.info("[SolanaMigrationClient] Withdrawing source tokens", {
                authority: params.authority.toString(),
                receiveAta: params.receiveAta.toString(),
            });

            const transactionHash = await withdrawSourceToken({
                program: this.program,
                authority: params.authority,
                receiveAta: params.receiveAta,
            });

            logger.info("[SolanaMigrationClient] Source tokens withdrawn", {
                transactionHash,
                authority: params.authority.toString(),
            });

            return transactionHash;
        } catch (error) {
            logger.error("[SolanaMigrationClient] Source token withdrawal failed:", error);
            throw error;
        }
    }


    async withdrawTargetToken(params: {
        authority: anchor.web3.PublicKey;
        receiveAta: anchor.web3.PublicKey;
    }): Promise<string> {
        try {
            logger.info("[SolanaMigrationClient] Withdrawing target tokens", {
                authority: params.authority.toString(),
                receiveAta: params.receiveAta.toString(),
            });

            const transactionHash = await withdrawTargetToken({
                program: this.program,
                authority: params.authority,
                receiveAta: params.receiveAta,
            });

            logger.info("[SolanaMigrationClient] Target tokens withdrawn", {
                transactionHash,
                authority: params.authority.toString(),
            });

            return transactionHash;
        } catch (error) {
            logger.error("[SolanaMigrationClient] Target token withdrawal failed:", error);
            throw error;
        }
    }


    getProgram(): Program<SolanaMigration> {
        return this.program;
    }


    getConnection(): anchor.web3.Connection {
        return this.connection;
    }


    getWallet(): anchor.Wallet {
        return this.wallet;
    }

    getProgramId(): anchor.web3.PublicKey {
        return this.programId;
    }


    setWallet(wallet: {
        publicKey: anchor.web3.PublicKey;
        signTransaction: <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(tx: T) => Promise<T>;
        signAllTransactions: <T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(txs: T[]) => Promise<T[]>;
    }): void {
        // Update the provider with the new wallet
        const provider = new anchor.AnchorProvider(
            this.connection,
            {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions,
            },
            anchor.AnchorProvider.defaultOptions()
        );

        // Create IDL with the programId from environment
        const idlWithProgramId = {
            ...idl,
            address: this.programId.toString()
        };

        this.program = new Program<SolanaMigration>(
            idlWithProgramId as unknown,
            provider
        );

        // Update stored wallet
        this.wallet = {
            publicKey: wallet.publicKey,
            signTransaction: wallet.signTransaction,
            signAllTransactions: wallet.signAllTransactions,
        } as any; // Type assertion to avoid payer property issues

        logger.info("[SolanaMigrationClient] Wallet updated", {
            walletAddress: this.wallet.publicKey.toString(),
        });
    }
}
