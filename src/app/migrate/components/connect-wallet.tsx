"use client";
import { Button } from "@/components/ui/button";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useBridge } from "@/hooks/useBridge";
import { useMigration } from "@/hooks/useMigration";
import BridgeProgress from "./bridge-progress";
import { SwapType } from "./swap-selector";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";

type SwapConfirmButtonProps = {
  selectedDestination: string | null;
  destinationAddress: string;
  swapType: SwapType;
  inputAmount: string;
};

export default function SwapButton({
  selectedDestination,
  destinationAddress,
  swapType,
  inputAmount,
}: SwapConfirmButtonProps) {
  const { connect, connected, publicKey } = useSolanaWallet();
  const {
    executeBridge,
    approveTokens,
    checkTokenDelegation,
    isLoading: bridgeLoading,
    error: bridgeError,
    showProgress,
    setShowProgress,
    transactionHash,
  } = useBridge();
  const {
    client,
    executeMigration,
    isLoading: migrationLoading,
    error: migrationError,
    initializeClient,
  } = useMigration();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);

  // Initialize migration client when component mounts
  useEffect(() => {
    if (!client && !migrationLoading) {
      console.log("[SwapButton] Initializing migration client...");

      // Get RPC URL-
      const rpcUrl =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.mainnet-beta.solana.com";
      // Initialize client without wallet - wallet will be set when user connects
      initializeClient({ rpcUrl });
    }
  }, [client, initializeClient, migrationLoading]);

  // Check approval status when component mounts or input changes
  useEffect(() => {
    const checkApproval = async () => {
      if (connected && inputAmount && swapType === SwapType.Bridge) {
        try {
          const approved = await checkTokenDelegation(
            "DuMbhu7mvQvqQHGcnikDgb4XegXJRyhUBfdU22uELiZA",
            inputAmount
          );
          setIsApproved(approved);
        } catch (error) {
          console.error("Error checking approval status:", error);
          setIsApproved(false);
        }
      }
    };
    checkApproval();
  }, [connected, inputAmount, swapType, checkTokenDelegation]);

  const handleApprove = async () => {
    if (!inputAmount) return;

    setApprovalLoading(true);
    setErrorMessage(null);

    try {
      const result = await approveTokens({ amount: inputAmount });
      if (result) {
        setIsApproved(true);
        toast.success("Tokens Approved!", {
          description: `Transaction: ${result}`,
          duration: 5000,
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Approval failed";
      setErrorMessage(errorMsg);
      toast.error("Approval Failed", {
        description: errorMsg,
        duration: 5000,
      });
      console.error("Approval error:", err);
    } finally {
      setApprovalLoading(false);
    }
  };

  if (!connected) {
    return (
      <Button
        onClick={connect}
        className="items-center bg-[#0B35F1] rounded-sm w-full max-w-[648px] h-[52px] sm:h-[68px] uppercase text-white text-[18px] sm:text-[24px] cursor-pointer"
      >
        Connect Wallet
      </Button>
    );
  }

  if (!selectedDestination) {
    return (
      <Button className="items-center bg-[#020826CC] rounded-sm w-full max-w-[648px] h-[52px] sm:h-[68px] uppercase text-[#616C99] text-[18px] sm:text-[24px] cursor-pointer">
        select destination
      </Button>
    );
  }

  const needsAddress =
    swapType === SwapType.Bridge ||
    (swapType === SwapType.Migrate && selectedDestination !== "solana");

  if (needsAddress && !destinationAddress) {
    return (
      <Button className="items-center bg-[#020826CC] rounded-sm w-full max-w-[648px] h-[52px] sm:h-[68px] uppercase text-[#616C99] text-[18px] sm:text-[24px]">
        paste destination address
      </Button>
    );
  }

  const handleBridge = async () => {
    if (
      swapType !== SwapType.Bridge ||
      !inputAmount ||
      !selectedDestination ||
      !destinationAddress
    ) {
      return;
    }

    try {
      setErrorMessage(null);

      const gasLimit = 200000;
      const allowOutOfOrderExecution = true;

      const result = await executeBridge({
        amount: inputAmount,
        recipientAddress: destinationAddress,
        targetChain: selectedDestination,
        gasLimit,
        allowOutOfOrderExecution,
      });

      if (result) {
        setErrorMessage(null);
        toast.success("Bridge Successful!", {
          description: `Transaction: ${result.signature}`,
          duration: 5000,
          action: {
            label: "View Explorer",
            onClick: () => window.open(result.solanaExplorerUrl, "_blank"),
          },
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Bridge failed";
      setErrorMessage(errorMsg);
      toast.error("Bridge Failed", {
        description: errorMsg,
        duration: 5000,
      });
      console.error("Bridge error:", err);
    }
  };


  const handleMigrate = async () => {
    if (swapType !== SwapType.Migrate || !inputAmount || !publicKey) {
      return;
    }

    try {
      setErrorMessage(null);


      // Convert amount to the correct format (9 decimals for ai16z token)
      const amountInSmallestUnit = Math.floor(
        parseFloat(inputAmount) * Math.pow(10, 9)
      );

      // Proof will be generated in the migrate function
      const proof: Buffer[] = [];

      const result = await executeMigration({
        authority: new PublicKey(publicKey!),
        amount: amountInSmallestUnit.toString(),
        proof,
      });

      if (result) {
        setErrorMessage(null);
        toast.success("Migration Successful!", {
          description: `Transaction: ${result}`,
          duration: 5000,
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Migration failed";
      setErrorMessage(errorMsg);
      toast.error("Migration Failed", {
        description: errorMsg,
        duration: 5000,
      });
      console.error("Migration error:", err);
    }
  };

  const buttonText = swapType === SwapType.Bridge ? "Bridge" : "Convert";
  const isBridgeReady =
    swapType === SwapType.Bridge &&
    inputAmount &&
    selectedDestination &&
    destinationAddress;
  const isMigrateReady =
    swapType === SwapType.Migrate && inputAmount && publicKey && client;
  const isLoading = bridgeLoading || migrationLoading;
  const error = errorMessage || migrationError;
  const isDisabled =
    isLoading ||
    (swapType === SwapType.Bridge && !isBridgeReady) ||
    (swapType === SwapType.Migrate && !isMigrateReady) ||
    (swapType === SwapType.Migrate && !client);
  const isApprovalDisabled = approvalLoading || !inputAmount;

  return (
    <div className="w-full max-w-[648px]">
      {errorMessage && (
        <div className="mb-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
          {errorMessage}
        </div>
      )}
      {error && (
        <div className="mb-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      {swapType === SwapType.Migrate && !client && !migrationLoading && (
        <div className="mb-2 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-300 text-sm">
          Initializing migration client... Please wait.
        </div>
      )}
      {swapType === SwapType.Bridge ? (
        <div className="space-y-2">
          {!isApproved ? (
            <Button
              onClick={handleApprove}
              disabled={isApprovalDisabled}
              className={`items-center rounded-sm w-full h-[52px] sm:h-[68px] uppercase text-[18px] sm:text-[24px] ${
                isApprovalDisabled
                  ? "bg-[#020826CC] text-[#616C99] cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-pointer hover:from-green-700 hover:to-emerald-700"
              }`}
            >
              {approvalLoading ? "Approving..." : "Approve Tokens"}
            </Button>
          ) : (
            <div className="text-center">
              <Button
                onClick={handleBridge}
                disabled={isDisabled}
                className={`items-center rounded-sm w-full h-[52px] sm:h-[68px] uppercase text-[18px] sm:text-[24px] ${
                  isDisabled
                    ? "bg-[#020826CC] text-[#616C99] cursor-not-allowed"
                    : "bg-[#0B35F1] text-white cursor-pointer"
                }`}
              >
                {isLoading ? "Bridging..." : "Bridge Tokens"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={handleMigrate}
          disabled={isDisabled}
          className={`items-center rounded-sm w-full h-[52px] sm:h-[68px] uppercase text-[18px] sm:text-[24px] ${
            isDisabled
              ? "bg-[#020826CC] text-[#616C99] cursor-not-allowed"
              : "bg-[#0B35F1] text-white cursor-pointer"
          }`}
        >
          {isLoading ? "Processing..." : buttonText}
        </Button>
      )}

      {/* Bridge Progress - Only show for bridge operations */}
      {swapType === SwapType.Bridge && (
        <BridgeProgress
          showProgress={showProgress}
          transactionHash={transactionHash}
          selectedDestination={selectedDestination}
          onClose={() => setShowProgress(false)}
        />
      )}
    </div>
  );
}
