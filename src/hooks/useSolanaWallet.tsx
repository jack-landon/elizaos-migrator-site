import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

type SolanaWalletType = {
  connect: () => Promise<void>;
  connected: boolean;
  publicKey: string | null;
  disconnect: () => Promise<void>;
};

export const useSolanaWallet = () => {
  const { connect, connected, publicKey, disconnect } = useWallet();
  const modal = useWalletModal();

  const handleConnect = async () => {
    try {
      modal.setVisible(true);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return {
    connect: handleConnect,
    connected,
    publicKey: publicKey ? publicKey.toBase58() : null,
    disconnect,
  } as SolanaWalletType;
};
