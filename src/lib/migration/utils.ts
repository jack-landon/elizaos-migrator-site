import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export const sourceTokenAccountSeed = "ai16z_token_account";
export const targetTokenAccountSeed = "eliza_token_account";
export const stateAccountSeed = "state_account_seed";
export const faucetAccountSeed = "faucet_account";
export const faucetAuthoritySeed = "faucet_authority";
export const userStateSeed = "user_state_seed";

const sourceTokenMint = process.env.NEXT_PUBLIC_ORIGIN_TOKEN;
const destinationTokenMint = process.env.NEXT_PUBLIC_DESTINATION_TOKEN;

if (!destinationTokenMint || !sourceTokenMint) {
  throw new Error(
    "Destination or source token mint address is not defined in environment variables"
  );
}

export const sourceToken = new anchor.web3.PublicKey(sourceTokenMint);
export const targetToken = new anchor.web3.PublicKey(destinationTokenMint);

export const allowedAddresses = [
  new anchor.web3.PublicKey("3fJL8rR35NVAjjfMTMYLSRrR9Qj9y1BxYBuzJnSRW5R9"), // signer wallet
  new anchor.web3.PublicKey("84m9KzP4xs63KtbeknqfwJyVviSirgBYutMdiWNYhrQV"),
  new anchor.web3.PublicKey("5Atbogg9fhfA4qfm621C7jDnH8TgZgXhHszPCQSEgUoE"),
  new anchor.web3.PublicKey("CgAY33NKgnMVRqNjQTQimoTDWkR7NfvUHgrkn7ED4T56"),
  new anchor.web3.PublicKey("2C62rQzuDfwDHzM4JwAysfDdB4aK6MyXKJTUjrMc5tUq"),
  new anchor.web3.PublicKey("5mb1vLFWBUc5R4Pz3AaYTcan6oo5KSbwyU1x8T9e3NNx"),
  new anchor.web3.PublicKey("CLqgXswdZrRLgXA1S8raW1soEu3G1UJLMgZFN6rQjEW9"),
  new anchor.web3.PublicKey("FXtqqHM9444KsSa9s9bWhAzGFS5AhGK6wRSEuTrzjWN1"),
  new anchor.web3.PublicKey("GtGwpatmzbwRSPe2FENTW2pvE8nGGR1nWoCmKLMkBmQu"),
  new anchor.web3.PublicKey("8DeX2efhagJ33hWam1SdUz9HcxZaxrEkgCsqbxcB1irq"),
  new anchor.web3.PublicKey("2Wr6FLNfy5SK9VJFAg3Q31u1mv5CkgRW8amhm2HZBEcG"),
  new anchor.web3.PublicKey("HbF5tDvsThUb5gFosP399LChoGVjBXoHhDx1pVMQZK4m"),
  new anchor.web3.PublicKey("1zomCU2bNbCpPCLvMz3YkT7quSrRqLsLjHvg46Rpto"),
  new anchor.web3.PublicKey("CuRn8Vhxgob2scejFQKRkEkQ57oaQfvZjL5Q6nuEe7o"),
  new anchor.web3.PublicKey("L5mvouXEZr8ZwDUGjGKZ3oYw6KcspawNiDKnRnhpfUo"),
  new anchor.web3.PublicKey("RcaD89t2FFqgbNHWhYTWRZfC4NivFyMDA4yG5Z8YP7o"),
  new anchor.web3.PublicKey("XuuhnkYvvNSG4xUe3pBbJY1TUG4zgdyhz258FA6CVbo"),
];


export const limitAmount = 100 * LAMPORTS_PER_SOL;

export const getStateAccount = (programId: PublicKey) => {
  const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(stateAccountSeed)],
    programId
  );
  return stateAccount;
};

export const getUserStateAccount = (programId: PublicKey, user: PublicKey) => {
  const [userStateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(userStateSeed), user.toBuffer()],
    programId
  );
  return userStateAccount;
};

export const getFaucetAuthority = (programId: PublicKey) => {
  const [faucetAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(faucetAccountSeed)],
    programId
  );
  return faucetAuthority;
};

export const getSourceTokenAccount = (
  sourceToken: PublicKey,
  programId: PublicKey
) => {
  const [sourceTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(sourceTokenAccountSeed), sourceToken.toBuffer()],
    programId
  );
  return sourceTokenAccount;
};

export const getTargetTokenAccount = (
  targetToken: PublicKey,
  programId: PublicKey
) => {
  const [targetTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(targetTokenAccountSeed), targetToken.toBuffer()],
    programId
  );
  return targetTokenAccount;
};
