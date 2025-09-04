import Badge from "./badge";

export default function Portal() {
  return (
    <div className="mt-12 flex flex-row relative h-full lg:h-[85vh] 2xl:h-[90vh] w-full bg-[#01071a] space-y-18 xl:space-y-0">
      <div className="h-fit mt-0 px-4 lg:px-12 space-y-0">
        <Badge title="access" />

        <h1 className="mt-12 text-white font-bold text-2xl lg:text-[54px] uppercase max-w-md">
          Your Portal to ElizaOS
        </h1>
        <p className="mt-5 text-[20px] lg:text-[28px] font-normal text-white w-full lg:max-w-xl">
          The window to migrate is open — dont miss your chance to convert your
          AI16Z and claim your role in the next phase of ElizaOS.
        </p>
      </div>
    </div>
  );
}
