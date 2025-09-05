import { useState, useCallback } from 'react';
import { useSolanaWallet } from './useSolanaWallet';
import { useTransactionListener } from '@/providers';
import { Connection, PublicKey, ComputeBudgetProgram, VersionedTransaction, TransactionMessage, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, getMint, createApproveInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, NATIVE_MINT } from '@solana/spl-token';
import { WalletContextState } from "@solana/wallet-adapter-react";

import { BN } from '@coral-xyz/anchor';
import {
  CCIPSendRequest,
  CCIPSendAccounts,
  CCIPInstructionResult,
  createExtraArgsBuffer,
  evmAddressToSolanaBytes,
  findConfigPDA,
  findDestChainStatePDA,
  findNoncePDA,
  findFeeBillingSignerPDA,
  findFqConfigPDA,
  findFqDestChainPDA,
  findFqBillingTokenConfigPDA,
  findRMNRemoteConfigPDA,
  findRMNRemoteCursesPDA,
  CCIP_ROUTER_PROGRAM_ID,
  FEE_QUOTER_PROGRAM_ID,
  RMN_REMOTE_PROGRAM_ID,
  LINK_TOKEN_MINT,
  buildTokenAccountsForSend,
  createCcipSendInstruction,
} from '@/lib/ccip';

export interface BridgeResult {
  signature: string;
  messageId: string;
  ccipExplorerUrl: string;
  solanaExplorerUrl: string;
}

export interface UseBridgeReturn {
  isLoading: boolean;
  error: string | null;
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
  transactionHash: string | null;
  executeBridge: (params: {
    allowOutOfOrderExecution: boolean;
    gasLimit: number;
    amount: string;
    recipientAddress: string;
    targetChain?: string;
  }) => Promise<BridgeResult | null>;
  approveTokens: (params: {
    amount: string;
  }) => Promise<string | null>;
  checkTokenDelegation: (tokenMint: string, requiredAmount?: string) => Promise<boolean>;
  delegateTokens: (tokenMint: string, amount: bigint) => Promise<string | null>;
}

const SOURCE_TOKEN = 'DuMbhu7mvQvqQHGcnikDgb4XegXJRyhUBfdU22uELiZA'; // Eliza

const CHAIN_SELECTORS = {
  mainnet: {
    base: BigInt('15971525489660198786'), // Base mainnet
    eth: BigInt('5009297550715157269'), // Ethereum mainnet
    bsc: BigInt('11344663589394136015'), // BSC mainnet
    arbitrum: BigInt('4949039107694359620'), // Arbitrum mainnet
    hyper: BigInt('2442541497099098535') // Hyperliquid mainnet
  },
  testnet: {
    base: BigInt('10344971235874465080'), // Base Sepolia
    eth: BigInt('16015286601757825753'), // Ethereum Sepolia 
    bsc: BigInt('13264668187771770619'), // BSC Testnet
    arbitrum: BigInt('3478487238524512106'), // Arbitrum Sepolia
  }
};

async function createCcipMessageInstruction({
  connection,
  payer,
  sourceTokenMint,
  amount,
  destinationChainSelector,
  receiverAddress,
  targetChain,
  gasLimit = 0,
  allowOutOfOrderExecution = true,
}: {
  connection: Connection;
  payer: PublicKey;
  sourceTokenMint: PublicKey;
  amount: bigint;
  destinationChainSelector: bigint;
  receiverAddress: string;
  targetChain: string;
  gasLimit?: number;
  allowOutOfOrderExecution?: boolean;
}): Promise<CCIPInstructionResult> {


  // Convert EVM address to Solana bytes
  const receiver = evmAddressToSolanaBytes(receiverAddress);
  const data = new Uint8Array(0); // Empty data for token transfers

  // Create token amounts array
  const tokenAmounts = [{
    token: sourceTokenMint,
    amount: new BN(amount.toString())
  }];

  // Use native SOL for fees
  const feeToken = PublicKey.default;
  const feeTokenMint = NATIVE_MINT;
  const isNativeSol = true;

  const extraArgs = createExtraArgsBuffer(gasLimit, allowOutOfOrderExecution);

  // Build the CCIP send request
  const sendRequest: CCIPSendRequest = {
    destChainSelector: new BN(destinationChainSelector.toString()),
    receiver,
    data,
    tokenAmounts,
    feeToken,
    extraArgs
  };

        // Build accounts for the ccipSend instruction
      const accounts = await buildCCIPSendAccounts(
        destinationChainSelector,
        feeTokenMint,
        isNativeSol,
        payer
      );
      
      const destChainStateInfo = await connection.getAccountInfo(accounts.destChainState);
      
      if (!destChainStateInfo) {
        const isDevnet = process.env.NEXT_PUBLIC_NETWORK === 'devnet';
        const chainName = targetChain === 'eth' ? (isDevnet ? 'Ethereum Sepolia' : 'Ethereum') : 
                         targetChain === 'base' ? (isDevnet ? 'Base Sepolia' : 'Base') : 
                         targetChain === 'bsc' ? (isDevnet ? 'BSC Testnet' : 'BSC') : 
                         targetChain === 'hyper' ? (isDevnet ? 'Hyperliquid Testnet' : 'Hyperliquid') : targetChain;
        
        
        throw new Error(
          `Destination chain "${chainName}" is not yet supported by the CCIP router. ` +
          `The chain needs to be initialized by the router administrator before users can send messages to it. ` +
          `Please contact the administrator to add support for ${chainName} chain. ` +
          `Chain selector: ${destinationChainSelector.toString()}`
        );
      }

  // Build token accounts and lookup tables
  const { tokenIndexes, remainingAccounts, lookupTableList } = await buildTokenAccountsForSend(
    sendRequest,
    connection,
    TOKEN_PROGRAM_ID,
    payer
  );

  // Create the instruction with proper serialization
  const instruction = createCcipSendInstruction(
    sendRequest,
    accounts,
    remainingAccounts,
    new Uint8Array(tokenIndexes)
  );

  return {
    instruction,
    remainingAccounts,
    lookupTableList,
    tokenIndexes
  };
}

async function buildCCIPSendAccounts(
  selectorBigInt: bigint,
  feeTokenMint: PublicKey,
  isNativeSol: boolean,
  signerPublicKey: PublicKey
): Promise<CCIPSendAccounts> {

  // Find all the PDAs needed for the ccipSend instruction
  const [configPDA] = findConfigPDA(CCIP_ROUTER_PROGRAM_ID);
  const [destChainState] = findDestChainStatePDA(selectorBigInt, CCIP_ROUTER_PROGRAM_ID);
  const [nonce] = findNoncePDA(selectorBigInt, signerPublicKey, CCIP_ROUTER_PROGRAM_ID);
  const [feeBillingSigner] = findFeeBillingSignerPDA(CCIP_ROUTER_PROGRAM_ID);
  const [feeQuoterConfig] = findFqConfigPDA(FEE_QUOTER_PROGRAM_ID);
  const [fqDestChain] = findFqDestChainPDA(selectorBigInt, FEE_QUOTER_PROGRAM_ID);
  const [fqBillingTokenConfig] = findFqBillingTokenConfigPDA(feeTokenMint, FEE_QUOTER_PROGRAM_ID);
  const [fqLinkBillingTokenConfig] = findFqBillingTokenConfigPDA(LINK_TOKEN_MINT, FEE_QUOTER_PROGRAM_ID);
  
  const [rmnRemoteCurses] = findRMNRemoteCursesPDA(RMN_REMOTE_PROGRAM_ID);
  const [rmnRemoteConfig] = findRMNRemoteConfigPDA(RMN_REMOTE_PROGRAM_ID);

  // Get the associated token accounts
  const userFeeTokenAccount = isNativeSol
    ? PublicKey.default // For native SOL we use the default public key
    : await getAssociatedTokenAddress(feeTokenMint, signerPublicKey, true, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

  const feeBillingSignerFeeTokenAccount = await getAssociatedTokenAddress(
    feeTokenMint,
    feeBillingSigner,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return {
    config: configPDA,
    destChainState,
    nonce,
    authority: signerPublicKey,
    systemProgram: new PublicKey('11111111111111111111111111111111'),
    feeTokenProgram: TOKEN_PROGRAM_ID,
    feeTokenMint,
    feeTokenUserAssociatedAccount: userFeeTokenAccount,
    feeTokenReceiver: feeBillingSignerFeeTokenAccount,
    feeBillingSigner,
    feeQuoter: FEE_QUOTER_PROGRAM_ID,
    feeQuoterConfig,
    feeQuoterDestChain: fqDestChain,
    feeQuoterBillingTokenConfig: fqBillingTokenConfig,
    feeQuoterLinkTokenConfig: fqLinkBillingTokenConfig,
    rmnRemote: RMN_REMOTE_PROGRAM_ID,
    rmnRemoteCurses,
    rmnRemoteConfig,
  };
}

// fee billing signer PDA
async function deriveFeeBillingSignerPDA(programId: PublicKey): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddress([Buffer.from('fee_billing_signer')], programId);
  return pda;
}

// Token delegation functions for CCIP prerequisites
async function checkTokenDelegation(
  connection: Connection,
  tokenMint: PublicKey,
  userPubkey: PublicKey,
  delegatePubkey: PublicKey
): Promise<boolean> {
  try {
    const userTokenAccount = await getAssociatedTokenAddress(tokenMint, userPubkey);
    const accountInfo = await getAccount(connection, userTokenAccount);

    // Check if the account has a delegate and if it matches our delegate
    return accountInfo.delegate !== null && accountInfo.delegate.equals(delegatePubkey);
  } catch (error) {
    return false;
  }
}

async function delegateTokens(
  connection: Connection,
  tokenMint: PublicKey,
  userPubkey: PublicKey,
  delegatePubkey: PublicKey,
  amount: bigint,
  wallet: WalletContextState
): Promise<string | null> {
  try {
    const userTokenAccount = await getAssociatedTokenAddress(tokenMint, userPubkey);

    const approveInstruction = createApproveInstruction(
      userTokenAccount,
      delegatePubkey,
      userPubkey,
      amount
    );

    const transaction = new Transaction();
    transaction.add(approveInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    const signedTransaction = await wallet.signTransaction!(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Wait for transaction finalization
    await connection.confirmTransaction({
      signature,
      blockhash: transaction.recentBlockhash!,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
    }, 'finalized');
    
    return signature;
  } catch (error) {
    return null;
  }
}

// Extract message ID from transaction logs
function extractMessageIdFromLogs(logs: string[]): string | null {
  for (const log of logs) {
    // Look for CCIP program return data
    if (log.includes('Program return: Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C')) {
      const match = log.match(/Program return: Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C (.+)/);
      if (match) {
        try {
          // Decode the base64 return data
          const returnData = Buffer.from(match[1], 'base64');
                    if (returnData.length >= 32) {
            const messageId = '0x' + returnData.slice(0, 32).toString('hex');
            return messageId;
          }
        } catch (error) {
        }
      }
    }
    
    // Fallback: Look for CCIP message sent event
    if (log.includes('CCIP message sent event')) {
      const match = log.match(/messageId: (0x[a-fA-F0-9]+)/);
      if (match) {
        return match[1];
      }
    }
  }
  return null;
}

export function useBridge(): UseBridgeReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { wallet, publicKey, connected: isConnected } = useSolanaWallet();
  const { addTransaction } = useTransactionListener();

  const approveTokens = useCallback(async (params: {
    amount: string;
  }): Promise<string | null> => {
    if (!isConnected || !wallet?.publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_NETWORK === 'devnet' 
          ? 'https://api.devnet.solana.com' 
          : 'https://api.mainnet-beta.solana.com'
      );

      const sourceTokenMint = new PublicKey(SOURCE_TOKEN);
      const amountBigInt = BigInt(Math.floor(parseFloat(params.amount) * 1e9));

      // Get user's token account
      const userTokenAccount = await getAssociatedTokenAddress(sourceTokenMint, wallet.publicKey);

      // Check token account balance
      const tokenAccountInfo = await getAccount(connection, userTokenAccount);

      // Get fee billing signer PDA
      const feeBillingSignerPDA = await deriveFeeBillingSignerPDA(CCIP_ROUTER_PROGRAM_ID);

      // Delegate tokens to CCIP router
      const delegationSignature = await delegateTokens(
        connection,
        sourceTokenMint,
        wallet.publicKey,
        feeBillingSignerPDA,
        amountBigInt,
        wallet
      );

      if (!delegationSignature) {
        throw new Error('Token delegation failed');
      }

      return delegationSignature;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token approval failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, wallet?.publicKey]);

  const executeBridge = useCallback(async (params: {
    allowOutOfOrderExecution: boolean;
    gasLimit: number;
    amount: string;
    recipientAddress: string;
    targetChain?: string;
  }): Promise<BridgeResult | null> => {
    if (!isConnected || !wallet?.publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);


      const isDevnet = process.env.NEXT_PUBLIC_NETWORK === 'devnet';
      const chainSelectors = isDevnet ? CHAIN_SELECTORS.testnet : CHAIN_SELECTORS.mainnet;

      const targetChain = params.targetChain || 'base';
      const chainSelector = chainSelectors[targetChain as keyof typeof chainSelectors];


      if (!chainSelector || chainSelector === BigInt('0')) {
        throw new Error(`Unsupported target chain: ${targetChain}`);
      }

      const connection = new Connection(
        isDevnet
          ? 'https://api.devnet.solana.com'
          : 'https://api.mainnet-beta.solana.com'
      );

      const sourceTokenMint = new PublicKey(SOURCE_TOKEN);

      const userTokenAccount = await getAssociatedTokenAddress(
        sourceTokenMint,
        wallet.publicKey
      );

      const mintInfo = await getMint(connection, sourceTokenMint);
      const amountBigInt = BigInt(Math.floor(parseFloat(params.amount) * Math.pow(10, mintInfo.decimals)));

      const tokenAccount = await getAccount(connection, userTokenAccount);
      
      if (tokenAccount.amount < amountBigInt) {
        throw new Error('Insufficient token balance');
      }

      // Check if tokens are delegated (but don't delegate here - that should be done separately)
      const feeBillingSignerPDA = await deriveFeeBillingSignerPDA(CCIP_ROUTER_PROGRAM_ID);
      
      const isDelegated = await checkTokenDelegation(
        connection,
        sourceTokenMint,
        wallet.publicKey,
        feeBillingSignerPDA
      );

      if (!isDelegated) {
        throw new Error('Tokens not approved. Please approve tokens first before bridging.');
      }

      const { instruction: ccipMessageInstruction, remainingAccounts, lookupTableList } = await createCcipMessageInstruction({
        connection,
        payer: wallet.publicKey,
        sourceTokenMint,
        amount: amountBigInt,
        destinationChainSelector: chainSelector,
        receiverAddress: params.recipientAddress,
        targetChain,
        gasLimit: params.gasLimit,
        allowOutOfOrderExecution: params.allowOutOfOrderExecution,
      });


      const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 2000000, // 2M compute units for the complex CCIP transaction
      });

      // Create transaction instructions array
      const instructions = [computeBudgetInstruction, ccipMessageInstruction];

      // Create the transaction message
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({
        commitment: "finalized",
      });
      
      // Validate blockhash
      if (!blockhash || blockhash === '11111111111111111111111111111111') {
        throw new Error('Invalid blockhash received from RPC');
      }

      const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message(lookupTableList);

      let transaction = new VersionedTransaction(messageV0);
      
      // Verify wallet supports VersionedTransaction signing
      if (!('signTransaction' in wallet) || !wallet.signTransaction) {
        throw new Error("Wallet does not support VersionedTransaction signing");
      }
      
      const freshBlockhash = await connection.getLatestBlockhash();
      transaction.message.recentBlockhash = freshBlockhash.blockhash;
      
      // Try signTransaction first, fallback to signAllTransactions if needed
      try {
        const signedTransaction = await wallet.signTransaction(transaction);
        transaction = signedTransaction;
      } catch (signError: any) {
        
        if (!('signAllTransactions' in wallet) || !wallet.signAllTransactions) {
          throw new Error("Wallet does not support signAllTransactions fallback");
        }
        
        const [signedTx] = await wallet.signAllTransactions([transaction]);
        transaction = signedTx;
      }

      let signature: string;
      try {
        signature = await connection.sendTransaction(transaction, {
          skipPreflight: false,
          preflightCommitment: "processed",
          maxRetries: 3,
        });
        
        if (signature === '1111111111111111111111111111111111111111111111111111111111111111') {
          throw new Error('Transaction failed to send - invalid signature received');
        }
      } catch (sendError: any) {
        
        if (sendError.message && sendError.message.includes('Simulation failed') && sendError.logs) {
          
          // Check if all programs completed successfully in the logs
          const logs = sendError.logs;
          const hasSuccessLogs = logs.some((log: string) => 
            log.includes('Program Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C success')
          );
          
          if (hasSuccessLogs) {
            
            // Try to extract the transaction signature from the error
            const errorSignature = sendError.signature || sendError.transaction?.signature;
            if (errorSignature) {
              signature = errorSignature;
            } else {
              // If we can't get the signature, we need to throw the error
              throw new Error('Transaction succeeded but could not extract signature');
            }
          } else {
            throw sendError;
          }
        } else {
          throw sendError;
        }
      }

      
      // Add timeout for confirmation
      const confirmationPromise = connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed" // Use "confirmed" instead of "finalized" for faster confirmation
      );
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Transaction confirmation timeout after 60 seconds')), 60000);
      });
      
      const confirmation = await Promise.race([confirmationPromise, timeoutPromise]) as any;

      // Extract message ID from transaction logs
      let messageId: string | null = null;
      if (confirmation.value && 'logs' in confirmation.value && Array.isArray(confirmation.value.logs)) {
        messageId = extractMessageIdFromLogs(confirmation.value.logs);
      }

      if (signature) {
        addTransaction(signature, 'migrate', parseFloat(params.amount), 0);
      }

      // Generate explorer URLs
      const cluster = isDevnet ? 'devnet' : 'mainnet-beta';
      const solanaExplorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
      const ccipExplorerUrl = messageId ? `https://ccip.chain.link/#/side-drawer/msg/${messageId}` : '';


      // Start progress tracking
      setTransactionHash(signature);
      setShowProgress(true);

      return {
        signature,
        messageId: messageId || '',
        ccipExplorerUrl,
        solanaExplorerUrl,
      };
    } catch (err) {
      
      // Enhanced error logging
      if (err instanceof Error) {
        
        // Check if it's a SendTransactionError
        if ('logs' in err) {
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Bridge transaction failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, wallet?.publicKey, addTransaction]);

  const checkTokenDelegationCallback = useCallback(async (tokenMint: string, requiredAmount?: string): Promise<boolean> => {
    if (!isConnected || !wallet?.publicKey) {
      return false;
    }

    const isDevnetEnv = process.env.NEXT_PUBLIC_NETWORK === 'devnet';
    const connection = new Connection(
      isDevnetEnv
        ? 'https://api.devnet.solana.com'
        : 'https://api.mainnet-beta.solana.com'
    );

    const sourceTokenMint = new PublicKey(tokenMint);
    const feeBillingSignerPDA = await deriveFeeBillingSignerPDA(CCIP_ROUTER_PROGRAM_ID);

    // Check if tokens are delegated
    const isDelegated = await checkTokenDelegation(
      connection,
      sourceTokenMint,
      wallet.publicKey,
      feeBillingSignerPDA
    );

    if (!isDelegated || !requiredAmount) {
      return isDelegated;
    }

    // If we have a required amount, check if the delegated amount is sufficient
    try {
      const userTokenAccount = await getAssociatedTokenAddress(
        sourceTokenMint,
        wallet.publicKey
      );

      const accountInfo = await getAccount(connection, userTokenAccount);
      const delegatedAmount = accountInfo.delegatedAmount || BigInt(0);
      const requiredAmountBigInt = BigInt(Math.floor(parseFloat(requiredAmount) * Math.pow(10, 9)));


      return delegatedAmount >= requiredAmountBigInt;
    } catch (error) {
      return isDelegated; // Fallback to basic delegation check
    }
  }, [isConnected, wallet?.publicKey]);

  const delegateTokensCallback = useCallback(async (tokenMint: string, amount: bigint): Promise<string | null> => {
    if (!isConnected || !wallet?.publicKey) {
      return null;
    }

    const isDevnetEnv = process.env.NEXT_PUBLIC_NETWORK === 'devnet';
    const connection = new Connection(
      isDevnetEnv
        ? 'https://api.devnet.solana.com'
        : 'https://api.mainnet-beta.solana.com'
    );

    const sourceTokenMint = new PublicKey(tokenMint);
    const feeBillingSignerPDA = await deriveFeeBillingSignerPDA(CCIP_ROUTER_PROGRAM_ID);

    return await delegateTokens(
      connection,
      sourceTokenMint,
      wallet.publicKey,
      feeBillingSignerPDA,
      amount,
      wallet
    );
  }, [isConnected, wallet?.publicKey]);

  return {
    isLoading,
    error,
    showProgress,
    setShowProgress,
    transactionHash,
    executeBridge,
    approveTokens,
    checkTokenDelegation: checkTokenDelegationCallback,
    delegateTokens: delegateTokensCallback,
  };
}
