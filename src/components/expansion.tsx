import Image from "next/image";
import Badge from "./badge";
import { cn } from "@/lib/utils";

export default function Expansion() {
  const images = [
    "/expansion/base.png",
    "/expansion/eth.png",
    "/expansion/eliza.png",
    "/expansion/hyper.png",
    "/expansion/solana.png",
  ];

  return (
    <div className="relative h-[75vh] lg:max-h-[85vh] lg:h-[100vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-10" />
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 "
      >
        <source src="/expansion/solar.mp4" type="video/mp4" />
      </video>

      {/* Color overlay */}

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        <div className="grid h-fit justify-between p-6 lg:p-12 col-span-1">
          <Badge title="expansion" />
          <h1 className="w-full md:max-w-lg mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col leading-13">
            The Path Forward is Infinite
          </h1>
          <p className="text-white text-[20px] lg:text-[28px] font-normal mt-4 max-w-xl">
            Migrate your tokens cross-chain — to Ethereum, Base, Hyperliquid, or
            even back to Solana — and choose the ecosystem that fits your
            strategy.
          </p>
        </div>

        <div className="flex justify-center items-center -mt-32 md:mt-0 lg:mt-40 lg:items-start h-full md:px-12">
          <div className="flex items-center w-full">
            {images.map((src, i) => (
              // make these images responsive
              <div key={i} className="flex-1 flex justify-center">
                <Image
                  src={src}
                  alt={`expansion-${i + 1}`}
                  width={src.includes("eliza.png") ? 150 : 100}
                  height={src.includes("eliza.png") ? 150 : 100}
                  draggable={false}
                  className={cn(
                    "h-auto",
                    src.includes("eliza.png")
                      ? "h-full w-15 sm:w-21 md:w-23 lg:w-26 xl:w-38"
                      : "h-full w-9 sm:w-13 md:w-15 lg:w-18 xl:w-24"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
