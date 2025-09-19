import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "../solana_migration";
import {
    getFaucetAuthority,
    getSourceTokenAccount,
    sourceToken,
} from "../utils";

export interface WithdrawSourceTokenParams {
    program: Program<SolanaMigration>;
    authority: anchor.web3.PublicKey;
    receiveTa: anchor.web3.PublicKey;
}

export async function withdrawSourceToken(params: WithdrawSourceTokenParams): Promise<string> {
    const { program, authority, receiveTa } = params;

    const faucetAuthority = getFaucetAuthority(program.programId);
    const sourceTokenAccount = getSourceTokenAccount(sourceToken, program.programId);

    const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state_account_seed")],
        program.programId
    );

    const tx = await program.rpc.withdrawSourceToken({
        accounts: {
            authority: authority,
            receiveTa: receiveTa,
            faucetAuthority: faucetAuthority,
            stateAccount: stateAccount,
            sourceToken: sourceToken,
            globalSourceTokenAccount: sourceTokenAccount,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });

    return tx;
}
