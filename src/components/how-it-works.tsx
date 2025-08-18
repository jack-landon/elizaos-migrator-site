import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="relative h-screen w-full bg-[#01071f]">
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
        <div className="grid p-12 col-span-1 ">
          <h1 className="uppercase text-white text-[60px] font-bold flex flex-col leading-18">
            How It <span>Works</span>
          </h1>
        </div>
        <div className="grid h-2/3 mt-12 col-span-1 justify-items-end">
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
    <div className="border-t-1 w-2/3 border-[#002FFF] flex items-center gap-6 pt-0">
      {/* Step Number */}
      <span className="text-white text-[125px] font-thin leading-none">
        {step}
      </span>

      {/* Title + Description */}
      <div className="ml-4">
        <h2 className="text-white font-normal text-[42px] leading-tight">
          {title}
        </h2>
        <p className="max-w-xl text-[#6D6D6D] text-[24px]">{description}</p>
      </div>
    </div>
  );
}
