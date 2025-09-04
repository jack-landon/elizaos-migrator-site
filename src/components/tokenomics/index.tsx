"use client";

import { useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Chart } from "chart.js";
import Badge from "../badge";

ChartJS.register(ArcElement, Tooltip);

export default function TokenOmics() {
  const chartRef = useRef<any>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const baseColors = [
    "#0B35F1",
    "#D60BF1",
    "#820BF1",
    "#7D94FA",
    "#7D94FA",
    "#2E4DD9",
    "#3E5FF6",
    "#637EF8",
    "#7D94FA",
  ];

  const data = {
    labels: [
      "Community",
      "Current Holders",
      "LP Services",
      "DAO trsry",
      "E. Reserve",
      "POL",
      "Core Team",
      "SAFT",
    ],
    datasets: [
      {
        data: [65, 5, 5, 5, 5, 5, 5, 5],
        backgroundColor: baseColors.map((c, i) =>
          hoverIndex === null ? c : hoverIndex === i ? c : c + "55"
        ),
        borderColor: "#01071f",
        borderWidth: 2,
      },
    ],
  };

  const centerImagePlugin = {
    id: "centerImage",
    afterDraw: (chart: Chart) => {
      const { ctx, chartArea } = chart;
      const image = new Image();
      image.src = "/expansion/eliza.png";
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      const size = 200;

      image.onload = () => {
        ctx.save();
        ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
        ctx.restore();
      };
    },
  };

  const options: any = {
    cutout: "60%",
    plugins: {
      legend: { display: false },
    },
    animation: false,
  };

  return (
    <div className="mt-12 grid grid-cols-4 relative h-full  2xl:h-[100vh] w-full bg-[#01071f] space-y-18 xl:space-y-0">
      {/* Header + text */}
      <div className="grid col-span-4 2xl:col-span-1 h-fit mt-0 px-4 lg:px-12 space-y-0">
        <Badge title="matrix" />

        <h1 className="text-white mt-4 font-bold text-2xl lg:text-[54px] uppercase">
          tokenomics
        </h1>
        <p className="text-[20px] lg:text-[28px] font-normal text-white w-full lg:max-w-xl">
          $ELIZA is the upgraded governance and utility token of the ElizaOS
          protocol. Holding it unlocks access to governance, staking,
          contributor rewards, and future protocol utility.
        </p>
      </div>

      {/* Chart */}
      <div className="grid col-span-4 xl:col-span-2 items-center justify-center xl:justify-center px-12 lg:px-0">
        <div className="h-[400px] w-[400px] md:w-[450px] md:h-[450px] 2xl:w-[600px] 2xl:h-[600px]">
          <Doughnut
            ref={chartRef}
            data={data}
            options={options}
            plugins={[centerImagePlugin]}
          />
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid col-span-4 xl:col-span-2 2xl:col-span-1 items-center place-items-center 2xl:place-items-center mx-12 lg:mx-8 mb-24">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          {data.labels.map((label, i) => (
            <div
              key={i}
              className="flex items-center border-b-2 border-[#0B35F1] cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <span className="md:text-[15px] xl:text-[21px] font-normal text-white w-[60px]">
                {data.datasets[0].data[i]}%
              </span>

              <span
                className={`md:text-[15px] xl:text-[21px] font-normal flex-1 text-start ${
                  hoverIndex === i ? "text-white" : "text-white"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
