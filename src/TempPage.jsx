import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import { fetchDataFromIndexedDB } from "./util/indexDB";

const MyGridComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const res = await fetchDataFromIndexedDB("IRIS.csv");

        const generatedColumnDefs = generateColumnDefs(res);
        setColumnDefs(generatedColumnDefs);

        setRowData(res);

        // Find duplicate rows
        const duplicates = findDuplicateRows(res);
        setDuplicateRows(duplicates);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCSVData();
  }, []);

  // Function to generate column definitions dynamically
  const generateColumnDefs = (data) => {
    // Assuming your data contains headers as an array of strings
    const headers = data[0];

    const columnDefs = Object.keys(headers).map((header) => ({
      headerName: header,
      field: header.toLowerCase().replace(/\s/g, ""), // Converting header to lowercase and removing spaces for field name
    }));

    // Optionally, you can add additional properties to the column definitions based on your requirements
    // For example, you can include sorting, filtering, and other options

    return columnDefs;
  };

  // Function to generate row data dynamically

  // Function to find duplicate rows
  const findDuplicateRows = (data) => {
    const duplicates = [];
    const seen = new Set();

    data.forEach((obj) => {
      const { id, ...rest } = obj;
      const key = Object.values(rest).join("|");
      if (seen.has(key)) {
        duplicates.push(obj);
      } else {
        seen.add(key);
      }
    });
    return duplicates;
  };

  return (
    <div>
      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "600px", margin: "20px" }}
      >
        <AgGridReact rowData={duplicateRows} columnDefs={columnDefs}>
          {/* Optionally, you can manually define AgGridColumn components if needed */}
          {/* <AgGridColumn field="id"></AgGridColumn> */}
          {/* <AgGridColumn field="name"></AgGridColumn> */}
          {/* <AgGridColumn field="age"></AgGridColumn> */}
        </AgGridReact>
      </div>
      {duplicateRows.length > 0 && (
        <div>
          <h2>Duplicate Rows</h2>
          <ul>
            {duplicateRows.map((row) => (
              <li key={row.id}>
                {Object.entries(row).map(([fieldName, fieldValue]) => (
                  <span key={fieldName}>
                    {fieldName}: {fieldValue},{" "}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyGridComponent;
