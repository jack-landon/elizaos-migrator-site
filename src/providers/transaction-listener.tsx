"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { useConnection } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface PendingTransaction {
  signature: string;
  type: "migrate" | "withdraw" | "updateWhitelist";
  inputAmount?: number;
  expectedOutput?: number;
  timestamp: number;
  confirmed?: boolean;
  toastShown?: boolean;
}

interface TransactionListenerContextType {
  pendingTransactions: PendingTransaction[];
  addTransaction: (
    signature: string,
    type: "migrate" | "withdraw" | "updateWhitelist",
    inputAmount?: number,
    expectedOutput?: number
  ) => void;
  clearConfirmedTransactions: () => void;
}

const TransactionListenerContext = createContext<
  TransactionListenerContextType | undefined
>(undefined);

export const TransactionListenerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();
  const [pendingTransactions, setPendingTransactions] = useLocalStorage<
    PendingTransaction[]
  >("migration-pending-transactions", []);
  const { connection } = useConnection();
  const monitoringRef = useRef<Set<string>>(new Set());
  const hasInitialized = useRef(false);

  const addTransaction = useCallback(
    (
      signature: string,
      type: "migrate" | "withdraw" | "updateWhitelist",
      inputAmount?: number,
      expectedOutput?: number
    ) => {
      const newTransaction: PendingTransaction = {
        signature,
        type,
        inputAmount,
        expectedOutput,
        timestamp: Date.now(),
        confirmed: false,
        toastShown: false,
      };

      const toastAction = {
        label: "View on Solscan",
        onClick: () => {
          const network =
            process.env.NEXT_PUBLIC_NETWORK === "devnet"
              ? "?cluster=devnet"
              : "";
          window.open(
            `https://solscan.io/tx/${newTransaction.signature}${network}`
          );
        },
      };

      toast.info(`Transaction submitted: ${type}`, {
        action: toastAction,
      });

      setPendingTransactions((prev) => {
        const filtered = prev.filter((tx) => tx.signature !== signature);
        return [newTransaction, ...filtered];
      });

      if (connection) {
        monitorTransaction(newTransaction);
      }
    },
    [setPendingTransactions, connection]
  );

  const showTransactionToast = useCallback(
    (transaction: PendingTransaction, success: boolean) => {
      const toastAction = {
        label: "View on Solscan",
        onClick: () => {
          const network =
            process.env.NEXT_PUBLIC_NETWORK === "devnet"
              ? "?cluster=devnet"
              : "";
          window.open(
            `https://solscan.io/tx/${transaction.signature}${network}`
          );
        },
      };

      if (success) {
        toast.success(`${transaction.type} completed successfully!`, {
          action: toastAction,
        });
      } else {
        toast.error(
          `${transaction.type} failed: ${transaction.signature.slice(0, 8)}...`,
          {
            action: toastAction,
          }
        );
      }

      setPendingTransactions((prev) =>
        prev.map((tx) =>
          tx.signature === transaction.signature
            ? { ...tx, toastShown: true }
            : tx
        )
      );
    },
    [setPendingTransactions]
  );

  const checkTransactionStatus = useCallback(
    async (transaction: PendingTransaction) => {
      if (!connection) return;

      try {
        const status = await connection.getSignatureStatus(
          transaction.signature
        );

        if (
          status.value?.confirmationStatus === "confirmed" ||
          status.value?.confirmationStatus === "finalized"
        ) {
          const success = !status.value.err;

          setPendingTransactions((prev) =>
            prev.map((tx) =>
              tx.signature === transaction.signature
                ? { ...tx, confirmed: true }
                : tx
            )
          );

          if (!transaction.toastShown) {
            showTransactionToast(transaction, success);
          }

          // cleanup
          setTimeout(() => {
            setPendingTransactions((prev) =>
              prev.filter((tx) => tx.signature !== transaction.signature)
            );
          }, 5 * 60 * 1000);

          return true;
        }

        return false; // pending
      } catch (error) {
        console.error("Error checking transaction status:", error);
        // failed
        setPendingTransactions((prev) =>
          prev.filter((tx) => tx.signature !== transaction.signature)
        );
        return true;
      }
    },
    [connection, setPendingTransactions, showTransactionToast]
  );

  const monitorTransaction = useCallback(
    async (transaction: PendingTransaction) => {
      if (!connection) {
        console.warn("Connection not available for transaction monitoring");
        return;
      }

      if (monitoringRef.current.has(transaction.signature)) {
        return;
      }

      monitoringRef.current.add(transaction.signature);

      try {
        const isDone = await checkTransactionStatus(transaction);
        if (isDone) {
          return;
        }

        // if not confirmed, wait
        const confirmation = await connection.confirmTransaction(
          transaction.signature,
          "finalized"
        );
        const success = !confirmation.value.err;

        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: ["migration-status"],
        });

        setPendingTransactions((prev) =>
          prev.map((tx) =>
            tx.signature === transaction.signature
              ? { ...tx, confirmed: true }
              : tx
          )
        );

        if (!transaction.toastShown) {
          showTransactionToast(transaction, success);
        }

        // cleanup
        setTimeout(() => {
          setPendingTransactions((prev) =>
            prev.filter((tx) => tx.signature !== transaction.signature)
          );
        }, 5 * 60 * 1000);
      } catch (error) {
        console.error("Error monitoring transaction:", error);
        setPendingTransactions((prev) =>
          prev.filter((tx) => tx.signature !== transaction.signature)
        );
      } finally {
        monitoringRef.current.delete(transaction.signature);
      }
    },
    [
      connection,
      setPendingTransactions,
      checkTransactionStatus,
      showTransactionToast,
      queryClient,
    ]
  );

  const clearConfirmedTransactions = useCallback(() => {
    setPendingTransactions((prev) => prev.filter((tx) => !tx.confirmed));
  }, [setPendingTransactions]);

  // monitor all transaction that haven't shown toast yet
  useEffect(() => {
    if (!connection || hasInitialized.current) return;

    const unprocessedTransactions = pendingTransactions.filter(
      (tx) => !tx.toastShown
    );

    if (unprocessedTransactions.length > 0) {
      console.log(
        `Checking status for ${unprocessedTransactions.length} unprocessed transactions`
      );

      for (const tx of unprocessedTransactions) {
        monitorTransaction(tx);
      }
    }

    hasInitialized.current = true;
  }, [connection, pendingTransactions, monitorTransaction]);

  // reset if connection drops or whatever
  useEffect(() => {
    if (connection) {
      hasInitialized.current = false;
    }
  }, [connection]);

  const value = {
    pendingTransactions,
    addTransaction,
    clearConfirmedTransactions,
  };

  return (
    <TransactionListenerContext.Provider value={value}>
      {children}
    </TransactionListenerContext.Provider>
  );
};

export const useTransactionListener = () => {
  const context = useContext(TransactionListenerContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionListener must be used within a TransactionListenerProvider"
    );
  }
  return context;
};
