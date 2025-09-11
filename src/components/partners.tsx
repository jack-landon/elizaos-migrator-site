import Badge from "./badge";

export default function Partners() {
  return (
    <div className="w-full bg-[#010514] h-[130px] md:h-[181px] xl:h-[308px]">
      <div className="h-1/2 place-content-center flex items-center justify-items-center">
        <Badge title="partners" />
      </div>
      <div className="w-full justify-around flex flex-row text-white text-[14px] xl:text-[42px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <h1 className="uppercase" key={i}>
            you
          </h1>
        ))}
      </div>
    </div>
  );
}
