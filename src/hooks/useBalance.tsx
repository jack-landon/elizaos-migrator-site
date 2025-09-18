import { useQuery } from "@tanstack/react-query";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

type BalanceParams = {
  address: string;
  tokenMint: string;
};

const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const fetchTokenBalance = async ({ address, tokenMint }: BalanceParams) => {
  if (!address || !tokenMint) return 0;

  try {
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const walletPublicKey = new PublicKey(address);
    const mintPublicKey = new PublicKey(tokenMint);

    const tokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    );

    const tokenAccount = await getAccount(connection, tokenAccountAddress);

    return Number(tokenAccount.amount);
  } catch (error) {
    return 0;
  }
};

export const useBalance = ({ address, tokenMint }: BalanceParams) => {
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tokenBalance", address, tokenMint],
    queryFn: () => fetchTokenBalance({ address, tokenMint }),
    enabled: !!address && !!tokenMint,
    refetchInterval: 20000,
    staleTime: 15000,
    retry: 3,
    initialData: 0,
  });

  return {
    balance: balance ?? 0,
    isLoading,
    error,
    refetch,
  };
};
