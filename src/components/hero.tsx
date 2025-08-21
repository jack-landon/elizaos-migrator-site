import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-[90.5vh] w-full overflow-hidden">
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

      <div className="relative p-12 text-white grid grid-cols-2 h-full">
        {/* Left Column */}
        <div className="text-white flex flex-col">
          <div className="flex flex-col items-start gap-y-12">
            <div>
              <h1 className="text-white font-bold text-[91px] leading-tight">
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
              <p className="text-[25px] text-white font-normal max-w-xl leading-9">
                Convert your $AI16Z tokens and step into the next phase of
                ElizaOS — governance, staking, and full protocol access.
              </p>
            </div>

            <div className="flex flex-col gap-0">
              <Link href="/migrate">
                <Button className="cursor-pointer hover:bg-none rounded-sm bg-white text-black text-[25px] relative font-bold w-[230px] h-[60px] flex items-center justify-center">
                  Start Migration
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <Image
          className="absolute bottom-0 right-0 w-auto max-w-[600px] md:max-w-[800px] lg:max-w-[1200px] h-auto object-contain"
          src="/hero/eliza-hero.png"
          height={1200}
          width={1200}
          alt="hero-image"
        />

        {/* Banner image on the complete right, hidden on mobile */}
        <Image
          className="absolute top-0 right-0 hidden md:block h-full object-cover"
          src="/hero/eliza-banner.svg"
          height={1785}
          width={17}
          alt="eliza-banner"
        />
      </div>
    </div>
  );
}
