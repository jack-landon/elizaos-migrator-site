"use client";
import Image from "next/image";

export default function PortalBar() {
  return (
    <div className="absolute top-0 h-full right-6 md:right-12 xl:right-12 overflow-hidden">
      {/* Container for the infinite scroll animation */}
      <div className="relative h-full">
        {/* Animated wrapper that moves vertically */}
        <div className="animate-scroll-up h-[200%] flex flex-col">
          {/* First set of images */}
          <div className="h-1/3 flex flex-col">
            <Image
              src="/portal/eliza-bar.svg"
              alt="Portal Bar"
              width={22}
              height={170}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Second set of images (duplicate for seamless loop) */}
          <div className="h-1/3 flex flex-col">
            <Image
              src="/portal/eliza-bar.svg"
              alt="Portal Bar"
              width={22}
              height={170}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="h-1/3 flex flex-col">
            <Image
              src="/portal/eliza-bar.svg"
              alt="Portal Bar"
              width={22}
              height={170}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll-up {
          animation: scroll-up 9s linear infinite;
        }
      `}</style>
    </div>
  );
}
