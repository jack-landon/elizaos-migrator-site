"use client";
import { useState } from "react";
import SwapButton from "./connect-wallet";
import DropDownSelect from "./dropdown-select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DisconnectButton from "./disconnect-button";

export default function Swap() {
  const destinations = [
    { name: "Base", value: "base", image: "/tokens/base.svg" },
    { name: "Solana", value: "solana", image: "/tokens/solana.svg" },
    { name: "Hyperliquid", value: "hyper", image: "/tokens/hyper.svg" },
    { name: "Ethereum", value: "eth", image: "/tokens/ethereum.svg" },
  ];
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");

  return (
    <div className="w-full flex flex-col">
      <div className="p-6 w-[648px] h-[240px] bg-[#0B35F14D] rounded-t-sm">
        <div className="flex justify-between flex-row space-x-2.5 items-center">
          <div className="flex flex-row items-center space-x-2.5">
            <Image
              src="/tokens/ai16z.svg"
              alt="eliza-token"
              height={42}
              width={42}
              draggable={false}
            />
            <h1 className="text-white font-medium text-[21px] uppercase">
              ai16z
            </h1>
          </div>
          <div className="text-[18px] text-white ">1 AI16Z = 6 ELIZA</div>
        </div>
        <div className="flex justify-between items-center">
          <Input
            type="number"
            placeholder="0"
            className="text-[70px] md:text-[70px] h-full my-4 font-light text-[#CCCCCC] border-0 focus-visible:ring-0 p-0 "
          />
          <div className="flex flex-row space-x-2.5 items-center mr-5">
            {/* <p className="text-[12px] mb-4 text-[#CCCCCC] uppercase">origin</p> */}
            <Image
              src="/tokens/solana.svg"
              alt="eliza-token"
              height={42}
              width={42}
              draggable={false}
            />
            <p className="text-white text-[24px] font-normal">Solana</p>
          </div>
        </div>
        <h1 className="text-[14px] text-white font-medium">
          25456 <span className="ml-1 font-bold text-white/50">MAX</span>
        </h1>
      </div>
      <div className="p-6 w-[648px] min-h-[240px] bg-[#3333334D] rounded-b-sm">
        <div className="flex flex-row space-x-2.5 items-center">
          <Image
            src="/tokens/eliza.svg"
            alt="eliza-token"
            height={42}
            width={42}
            draggable={false}
          />
          <h1 className="text-white font-medium text-[21px]">Eliza</h1>
        </div>
        <div className="mt-2 flex justify-between items-start">
          {/* this is the amount you will receive */}
          <h1 className="text-[70px] mt-3 font-light text-[#CCCCCC]">
            2,300.46
          </h1>

          <div className="flex flex-col items-end">
            <p className="uppercase mb-2 text-[#CCCCCC]">destination</p>
            <DropDownSelect
              onChange={setSelectedDestination}
              destinations={destinations}
            />
          </div>
        </div>
        {/* this part should not be visible when selectedDestination is not selected */}
        {selectedDestination && selectedDestination != "solana" ? (
          <div className="border-t-1">
            <div className="items-center mt-3 text-white flex flex-row justify-between">
              <h1 className="uppercase text-[12px] text-white space-x-4">
                DESTINATION ADDRESS
              </h1>
              <Button
                onClick={async () =>
                  setDestinationAddress(await navigator.clipboard.readText())
                }
                className="font-normal cursor-pointer bg-transparant hover:bg-white/15 rounded-xs px-1 flex flex-row items-center"
              >
                Paste Address{" "}
                <Image
                  src="/util-icons/clipboard.svg"
                  alt="clipboard-icon"
                  height={16}
                  width={16}
                />
              </Button>
            </div>
            <div className="text-center mt-5">
              <h1 className="uppercase font-semibold text-[17px] text-white/80 ml-3">
                {destinationAddress}
              </h1>
            </div>
          </div>
        ) : null}
      </div>
      <div className="justify-center mt-8 space-y-2">
        <SwapButton
          selectedDestination={selectedDestination}
          destinationAddress={destinationAddress}
          setDestinationAddress={setDestinationAddress}
        />
        <DisconnectButton />
      </div>
    </div>
  );
}
