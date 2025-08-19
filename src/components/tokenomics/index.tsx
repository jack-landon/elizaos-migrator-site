"use client";

import { useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Chart } from "chart.js";

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
      image.src = "/chart/eliza-pictogram.png";
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      const size = 255;

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
    <div className="grid grid-cols-3 relative h-[70vh] w-full bg-[#01071f] ">
      {/* Header + text */}
      <div className="grid col-span-1 h-fit mt-12 px-12 space-y-4">
        <h1 className="text-white font-bold text-[60px] uppercase">
          tokenomics
        </h1>
        <p className="text-[28px] font-normal text-white max-w-xl">
          $ELIZA is the upgraded governance and utility token of the ElizaOS
          protocol. Holding it unlocks access to governance, staking,
          contributor rewards, and future protocol utility.
        </p>
      </div>

      {/* Chart */}
      <div className="grid col-span-1 items-center justify-start px-12 lg:px-0">
        <div className="h-[700px] w-[700px]">
          <Doughnut
            ref={chartRef}
            data={data}
            options={options}
            plugins={[centerImagePlugin]}
          />
        </div>
      </div>

      {/* Custom Legend */}
      <div className="place-items-center grid grid-cols-1">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          {data.labels.map((label, i) => (
            <div
              key={i}
              className="flex items-center border-b-2 border-[#0B35F1] cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <span className="text-[21px] font-normal text-white w-[60px]">
                {data.datasets[0].data[i]}%
              </span>

              <span
                className={`text-[28px] font-normal flex-1 text-start ${
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
