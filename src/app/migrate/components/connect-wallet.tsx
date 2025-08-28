"use client";
import { Button } from "@/components/ui/button";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { SwapType } from "./swap-selector";

type SwapConfirmButtonProps = {
  selectedDestination: string | null;
  destinationAddress: string;
  setDestinationAddress: (val: string) => void;
  swapType: SwapType;
};

export default function SwapButton({
  selectedDestination,
  destinationAddress,
  setDestinationAddress,
  swapType,
}: SwapConfirmButtonProps) {
  const { connect, connected } = useSolanaWallet();

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

  const buttonText = swapType === SwapType.Bridge ? "Bridge" : "Convert";

  return (
    <Button className="items-center bg-[#0B35F1] rounded-sm w-full max-w-[648px] h-[52px] sm:h-[68px] uppercase text-white text-[18px] sm:text-[24px] cursor-pointer">
      {buttonText}
    </Button>
  );
}
