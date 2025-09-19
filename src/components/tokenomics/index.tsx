"use client";

import { useRef, useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Chart } from "chart.js";
import Badge from "../badge";

ChartJS.register(ArcElement, Tooltip);

export default function TokenOmics() {
  const chartRef = useRef<ChartJS<"doughnut", number[], string>>(null);
  const [hoverState, setHoverState] = useState<{
    datasetIndex: number;
    index: number;
  } | null>(null);

  // --- Data Structures ---
  const outerRing = {
    labels: ["Community", "Core Team", "SAFT"],
    data: [75, 10, 15],
    colors: ["#0000FF", "#0BACF1", "#0AC9A9"],
  };

  const innerRing = {
    labels: [
      "Current Holders",
      "LP Services",
      "DAO trsry",
      "E. Reserve",
      "POL",
      "Core Team Fill",
      "SAFT Fill",
    ],
    data: [60, 5, 5, 2.5, 2.5, 10, 15],
    colors: [
      "#0827B3",
      "#092CC9",
      "#1840F1",
      "#3358FF",
      "#5977FF",
      "#0BACF1",
      "#0AC9A9",
    ],
  };

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: outerRing.data,
          backgroundColor: outerRing.colors.map((c, i) => {
            if (hoverState === null) return c;
            return hoverState.datasetIndex === 0 && hoverState.index === i
              ? c
              : c + "55";
          }),
          borderColor: "#01071f",
          borderWidth: 0,
        },
        {
          data: innerRing.data,
          backgroundColor: innerRing.colors.map((c, i) => {
            if (hoverState === null) return c;
            if (i === 5) {
              // Core Team fill
              return hoverState.datasetIndex === 0 && hoverState.index === 1
                ? c
                : c + "55";
            }
            if (i === 6) {
              // SAFT fill
              return hoverState.datasetIndex === 0 && hoverState.index === 2
                ? c
                : c + "55";
            }
            return hoverState.datasetIndex === 1 && hoverState.index === i
              ? c
              : c + "55";
          }),
          borderColor: "#01071f",
          borderWidth: 0,
        },
      ],
    }),
    [hoverState, outerRing.colors, outerRing.data, innerRing.colors, innerRing.data]
  ); // Re-calculate data only when hoverState changes

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
      if (!(chart as Chart & { elizaImage?: HTMLImageElement }).elizaImage) {
        const image = new Image();
        image.src = "/chart/eliza.png";
        image.onload = () => {
          (chart as Chart & { elizaImage?: HTMLImageElement }).elizaImage = image;
          chart.draw();
        };
        return;
      }
      const image = (chart as Chart & { elizaImage?: HTMLImageElement }).elizaImage;
      if (!image) return;
      
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      const size = 210;
      ctx.save();
      ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
      ctx.restore();
    },
  };

  const options = useMemo(
    () => ({
      cutout: "60%",
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (tooltipItem: { datasetIndex: number; dataIndex: number }) =>
            !(tooltipItem.datasetIndex === 1 && tooltipItem.dataIndex >= 5),
        },
      },
      animation: false,
      onHover: (event: unknown, elements: unknown[]) => {
        let newHoverState: { datasetIndex: number; index: number } | null =
          null;
        if (elements.length > 0) {
          const element = elements[0] as { datasetIndex: number; index: number };
          if (element.datasetIndex === 1 && element.index === 5) {
            newHoverState = { datasetIndex: 0, index: 1 };
          } else if (element.datasetIndex === 1 && element.index === 6) {
            newHoverState = { datasetIndex: 0, index: 2 };
          } else {
            newHoverState = {
              datasetIndex: element.datasetIndex,
              index: element.index,
            };
          }
        }
        if (
          newHoverState?.datasetIndex !== hoverState?.datasetIndex ||
          newHoverState?.index !== hoverState?.index
        ) {
          setHoverState(newHoverState);
        }
      },
    }),
    [hoverState]
  ); // Re-create options only when hoverState changes to get the latest value

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

      {/* Custom Legend */}
      <div className="grid col-span-4 xl:col-span-2 2xl:col-span-1 items-center place-items-center 2xl:place-items-center mx-4 lg:mx-8 mb-24">
        <div className="w-full max-w-[480px] flex flex-col gap-0">
          <div className="border-t-[#0000FF] border-t-3"></div>
          {legendItems.map((item) => (
            <div key={item.label}>
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
              {item.subItems && item.subItems.length > 0 && (
                <div className="pl-0 pt-0 flex flex-col">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.label}
                      style={{ borderColor: subItem.color }}
                      className={
                        "flex items-center py-2 border-b-2 cursor-pointer"
                      }
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
                        className="md:text-[15px] ml-18 xl:text-[21px] font-normal w-[70px]"
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
