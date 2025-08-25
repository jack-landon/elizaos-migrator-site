"use client";
import { useState, useEffect } from "react";
import SwapButton from "./connect-wallet";
import DropDownSelect from "./dropdown-select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DisconnectButton from "./disconnect-button";
import SelectChainModal from "@/components/modals/select-chain-modal";
import { useBalance } from "@/hooks/useBalance";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useQueryClient } from "@tanstack/react-query";

export default function Swap() {
  const destinations = [
    { name: "Base", value: "base", image: "/tokens/base.svg" },
    { name: "Solana", value: "solana", image: "/tokens/solana.svg" },
    { name: "Hyperliquid", value: "hyper", image: "/tokens/hyper.svg" },
    { name: "Ethereum", value: "eth", image: "/tokens/ethereum.svg" },
  ];
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const { connected, publicKey } = useSolanaWallet();
  const [selectChainModalOpen, setSelectChainModalOpen] =
    useState<boolean>(false);
  const queryClient = useQueryClient();

  const { balance, isLoading } = useBalance({
    address: publicKey?.toString() || "",
    tokenMint: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
  });

  useEffect(() => {
    const tokenMint = "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC";

    if (connected && publicKey) {
      const address = publicKey.toString();
      queryClient.invalidateQueries({
        queryKey: ["tokenBalance", address, tokenMint],
      });
    } else {
      setInputValue("");
      queryClient.removeQueries({
        queryKey: ["tokenBalance"],
      });
    }
  }, [connected, publicKey, queryClient]);

  const formatBalance = (balance: number | null) => {
    if (balance === null || balance === 0) return "0";
    return (balance / Math.pow(10, 6)).toLocaleString();
  };

  const handleMaxClick = () => {
    if (connected && balance && balance > 0) {
      const formattedBalance = (balance / Math.pow(10, 6)).toString();
      setInputValue(formattedBalance);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <SelectChainModal
        isOpen={selectChainModalOpen}
        setIsModalOpen={setSelectChainModalOpen}
      />
      <div className="p-4 sm:p-6 min-h-[200px] sm:min-h-[240px] w-full bg-[#0B35F14D] rounded-t-sm">
        <div className="flex justify-between flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2.5 items-start sm:items-center">
          <div className="flex flex-row items-center space-x-2.5">
            <Image
              src="/tokens/ai16z.svg"
              alt="eliza-token"
              height={42}
              width={42}
              draggable={false}
            />
            <h1 className="text-white font-medium text-[18px] sm:text-[21px] uppercase">
              ai16z
            </h1>
          </div>
          <div className="text-[14px] sm:text-[18px] text-white">
            1 AI16Z = 6 ELIZA
          </div>
        </div>
        <div className="flex justify-between items-center flex-col sm:flex-row">
          <Input
            type="number"
            placeholder="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="text-[50px] sm:text-[60px] md:text-[70px] h-full my-4 font-light text-[#CCCCCC] border-0 focus-visible:ring-0 p-0"
          />
          <div className="flex flex-row space-x-2.5 items-center mr-0 sm:mr-5">
            <Image
              src="/tokens/solana.svg"
              alt="eliza-token"
              height={42}
              width={42}
              draggable={false}
            />
            <p className="text-white text-[20px] sm:text-[24px] font-normal">
              Solana
            </p>
          </div>
        </div>

        <div className="text-[12px] sm:text-[14px] text-white font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isLoading && connected ? (
              <>
                <Skeleton
                  width={64}
                  height={16}
                  baseColor="rgba(255, 255, 255, 0.2)"
                  highlightColor="rgba(255, 255, 255, 0.3)"
                />
                <button
                  onClick={handleMaxClick}
                  disabled
                  className="ml-1 font-bold text-white/30 cursor-not-allowed"
                >
                  MAX
                </button>
              </>
            ) : (
              <>
                <span>{connected ? formatBalance(balance) : "0"}</span>
                <button
                  onClick={handleMaxClick}
                  disabled={!connected || !balance || balance === 0}
                  className={`ml-1 font-bold transition-colors ${
                    connected && balance && balance > 0
                      ? "text-white/80 hover:text-white cursor-pointer"
                      : "text-white/50 cursor-not-allowed"
                  }`}
                >
                  MAX
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 w-full bg-[#3333334D] rounded-b-sm">
        <div className="flex flex-row space-x-2.5 items-center">
          <Image
            src="/tokens/eliza.svg"
            alt="eliza-token"
            height={42}
            width={42}
            draggable={false}
          />
          <h1 className="text-white font-medium text-[18px] sm:text-[21px]">
            Eliza
          </h1>
        </div>
        <div className="mt-2 flex justify-between items-start flex-col sm:flex-row">
          <h1 className="text-[50px] sm:text-[60px] md:text-[70px] mt-3 font-light text-[#CCCCCC]">
            2,300.46
          </h1>

          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <p className="uppercase mb-2 text-[#CCCCCC]">destination</p>
            <DropDownSelect
              onChange={setSelectedDestination}
              destinations={destinations}
            />
          </div>
        </div>
        {selectedDestination && selectedDestination != "solana" ? (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="items-center text-white flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <h1 className="uppercase text-[12px] text-white">
                DESTINATION ADDRESS
              </h1>
              <Button
                onClick={async () =>
                  setDestinationAddress(await navigator.clipboard.readText())
                }
                className="font-normal cursor-pointer bg-transparent hover:bg-white/15 rounded-xs px-2 sm:px-3 py-1 sm:py-2 flex flex-row items-center text-[12px] sm:text-[14px]"
              >
                Paste Address{" "}
                <Image
                  src="/util-icons/clipboard.svg"
                  alt="clipboard-icon"
                  height={14}
                  width={14}
                  className="ml-1 sm:ml-2"
                />
              </Button>
            </div>
            {destinationAddress && (
              <div className="text-center mt-3">
                <h1 className="uppercase font-semibold text-[14px] sm:text-[17px] text-white/80 break-all">
                  {destinationAddress}
                </h1>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex justify-center mt-6 sm:mt-8 space-y-2 flex-col">
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
