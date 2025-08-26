import Image from "next/image";

export default function BackedBySwarm() {
  return (
    <div className="w-full bg-[#010514] h-fit">
      <h1 className="py-12 uppercase text-[40px] md:text-[60px] font-bold text-center text-white">
        {" "}
        <span
          className="text-transparent mr-4"
          style={{ WebkitTextStroke: "0.5px white" }}
        >
          Backed by the
        </span>
        swarm
      </h1>
      <div className="relative place-items-center overflow-hidden">
        <Image
          className="w-full h-full"
          priority
          unoptimized
          src="/swarms/avatars-2.png"
          alt="avatars-image"
          height={385}
          width={1945}
          draggable={false}
        />

        {/* invisble on mobile until I know if this is also suppoed to be on mobile */}
        <div className="hidden md:block absolute left-0 top-0 h-full w-1/7 md:w-1/7 bg-gradient-to-r from-[#000321]/10 to-transparent backdrop-blur-md pointer-events-none"></div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/7 md:w-1/7 bg-gradient-to-l from-[#000321]/10 to-transparent backdrop-blur-md pointer-events-none"></div>
      </div>
    </div>
  );
}
