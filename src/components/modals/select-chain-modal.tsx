import ReusableModal from "./reusable-modal";

// const destinations = [
//   { name: "Base", value: "base", image: "/tokens/base.svg" },
//   { name: "BSC", value: "bsc", image: "/tokens/bsc.svg" },
//   { name: "Ethereum", value: "eth", image: "/tokens/ethereum.svg" },
//   { name: "Hyperliquid", value: "hyper", image: "/tokens/hyper.svg" },
//   { name: "Solana", value: "solana", image: "/tokens/solana.svg" },
// ];

export default function SelectChainModal({
  isOpen,
  setIsModalOpen,
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={() => setIsModalOpen(false)}
      className="bg-[#96A3D8] rounded-lg p-6"
    >
      <h2 className="uppercase font-normal text-[#B2BFF2]">
        Select Chain Modal
      </h2>
    </ReusableModal>
  );
}
