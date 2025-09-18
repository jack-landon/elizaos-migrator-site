import Image from "next/image";

export default function Badge({ title }: { title: string }) {
  return (
    <div className="relative w-[80px] h-[40px] md:w-[120px] md:h-[40px] lg:w-[147px] lg:h-[55px] flex items-center justify-center">
      {/* Corners */}
      <Image
        src="/arrows/left-up.svg"
        alt="left up"
        width={10}
        height={10}
        className="absolute top-0 left-0"
        draggable={false}
      />
      <Image
        src="/arrows/right-up.svg"
        alt="right up"
        width={10}
        height={10}
        className="absolute top-0 right-0"
        draggable={false}
      />
      <Image
        src="/arrows/left-down.svg"
        alt="left down"
        width={10}
        height={10}
        className="absolute bottom-0 left-0"
        draggable={false}
      />
      <Image
        src="/arrows/right-down.svg"
        alt="right down"
        width={10}
        height={10}
        className="absolute bottom-0 right-0"
        draggable={false}
      />

      {/* Title */}
      <span className="z-10 uppercase text-[#FF5800] text-[9px] md:text-[14px] lg:text-[21px]">
        {title}
      </span>
    </div>
  );
}
