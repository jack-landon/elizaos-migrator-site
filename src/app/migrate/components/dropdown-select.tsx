import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DropDownSelect({
  destinations,
  onChange,
}: {
  destinations: { name: string; value: string; image: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[240px] h-[60px] border-none rounded-xs bg-[#282F47]">
        <SelectValue placeholder="SELECT" />
      </SelectTrigger>
      <SelectContent className="bg-[#3D404D] border-none rounded-none">
        <SelectGroup>
          {destinations.map((destination) => (
            <SelectItem
              className="bg-[#3D404D] rounded-xs"
              key={destination.value}
              value={destination.value}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={30}
                  height={30}
                  draggable={false}
                />
                <span className="text-white font-normal text-[20px] ">
                  {destination.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
