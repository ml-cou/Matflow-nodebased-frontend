import { Collapse } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AgGridComponent from "../../Components/AgGridComponent/AgGridComponent";
import { fetchDataFromIndexedDB } from "../../util/indexDB";

function FinalDataset() {
  const [datasetNames, setDatasetNames] = useState();
  const render = useSelector((state) => state.uploadedFile.rerender);
  const [csvData, setCsvData] = useState();
  const [colDefs, setColDefs] = useState();

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("uploadedFiles")).map(
      (val) => val.name
    );
    setDatasetNames(temp);
  }, [render]);

  const handleChange = async (e) => {
    const temp = JSON.parse(localStorage.getItem("uploadedFiles")).map(
      (val) => val.name
    );
    const res = await fetchDataFromIndexedDB(temp[e - 1]);
    setCsvData(res);
    setColDefs(
      res.length > 0
        ? Object.keys(res[0]).map((key) => ({
            headerName: key,
            field: key,
            valueGetter: (params) => {
              return params.data[key];
            },
          }))
        : []
    );
  };

  return (
    <div className="my-8 border shadow p-1 px-4">
      <Collapse.Group accordion onChange={(e) => handleChange(e)}>
        {datasetNames &&
          datasetNames.map((val, ind) => (
            <Collapse
              key={ind}
              title={
                <h1 className="font-medium tracking-wider text-lg">{val}</h1>
              }
            >
              <div className="min-h-[650px]">
                <div
                  className="ag-theme-alpine"
                  style={{ height: "600px", width: "100%" }}
                >
                  <AgGridComponent
                    download={true}
                    rowData={csvData}
                    columnDefs={colDefs}
                  />
                </div>
              </div>
            </Collapse>
          ))}
      </Collapse.Group>
    </div>
  );
}

export default FinalDataset;
