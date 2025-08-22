"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SwapConfirmButtonProps = {
  walletConnected: boolean;
  selectedDestination: string | null; 
  destinationAddress: string;
  setDestinationAddress: (val: string) => void;
};

export default function SwapButton({
  walletConnected,
  selectedDestination,
  destinationAddress,
  setDestinationAddress,
}: SwapConfirmButtonProps) {
  if (!walletConnected) {
    return (
      <Button className="items-center bg-[#0B35F1] rounded-sm w-[648px] h-[68px] uppercase text-white text-[24px] cursor-pointer">
        Connect Wallet
      </Button>
    )
  }

  if (!selectedDestination) {
    return (
      <Button className="items-center bg-[#020826CC] rounded-sm w-[648px] h-[68px] uppercase text-[#616C99] text-[24px] cursor-pointer">
        select destination
      </Button>
    )
  }

  // Only require destinationAddress if it's not Solana
  if (selectedDestination !== "solana" && !destinationAddress) {
    return (
      <Input
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        placeholder="enter address"
        className="bg-[#020826CC] border-none text-center rounded-sm w-[648px] h-[68px] uppercase text-[#616C99] text-[24px] font-medium px-4"
      />
    )
  }

  return (
    <Button className="items-center bg-[#0B35F1] rounded-sm w-[648px] h-[68px] uppercase text-white text-[24px] cursor-pointer">
      Convert
    </Button>
  )
}
