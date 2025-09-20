"use client";
import Expansion from "@/components/expansion";
import Faq from "@/components/faq";
import Hero from "@/components/hero";
import HeroBar from "@/components/hero-bar";
import Portal from "@/components/portal";
import Partners from "@/components/partners";
import TokenOmics from "@/components/tokenomics";
import Protocol from "@/components/protocol";
import Foundation from "@/components/foundation";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section wrapper */}
      <Hero />

      {/* HeroBar over Hero and Header, only on lg and up */}
      <div className="absolute -top-27 right-6 md:right-12 xl:right-12">
        <HeroBar />
      </div>
      <div className="z-20">
        <Partners />
        <Foundation />
        <Protocol />
        {/* <Expansion /> */}
        {/* <TokenOmics /> */}
        {/* <Portal /> */}
        {/* <Faq /> */}
      </div>
    </div>
  );
}
