import Image from "next/image";
import Badge from "./badge";
import { Button } from "./ui/button";
import Link from "next/link";
import PortalBar from "./portal-bar";

export default function Portal() {
  return (
    <div className="relative mt-0 flex flex-col w-full bg-[#0a16f1] h-[100vh] md:h-[80vh]">
      {/* Background image */}

      <Image
        src="/portal/migration-portal.png"
        alt="Portal background"
        height={700}
        width={1200}
        className="absolute left-0 w-full h-full zoom-out-40 object-cover z-0"
        loading="eager"

      />
      {/* Content */}
      <div className="relative mt-4 md:mt-12 z-10 h-fit px-4 lg:px-12">
        <Badge title="access" />

        <h1 className="mt-8 text-white font-bold text-[32px] leading-tight xl:text-[54px] uppercase ">
          Your Portal <br /> to ElizaOS
        </h1>
        <p className="mt-3 text-[20px] lg:text-[28px] font-normal text-white w-full max-w-xs sm:max-w-xl">
          The window to migrate is open — dont miss your chance to convert your
          AI16Z and claim your role in the next phase of ElizaOS.
        </p>
      </div>
      <div className="z-20 h-full place-content-center">
        <div className="justify-center flex">
          <Link href="/migrate">
            <Button className="cursor-pointer hover:bg-none rounded-sm bg-white text-black text-[20px] md:text-[25px] relative font-bold w-[160px] h-[42px] md:w-[230px] md:h-[60px] flex items-center justify-center">
              Start Migration
            </Button>
          </Link>
        </div>
      </div>
      <PortalBar />
    </div>
  );
}
