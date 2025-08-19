import Image from "next/image";
import Hero from "@/components/hero";
import Faq from "@/components/faq";
import Partners from "@/components/partners";
import HowItWorks from "@/components/how-it-works";
import TokenOmics from "@/components/tokenomics";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* <Partners /> */}
      <HowItWorks />
      <TokenOmics />
      {/* <Faq /> */}
    </div>
  );
}
