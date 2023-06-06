import { Input, Popover } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { BiHide } from "react-icons/bi";
import { GrFormAdd } from "react-icons/gr";
import { useSelector } from "react-redux";
import AgGridComponent from "../../Components/AgGridComponent/AgGridComponent";
import { fetchDataFromIndexedDB } from "../../util/indexDB";

function DatasetDuplicates() {
  const [rowData, setRowData] = useState([]);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const [excludeKeys, setExcludeKeys] = useState(["id"]);
  const [columnShown, setColumnShown] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (activeCsvFile) {
      // Function to find duplicate rows
      const findDuplicateRows = (data) => {
        const duplicates = [];
        const seen = new Set();

        data.forEach((obj) => {
          const excludedObj = {};
          for (const key in obj) {
            if (!excludeKeys.includes(key)) {
              excludedObj[key] = obj[key];
            }
          }
          const key = Object.values(excludedObj).join("|");
          if (seen.has(key)) {
            duplicates.push(obj);
          } else {
            seen.add(key);
          }
        });

        return duplicates;
      };
      const fetchCSVData = async () => {
        try {
          const res = await fetchDataFromIndexedDB(activeCsvFile.name);

          const generatedColumnDefs = generateColumnDefs(res, excludeKeys);
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
    }
  }, [activeCsvFile, excludeKeys]);

  useEffect(() => {
    if (rowData && rowData.length > 0) {
      const findMissingValues = (firstList, secondList) => {
        const firstSet = new Set(firstList);
        const missingValues = [];

        for (const value of secondList) {
          if (!firstSet.has(value)) {
            missingValues.push(value);
          }
        }
        console.log({ firstList, secondList });
        return missingValues;
      };
      const colShowing = findMissingValues(
        excludeKeys,
        Object.keys(rowData[0])
      );
      setColumnShown(colShowing);
    }
  }, [excludeKeys, rowData]);

  // Function to generate column definitions dynamically
  const generateColumnDefs = (data, exKey) => {
    // Assuming your data contains headers as an array of strings
    const headers = data[0];
    const baadDibo = new Set(exKey);

    const columnName = Object.keys(headers);

    const columnDefs = [];
    for (let i = 0; i < columnName.length; i++) {
      if (baadDibo.has(columnName[i]) && columnName[i] !== "id") continue;
      columnDefs.push({
        headerName: columnName[i],
        field: columnName[i].toLowerCase().replace(/\s/g, ""),
        flex: 1,
        filter: true,
        sortable: true,
      });
    }

    return columnDefs;
  };

  // Function to generate row data dynamically

  const filterColumn = (column) => {
    setExcludeKeys([...excludeKeys, column]);
    setColumnShown(columnShown.filter((val) => val !== column));
  };

  const handleColHide = () => {
    setColumnShown([...columnShown, searchValue]);
    setExcludeKeys(excludeKeys.filter((val) => val !== searchValue));
    setSearchValue("");
  };

  return (
    <div className="mt-4">
      {duplicateRows && duplicateRows.length > 0 ? (
        <div className="ag-theme-alpine w-full h-[600px]">
          <div className="w-full flex justify-between mb-2">
            <p className="">There are {duplicateRows.length} duplicate data.</p>
            <Popover placement={"bottom-right"} shouldFlip isBordered>
              <Popover.Trigger>
                <h3 className="text-base underline cursor-pointer text-[#06603b] font-medium tracking-wide">
                  Filter Column
                </h3>
              </Popover.Trigger>
              <Popover.Content>
                <div className="px-6 py-4 min-w-[300px] max-w-xl">
                  <div className="w-full">
                    <p className="mb-2 tracking-wide font-semibold font-titillium">
                      Add Column
                    </p>
                    <Input
                      width="100%"
                      color="success"
                      bordered
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Enter Column Name. (Check spelling)"
                      contentRight={
                        <button
                          className="cursor-pointer"
                          onClick={handleColHide}
                        >
                          <GrFormAdd color="#06603b" />
                        </button>
                      }
                      contentClickable
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm tracking-wide font-titillium font-semibold">
                      Showing Column :
                    </h3>
                    <div className="w-full flex items-center mt-4 flex-wrap gap-2 max-w-xl">
                      {columnShown.map((val, ind) => (
                        <button
                          className="text-white flex items-center justify-between rounded cursor-pointer bg-[#097045] font-roboto tracking-wide group"
                          key={ind}
                        >
                          <span className="p-2">{val}</span>
                          <span
                            className="pr-2 hidden group-hover:flex"
                            onClick={(e) => filterColumn(val)}
                          >
                            <BiHide />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </div>
          <AgGridComponent rowData={duplicateRows} columnDefs={columnDefs} />
        </div>
      ) : (
        <h3>There are no duplicate data.</h3>
      )}
    </div>
  );
}

export default DatasetDuplicates;
