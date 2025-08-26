import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export const sourceTokenAccountSeed = "ai16z_token_account";
export const targetTokenAccountSeed = "eliza_token_account";
export const stateAccountSeed = "state_account_seed";
export const faucetAccountSeed = "faucet_account";
export const faucetAuthoritySeed = "faucet_authority";
export const userStateSeed = "user_state_seed";

export const sourceToken = new anchor.web3.PublicKey(
    "BuUeraR7qnmMr1gfkVVnb1spZHGmhRuxsFPsniMBVshF"
);
export const targetToken = new anchor.web3.PublicKey(
    "BrmpEAhbLU7dgpZjzKsHALGXa5mmunzfvFrok9jqZcwc"
);

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
