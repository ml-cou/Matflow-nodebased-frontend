import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AgGridComponent from "../../Components/AgGridComponent/AgGridComponent";
import { fetchDataFromIndexedDB } from "../../util/indexDB";

const DatasetDisplay = () => {
  const [value] = useState("All");
  const [csvData, setCsvData] = useState([]);
  const [filterText] = useState("");
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);

  // Fetch data from IndexedDB
  useEffect(() => {
    if (activeCsvFile && activeCsvFile.name) {
      const getData = async () => {
        const res = await fetchDataFromIndexedDB(activeCsvFile.name);
        setCsvData(res);
      };
      getData();
    }
  }, [activeCsvFile]);

  // Define the row data based on the selected view option
  let rowData;
  if (value === "Head") {
    rowData = csvData.slice(0, 10); // Display the first 10 rows
  } else if (value === "Tail") {
    rowData = csvData.slice(-10); // Display the last 10 rows
  } else if (value === "Custom") {
    // Apply custom filtering based on filterText
    rowData = csvData.filter((row) =>
      Object.values(row).some(
        (value) =>
          value !== null &&
          value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  } else {
    rowData = csvData; // Display all rows
  }

  const columnDefs =
    csvData.length > 0
      ? Object.keys(csvData[0]).map((key) => ({
          headerName: key,
          field: key,
          valueFormatter: ({ value }) => (value !== null ? value : "N/A"),
          filter: true, // Enable filtering for the column
          filterParams: {
            suppressAndOrCondition: true, // Optional: Suppress 'and'/'or' filter conditions
            newRowsAction: "keep", // Optional: Preserve filter when new rows are loaded
          },
          sortable: true, // Enable sorting for the column
          flex: 1,
        }))
      : [];

  return (
    <>
      <h1 className="text-3xl mt-4 font-bold">Display Dataset</h1>

      <div className="mt-4">
        {rowData.length > 0 && (
          <div
            className="ag-theme-alpine"
            style={{ height: "600px", width: "100%" }}
          >
            <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
          </div>
        )}
      </div>
    </>
  );
};

export default DatasetDisplay;
