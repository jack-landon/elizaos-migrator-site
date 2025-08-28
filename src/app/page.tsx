import Expansion from "@/components/expansion";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import BackedBySwarm from "@/components/swarm";
import TokenOmics from "@/components/tokenomics";

export default function Home() {
  return (
    <div>
      <Hero />
      <BackedBySwarm />
      <HowItWorks />
      <Expansion />
      <TokenOmics />
      {/* <Faq /> */}
    </div>
  );
}
