import Image from "next/image";
import Badge from "./badge";

export default function HowItWorks() {
  return (
    <div className="relative h-full 2xl:h-[90vh] w-full ">
      {/* Left-side background image */}
      {/* <div className="hidden -z-20 md:flex  absolute inset-y-0 left-0">
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
      <div className="hidden -z-10 md:flex absolute -inset-0 justify-center md:items-end xl:items-center">
        <video
          src="/how-it-works/sequence.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hidden lg:flex w-[575px] h-[530px] lg:w-[865px] lg:h-[800px]"
          draggable={false}
        />
      </div>
      {/* desktop/ipad image */}
      <div className="absolute bottom-0 w-full flex lg:right-[200px] 2xl:right-[450px] justify-start 2xl:justify-center">
        <Image
          src="/how-it-works/eliza.png"
          height={950}
          width={1200}
          alt="eliza-image"
          draggable={false}
          className="w-[351px] h-[265px] md:w-[660px] md:h-[500px] 2xl:w-[1100px] 2xl:h-[800px]"
        />
      </div>

      {/* Content */}
      <div className="relative h-full grid grid-cols-1 xl:grid-cols-2">
        <div className="grid h-fit justify-between p-6 lg:p-12 col-span-1">
          <Badge title="protocol" />
          <h1 className="w-full md:max-w-md mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col leading-15">
            The Migration Sequence
          </h1>
        </div>
        <div className="xl:p-6 px-6">
          <div className="h-full flex flex-col gap-8 2xl:gap-4 mt-0 xl:mt-12 col-span-1 items-end xl:space-y-2 2xl:space-y-8">
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

        <div className="grid col-span-1 lg:hidden ">
          <div className="">
            <video
              src="/how-it-works/sequence.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full"
              draggable={false}
            />
          </div>
          <div className="absolute bottom-0 -left-24 lg:hidden">
            <Image
              src="/how-it-works/eliza.png"
              height={240}
              width={320}
              alt="eliza-image"
              draggable={false}
              className="w-full h-full"
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
    <div className="border-t w-full lg:w-1/3 xl:w-2/3 2xl:w-2/3 border-[#FF5800] flex flex-col sm:flex-row items-start gap-0 sm:gap-6 pt-2 mr-0 2xl:mr-12">
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
        text-[14px] sm:text-[18px] md:text-[25px] xl:text-[30px] w-full text-left"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
