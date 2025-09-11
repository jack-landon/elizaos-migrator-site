import Image from "next/image";
import Badge from "./badge";
import { Button } from "./ui/button";
import Link from "next/link";
import PortalBar from "./portal-bar";

export default function Portal() {
  return (
    <div className="relative mt-0 flex flex-col h-[1000px] w-full bg-[#01071a]">
      {/* Background image */}
      <Image
        src="/portal/migration-portal.png"
        alt="Portal background"
        fill
        className="h-[700px] w-auto z-0"
        priority
      />

      {/* Content */}
      <div className="relative mt-12 z-10 h-fit px-4 lg:px-12">
        <Badge title="access" />

        <h1 className="mt-8 text-white font-bold text-2xl lg:text-[54px] uppercase max-w-md">
          Your Portal to ElizaOS
        </h1>
        <p className="mt-5 text-[20px] lg:text-[28px] font-normal text-white w-full max-w-sm md:max-w-xl">
          The window to migrate is open — dont miss your chance to convert your
          AI16Z and claim your role in the next phase of ElizaOS.
        </p>
      </div>
      <div className="z-20 h-full place-content-center">
        <div className="justify-center flex">
          <Link href="/migrate">
            <Button className="cursor-pointer hover:bg-none rounded-sm bg-white text-black md:text-[25px] relative font-bold w-full h-full max-w-[230px] max-h-[60px] flex items-center justify-center">
              Start Migration
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute top-0 h-full right-6 md:right-12 xl:right-12">
        <PortalBar />
      </div>
    </div>
  );
}
