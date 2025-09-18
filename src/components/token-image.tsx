"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function TokenImage() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Flip every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[90px] h-[90px] [perspective:1000px]">
      {/* Flipper container */}
      <div
        className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front Face (Eliza) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center">
          <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] lg:w-[90px] lg:h-[90px]">
            {/* Orange Glow */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700 ${
                !isFlipped ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: "220%",
                height: "220%",
                background:
                  "radial-gradient(circle, rgba(255,165,0,0.35) 0%, rgba(255,165,0,0.12) 60%, transparent 80%)",
                filter: "blur(10px)",
                zIndex: -1,
              }}
            />
            <Image
              src="/tokens/eliza.svg"
              alt="Eliza Token"
              width={90}
              height={90}
              className="w-full h-full object-contain relative z-10"
              draggable={false}
            />
          </div>
        </div>

        {/* Back Face (AI16Z) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] lg:w-[90px] lg:h-[90px]">
            <Image
              src="/tokens/ai16z.svg"
              alt="AI16Z Token"
              width={90}
              height={90}
              className="w-full h-full object-contain relative z-10"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
