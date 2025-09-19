import { TransactionInstruction, AccountMeta } from '@solana/web3.js';
import { CCIPSendRequest, CCIPSendAccounts, SVM2AnyMessageFields } from './types';
import { CCIPSendLayout } from './serialization';
import { CCIP_ROUTER_PROGRAM_ID } from './pdas';

const CCIP_SEND_DISCRIMINATOR = Buffer.from([108, 216, 134, 191, 249, 234, 33, 84]);

export function createCcipSendInstruction(
  args: CCIPSendRequest,
  accounts: CCIPSendAccounts,
  remainingAccounts: AccountMeta[],
  tokenIndexes: Uint8Array
): TransactionInstruction {

  const keys: Array<AccountMeta> = [
    { pubkey: accounts.config, isSigner: false, isWritable: false },
    { pubkey: accounts.destChainState, isSigner: false, isWritable: true },
    { pubkey: accounts.nonce, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenUserAssociatedAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.feeTokenReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.feeBillingSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoter, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterDestChain, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterBillingTokenConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterLinkTokenConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.rmnRemote, isSigner: false, isWritable: false },
    { pubkey: accounts.rmnRemoteCurses, isSigner: false, isWritable: false },
    { pubkey: accounts.rmnRemoteConfig, isSigner: false, isWritable: false },
  ];
  
  
  // Add remaining accounts if any
  keys.push(...remainingAccounts);
  
  // Create the message object for serialization
  const message: SVM2AnyMessageFields = {
    receiver: args.receiver,
    data: args.data,
    tokenAmounts: args.tokenAmounts,
    feeToken: args.feeToken,
    extraArgs: args.extraArgs,
  };
  
  
  // Serialize 
  const buffer = Buffer.alloc(1000);
  const len = CCIPSendLayout.encode(
    {
      destChainSelector: args.destChainSelector,
      message: {
        receiver: Buffer.from(message.receiver.buffer, message.receiver.byteOffset, message.receiver.length),
        data: Buffer.from(message.data.buffer, message.data.byteOffset, message.data.length),
        tokenAmounts: message.tokenAmounts.map(ta => ({
          token: ta.token,
          amount: ta.amount,
        })),
        feeToken: message.feeToken,
        extraArgs: Buffer.from(message.extraArgs.buffer, message.extraArgs.byteOffset, message.extraArgs.length),
      },
      tokenIndexes: Buffer.from(tokenIndexes.buffer, tokenIndexes.byteOffset, tokenIndexes.length),
    },
    buffer
  );
  
  
  const data = Buffer.concat([CCIP_SEND_DISCRIMINATOR, buffer]).slice(0, 8 + len);
  
  const instruction = new TransactionInstruction({
    keys,
    programId: CCIP_ROUTER_PROGRAM_ID,
    data,
  });
  
  return instruction;
}
