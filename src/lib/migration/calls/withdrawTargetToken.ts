import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "../solana_migration";
import {
    getFaucetAuthority,
    getTargetTokenAccount,
    targetToken,
} from "../utils";

export interface WithdrawTargetTokenParams {
    program: Program<SolanaMigration>;
    authority: anchor.web3.PublicKey;
    receiveAta: anchor.web3.PublicKey;
}

export async function withdrawTargetToken(params: WithdrawTargetTokenParams): Promise<string> {
    const { program, authority, receiveAta } = params;

    const faucetAuthority = getFaucetAuthority(program.programId);
    const targetTokenAccount = getTargetTokenAccount(targetToken, program.programId);

    const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state_account_seed")],
        program.programId
    );

    const tx = await program.rpc.withdrawTargetToken({
        accounts: {
            authority: authority,
            receiveAta: receiveAta,
            faucetAuthority: faucetAuthority,
            stateAccount: stateAccount,
            targetToken: targetToken,
            globalTargetTokenAccount: targetTokenAccount,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });

    return tx;
}
