"use client";
import { useState } from "react";
import SwapButton from "./connect-wallet";
import DropDownSelect from "./dropdown-select";

export default function Swap() {
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const walletConnected = false;
  const destination = false;

  return (
    <div className="w-full flex flex-col">
      <div className="w-[648px] h-[240px] bg-[#0B35F14D] rounded-t-sm">
        swap component
      </div>
      <div className="w-[648px] h-[240px] bg-[#3333334D] rounded-b-sm">
        swap component
        <DropDownSelect />
      </div>
      <div className="justify-center mt-8">
        <SwapButton
          walletConnected={walletConnected}
          destination={destination}
          destinationAddress={destinationAddress}
          setDestinationAddress={setDestinationAddress}
        />
      </div>
    </div>
  );
}
