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
  new anchor.web3.PublicKey("GsptFNjTjEY17ZQoog5f9Ld7yBTVCtpaL7JoBt33yHq5"), // signer wallet
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
