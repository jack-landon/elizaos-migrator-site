import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="text-white grid grid-cols-2 min-h-screen">
      <div className="text-white ">
        <div className="flex gap-y-12 flex-col items-start mt-62 leading-25">
          <div>
            <h1 className="text-white font-bold text-[75px]">A NEW ERA</h1>
            <h1 className="text-white font-bold text-[114px]">BEGINS</h1>
          </div>
          <div className="">
            <p className="text-[25px] text-[#FAFAFA] font-normal max-w-3xl leading-9">
              Convert your $AI16Z tokens and step into the next phase of{" "}
              <span className="font-bold">ElizaOS</span> — governance, staking,
              and full protocol access.
            </p>
          </div>
          <Button className="rounded-2xl px-18 py-7 bg-white text-black text-[20px] relative">Start Migration</Button>
        </div>
      </div>
      {/* <div className=" relative">
        <Image
          src="/hero/hero-eliza.png"
          alt="full-column-image"
          fill
          className="object-cover"
        />
      </div> */}
    </div>
  );
}
