"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "./badge";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import ProgressSteps from "./progress-steps";

interface CCIPProgressData {
  messageId: string;
  state: number | null;
  sourceNetworkName: string;
  destNetworkName: string;
  sender: string;
  receiver: string;
  sendTransactionHash: string;
  commitTransactionHash?: string;
  receiptTransactionHash?: string;
  sendBlockTimestamp: string;
  commitBlockTimestamp?: string;
  receiptBlockTimestamp?: string;
  tokenAmounts: Array<{
    tokenAddress: string;
    amount: string;
  }>;
}

interface CCIPProgressTrackerProps {
  sourceTransactionHash: string;
  sourceChainSelectorName: string;
  onComplete?: (data: CCIPProgressData) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

type ProgressStep = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "error";
};

export function CCIPProgressTracker({
  sourceTransactionHash,
  sourceChainSelectorName,
  onComplete,
  onError,
  onClose,
}: CCIPProgressTrackerProps) {
  const [progressData, setProgressData] = useState<CCIPProgressData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pollInterval = 12000; // 12 seconds
  const retryInterval = 10000; // 10 seconds for 400 errors

  const fetchProgress = async () => {
    try {
      const response = await fetch(
        `/api/ccip-progress?sourceChainSelectorName=${sourceChainSelectorName}&sourceTransactionHash=${sourceTransactionHash}`
      );

      if (response.status === 400) {
        setRetryCount((prev) => prev + 1);
        // Clear current interval and set a timeout for 400 errors
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
          clearInterval(intervalRef.current);
        }
        // Use setTimeout to wait 10 seconds before next attempt
        intervalRef.current = setTimeout(fetchProgress, retryInterval);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CCIPProgressData = await response.json();
      setProgressData(data);
      setError(null);
      setIsLoading(false);

      // Reset to normal polling interval when we get successful data
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(fetchProgress, pollInterval);

      // Check if transaction is complete
      if (data.receiptTransactionHash && !isCompleted) {
        setIsCompleted(true);
        // Clear the polling interval
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        toast.success("CCIP Transfer Complete!", {
          description:
            "Your cross-chain transfer has been successfully completed.",
          duration: 5000,
        });
        onComplete?.(data);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch progress";
      setError(errorMsg);
      setIsLoading(false);
      toast.error("CCIP Progress Error", {
        description: errorMsg,
        duration: 5000,
      });
      onError?.(errorMsg);
    }
  };

  useEffect(() => {
    // Don't poll if already completed
    if (isCompleted) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    fetchProgress();

    // Set up polling interval
    intervalRef.current = setInterval(fetchProgress, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sourceTransactionHash, sourceChainSelectorName, retryCount, isCompleted]);

  const getProgressSteps = (): ProgressStep[] => {
    if (!progressData) {
      return [
        {
          id: "finalizing",
          title: "Waiting for transaction to be finalized",
          description:
            "Transaction is being processed and indexed by CCIP network",
          status: "in-progress",
        },
        {
          id: "confirming",
          title: "Confirming transaction",
          description: "Transaction confirmed on source chain",
          status: "pending",
        },
        {
          id: "finality",
          title: "Waiting for Solana finality",
          description: "Waiting for transaction finality",
          status: "pending",
        },
        {
          id: "commit",
          title: "Publishing CCIP commitment",
          description: "Publishing commitment to CCIP network",
          status: "pending",
        },
        {
          id: "complete",
          title: "Completing transfer",
          description: "Finalizing cross-chain transfer",
          status: "pending",
        },
      ];
    }

    const steps: ProgressStep[] = [
      {
        id: "finalizing",
        title: "Waiting for transaction to be finalized",
        description:
          "Transaction is being processed and indexed by CCIP network",
        status: "completed",
      },
      {
        id: "confirming",
        title: "Confirming transaction",
        description: "Transaction confirmed on source chain",
        status: progressData.sendBlockTimestamp ? "completed" : "in-progress",
      },
      {
        id: "finality",
        title: "Waiting for Solana finality",
        description: "Waiting for transaction finality",
        status:
          progressData.sendBlockTimestamp && !progressData.commitBlockTimestamp
            ? "in-progress"
            : progressData.commitBlockTimestamp
            ? "completed"
            : "pending",
      },
      {
        id: "commit",
        title: "Publishing CCIP commitment",
        description: "Publishing commitment to CCIP network",
        status: progressData.commitTransactionHash
          ? "completed"
          : progressData.sendBlockTimestamp
          ? "in-progress"
          : "pending",
      },
      {
        id: "complete",
        title: "Completing transfer",
        description: "Finalizing cross-chain transfer",
        status: progressData.receiptTransactionHash
          ? "completed"
          : progressData.commitTransactionHash
          ? "in-progress"
          : "pending",
      },
    ];

    return steps;
  };

  const formatAmount = (amount: string, decimals: number = 9) => {
    const amountBigInt = BigInt(amount);
    const divisor = BigInt(Math.pow(10, decimals));
    const wholePart = amountBigInt / divisor;
    const fractionalPart = amountBigInt % divisor;

    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }

    const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
    const trimmedFractional = fractionalStr.replace(/0+$/, "");

    return trimmedFractional
      ? `${wholePart}.${trimmedFractional}`
      : wholePart.toString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainInfo = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case "ethereum-testnet-sepolia":
      case "ethereum":
        return {
          logo: "/tokens/ethereum.svg",
          name: "Ethereum",
          alt: "Ethereum",
        };
      case "base":
        return {
          logo: "/tokens/base.svg",
          name: "Base",
          alt: "Base",
        };
      case "bsc":
        return {
          logo: "/tokens/bsc.svg",
          name: "BSC",
          alt: "BSC",
        };
      case "solana-devnet":
      case "solana":
        return {
          logo: "/tokens/solana.svg",
          name: "Solana",
          alt: "Solana",
        };
      case "hyper":
        return {
          logo: "/tokens/hyper.svg",
          name: "Hyperliquid",
          alt: "Hyperliquid",
        };
      default:
        return {
          logo: "/tokens/ethereum.svg", // fallback
          name: chainName,
          alt: chainName,
        };
    }
  };

  const steps = getProgressSteps();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#020826CC] border-[#616C99] overflow-hidden p-0">
      <CardContent className="p-0">
        <div className={`flex items-center justify-between px-4 py-3 ${!isCollapsed ? 'border-b border-[#616C99]' : ''}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-3 flex-1 text-left cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-white" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                CCIP Transfer Progress
              </h2>
              <p className="text-sm text-[#CCCCCC]">
                {isCompleted
                  ? "Transfer completed successfully"
                  : "Tracking cross-chain transfer..."}
              </p>
            </div>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Sending...
              </h3>
              <p className="text-[#CCCCCC]">
                Your token transfer is currently being sent securely cross chain
                using Chainlink CCIP.
              </p>
            </div>

            <div className="mb-8">
              <ProgressSteps
                steps={steps.map((step) => ({
                  label: step.title,
                  completed: step.status === "completed",
                }))}
              />
            </div>

            {progressData &&
              (() => {
                const sourceChain = getChainInfo(
                  progressData.sourceNetworkName
                );
                const destChain = getChainInfo(progressData.destNetworkName);

                return (
                  <div className="border-t border-[#616C99] pt-8">
                    <h3 className="font-semibold mb-6 text-white text-lg">
                      Summary
                    </h3>
                    <div className="flex items-center justify-between bg-[#000321] rounded-lg p-6">
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-3 mx-auto">
                          <Image
                            src={sourceChain.logo}
                            alt={sourceChain.alt}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <p className="text-sm text-[#CCCCCC] font-mono">
                          {formatAddress(progressData.sender)}
                        </p>
                        <p className="text-xs text-[#616C99] mt-1">
                          From {sourceChain.name}
                        </p>
                      </div>
                      <div className="text-center flex-1 px-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {progressData.tokenAmounts.length > 0
                            ? formatAmount(progressData.tokenAmounts[0].amount)
                            : "0"}
                        </div>
                        <div className="w-8 h-0.5 bg-[#FF5800] mx-auto"></div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-[#0B35F1] rounded-lg flex items-center justify-center mb-3 mx-auto">
                          <Image
                            src={destChain.logo}
                            alt={destChain.alt}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <p className="text-sm text-[#CCCCCC] font-mono">
                          {formatAddress(progressData.receiver)}
                        </p>
                        <p className="text-xs text-[#616C99] mt-1">
                          To {destChain.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {progressData && (
              <div className="border-t border-[#616C99] pt-4 mt-4">
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-white">Message ID:</span>{" "}
                    <a
                      href={`https://test.transporter.io/api/h/ccipData/message/details?sourceChainSelectorName=${sourceChainSelectorName}&sourceTransactionHash=${sourceTransactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5800] hover:underline"
                    >
                      {progressData.messageId}
                    </a>
                  </div>
                  {progressData.sendTransactionHash && (
                    <div>
                      <span className="font-medium text-white">
                        Source Transaction:
                      </span>{" "}
                      <a
                        href={`https://explorer.solana.com/tx/${progressData.sendTransactionHash}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF5800] hover:underline"
                      >
                        {formatAddress(progressData.sendTransactionHash)}
                      </a>
                    </div>
                  )}
                  {progressData.receiptTransactionHash && (
                    <div>
                      <span className="font-medium text-white">
                        Destination Transaction:
                      </span>{" "}
                      <a
                        href={`https://sepolia.etherscan.io/tx/${progressData.receiptTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF5800] hover:underline"
                      >
                        {formatAddress(progressData.receiptTransactionHash)}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-white">
                      CCIP Explorer:
                    </span>{" "}
                    <a
                      href={`https://ccip.chain.link/#/side-drawer/msg/${progressData.messageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5800] hover:underline"
                    >
                      View on CCIP Explorer
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
