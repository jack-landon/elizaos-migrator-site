import * as borsh from '@coral-xyz/borsh';
import { SVMTokenAmountFields, SVM2AnyMessageFields, CCIPSendRequest } from './types';


export const SVMTokenAmountLayout = borsh.struct([
  borsh.publicKey('token'),
  borsh.u64('amount'),
]);

export const SVM2AnyMessageLayout = borsh.struct([
  borsh.vecU8('receiver'),
  borsh.vecU8('data'),
  borsh.vec(SVMTokenAmountLayout, 'tokenAmounts'),
  borsh.publicKey('feeToken'),
  borsh.vecU8('extraArgs'),
]);

export const CCIPSendLayout = borsh.struct([
  borsh.u64('destChainSelector'),
  SVM2AnyMessageLayout.replicate('message'),
  borsh.vecU8('tokenIndexes'),
]);

// Serialization functions 
export function serializeSVMTokenAmount(tokenAmount: SVMTokenAmountFields): Buffer {
  return SVMTokenAmountLayout.encode(tokenAmount);
}

export function serializeSVM2AnyMessage(message: SVM2AnyMessageFields): Buffer {
  return SVM2AnyMessageLayout.encode(message);
}

export function serializeCCIPSendRequest(
  request: CCIPSendRequest,
  tokenIndexes: Uint8Array
): Buffer {
  const data = {
    destChainSelector: request.destChainSelector,
    message: {
      receiver: Buffer.from(request.receiver.buffer, request.receiver.byteOffset, request.receiver.length),
      data: Buffer.from(request.data.buffer, request.data.byteOffset, request.data.length),
      tokenAmounts: request.tokenAmounts.map(ta => ({
        token: ta.token,
        amount: ta.amount,
      })),
      feeToken: request.feeToken,
      extraArgs: Buffer.from(request.extraArgs.buffer, request.extraArgs.byteOffset, request.extraArgs.length),
    },
    tokenIndexes: Buffer.from(tokenIndexes.buffer, tokenIndexes.byteOffset, tokenIndexes.length),
  };
  
  return CCIPSendLayout.encode(data);
}

// Create extraArgs buffer for gas limit and execution order
export function createExtraArgsBuffer(
  gasLimit: number,
  allowOutOfOrderExecution: boolean
): Uint8Array {
  // GENERIC_EXTRA_ARGS_V2_TAG: 0x181dcf10
  const typeTag = Buffer.from([0x18, 0x1d, 0xcf, 0x10]);
  
  // Convert gas limit to little-endian bytes (u128 = 16 bytes)
  const gasLimitLE = Buffer.alloc(16);
  gasLimitLE.writeBigUInt64LE(BigInt(gasLimit), 0);
  
  // Create bool byte for allowOutOfOrderExecution
  const allowOutOfOrderExecutionByte = Buffer.from([allowOutOfOrderExecution ? 1 : 0]);
  
  // Concatenate: gasLimit + allowOutOfOrderExecution
  const argsData = Buffer.concat([gasLimitLE, allowOutOfOrderExecutionByte]);
  
  // Final buffer: tag + args
  const result = Buffer.concat([typeTag, argsData]);
  
  return new Uint8Array(result);
}

// Convert EVM address to Solana bytes
export function evmAddressToSolanaBytes(evmAddress: string): Uint8Array {
  // Remove 0x prefix and convert to bytes
  const addressBytes = new Uint8Array(Buffer.from(evmAddress.slice(2), 'hex'));
  
  // Left pad to 32 bytes (EVM: 20 bytes → Solana: 32 bytes)
  const padded = new Uint8Array(32);
  padded.set(addressBytes, 32 - addressBytes.length);
  
  return padded;
}
