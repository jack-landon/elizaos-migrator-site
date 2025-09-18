"use client";
import { useState } from "react";
import Badge from "../badge";
import Carrousel from "./carrousel";

export default function Foundation() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="relative h-screen bg-[#020A2E]">
      {/* Background centered div */}

      {/* Foreground content - only visible on slide 0 */}
      <div className="relative z-20 justify-between p-6 lg:p-12 space-y-4">
        <Badge title="foundation" />
        {activeSlide === 0 && (
          <>
            <h1 className="w-full md:max-w-md mt-9 text-white text-[40px] xl:text-[54px] font-semibold flex flex-col leading-15">
              The Intelligent Economy
            </h1>
            <p className="text-white text-[24px] max-w-lg">
              Migrating to ELIZA activates your role in a new kind of Economy
              —One powered by autonomous agents, intelligent treasuries, and
              adaptive governance.
            </p>
          </>
        )}
      <div className="absolute place-self-center -z-20 inset-0 w-full flex items-center justify-center">
        <Carrousel onSlideChange={setActiveSlide} />
      </div>
      </div>
    </div>
  );
}
