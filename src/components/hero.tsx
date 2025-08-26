import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import HeroBanner from "./hero-banner";

export default function Hero() {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero/hero-snapshot.png"
      >
        <source src="/hero/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with dark tint (makes text readable) */}
      <div className="absolute inset-0 " />

      <div className="relative px-6 md:p-12 text-white grid grid-cols-1 xl:grid-cols-2 h-full">
        {/* Left Column */}
        <div className="w-full text-white flex flex-col">
          <div className="flex flex-col items-start gap-y-5 md:gap-y-12">
            <div className="w-full">
              <h1 className="text-white font-bold text-[40px] md:text-[80px] lg:text-[91px] leading-tight">
                A NEW ERA
              </h1>
              {/* this is temporary until I get the font files */}
              <Image
                className="mt-4"
                src="/hero/begins.svg"
                alt="hero-text"
                height={184}
                width={720}
                draggable={false}
              />
            </div>

            <div>
              <p className="text-[20px] md:text-[28px] text-white font-normal max-w-xl md:leading-9">
                Convert your $AI16Z tokens and step into the next phase of
                ElizaOS — governance, staking, and full protocol access.
              </p>
            </div>

            <div className="flex flex-col gap-0">
              <Link href="/migrate">
                <Button className="cursor-pointer hover:bg-none rounded-sm bg-white text-black md:text-[25px] relative font-bold w-full h-full max-w-[230px] max-h-[60px] flex items-center justify-center">
                  Start Migration
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero image */}

        <Image
          className="absolute bottom-0 right-0 w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] 2xl:max-w-[1000px] h-full object-contain"
          src="/hero/eliza-hero-2.png"
          height={1200}
          width={1200}
          alt="hero-image"
        />

        {/* <HeroBanner /> */}
      </div>
    </div>
  );
}
