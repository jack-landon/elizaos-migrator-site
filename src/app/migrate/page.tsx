"use client";
import { Card } from "@/components/ui/card";
import Swap from "./components/swap";
import SwapSelector, { SwapType } from "./components/swap-selector";
import { useState } from "react";
import SvgParticleSimulation from "./components/animation";
import { redirect } from "next/navigation";

export default function Page() {
  if (process.env.NEXT_PUBLIC_IS_MIGRATION_LIVE === "false") {
    redirect("/");
  }

  const [currentSwapType, setCurrentSwapType] = useState<SwapType>(
    SwapType.Migrate
  );

  return (
    <div className="h-full flex flex-col relative bg-[#000322]">
      <div className="flex flex-col justify-center items-center z-10 flex-1 px-4 sm:px-6 py-4 sm:py-8 bg-transparent">
        <div className="w-full max-w-[680px]">
          <SwapSelector
            onChange={setCurrentSwapType}
            selected={currentSwapType}
          />
          <Card className="p-4 w-full bg-[#0B35F11A] border-none rounded-sm min-h-fit">
            <Swap swapType={currentSwapType} />
          </Card>
        </div>
      </div>
      <SvgParticleSimulation />
    </div>
  );
}
