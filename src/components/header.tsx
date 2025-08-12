import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-row justify-between">
      <Image
        width={120}
        height={20}
        src="/header/header-logo.svg"
        alt="header-logo"
        draggable={false}
      />
      <div className="mr-0 lg:mr-55 relative -mt-8">
        <Image
          src="/header/eliza-icon-text.png"
          priority
          unoptimized
          height={50}
          width={154}
          alt="header-eliza-icon"
          draggable={false}
        />
      </div>
    </div>
  );
}
