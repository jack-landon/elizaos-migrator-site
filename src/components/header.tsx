"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

  const pathname = usePathname();

  return (
    <div className="p-12 flex flex-row items-center justify-between w-full">
      <Link href="/">

      <Image
        width={120}
        height={20}
        src="/header/header-logo.svg"
        alt="header-logo"
        draggable={false}
        />
        </Link>
   {pathname !== "/migrate" && (

      <div className="relative">
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
   )}
    </div>
  );
}
