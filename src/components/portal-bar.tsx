"use client";
import Image from "next/image";

export default function PortalBar() {
  return (
    <div className="relative h-full w-[17px] overflow-hidden">
      <div className="absolute flex flex-col animate-scroll">
        {/* 3 copies to cover the loop */}
        <Image src="/portal/eliza-bar.svg" alt="" width={17} height={700} />
        <Image src="/portal/eliza-bar.svg" alt="" width={17} height={700} />
        <Image src="/portal/eliza-bar.svg" alt="" width={17} height={700} />
      </div>

      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-1400px); /* (imageHeight * (copies - 1)) */
          }
        }

        .animate-scroll {
          animation: scroll-up 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
