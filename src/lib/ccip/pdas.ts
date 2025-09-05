import { PublicKey } from '@solana/web3.js';

// CCIP Program IDs
export const CCIP_ROUTER_PROGRAM_ID = new PublicKey('Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C');
export const FEE_QUOTER_PROGRAM_ID = new PublicKey('FeeQPGkKDeRV1MgoYfMH6L8o3KeuYjwUZrgn4LRKfjHi');
export const RMN_REMOTE_PROGRAM_ID = new PublicKey('RmnXLft1mSEwDgMKu2okYuHkiazxntFFcZFrrcXxYg7');
export const LINK_TOKEN_MINT = new PublicKey('LinkhB3afbBKb2EQQu7s7umdZceV3wcvAUJhQAfQ23L');

// PDA derivation functions
export function findConfigPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], programId);
}

export function findDestChainStatePDA(
  chainSelector: bigint,
  programId: PublicKey
): [PublicKey, number] {
  const chainSelectorBuffer = Buffer.alloc(8);
  chainSelectorBuffer.writeBigUInt64LE(chainSelector, 0); // Changed to Little Endian
  return PublicKey.findProgramAddressSync(
    [Buffer.from('dest_chain_state'), chainSelectorBuffer],
    programId
  );
}

export function findNoncePDA(
  chainSelector: bigint,
  userPubkey: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  const chainSelectorBuffer = Buffer.alloc(8);
  chainSelectorBuffer.writeBigUInt64LE(chainSelector, 0); // Changed to Little Endian
  return PublicKey.findProgramAddressSync(
    [Buffer.from('nonce'), chainSelectorBuffer, userPubkey.toBuffer()],
    programId
  );
}

export function findFeeBillingSignerPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('fee_billing_signer')], programId);
}

export function findFeeReceiverPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('fee_receiver')], programId);
}

export function findFqConfigPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], programId);
}

export function findFqDestChainPDA(
  chainSelector: bigint,
  programId: PublicKey
): [PublicKey, number] {
  const chainSelectorBuffer = Buffer.alloc(8);
  chainSelectorBuffer.writeBigUInt64LE(chainSelector, 0); // Changed to Little Endian
  return PublicKey.findProgramAddressSync(
    [Buffer.from('dest_chain'), chainSelectorBuffer],
    programId
  );
}

export function findFqBillingTokenConfigPDA(
  tokenMint: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('fee_billing_token_config'), tokenMint.toBuffer()],
    programId
  );
}

export function findFqPerChainPerTokenConfigPDA(
  chainSelector: bigint,
  tokenMint: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  const chainSelectorBuffer = Buffer.alloc(8);
  chainSelectorBuffer.writeBigUInt64LE(chainSelector, 0); // Changed to Little Endian
  return PublicKey.findProgramAddressSync(
    [Buffer.from('per_chain_per_token_config'), chainSelectorBuffer, tokenMint.toBuffer()],
    programId
  );
}

export function findRMNRemoteConfigPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], programId);
}

export function findRMNRemoteCursesPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('curses')], programId);
}

export function findTokenAdminRegistryPDA(
  tokenMint: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('token_admin_registry'), tokenMint.toBuffer()],
    programId
  );
}

export function findBurnMintPoolChainConfigPDA(
  chainSelector: bigint,
  tokenMint: PublicKey,
  poolProgramId: PublicKey
): [PublicKey, number] {
  const chainSelectorBuffer = Buffer.alloc(8);
  chainSelectorBuffer.writeBigUInt64LE(chainSelector, 0); // Changed to Little Endian
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ccip_tokenpool_chainconfig'), chainSelectorBuffer, tokenMint.toBuffer()],
    poolProgramId
  );
}
