import React from "react";
import ReactApexChart from "react-apexcharts";

function ApexChart({ data }) {
  // console.log(data)
  const heatmapData = data.map((item) => {
    const newData = [];

    Object.keys(item).forEach((key) => {
      if (key !== "column_name") {
        newData.push(parseFloat(item[key]));
      }
    });

    return {
      name: item["column_name"],
      data: newData,
    };
  });

  const ranges = [];
  const step = 0.01; // Dividing the range into 10 parts

  for (let i = -1; i <= 1; i += step) {
    const range = {
      from: i,
      to: i + step,
      name: `Range ${Math.abs(i * 10)} (${i.toFixed(1)} to ${(i + step).toFixed(
        1
      )})`,
      color: getColor(i),
    };
    ranges.push(range);
  }

  function getColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  const options = {
    chart: {
      height: 600,
      type: "heatmap",
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: ranges,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },
    title: {
      text: "HeatMap Chart",
      align: "center",
    },
    xaxis: {
      categories: data.map((item) => item["column_name"]),
    },
    yaxis: {
      categories: data.map((item) => item["column_name"]),
      labels: {
        show: true,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => value.toFixed(3),
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    legend: {
      show: false,
      position: "right",
      floating: false,
      offsetX: 0,
      offsetY: 10,
      markers: {
        width: 20,
        height: 20,
      },
      itemMargin: {
        vertical: 1,
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={heatmapData}
        type="heatmap"
        height={600}
      />
    </div>
  );
}

export default ApexChart;
