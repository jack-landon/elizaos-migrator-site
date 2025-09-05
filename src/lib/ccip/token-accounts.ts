import { Connection, PublicKey, AccountMeta, AddressLookupTableAccount } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { TokenLookupAccounts, CCIPSendRequest } from './types';
import { findFqPerChainPerTokenConfigPDA, findBurnMintPoolChainConfigPDA, FEE_QUOTER_PROGRAM_ID, CCIP_ROUTER_PROGRAM_ID } from './pdas';
import { getTokenAdminRegistry, getLookupTableAccount, getPoolProgram, isWritable } from './token-admin-registry';

export async function buildTokenAccountsForSend(
  request: CCIPSendRequest,
  connection: Connection,
  feeTokenProgramId: PublicKey,
  signerPublicKey: PublicKey
): Promise<{
  tokenIndexes: number[];
  remainingAccounts: AccountMeta[];
  lookupTableList: AddressLookupTableAccount[];
}> {
  const tokenIndexes: number[] = [];
  const remainingAccounts: AccountMeta[] = [];
  const lookupTableList: AddressLookupTableAccount[] = [];
  let lastIndex = 0;

  // Process each token amount
  for (const tokenAmount of request.tokenAmounts) {
    try {
      const tokenMint = tokenAmount.token;
      
      // Determine token program from token mint
      let tokenProgram = TOKEN_PROGRAM_ID;
      try {
        const tokenMintInfo = await connection.getAccountInfo(tokenMint);
        if (tokenMintInfo) {
          tokenProgram = tokenMintInfo.owner;
        } else {
          tokenProgram = TOKEN_2022_PROGRAM_ID;
        }
      } catch (error) {
        tokenProgram = TOKEN_2022_PROGRAM_ID;
      }

      // Get token admin registry for this token to access lookup table
      const tokenAdminRegistry = await getTokenAdminRegistry(connection, tokenMint);
      
      // Get lookup table for this token
      const lookupTable = await getLookupTableAccount(connection, tokenAdminRegistry.lookupTable);
      lookupTableList.push(lookupTable);
      
      // Get the lookup table addresses
      const lookupTableAddresses = lookupTable.state.addresses;
      
      // Extract pool program from lookup table
      const poolProgram = getPoolProgram(lookupTableAddresses);
      
      // Get user token account
      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        signerPublicKey,
        true,
        tokenProgram,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      // Get token chain config
      const [tokenBillingConfig] = findFqPerChainPerTokenConfigPDA(
        BigInt(request.destChainSelector.toString()),
        tokenMint,
        FEE_QUOTER_PROGRAM_ID
      );
      
      
      // Get pool chain config - use the pool program from lookup table
      const [poolChainConfig] = findBurnMintPoolChainConfigPDA(
        BigInt(request.destChainSelector.toString()),
        tokenMint,
        poolProgram
      );
      
      // Also try with the pool program for comparison
      const [poolChainConfigWithPool] = findBurnMintPoolChainConfigPDA(
        BigInt(request.destChainSelector.toString()),
        tokenMint,
        poolProgram
      );
      
      // Try with different token mints to see if we can find the right one
      const [poolChainConfigWithLink] = findBurnMintPoolChainConfigPDA(
        BigInt(request.destChainSelector.toString()),
        new PublicKey('LinkhB3afbBKb2EQQu7s7umdZceV3wcvAUJhQAfQ23L'), // LINK token
        CCIP_ROUTER_PROGRAM_ID
      );
      
      // Build token accounts using lookup table
      const tokenAccounts = buildTokenLookupAccounts(
        userTokenAccount,
        tokenBillingConfig,
        poolChainConfig,
        lookupTableAddresses,
        tokenAdminRegistry.writableIndexes
      );
      
      tokenIndexes.push(lastIndex);
      const currentLen = tokenAccounts.length;
      lastIndex += currentLen;
      remainingAccounts.push(...tokenAccounts);
      
    } catch (error) {
      throw error;
    }
  }

  return { tokenIndexes, remainingAccounts, lookupTableList };
}

function buildTokenLookupAccounts(
  userTokenAccount: PublicKey,
  tokenBillingConfig: PublicKey,
  poolChainConfig: PublicKey,
  lookupTableEntries: Array<PublicKey>,
  writableIndexes: BN[]
): Array<AccountMeta> {
  // First entry is the lookup table itself
  const lookupTable = lookupTableEntries[0];
  
  // Build the token accounts with the correct writable flags
  const accounts = [
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: tokenBillingConfig, isSigner: false, isWritable: false },
    { pubkey: poolChainConfig, isSigner: false, isWritable: true },
    
    // First account is the lookup table - must be non-writable
    { pubkey: lookupTable, isSigner: false, isWritable: false },
  ];
  
  // Add the remaining lookup table entries with correct writable flags
  const remainingAccounts = lookupTableEntries.slice(1).map((pubkey, index) => {
    const isWrit = isWritable(index + 1, writableIndexes);
    return {
      pubkey,
      isSigner: false,
      isWritable: isWrit,
    };
  });
  
  return [...accounts, ...remainingAccounts];
}
