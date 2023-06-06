import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import * as Stat from "statistics.js";
import AgGridComponent from "../../Components/AgGridComponent/AgGridComponent";
import { fetchDataFromIndexedDB } from "../../util/indexDB";

function DatasetCorrelation() {
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [relationMethod, setRelationMethod] = useState("pearson");
  const [displayType, setDisplayType] = useState("table");

  useEffect(() => {
    if (activeCsvFile) {
      const calculateCorrelations = (data) => {
        let columnNames = Object.keys(data[0]);
        columnNames = columnNames.filter(
          (val) => typeof data[0][val] === "number" && val !== "id"
        );
        const correlations = {};

        for (let i = 0; i < columnNames.length; i++) {
          const column1 = columnNames[i];
          correlations[column1] = {};

          for (let j = 0; j < columnNames.length; j++) {
            const column2 = columnNames[j];
            const column1Data = [];
            const column2Data = [];
            const tempData = [];

            for (let k = 0; k < data.length; k++) {
              const val1 = parseFloat(data[k][column1]);
              const val2 = parseFloat(data[k][column2]);

              if (!isNaN(val1) && !isNaN(val2)) {
                column1Data.push(val1);
                column2Data.push(val2);

                tempData.push({
                  [column1]: val1,
                  [column2]: val2,
                });
              }
            }

            const bodyVars = {
              [column1]: "metric",
              [column2]: "metric",
            };

            const temp = new Stat(tempData, bodyVars);
            // Calculate the correlation coefficient using simple-statistics correlation function
            const l = Object.keys(bodyVars);

            if (relationMethod === "spearman") {
              const cc = temp.spearmansRho(
                l[0],
                l[l.length === 1 ? 0 : 1],
                true
              );

              // // Store the correlation coefficient in the correlations object
              correlations[column1][column2] = cc.rho.toFixed(4);
            } else if (relationMethod === "pearson") {
              const cc = temp.correlationCoefficient(
                l[0],
                l[l.length === 1 ? 0 : 1]
              );

              // // Store the correlation coefficient in the correlations object
              correlations[column1][column2] =
                cc.correlationCoefficient.toFixed(4);
            } else if (relationMethod === "kendall") {
              const cc = temp.kendallsTau(l[0], l[l.length === 1 ? 0 : 1]);
              // // Store the correlation coefficient in the correlations object
              correlations[column1][column2] = cc.a ? cc.a.tauA : 0;
            }
          }
        }

        return correlations;
      };

      const fetchCSVData = async () => {
        try {
          const res = await fetchDataFromIndexedDB(activeCsvFile.name);

          const correlations = calculateCorrelations(res);
          const { columnDefs, rowData } = generateAgGridData(res, correlations);

          setColumnDefs(columnDefs);
          setRowData(rowData);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchCSVData();
    }
  }, [activeCsvFile, relationMethod]);

  const generateAgGridData = (data, correlations) => {
    let columnDefs = Object.keys(correlations).map((columnName) => ({
      headerName: columnName,
      field: columnName,
      flex: 1,
      filter: true,
      sortable: true,
    }));
    columnDefs = [{ headerName: "", field: "name" }, ...columnDefs];
    const columnName = Object.keys(correlations);
    let ind = 0;

    let rowData = Object.values(correlations);
    rowData = rowData.map((val) => {
      return { ...val, name: columnName[ind++] };
    });

    return { columnDefs, rowData };
  };

  return (
    <div className="ag-theme-alpine w-full h-[600px]">
      <h1 className="text-3xl font-bold my-4">Feature Correlation</h1>
      {rowData && columnDefs && (
        <>
          <div className="flex text-lg my-6 items-center gap-8 max-w-2xl ">
            <div className="flex flex-col w-1/2 gap-1">
              <label className="" htmlFor="correlation-method">
                Correlation Method
              </label>
              <select
                className="text-xl p-2 rounded outline-none border-2 border-[#06603b] shadow bg-gray-100"
                name="correlation-method"
                id="correlation-method"
                value={relationMethod}
                onChange={(e) => setRelationMethod(e.target.value)}
              >
                <option value="pearson">Pearson</option>
                <option value="kendall">Kendall</option>
                <option value="spearman">Spearman</option>
              </select>
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <label htmlFor="display-type">Display Type</label>
              <select
                className="text-xl p-2 rounded outline-none border-2 border-[#06603b] shadow bg-gray-100"
                name="display-type"
                id="display-type"
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value)}
              >
                <option value="table">Table</option>
                <option value="heatmap">Heatmap</option>
              </select>
            </div>
          </div>
          {displayType === "table" ? (
            <AgGridComponent columnDefs={columnDefs} rowData={rowData} />
          ) : (
            <div className="mt-12">
              <ApexChart data={rowData} />
              <p className="flex items-center gap-2 mt-3 tracking-wide">
                <span>
                  <AiOutlineInfoCircle size={25} />{" "}
                </span>{" "}
                <span className="font-light">
                  Hover on the color to see the value.
                </span>{" "}
                <span className="text-sm font-light">
                  All colors are generated randomly.
                </span>{" "}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ApexChart({ data }) {
  const heatmapData = data.map((item) => {
    const newData = [];

    Object.keys(item).forEach((key) => {
      if (key !== "name") {
        newData.push(parseFloat(item[key]));
      }
    });

    return {
      name: item.name,
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
      categories: data.map((item) => item.name),
    },
    yaxis: {
      categories: data.map((item) => item.name),
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

export default DatasetCorrelation;
