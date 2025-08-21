import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-12 flex flex-row justify-between">
      <Link href="/">

      <Image
        width={120}
        height={20}
        src="/header/header-logo.svg"
        alt="header-logo"
        draggable={false}
        />
        </Link>
      <div className="mr-0 lg:mr-55 relative">
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
