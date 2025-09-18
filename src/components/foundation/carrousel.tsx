"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

export default function Carrousel({ onSlideChange }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      title: "New Economy Video",
      href: "#",
    },
    {
      title: "Generative Networks",
      href: "#",
      image: "#",
      text: "Generative networks are economic systems that learn and evolve in real time. Powered by autonomous agents, they compound value, adapt across chains at machine speed, and unlock strategies beyond human design.",
    },
    {
      title: "Autonomous capital",
      href: "#",
      image: "#",
      text: "Autonomous capital is money that runs itself. Intelligent agents deploy, rebalance, and compound value continuously, creating always-on treasuries that adapt and grow across chains.",
    },
    {
      title: "Cross-Chain Architecture",
      href: "#",
      image: "#",
      text: "Cross-chain architecture turns fragmented blockchains into a unified economic system. Agents move liquidity, share memory, and coordinate strategies seamlessly across chains, enabling networks to adapt globally at machine speed.",
    },
  ];

  const handleSlideChange = (index) => {
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  const handleSwiperSlideChange = (swiperInstance) => {
    const newIndex = swiperInstance.activeIndex;
    setActiveIndex(newIndex);
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  };

  return (
    <div className="w-4/5 h-3/5">
      {/* Header Navigation */}
      <div className="flex justify-end mb-6">
        <div className="flex z-30 space-x-8">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`text-[18px] font-medium transition-colors duration-200 px-3 ${
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
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative bg-[#061B79] flex items-center justify-center overflow-hidden w-full h-[900px]">
              {index === 0 ? (
                // Video slide with play button
                <div className="flex items-center justify-center w-full h-full">
                  <button className="flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors duration-200">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Blog slide layout
                <div className="w-full h-full p-12 flex flex-col ">
                  {/* Top left content */}
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold text-white mb-6">
                      {item.title}
                    </h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  {/* Bottom right button */}
                  <div className="flex justify-end">
                    <a
                      href={item.href}
                      className="text-white text-lg font-medium hover:text-orange-500 transition-colors duration-200 underline underline-offset-4"
                    >
                      Article
                    </a>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
