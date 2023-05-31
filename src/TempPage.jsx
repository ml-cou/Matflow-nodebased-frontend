import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as stats from "simple-statistics"; // Importing the corrcoef function from mathjs
import { fetchDataFromIndexedDB } from "./util/indexDB";

const CorrelationGrid = () => {
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (true) {
      const fetchCSVData = async () => {
        try {
          const res = await fetchDataFromIndexedDB("IRIS.csv");

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
  }, [activeCsvFile]);

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

        for (let k = 0; k < data.length; k++) {
          const val1 = parseFloat(data[k][column1]);
          const val2 = parseFloat(data[k][column2]);

          if (!isNaN(val1) && !isNaN(val2)) {
            column1Data.push(val1);
            column2Data.push(val2);
          }
        }

        // Calculate the correlation coefficient using simple-statistics correlation function
        const correlationCoefficient = stats
          .sampleCorrelation(column1Data, column2Data)
          .toFixed(3);

        // Store the correlation coefficient in the correlations object
        correlations[column1][column2] = correlationCoefficient;
      }
    }

    return correlations;
  };

  const generateAgGridData = (data, correlations) => {
    let columnDefs = Object.keys(correlations).map((columnName) => ({
      headerName: columnName,
      field: columnName,
    }));
    columnDefs = [{ headerName: "", field: "name" }, ...columnDefs];
    const columnName = Object.keys(correlations);
    let ind = 0;

    let rowData = Object.values(correlations);
    // console.log(JSON.stringify(correlations));
    rowData = rowData.map((val) => {
      return { ...val, name: columnName[ind++] };
    });

    return { columnDefs, rowData };
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
      {console.log(JSON.stringify(rowData))}
      <AgGridReact columnDefs={columnDefs} rowData={rowData} />
    </div>
  );
};

export default CorrelationGrid;


