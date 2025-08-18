import Image from "next/image";
import Hero from "@/components/hero";
import Faq from "@/components/faq";
import Partners from "@/components/partners";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  return (
    <div>
      <Hero />
      <Partners />
      <HowItWorks />
      {/* <Faq /> */}
    </div>
  );
}
