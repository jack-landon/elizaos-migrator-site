import { Card } from "@/components/ui/card";
import Image from "next/image";
import Swap from "./components/swap";

export default function Page() {
  return (
    <div className=" max-h-screen flex flex-col">
      {/* Main content */}
      <div className="h-[70vh] grid place-items-center z-10">
        <Card className="p-4 w-full bg-[#0B35F11A] border-none rounded-sm max-w-[680px] h-fit max-h-[720px]">
          <Swap />
        </Card>
      </div>

      {/* Background image at the bottom */}
      {/* <Image
        src="/migrate/bottom-background.png"
        alt="Background"
        width={1920}
        height={1080}
        className="absolute h-[800px] bottom-0 left-0 w-full object-cover z-0 select-none"
        draggable={false}
      /> */}
    </div>
  );
}
