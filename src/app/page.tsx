import Expansion from "@/components/expansion";
import Faq from "@/components/faq";
import Hero from "@/components/hero";
import HeroBar from "@/components/hero-bar";
import HowItWorks from "@/components/how-it-works";
import BackedBySwarm from "@/components/swarm";
import TokenOmics from "@/components/tokenomics";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section wrapper */}
      <Hero />

      {/* HeroBar over Hero and Header, only on lg and up */}
      <div className="absolute -top-27 right-6 md:right-12 xl:right-24">
        <HeroBar />
      </div>
      <div className="z-20">
        <BackedBySwarm />
        <HowItWorks />
        <Expansion />
        <TokenOmics />
        <Faq />
      </div>
    </div>
  );
}
