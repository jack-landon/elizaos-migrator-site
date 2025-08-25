import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaMigration } from "../solana_migration";

export interface UpdateWhitelistParams {
    program: Program<SolanaMigration>;
    authority: anchor.Wallet;
    root: number[];
}

export async function updateWhitelist(params: UpdateWhitelistParams): Promise<string> {
    const { program, authority, root } = params;

    const [stateAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("state_account_seed")],
        program.programId
    );

    const tx = await program.rpc.updateWhitelist(root, {
        accounts: {
            authority: authority.publicKey,
            stateAccount: stateAccount,
        },
    });

    return tx;
}
