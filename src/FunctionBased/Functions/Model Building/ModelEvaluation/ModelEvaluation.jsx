import { Checkbox, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchDataFromIndexedDB } from "../../../../util/indexDB";
import AgGridComponent from "../../../Components/AgGridComponent/AgGridComponent";
import MultipleDropDown from "../../../Components/MultipleDropDown/MultipleDropDown";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";

function ModelEvaluation() {
  const [display_type, setDisplayType] = useState("Table");
  const [orientation, setOrientation] = useState("Vertical");
  const [test_dataset, setTestDataset] = useState();
  const [include_data, setIncludeData] = useState(false);
  const [display_result, setDisplayResult] = useState("Test");
  const [allDatasetName, setAllDatasetName] = useState();
  const [columnName, setColumnName] = useState();
  const [file, setFile] = useState();
  const [selectedColumn, setSelectedColumn] = useState();
  const [columnDefs, setColumnDefs] = useState();
  const [graphData, setGraphData] = useState();
  const [notFound, setNotFound] = useState(false);
  const [allModelName, setAllModelName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let tempDatasetName = await fetchDataFromIndexedDB("splitted_dataset");
      tempDatasetName = tempDatasetName.map((val) => Object.keys(val)[0]);
      setAllDatasetName(tempDatasetName);

      let tempModels = await fetchDataFromIndexedDB("models");
      tempModels = tempModels.map((val) => {
        if (Object.keys(val)[0] === tempDatasetName[0]) {
          return val[tempDatasetName[0]];
        }
      })[0];
      if (!tempModels) setNotFound(true);
      else setNotFound(false);
    };
    fetchData();
  }, []);

  const handleChangeDataset = async (e) => {
    setColumnDefs();
    setTestDataset(e);
    let tempModels = await fetchDataFromIndexedDB("models");
    // console.log(tempModels)
    tempModels = tempModels.map((val) => {
      if (Object.keys(val)[0] === e) {
        return val[e];
      }
    });
    // console.log(tempModels)
    tempModels = tempModels.filter(
      (val) => val !== undefined && val !== null
    )[0];
    // console.log(tempModels)
    const keys = Object.keys(tempModels);

    let temp = keys.map((val) => {
      return { ...tempModels[val].metrics_table, name: val };
    });
    console.log(temp);
    setAllModelName(temp.map((val) => val.name));

    setColumnName(Object.keys(temp[0]));
    setFile(temp);
  };

  const handleSave = async () => {
    try {
      if (display_type === "Graph") {
        console.log({
          file,
          "Display Type": display_type,
          "Display Result": display_result,
          "Select Orientation": orientation,
          Columns: selectedColumn,
        });
        const res = await fetch("http://127.0.0.1:8000/api/model_evaluation/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file,
            "Display Type": display_type,
            "Display Result": display_result,
            "Select Orientation": orientation,
            Columns: selectedColumn,
          }),
        });
        const data = await res.json();
        setGraphData(JSON.parse(data));
      } else {
        const columnSet = new Set(selectedColumn);
        let tempDef = [];
        let temp =
          columnName.length > 0
            ? columnName.map((key) => {
                const tempCol = key.toLowerCase();
                if (display_result === "Test" || display_result === "Train") {
                  if (
                    tempCol.includes(display_result.toLowerCase()) ||
                    key === "name"
                  )
                    tempDef.push({
                      headerName: key,
                      field: key,
                      valueGetter: (params) => {
                        return params.data[key];
                      },
                    });
                }
                if (display_result === "All")
                  tempDef.push({
                    headerName: key,
                    field: key,
                    valueGetter: (params) => {
                      return params.data[key];
                    },
                  });
                if (display_result === "Custom") {
                  if (columnSet.has(key) || key === "name") {
                    tempDef.push({
                      headerName: key,
                      field: key,
                      valueGetter: (params) => {
                        return params.data[key];
                      },
                    });
                  }
                }
              })
            : [];

        tempDef = [
          tempDef[tempDef.length - 1],
          ...tempDef.slice(0, tempDef.length - 1),
        ];
        setColumnDefs(tempDef);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!allDatasetName) return <div>Loading...</div>;
  if (!allDatasetName || allDatasetName.length === 0 || notFound)
    return (
      <h1 className="mt-8 text-3xl font-medium tracking-wide">
        Build Model First...
      </h1>
    );
  return (
    <div className="mt-8">
      <div>
        <p>Select Train Test Dataset</p>
        <SingleDropDown
          columnNames={allDatasetName}
          onValueChange={(e) => handleChangeDataset(e)}
        />
      </div>
      <div className="flex items-end gap-8 mt-4">
        <div className="w-full">
          <p>Display Type</p>
          <SingleDropDown
            columnNames={["Graph", "Table"]}
            // initValue={"Graph"}
            onValueChange={(e) => {
              setDisplayType(e);
              setColumnDefs();
              setGraphData();
            }}
          />
        </div>
        <div className="w-full">
          {display_type === "Graph" ? (
            <div>
              <p>Select Orientation</p>
              <SingleDropDown
                columnNames={["Vertical", "Horizontal"]}
                initValue={"Vertical"}
                onValueChange={setOrientation}
              />
            </div>
          ) : (
            <div>
              <Checkbox
                color="success"
                onChange={(e) => setIncludeData(e.valueOf())}
              >
                Include Data
              </Checkbox>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Radio.Group
          orientation="horizontal"
          label="Display Result"
          defaultValue={display_result}
          onChange={(e) => {
            setDisplayResult(e);
            setColumnDefs();
            setGraphData();
          }}
        >
          <Radio value="All" color="success">
            All
          </Radio>
          <Radio value="Train" color="success">
            Train
          </Radio>
          <Radio value="Test" color="success">
            Test
          </Radio>
          <Radio value="Custom" color="success">
            Custom
          </Radio>
        </Radio.Group>
      </div>
      {display_result === "Custom" && (
        <div className="mt-4">
          <p>Columns</p>
          <MultipleDropDown
            columnNames={columnName}
            setSelectedColumns={setSelectedColumn}
          />
        </div>
      )}
      {file && (
        <button
          className="self-start border-2 px-6 tracking-wider bg-primary-btn text-white font-medium rounded-md py-2 mt-8"
          onClick={handleSave}
        >
          Submit
        </button>
      )}

      {columnDefs && columnDefs.length > 0 && (
        <div className="mt-4">
          <div className="mb-4">
            <p className="tracking-wide">Filter Model</p>
            <MultipleDropDown
              columnNames={allModelName}
              setSelectedColumns={setSelectedColumn}
            />
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: "300px", width: "100%" }}
          >
            <AgGridComponent
              rowData={file}
              columnDefs={columnDefs}
              rowHeight={30}
              paginationPageSize={8}
              headerHeight={30}
            />
          </div>
        </div>
      )}

      {graphData && (
        <div className="flex justify-center mt-4">
          <Plot
            data={graphData?.data}
            layout={{ ...graphData.layout, showlegend: true }}
            config={{ editable: true, responsive: true }}
          />
        </div>
      )}
    </div>
  );
}

export default ModelEvaluation;
