import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Hero() {
  return (
<div className="p-12 text-white grid grid-cols-2 relative h-[90.5vh] ">
  {/* The left column of the grid */}
  <div className="text-white flex flex-col">
    {/* This div wraps the top content that should remain at its natural height */}
    <div className="flex flex-col items-start gap-y-12">
      <div>
        <h1 className="text-white font-bold text-[75px] leading-tight">A NEW ERA</h1>
        <h1 className="text-white font-bold text-[114px] leading-none">BEGINS</h1>
      </div>
      <div>
        <p className="text-[25px] text-[#FAFAFA] font-normal max-w-3xl leading-9">
          Convert your $AI16Z tokens and step into the next phase of{" "}
          <span className="font-bold">ElizaOS</span> — governance, staking,
          and full protocol access.
        </p>
      </div>
      <div className="flex flex-col gap-0">
        {/* --- BUTTON MODIFIED HERE --- */}
        <button className="rounded-2xl bg-white text-black text-[20px] relative font-bold w-[240px] h-[55px] flex items-center justify-center">
          Start Migration
        </button>
        <span className="gap-x-2 mt-5 leading-none flex flex-row justify-center items-center text-[18px] font-normal text-[#868686B8]">
          Audit by{" "}
          <img
            src="/hero/certrik.svg"
            alt="certik-logo"
            className="h-[30px] w-[80px]"
          />
        </span>
      </div>
    </div>

    {/* This is the div you want at the bottom. It will grow to fill the remaining space. */}
    <div className="w-full flex-grow mt-12">
      awd
    </div>
  </div>

  {/* <div className="relative">
    <Image
      src="/hero/hero-eliza.png"
      alt="full-column-image"
      fill
      className="object-cover"
    />
  </div> 
  */}
</div>
  );
}
