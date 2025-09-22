"use client";
import Hero from "@/components/hero";
import HeroBar from "@/components/hero-bar";

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
        {/* <Partners /> */}
        {/* <Foundation /> */}
        {/* <Protocol /> */}
        {/* <Expansion /> */}
        {/* <TokenOmics /> */}
        {/* <Portal /> */}
        {/* <Faq /> */}
      </div>
    </div>
  );
}
