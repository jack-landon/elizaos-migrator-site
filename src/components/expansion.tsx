export default function Expansion() {
  return (
    <div className="relative h-[85vh] w-full bg-[#0B35F1]">
      {/* Content */}
      <div className="relative h-full grid grid-cols-1 xl:grid-cols-2">
        <div className="grid h-fit justify-between p-6 lg:p-12 col-span-1">
          <p className="text-white uppercase text-[24px] font-medium">
            expansion
          </p>
          <h1 className="w-full md:max-w-lg mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col leading-13">
            The Path Forward is Infinite
          </h1>
          <p className="text-white text-[20px] lg:text-[28px] font-normal mt-4 max-w-xl">
            Migrate your tokens cross-chain — to Ethereum, Base, Hyperliquid, or
            even back to Solana — and choose the ecosystem that fits your
            strategy.
          </p>
        </div>
      </div>
    </div>
  );
}
