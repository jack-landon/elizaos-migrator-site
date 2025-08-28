import { twMerge } from "tailwind-merge";

export enum SwapType {
  Migrate = "swap",
  Bridge = "migrate",
}

type SwapSelectorProps = {
  onChange: (swapType: SwapType) => void;
  selected: SwapType;
};

export default function SwapSelector({
  onChange,
  selected,
}: SwapSelectorProps) {
  return (
    <div className="flex gap-5 py-4">
      <button
        className="justify-start flex flex-col align-start space-y-1"
        onClick={() => onChange(SwapType.Migrate)}
      >
        <div
          className={twMerge(
            "border-b-3 border-b-transparent hover:cursor-pointer transition-all w-20",
            selected === SwapType.Migrate && "border-b-[#0B35F1]"
          )}
        />
        <p className="font-normal text-left text-xl text-[#0B35F1]">Migrate</p>
      </button>
      <button
        onClick={() => onChange(SwapType.Bridge)}
        className="justify-start flex flex-col align-start space-y-1"
      >
        <div
          className={twMerge(
            "border-b-3 border-b-transparent hover:cursor-pointer transition-all w-20",
            selected === SwapType.Bridge && "border-b-[#0B35F1]"
          )}
        />
        <p className="font-normal text-left text-xl text-[#0B35F1]">Bridge</p>
      </button>
    </div>
  );
}
