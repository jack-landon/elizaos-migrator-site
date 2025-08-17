import Image from "next/image";
import Hero from "@/components/hero";
import Faq from "@/components/faq";
import Partners from "@/components/partners";

export default function Home() {
  return (
    <div>
      <Hero />
      <Partners />
      {/* <Faq /> */}
    </div>
  );
}
