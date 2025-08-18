import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="relative lg:h-[80vh] w-full bg-[#01071f]">
      {/* Left-side background image */}
      <div className="absolute inset-y-0 left-0">
        <Image
          src="/how-it-works/background.png"
          alt="Decorative strip"
          className="h-full w-full"
          priority
          height={900}
          width={400}
          draggable={false}
        />
      </div>

      {/* Content */}
      <div className="relative h-full grid grid-cols-1 md:grid-cols-2">
        <div className="grid h-fit p-12 col-span-1 ">
          <h1 className="uppercase text-white text-[60px] font-bold flex flex-col leading-18">
            How It <span>Works</span>
          </h1>
        </div>
        <div className="grid h-5/6 mt-12 col-span-1 justify-items-end">
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
          {/* <div className="w-2/3 border-b border-[#002FFF]" /> */}
        </div>
        <div className="absolute bottom-0 left-0">
          <Image
            src="/how-it-works/eliza.png"
            height={585}
            width={775}
            alt="eliza-image"
            draggable={false}
          />
        </div>
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
    <div className="border-t w-2/3 border-[#002FFF] flex items-start gap-4 sm:gap-6 pt-5">
      {/* Step Number */}
      <div className="w-1/5">
        <span
          className="text-white font-thin leading-none 
        text-[48px] sm:text-[72px] md:text-[90px] lg:text-[125px]"
        >
          {step}
        </span>
      </div>

      {/* Title + Description */}
      <div className="ml-4 w-full sm:ml-8 lg:ml-2">
        <h2
          className="text-white font-normal leading-tight 
        text-[20px] sm:text-[28px] md:text-[34px] lg:text-[42px]"
        >
          {title}
        </h2>
        <p
          className="text-[#6D6D6D] max-w-sm sm:max-w-md 
        text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px]"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
