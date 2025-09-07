import Image from "next/image";
import Badge from "./badge";

export default function Portal() {
  return (
    <div className="relative mt-0 flex flex-row h-full lg:h-[85vh] 2xl:h-[100vh] w-full bg-[#01071a]">
      {/* Background image */}
      <Image
        src="/portal/migration-portal.png" // replace with your image path
        alt="Portal background"
        fill
        className="object-cover object-center z-0"
        priority
      />

      {/* Content */}
      <div className="relative mt-12 z-10 h-fit px-4 lg:px-12">
        <Badge title="access" />

        <h1 className="mt-8 text-white font-bold text-2xl lg:text-[54px] uppercase max-w-md">
          Your Portal to ElizaOS
        </h1>
        <p className="mt-5 text-[20px] lg:text-[28px] font-normal text-white w-full lg:max-w-xl">
          The window to migrate is open — dont miss your chance to convert your
          AI16Z and claim your role in the next phase of ElizaOS.
        </p>
      </div>
      <div className="bg-red-500">hier moet een bu</div>
    </div>
  );
}
