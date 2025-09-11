"use client";
import { CCIPProgressTracker } from "@/components/ccip-progress-tracker";
import { toast } from "sonner";

interface BridgeProgressProps {
  showProgress: boolean;
  transactionHash: string | null;
  selectedDestination: string | null;
  onClose: () => void;
}

export default function BridgeProgress({
  showProgress,
  transactionHash,
  selectedDestination,
  onClose,
}: BridgeProgressProps) {
  if (!showProgress || !transactionHash) {
    return null;
  }

  return (
    <div className="mt-6">
      <CCIPProgressTracker
        sourceTransactionHash={transactionHash}
        sourceChainSelectorName="solana-devnet"
        selectedDestination={selectedDestination}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onComplete={(data) => {
          toast.success("CCIP Transfer Complete!", {
            description:
              "Your cross-chain transfer has been successfully completed.",
            duration: 5000,
          });
        }}
        onError={(error) => {
          console.error("❌ CCIP progress error:", error);
          toast.error("CCIP Progress Error", {
            description: error,
            duration: 5000,
          });
        }}
        onClose={onClose}
      />
    </div>
  );
}
