import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { Button } from "@/components/ui/button";

export default function DisconnectButton() {
  const { connected, disconnect } = useSolanaWallet();

  if (!connected) return null;

  return (
    <Button
      onClick={disconnect}
      className="items-center bg-[#0B35F1] rounded-sm w-[648px] h-[68px] uppercase text-white text-[24px] cursor-pointer"
    >
      Disconnect
    </Button>
  );
}
