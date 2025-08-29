import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-[#01071F] relative">
      <div className="grid place-self-center mx-6 md:mx-12 gap-y-12 md:gap-y-24 grid-cols-1 h-full md:grid-cols-2 py-6 mb-12 md:mb-0 md:py-12">
        <div className="col-span-full">
          <Image
            src="/footer/logo.svg"
            alt="footer-logo"
            className="w-full h-auto object-contain"
            height={250}
            width={1600}
            unoptimized
            priority
            draggable={false}
          />
        </div>
        <div className="w-full justify-items-start">
          <h1 className="text-[#0B35F1] text-[36px] uppercase leading-[1.1] font-extrabold">
            Economy Powered <br /> by Intelligence
          </h1>
        </div>
        <div className="w-full flex flex-row justify-between md:justify-around justify-items-center">
          <div className="flex text-[24px] flex-col space-y-4">
            <Link
              href="/partners"
              className="transition-colors font-medium text-[20px] text-[#0B35F1] uppercase duration-300 hover:text-[#0B35F1]"
            >
              Partners
            </Link>
            <Link
              href="https://docs.elizaos.ai"
              className="transition-colors font-medium text-[20px] text-[#0B35F1] uppercase duration-300 hover:text-[#0B35F1]"
              target="_blank"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/elizaos"
              className="transition-colors font-medium text-[20px] text-[#0B35F1] uppercase duration-300 hover:text-[#0B35F1]"
              target="_blank"
            >
              Github
            </Link>
            <Link
              href="mailto:inquiries@elizalabs.ai"
              className="transition-colors font-medium text-[#0B35F1] text-[20px] uppercase duration-300 hover:text-[#0B35F1]"
            >
              Contact
            </Link>
          </div>
          <div className="flex text-[24px] flex-col space-y-6">
            <Link
              target="_blank"
              href="https://github.com/elizaos"
              className="flex items-center space-x-2"
            >
              <Image
                src="/footer/github-icon.svg"
                alt="Github"
                width={36}
                height={36}
                draggable={false}
              />
              <h1 className="text-[#0B35F1] ml-2">Github</h1>
            </Link>

            <Link
              target="_blank"
              className="flex items-center space-x-2"
              href="https://discord.com/invite/tgCCVF9vEa"
            >
              <Image
                src="/footer/discord-icon.svg"
                alt="Contact"
                width={36}
                height={36}
                draggable={false}
              />
              <h1 className="text-[#0B35F1] ml-2">Discord</h1>
            </Link>
            <Link
              className="flex items-center space-x-2"
              href="https://x.com/elizaos"
              target="_blank"
            >
              <Image
                src="/footer/x-icon.svg"
                alt="Docs"
                width={36}
                height={36}
                draggable={false}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[url('/footer/checker-bar-2.svg')] bg-repeat w-full h-12 mt-4" />
    </div>
  );
}
