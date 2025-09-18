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
    <div className="flex gap-5 pb-4 relative">
      <button
        className="justify-start cursor-pointer flex flex-col align-start space-y-1 group"
        onClick={() => onChange(SwapType.Migrate)}
      >
        <div
          className={twMerge(
            "border-b-3 border-b-transparent hover:cursor-pointer transition-all duration-300 ease-in-out w-20",
            selected === SwapType.Migrate && "border-b-[#0B35F1]"
          )}
        />
        <p
          className={twMerge(
            "font-normal text-left text-xl transition-all duration-300 ease-in-out",
            selected === SwapType.Migrate
              ? "text-[#0B35F1] scale-105"
              : "text-[#616C99] hover:text-[#0B35F1] group-hover:scale-102"
          )}
        >
          Migrate
        </p>
      </button>

      <button
        onClick={() => onChange(SwapType.Bridge)}
        className="justify-start cursor-pointer flex flex-col align-start space-y-1 group"
      >
        <div
          className={twMerge(
            "border-b-3 border-b-transparent hover:cursor-pointer transition-all duration-300 ease-in-out w-20",
            selected === SwapType.Bridge && "border-b-[#0B35F1]"
          )}
        />
        <p
          className={twMerge(
            "font-normal text-left text-xl transition-all duration-300 ease-in-out",
            selected === SwapType.Bridge
              ? "text-[#0B35F1] scale-105"
              : "text-[#616C99] hover:text-[#0B35F1] group-hover:scale-102"
          )}
        >
          Bridge
        </p>
      </button>
    </div>
  );
}
