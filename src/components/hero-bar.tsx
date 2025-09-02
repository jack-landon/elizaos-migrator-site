import Image from "next/image";

export default function HeroBar() {
  return (
    <div className="hidden lg:block relative h-[98vh] w-[17px] overflow-hidden">
      <div className="absolute flex flex-col scroll-up">
        <Image src="/hero/eliza-banner.svg" alt="" width={17} height={1117} />
        <Image src="/hero/eliza-banner.svg" alt="" width={17} height={1117} />
      </div>
    </div>
  );
}
