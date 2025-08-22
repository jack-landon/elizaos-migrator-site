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

export default function DropDownSelect() {
  const tokens = [
    { name: "Base", value: "base", image: "/tokens/base.svg" },
    { name: "Solana", value: "solana", image: "/tokens/solana.svg" },
    { name: "Hyperliquid", value: "hyper", image: "/tokens/hyper.svg" },
    { name: "Ethereum", value: "eth", image: "/tokens/ethereum.svg" },
  ];

  return (
    <Select>
      <SelectTrigger className="w-[240px] h-[60px] border-none rounded-xs bg-[#282F47]">
        <SelectValue placeholder="SELECT" />
      </SelectTrigger>
      <SelectContent className="bg-[#3D404D] border-none rounded-none">
        <SelectGroup>
          {tokens.map((token) => (
            <SelectItem
              className="bg-[#3D404D] rounded-xs"
              key={token.value}
              value={token.value}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={token.image}
                  alt={token.name}
                  width={30}
                  height={30}
                />
                <span className="text-white font-normal text-[20px] ">
                  {token.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
