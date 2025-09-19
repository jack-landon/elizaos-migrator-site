"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import PlayButton from "../play-button";

export default function Carrousel({ onSlideChange }: { onSlideChange?: (index: number) => void }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    // {
    //   title: "New Economy Video",
    //   href: "#",
    // },
    {
      title: "Generative Networks",
      href: "#",
      image: "/carrousel/star.png",
      text: "Generative networks are economic systems that learn and evolve in real time. Powered by autonomous agents, they compound value, adapt across chains at machine speed, and unlock strategies beyond human design.",
    },
    {
      title: "Generative Networks",
      href: "#",
      image: "/carrousel/star.png",
      text: "Generative networks are economic systems that learn and evolve in real time. Powered by autonomous agents, they compound value, adapt across chains at machine speed, and unlock strategies beyond human design.",
    },
    {
      title: "Autonomous capital",
      href: "#",
      image: "/carrousel/circle.png",
      text: "Autonomous capital is money that runs itself. Intelligent agents deploy, rebalance, and compound value continuously, creating always-on treasuries that adapt and grow across chains.",
    },
    {
      title: "Cross-Chain Architecture",
      href: "#",
      image: "/carrousel/orb.png",
      text: "Cross-chain architecture turns fragmented blockchains into a unified economic system. Agents move liquidity, share memory, and coordinate strategies seamlessly across chains, enabling networks to adapt globally at machine speed.",
    },
  ];

  const handleSlideChange = (index: number) => {
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  const handleSwiperSlideChange = (swiperInstance: SwiperType) => {
    const newIndex = swiperInstance.activeIndex;
    setActiveIndex(newIndex);
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  };

  return (
    <div className="w-full mt-4 md:mt-20 h-full">
      {/* Header Navigation for desktop and ipad */}
      <div className="hidden md:flex justify-end mb-6">
        <div className="flex z-30 space-x-4 mr-0 md:mr-12 mb-8">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`text-[12px] lg:text-[18px] font-medium transition-colors duration-200 px-2 ${
                activeIndex === index
                  ? "text-white border-white hover:text-[#FF5800] hover:border-[#FF5800] pb-1 border-l-2 border-r-2"
                  : "text-white/20 hover:text-[#FF5800]"
              }`}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
        onSlideChange={handleSwiperSlideChange}
        className="w-5/6"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-md bg-[#061B79] flex items-center justify-center overflow-hidden w-full h-[80vh]">
              {index === 0 ? (
                // Video slide with play button - FIXED HEIGHT
                <div className="flex items-center justify-center w-full h-[600px] sm:h-80 md:h-96 lg:h-[500px]">
                  <PlayButton />
                </div>
              ) : (
                // Blog slide layout
                <div className="w-full h-full space-y-6 lg:space-y-12 p-6 sm:p-8 md:p-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Top left content */}
                  <div className="max-w-2xl">
                    <h2 className="text-lg sm:text-xl md:text-2xl 2xl:text-[40px] font-bold text-white mb-4 md:mb-6">
                      {item.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg 2xl:text-[28px] max-w-xl text-gray-200 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  {/* Image container with responsive sizing */}
                  <div className="flex items-center justify-center">
                    {item.image && item.image !== "#" ? (
                      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          height={400}
                          width={400}
                          className="w-full h-auto object-contain max-h-64 md:max-h-80 lg:max-h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-64 bg-gray-700 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400 text-sm md:text-base">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom right button */}
                  <div className="grid col-span-full h-full w-full">
                    <a
                      href={item.href}
                      className="xl:place-self-end text-white text-lg md:text-xl lg:text-2xl xl:text-[32px] font-normal hover:text-[#FF5800] transition-colors duration-200 flex flex-row gap-x-3 items-center group"
                    >
                      Article
                      <Image
                        src="/carrousel/article.svg"
                        height={32}
                        width={32}
                        className="h-5 w-5 md:h-6 md:w-6 lg:h-[32px] lg:w-[32px] group-hover:[filter:brightness(0)_saturate(100%)_invert(45%)_sepia(100%)_saturate(2000%)_hue-rotate(0deg)] transition-all duration-200"
                        alt="article-icon"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* mobile carrousel header */}
      <div className="flex md:hidden justify-end mt-12 place-self-center">
        <div className="flex z-30 space-x-4 mr-0 md:mr-12 mb-8">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`text-[12px] lg:text-[18px] font-medium transition-colors duration-200 px-2 ${
                activeIndex === index
                  ? "text-white border-white hover:text-[#FF5800] hover:border-[#FF5800] pb-1 border-l-2 border-r-2"
                  : "text-white/20 hover:text-[#FF5800]"
              }`}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
