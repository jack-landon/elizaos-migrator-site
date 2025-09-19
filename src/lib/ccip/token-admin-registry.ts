import { Connection, PublicKey, AddressLookupTableAccount } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { TokenAdminRegistry } from './types';
import { findTokenAdminRegistryPDA, CCIP_ROUTER_PROGRAM_ID } from './pdas';

// Official Token Admin Registry account structure based on the starter kit
export interface TokenAdminRegistryFields {
  version: number;
  administrator: PublicKey;
  pendingAdministrator: PublicKey;
  lookupTable: PublicKey;
  writableIndexes: Array<BN>;
  mint: PublicKey;
}

export async function getTokenAdminRegistry(
  connection: Connection,
  tokenMint: PublicKey
): Promise<TokenAdminRegistry> {
  try {
    const [tokenAdminRegistryPDA] = findTokenAdminRegistryPDA(tokenMint, CCIP_ROUTER_PROGRAM_ID);
    
    // Fetch the token admin registry account
    const accountInfo = await connection.getAccountInfo(tokenAdminRegistryPDA);
    
    if (!accountInfo) {
      throw new Error(`Token admin registry not found for token: ${tokenMint.toString()}`);
    }
    
    if (!accountInfo.owner.equals(CCIP_ROUTER_PROGRAM_ID)) {
      throw new Error("Account doesn't belong to CCIP Router program");
    }
    
    // Parse the account data using the official structure
    const data = accountInfo.data;
    
    // Check discriminator (first 8 bytes)
    const discriminator = Buffer.from([70, 92, 207, 200, 76, 17, 57, 114]);
    if (!data.slice(0, 8).equals(discriminator)) {
      throw new Error("Invalid account discriminator");
    }
    
    // Parse the account data manually
    let offset = 8;
    
    // version (u8)
    const _version = data.readUInt8(offset);
    offset += 1;
    
    // administrator (PublicKey)
    const _administrator = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // pendingAdministrator (PublicKey)
    const _pendingAdministrator = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // lookupTable (PublicKey)
    const lookupTable = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // writableIndexes (Array<u128> with length 2)
    const writableIndexes: BN[] = [];
    for (let i = 0; i < 2; i++) {
      const indexBytes = data.slice(offset, offset + 16);
      writableIndexes.push(new BN(indexBytes, 'le'));
      offset += 16;
    }
    
    // mint (PublicKey)
    const _mint = new PublicKey(data.slice(offset, offset + 32));
    
    return {
      lookupTable,
      writableIndexes,
    };
  } catch (error) {
    throw error;
  }
}

export async function getLookupTableAccount(
  connection: Connection,
  lookupTableAddress: PublicKey
): Promise<AddressLookupTableAccount> {
  try {
    const { value: lookupTableAccount } = await connection.getAddressLookupTable(lookupTableAddress);
    
    if (!lookupTableAccount) {
      throw new Error(`Lookup table not found: ${lookupTableAddress.toString()}`);
    }
    
    if (lookupTableAccount.state.addresses.length < 7) {
      throw new Error(
        `Lookup table has insufficient accounts: ${lookupTableAccount.state.addresses.length} (needs at least 7)`
      );
    }
    
    return lookupTableAccount;
  } catch (error) {
    throw error;
  }
}

export function getPoolProgram(
  lookupTableAddresses: PublicKey[]
): PublicKey {
  // The pool program is at index 2 in the lookup table
  if (lookupTableAddresses.length <= 2) {
    throw new Error(
      "Lookup table doesn't have enough entries to determine pool program"
    );
  }
  
  return lookupTableAddresses[2];
}

export function isWritable(
  index: number,
  writableIndexes: BN[]
): boolean {
  // The lookup table itself must be NON-writable
  if (index === 0) {
    return false;
  }
  
  // For other accounts, check the writable indexes bitmap
  // Each BN in writableIndexes represents a 256-bit mask
  const bnIndex = Math.floor(index / 128);
  
  const bitPosition = bnIndex === 0 ? 127 - (index % 128) : 255 - (index % 128);
  
  if (bnIndex < writableIndexes.length) {
    // Create a BN with the bit at the position we want to check
    const mask = new BN(1).shln(bitPosition);
    
    // Check if the bit is set using bitwise AND
    const result = writableIndexes[bnIndex].and(mask);
    
    // If the result is not zero, the bit is set
    return !result.isZero();
  }
  
  // Default to non-writable if index is out of bounds
  return false;
}
