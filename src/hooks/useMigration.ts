import { useState, useCallback, useEffect } from 'react';
import { SolanaMigrationClient, SolanaClientConfig } from '@/lib/migration';
import * as anchor from '@coral-xyz/anchor';
import { useSolanaWallet } from './useSolanaWallet';
import { useTransactionListener } from '@/providers';

export interface UseMigrationReturn {
  client: SolanaMigrationClient | null;
  isLoading: boolean;
  error: string | null;
  initializeClient: (config: SolanaClientConfig) => void;
  executeMigration: (params: {
    authority: anchor.web3.PublicKey;
    amount: string;
    limitAmount: string;
    proof: Buffer[];
  }) => Promise<string | null>;
  updateWhitelist: (params: {
    authority: anchor.Wallet;
    root: number[];
  }) => Promise<string | null>;
  withdrawSourceToken: (params: {
    authority: anchor.web3.PublicKey;
    receiveAta: anchor.web3.PublicKey;
  }) => Promise<string | null>;
  withdrawTargetToken: (params: {
    authority: anchor.web3.PublicKey;
    receiveAta: anchor.web3.PublicKey;
  }) => Promise<string | null>;
}

export function useMigration(): UseMigrationReturn {
  const [client, setClient] = useState<SolanaMigrationClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallet, publicKey, disconnect, connected: isConnected } = useSolanaWallet();
  const { addTransaction } = useTransactionListener();

  const initializeClient = useCallback((config: SolanaClientConfig) => {
    try {
      setError(null);
      const newClient = new SolanaMigrationClient(config);
      setClient(newClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize client');
    }
  }, []);

  // Update client wallet when wallet connection changes
  useEffect(() => {
    if (client && wallet && isConnected && wallet.publicKey) {
      try {
        // Create an anchor wallet adapter that wraps the wallet adapter
        const anchorWallet = {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction!,
          signAllTransactions: wallet.signAllTransactions!,
        };
        client.setWallet(anchorWallet as anchor.Wallet);
      } catch (err) {
        console.error('Failed to update client wallet:', err);
      }
    }
  }, [client, wallet, isConnected]);

  const executeMigration = useCallback(async (params: {
    authority: anchor.web3.PublicKey;
    amount: string;
    limitAmount: string;
    proof: Buffer[];
  }): Promise<string | null> => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    if (!isConnected || !wallet?.publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await client.executeMigration(params);

      if (result) {
        // Add transaction to listener for monitoring
        addTransaction(result, 'migrate', parseFloat(params.amount), 0);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Migration failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [client, isConnected, wallet?.publicKey, addTransaction]);

  const updateWhitelist = useCallback(async (params: {
    authority: anchor.Wallet;
    root: number[];
  }): Promise<string | null> => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    if (!isConnected || !wallet?.publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await client.updateWhitelist(params);

      if (result) {
        // Add transaction to listener for monitoring
        addTransaction(result, 'updateWhitelist');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Whitelist update failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [client, isConnected, wallet?.publicKey, addTransaction]);

  const withdrawSourceToken = useCallback(async (params: {
    authority: anchor.web3.PublicKey;
    receiveAta: anchor.web3.PublicKey;
  }): Promise<string | null> => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    if (!isConnected || !wallet?.publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await client.withdrawSourceToken(params);

      if (result) {
        // Add transaction to listener for monitoring
        addTransaction(result, 'withdraw');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Source token withdrawal failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [client, isConnected, wallet?.publicKey, addTransaction]);

  const withdrawTargetToken = useCallback(async (params: {
    authority: anchor.web3.PublicKey;
    receiveAta: anchor.web3.PublicKey;
  }): Promise<string | null> => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    if (!isConnected || !wallet?.publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await client.withdrawTargetToken(params);

      if (result) {
        // Add transaction to listener for monitoring
        addTransaction(result, 'withdraw');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Target token withdrawal failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [client, isConnected, wallet?.publicKey, addTransaction]);

  return {
    client,
    isLoading,
    error,
    initializeClient,
    executeMigration,
    updateWhitelist,
    withdrawSourceToken,
    withdrawTargetToken,
  };
}
