"use-client";

import { useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Chart } from "chart.js";
import Badge from "../badge";

ChartJS.register(ArcElement, Tooltip);

export default function TokenOmics() {
  const chartRef = useRef<ChartJS<"doughnut", number[], string>>(null);
  // State to handle hover for multiple rings { datasetIndex, index }
  const [hoverState, setHoverState] = useState<{
    datasetIndex: number;
    index: number;
  } | null>(null);

  // --- New Data Structure for Two Rings ---

  // Ring 1: Top-level allocation
  const outerRing = {
    labels: ["Community", "Core Team", "SAFT"],
    data: [75, 10, 15],
    colors: ["#0000FF", "#0BACF1", "#0AC9A9"],
  };

  // Ring 2: Breakdown of the "Community" slice
  const innerRing = {
    labels: [
      "Current Holders",
      "LP Services",
      "DAO trsry",
      "E. Reserve",
      "POL",
    ],
    data: [60, 5, 5, 2.5, 2.5],
    colors: ["#0827B3", "#092CC9", "#1840F1", "#3358FF", "#5977FF"],
  };

  // Data structure for the Chart.js component
  const data = {
    datasets: [
      {
        // Outer Ring
        data: outerRing.data,
        backgroundColor: outerRing.colors.map((c, i) => {
          if (hoverState === null) return c;
          // Highlight if hovered, otherwise fade
          return hoverState.datasetIndex === 0 && hoverState.index === i
            ? c
            : c + "55";
        }),
        borderColor: "#01071f",
        borderWidth: 0,
      },
      {
        // Inner Ring
        data: innerRing.data,
        backgroundColor: innerRing.colors.map((c, i) => {
          if (hoverState === null) return c;
          // Highlight if hovered, otherwise fade
          return hoverState.datasetIndex === 1 && hoverState.index === i
            ? c
            : c + "55";
        }),
        borderColor: "#01071f",
        borderWidth: 0,
      },
    ],
  };

  // Data structure to build the hierarchical legend
  const legendItems = [
    {
      label: "Community",
      value: 75,
      datasetIndex: 0,
      index: 0,
      color: "#0000FF",
      subItems: [
        {
          label: "Current Holders",
          value: 60,
          datasetIndex: 1,
          index: 0,
          color: "#0827B3",
        },
        {
          label: "LP Services",
          value: 5,
          datasetIndex: 1,
          index: 1,
          color: "#092CC9",
        },
        {
          label: "DAO trsry",
          value: 5,
          datasetIndex: 1,
          index: 2,
          color: "#1840F1",
        },
        {
          label: "E. Reserve",
          value: 2.5,
          datasetIndex: 1,
          index: 3,
          color: "#3358FF",
        },
        {
          label: "POL",
          value: 2.5,
          datasetIndex: 1,
          index: 4,
          color: "#5977FF",
        },
      ],
    },
    {
      label: "Core Team",
      value: 10,
      datasetIndex: 0,
      index: 1,
      subItems: [],
      color: "#0BACF1",
    },
    {
      label: "SAFT",
      value: 15,
      datasetIndex: 0,
      index: 2,
      subItems: [],
      color: "#0AC9A9",
    },
  ];

  const centerImagePlugin = {
    id: "centerImage",
    beforeDraw: (chart: Chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
  
      
      if (!(chart as any).elizaImage) {
        const image = new Image();
        image.src = "/chart/eliza.png";
        image.onload = () => {
          (chart as any).elizaImage = image;
          chart.draw(); // re-render once loaded
        };
        return;
      }
  
      const image = (chart as any).elizaImage;
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      const size = 210;
  
      ctx.save();
      ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
      ctx.restore();
    },
  };
  

  const options = {
    cutout: "60%",
    plugins: {
      legend: { display: false },
    },
    animation: false,
  };

  return (
    <div className="grid grid-cols-4 relative h-full 2xl:h-[100vh] w-full bg-[#D7D5CA] space-y-18 xl:space-y-0">
      {/* Header + text */}
      <div className="mt-4 md:mt-12 grid col-span-4 2xl:col-span-1 h-fit px-4 lg:px-12 space-y-0">
        <Badge title="matrix" />

        <h1 className="text-[#0B35F1] mt-4 font-bold text-[32px] md:text-[38px] lg:text-[54px]">
          Tokenomics
        </h1>
        <p className="text-[20px] mt-2 lg:text-[28px] font-normal text-[#0B35F1] w-full lg:max-w-xl">
          $ELIZA is the upgraded governance and utility token of the ElizaOS
          protocol. Holding it unlocks access to governance, staking,
          contributor rewards, and future protocol utility.
        </p>
      </div>

      {/* Chart */}
      <div className="grid col-span-4 xl:col-span-2 items-center justify-center xl:justify-center px-12 lg:px-0">
        <div className="h-[370px] w-[370px] md:w-[450px] md:h-[450px] 2xl:w-[600px] 2xl:h-[600px]">
          <Doughnut
            ref={chartRef}
            data={data}
            options={options}
            plugins={[centerImagePlugin]}
          />
        </div>
      </div>

      {/* --- Updated Custom Legend --- */}
      <div className="grid col-span-4 xl:col-span-2 2xl:col-span-1 items-center place-items-center 2xl:place-items-center mx-4 lg:mx-8 mb-24">
        <div className="w-full max-w-[480px] flex flex-col gap-0">
          <div className="border-t-[#0000FF] border-t-3"></div>
          {legendItems.map((item) => (
            <div key={item.label}>
              {/* Main Item */}
              <div
                className="flex items-center border-b-3 cursor-pointer py-0"
                style={{ borderColor: item.color }}
                onMouseEnter={() =>
                  setHoverState({
                    datasetIndex: item.datasetIndex,
                    index: item.index,
                  })
                }
                onMouseLeave={() => setHoverState(null)}
              >
                <span
                  style={{ color: item.color }}
                  className="md:text-[22px] xl:text-[28px] py-2 font-bold w-[70px]"
                >
                  {item.value}%
                </span>
                <span
                  style={{ color: item.color }}
                  className="md:text-[22px] xl:text-[28px] font-bold flex-1 text-start text-white"
                >
                  {item.label}
                </span>
              </div>
              {/* Sub Items */}
              {item.subItems && item.subItems.length > 0 && (
                <div className="pl-0 pt-0 flex flex-col">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.label}
                      style={{ borderColor: subItem.color }}
                      className={"flex items-center py-2 border-b-2 cursor-pointer"}
                      onMouseEnter={() =>
                        setHoverState({
                          datasetIndex: subItem.datasetIndex,
                          index: subItem.index,
                        })
                      }
                      onMouseLeave={() => setHoverState(null)}
                    >
                      <span
                        style={{ color: subItem.color }}
                        className="md:text-[15px] xl:text-[21px] font-normal w-[70px]"
                      >
                        {subItem.value}%
                      </span>
                      <span
                        style={{ color: subItem.color }}
                        className="md:text-[15px] xl:text-[21px] font-normal flex-1 text-start"
                      >
                        {subItem.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
