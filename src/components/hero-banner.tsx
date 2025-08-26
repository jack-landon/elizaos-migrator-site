import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="">

    <Image
      className="mr-24 absolute top-0 right-0 hidden md:block h-full object-cover"
      src="/hero/eliza-banner.svg"
      height={1785}
      width={17}
      alt="eliza-banner"
      />
      </div>
  );
}
