import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="relative lg:h-[70vh] w-full bg-[#01071f]">
      {/* Left-side background image */}
      {/* <div className="hidden md:flex  absolute inset-y-0 left-0">
        <Image
          src="/how-it-works/background.png"
          alt="Decorative strip"
          className="h-full w-full"
          priority
          height={900}
          width={400}
          draggable={false}
        />
      </div> */}
      {/* Center background video */}
      {/* <div className="hidden md:flex absolute -inset-0 justify-center">
        <video
          src="/how-it-works/sequence.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full"
          draggable={false}
        />
      </div> */}

      {/* Content */}
      <div className="relative h-full grid grid-cols-1 xl:grid-cols-2">
        <div className="grid h-fit justify-between p-6 lg:p-12 col-span-1">
          <p className="text-white uppercase text-[24px] font-medium">
            Protocol
          </p>
          <h1 className="w-full md:max-w-md mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col ">
            The Migration Sequence
          </h1>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-8 2xl:gap-16 mt-0 md:mt-12 col-span-1 items-end">
            <Steps
              step={1}
              title="Connect"
              description="Connect Wallet - Ethereum wallet only MetaMask, WalletConnect, Coinbase, etc."
            />
            <Steps
              step={2}
              title="Approve"
              description="Sign a transaction to authorize migration contract."
            />
            <Steps
              step={3}
              title="Migrate"
              description="1 $AI16Z → 6 $ELIZA 
(Instant airdropped into your wallet"
            />
            <Steps
              step={4}
              title="Join the Swarm"
              description="Start staking, governing, and building with ElizaOS"
            />
          </div>
        </div>

        {/* <div className="absolute bottom-0 left-55">
          <Image
            src="/how-it-works/eliza.png"
            height={682}
            width={903}
            alt="eliza-image"
            draggable={false}
          />
        </div> */}
      </div>
    </div>
  );
}

interface IStepsProps {
  step: number;
  title: string;
  description: string;
}

function Steps({ step, title, description }: IStepsProps) {
  return (
    <div className="border-t w-full lg:w-full 2xl:w-2/3 border-[#002FFF] flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-2 mr-0 2xl:mr-12">
      {/* Step Number */}
      <div className="sm:w-1/5">
        <span
          className="text-white font-extralight leading-none 
        text-[48px] sm:text-[72px] md:text-[90px] 2xl:text-[100px]"
        >
          0{step}
        </span>
      </div>

      {/* Title + Description */}
      <div className="py-0 sm:py-3 flex flex-col sm:flex-row w-full items-start sm:items-start justify-between gap-2 sm:gap-4">
        <h2
          className="text-white font-normal leading-tight 
        text-[20px] sm:text-[28px] md:text-[34px] 2xl:text-[42px] w-full sm:w-1/3"
        >
          {title}
        </h2>
        <p
          className="text-white font-normal 
        text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px] w-full sm:w-1/2 text-left"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
