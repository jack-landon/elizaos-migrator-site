import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "../solana_migration";
import {
    getFaucetAuthority,
    getSourceTokenAccount,
    getTargetTokenAccount,
    getUserStateAccount,
    sourceToken,
    targetToken,
    allowedAddresses,
    limitAmount,
} from "../utils";
import { getMerkleProof } from "@metaplex-foundation/js";
import { createHash } from "crypto";

export interface MigrateParams {
    program: Program<SolanaMigration>;
    authority: anchor.web3.PublicKey;
    amount: anchor.BN;
    proof: Buffer[];
}

export async function migrate(params: MigrateParams): Promise<string> {
    const { program, authority, amount, proof: _proof } = params;
    // Use the constant limitAmount from utils instead of the parameter
    const limitAmountValue = new anchor.BN(limitAmount);

    // Generate the Merkle root for all wallets
    const leaves: Buffer[] = [];
    for (let i = 0; i < allowedAddresses.length; i++) {
        const leaf = Buffer.from([
            ...allowedAddresses[i].toBuffer(),
            ...limitAmountValue.toArray("le", 8),
        ]);
        leaves.push(leaf);
    }
    
    // Calculate Merkle root
    let currentLevel = [...leaves];
    while (currentLevel.length > 1) {
        const nextLevel: Buffer[] = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = currentLevel[i + 1] || left;
            nextLevel.push(createHash('sha256').update(Buffer.concat([left, right])).digest());
        }
        currentLevel = nextLevel;
    }
    const _merkleRoot = currentLevel[0];

    // Generate Merkle proof
    let merkleProof: Buffer[] = [];
    try {
        // Find the index of the current wallet in the allowed addresses
        const walletIndex = allowedAddresses.findIndex(addr => addr.equals(authority));
        
        if (walletIndex === -1) {
            throw new Error("Wallet not found in whitelist");
        }
        
        // Generate leaves for the Merkle tree
        const leaves: Buffer[] = [];
        for (let i = 0; i < allowedAddresses.length; i++) {
            const leaf = Buffer.from([
                ...allowedAddresses[i].toBuffer(),
                ...limitAmountValue.toArray("le", 8),
            ]);
            leaves.push(leaf);
        }
        
        // Generate the leaf for the current wallet
        const leaf = Buffer.from([
            ...authority.toBuffer(),
            ...limitAmountValue.toArray("le", 8),
        ]);
        
        // Generate Merkle proof
        const proofUint8Arrays = getMerkleProof(leaves, leaf, walletIndex);
        merkleProof = proofUint8Arrays.map(proof => Buffer.from(proof));
    } catch (_error) {
        console.error("Error generating Merkle proof:", _error);
        throw new Error("Failed to generate Merkle proof for wallet");
    }

    const faucetAuthority = getFaucetAuthority(program.programId);
    const userStateAccount = getUserStateAccount(program.programId, authority);
    const sourceTokenAccount = getSourceTokenAccount(sourceToken, program.programId);
    const targetTokenAccount = getTargetTokenAccount(targetToken, program.programId);

    // Use correct ATA address calculation for different token programs
    const fromAta = await spl.getAssociatedTokenAddress(
        sourceToken, 
        authority, 
        false, // allowOwnerOffCurve
        spl.TOKEN_2022_PROGRAM_ID // token program ID for source token
    );
    const receiveTa = await spl.getAssociatedTokenAddress(
        targetToken, 
        authority, 
        false, // allowOwnerOffCurve
        spl.TOKEN_PROGRAM_ID // token program ID for target token
    );

    const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state_account_seed")],
        program.programId
    );

    // Check if source token ATA exists, create if not
    try {
        await program.provider.connection.getTokenAccountBalance(fromAta);
    } catch (_error) {
        const createSourceAtaIx = spl.createAssociatedTokenAccountInstruction(
            authority, // payer
            fromAta, // ata
            authority, // owner
            sourceToken, // mint
            spl.TOKEN_2022_PROGRAM_ID // token program ID for source token
        );
        
        const tx = new anchor.web3.Transaction().add(createSourceAtaIx);
        const provider = program.provider as anchor.AnchorProvider;
        await provider.sendAndConfirm(tx, []);
    }

    // Check if target token ATA exists, create if not
    try {
        await program.provider.connection.getTokenAccountBalance(receiveTa);
    } catch (_error) {
        const createTargetAtaIx = spl.createAssociatedTokenAccountInstruction(
            authority, // payer
            receiveTa, // ata
            authority, // owner
            targetToken, // mint
            spl.TOKEN_PROGRAM_ID // token program ID for target token
        );
        
        const tx = new anchor.web3.Transaction().add(createTargetAtaIx);
        const provider = program.provider as anchor.AnchorProvider;
        await provider.sendAndConfirm(tx, []);
    }

    const tx = await program.rpc.migrate(amount, limitAmountValue, merkleProof, {
        accounts: {
            authority: authority,
            userState: userStateAccount,
            faucetAuthority: faucetAuthority,
            fromTa: fromAta,
            receiveTa: receiveTa,
            targetToken: targetToken,
            sourceToken: sourceToken,
            globalSourceTokenAccount: sourceTokenAccount,
            globalTargetTokenAccount: targetTokenAccount,
            stateAccount: stateAccount,
            sourceTokenProgram: spl.TOKEN_2022_PROGRAM_ID,
            targetTokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });

    return tx;
}
