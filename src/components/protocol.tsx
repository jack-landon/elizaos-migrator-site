import Image from "next/image";
import Badge from "./badge";

export default function Protocol() {
  return (
    <div className="relative overflow-hidden md:h-full 2xl:h-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:flex absolute z-[-1] top-1/2 left-1/2 md:w-[670px] md:h-[630px] 2xl:w-[850px] 2xl:h-[800px] -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        {/* Make sure your video is in the `public` folder */}
        <source src="/how-it-works/sequence.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Image
        src="/how-it-works/eliza.png"
        alt="Descriptive alt text for the image"
        width={950}
        height={724}
        className="hidden md:flex absolute bottom-0 place-self-start  md:right-1/2 2xl:place-self-center md:w-[660px] md:h-[500px] 2xl:right-2/5 2xl:mr-44 2xl:w-[950px] 2xl:h-[724px]"
      />

      {/* Your Original Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 h-full">
        <div className="grid h-fit justify-between p-6 lg:p-12 col-span-1">
          <Badge title="protocol" />
          <h1 className="w-full md:max-w-md mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col leading-15">
            The Migration Sequence
          </h1>
        </div>

        <div className="grid items-center">
          <div className="place-items-end space-y-12">
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
    <div className="border-t w-full lg:w-3/5 xl:w-2/3 2xl:w-2/3 border-[#FF5800] flex flex-col sm:flex-row items-start gap-0 sm:gap-6 pt-2 mr-0 2xl:mr-12">
      {/* Step Number */}
      <div className="h-full">
        <span
          className="text-[#FF5800] font-light leading-none 
        text-[48px] md:text-[25px] 2xl:text-[48px]"
        >
          0{step}
        </span>
      </div>

      {/* Title + Description */}
      <div className="py-0 flex flex-col w-full items-start sm:items-start justify-between gap-2 sm:gap-0">
        <h2
          className="text-white font-normal leading-tight 
        text-[20px] sm:text-[28px] md:text-[28px] 2xl:text-[48px] w-full"
        >
          {title}
        </h2>
        <p
          className="text-white font-normal 
        text-[14px] sm:text-[18px] md:text-[20px] xl:text-[30px] w-full text-left"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
