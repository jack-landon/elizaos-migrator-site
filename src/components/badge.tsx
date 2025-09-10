import Image from "next/image";

export default function Badge({ title }: { title: string }) {
  return (
    <div className="relative w-[80px] h-[40px] lg:w-[147px] lg:h-[55px] flex items-center justify-center">
      {/* Corners */}
      <Image
        src="/arrows/left-up.svg"
        alt="left up"
        width={14}
        height={14}
        className="absolute top-0 left-0"
        draggable={false}
      />
      <Image
        src="/arrows/right-up.svg"
        alt="right up"
        width={14}
        height={14}
        className="absolute top-0 right-0"
        draggable={false}
      />
      <Image
        src="/arrows/left-down.svg"
        alt="left down"
        width={14}
        height={14}
        className="absolute bottom-0 left-0"
        draggable={false}
      />
      <Image
        src="/arrows/right-down.svg"
        alt="right down"
        width={14}
        height={14}
        className="absolute bottom-0 right-0"
        draggable={false}
      />

      {/* Title */}
      <span className="z-10 uppercase text-[#FF5800] text-[12px] lg:text-[21px]">
        {title}
      </span>
    </div>
  );
}
