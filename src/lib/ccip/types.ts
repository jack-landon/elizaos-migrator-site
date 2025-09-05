import { PublicKey, TransactionInstruction, AccountMeta, AddressLookupTableAccount } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

// CCIP Message Types based on official starter kit implementation
export interface SVMTokenAmountFields {
  token: PublicKey;
  amount: BN;
}

export interface SVM2AnyMessageFields {
  receiver: Uint8Array;
  data: Uint8Array;
  tokenAmounts: Array<SVMTokenAmountFields>;
  feeToken: PublicKey;
  extraArgs: Uint8Array;
}

export interface CCIPSendRequest {
  destChainSelector: BN;
  receiver: Uint8Array;
  data: Uint8Array;
  tokenAmounts: Array<SVMTokenAmountFields>;
  feeToken: PublicKey;
  extraArgs: Uint8Array;
}

export interface CCIPSendAccounts {
  config: PublicKey;
  destChainState: PublicKey;
  nonce: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
  feeTokenProgram: PublicKey;
  feeTokenMint: PublicKey;
  feeTokenUserAssociatedAccount: PublicKey;
  feeTokenReceiver: PublicKey;
  feeBillingSigner: PublicKey;
  feeQuoter: PublicKey;
  feeQuoterConfig: PublicKey;
  feeQuoterDestChain: PublicKey;
  feeQuoterBillingTokenConfig: PublicKey;
  feeQuoterLinkTokenConfig: PublicKey;
  rmnRemote: PublicKey;
  rmnRemoteCurses: PublicKey;
  rmnRemoteConfig: PublicKey;
}

export interface TokenAdminRegistry {
  lookupTable: PublicKey;
  writableIndexes: BN[];
}

export interface TokenLookupAccounts {
  userTokenAccount: PublicKey;
  tokenBillingConfig: PublicKey;
  poolChainConfig: PublicKey;
  lookupTable: PublicKey;
  remainingAccounts: Array<{
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }>;
}

export interface CCIPInstructionResult {
  instruction: TransactionInstruction;
  remainingAccounts: AccountMeta[];
  lookupTableList: AddressLookupTableAccount[];
  tokenIndexes: number[];
}
