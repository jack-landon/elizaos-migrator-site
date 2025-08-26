import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "../solana_migration";
import {
    getFaucetAuthority,
    getSourceTokenAccount,
    getTargetTokenAccount,
    getUserStateAccount,
    sourceToken,
    targetToken,
} from "../utils";

export interface MigrateParams {
    program: Program<SolanaMigration>;
    authority: anchor.web3.PublicKey;
    amount: anchor.BN;
    limitAmount: anchor.BN;
    proof: Buffer[];
}

export async function migrate(params: MigrateParams): Promise<string> {
    const { program, authority, amount, limitAmount, proof } = params;

    const faucetAuthority = getFaucetAuthority(program.programId);
    const userStateAccount = getUserStateAccount(program.programId, authority);
    const sourceTokenAccount = getSourceTokenAccount(sourceToken, program.programId);
    const targetTokenAccount = getTargetTokenAccount(targetToken, program.programId);

    const fromAta = await spl.getAssociatedTokenAddress(sourceToken, authority);
    const receiveAta = await spl.getAssociatedTokenAddress(targetToken, authority);

    const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state_account_seed")],
        program.programId
    );

    const tx = await program.rpc.migrate(amount, limitAmount, proof, {
        accounts: {
            authority: authority,
            faucetAuthority: faucetAuthority,
            fromAta: fromAta,
            userState: userStateAccount,
            receiveAta: receiveAta,
            targetToken: targetToken,
            sourceToken: sourceToken,
            globalSourceTokenAccount: sourceTokenAccount,
            globalTargetTokenAccount: targetTokenAccount,
            stateAccount: stateAccount,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });

    return tx;
}
