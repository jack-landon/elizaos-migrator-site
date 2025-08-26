import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

type SolanaWalletType = {
  wallet: WalletContextState;
  connect: () => Promise<void>;
  connected: boolean;
  publicKey: string | null;
  disconnect: () => Promise<void>;
};

export const useSolanaWallet = () => {
  const wallet = useWallet();
  const { connect, connected, publicKey, disconnect } = wallet;
  const modal = useWalletModal();

  const handleConnect = async () => {
    try {
      modal.setVisible(true);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return {
    wallet: wallet,
    connect: handleConnect,
    connected,
    publicKey: publicKey ? publicKey.toBase58() : null,
    disconnect,
  } as SolanaWalletType;
};
