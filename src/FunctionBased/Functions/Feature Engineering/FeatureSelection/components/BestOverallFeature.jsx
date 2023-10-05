import { Input, Progress, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import AgGridAutoDataComponent from "../../../../Components/AgGridComponent/AgGridAutoDataComponent";

function BestOverallFeature({ csvData }) {
  const [k_fold, setKFoldValue] = useState(2);
  const [method, setMethod] = useState("None");
  const selectionMethod = useSelector((state) => state.featureSelection.method);
  const target_var = useSelector(
    (state) => state.featureSelection.target_variable
  );
  const [graph_data, setGraphData] = useState();
  const [selected_feature_data, setSelectedFeatureData] = useState();
  const [dropped_feature_data, setDroppedFeatureData] = useState();
  const [loading, setLoading] = useState();
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev + 5 < 100) return prev + 5;
          return prev;
        });
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleMethod = async (e) => {
    setMethod(e);
    if (e === "None") {
      setSelectedFeatureData();
      setDroppedFeatureData();
      setGraphData();
      setProgress(0);
      setData();
    } else if (e === "All") {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/feature_selection/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: selectionMethod,
          k_fold,
          target_var,
          dataset: csvData,
        }),
      });

      setProgress(100);
      clearInterval(intervalId);

      setTimeout(() => setLoading(false), 500);

      const Data = await res.json();

      // console.log(Data)

      // For group data
      let selectedFeatureData =
        Data.selected_features.custom_feature_data.group.selected_features_data;
      let tempResult1 = [];
      selectedFeatureData.rows.forEach((row) => {
        let tmp = {};
        row.forEach((val, ind) => {
          tmp = { ...tmp, [selectedFeatureData.headers[ind]]: val };
        });
        tempResult1.push(tmp);
      });

      let tempResult = [];
      let droppedFeature =
        Data.selected_features.custom_feature_data.group.dropped_features_data;
      droppedFeature.rows.forEach((row) => {
        let tmp = {};
        row.forEach((val, ind) => {
          tmp = { ...tmp, [droppedFeature.headers[ind]]: val };
        });
        tempResult.push(tmp);
      });

      // For Single Data
      selectedFeatureData =
        Data.selected_features.custom_feature_data.single
          .selected_features_data;
      let tempResult3 = [];
      selectedFeatureData.rows.forEach((row) => {
        let tmp = {};
        row.forEach((val, ind) => {
          tmp = { ...tmp, [selectedFeatureData.headers[ind]]: val };
        });
        tempResult3.push(tmp);
      });

      let tempResult4 = [];
      droppedFeature =
        Data.selected_features.custom_feature_data.single.dropped_features_data;
      droppedFeature.rows.forEach((row) => {
        let tmp = {};
        row.forEach((val, ind) => {
          tmp = { ...tmp, [droppedFeature.headers[ind]]: val };
        });
        tempResult4.push(tmp);
      });

      console.log({
        ...data,
        graph_data: Data.selected_features.graph_data,
        dropped_feature_data: tempResult,
        selected_feature_data: tempResult1,
        single_selected: tempResult3,
        single_dropped: tempResult4,
        single_graph:
          Data.selected_features.custom_feature_data.single.graph_data,
      });

      setData({
        ...data,
        graph_data: Data.selected_features.graph_data,
        dropped_feature_data: tempResult,
        selected_feature_data: tempResult1,
        single_selected: tempResult3,
        single_dropped: tempResult4,
        single_graph:
          Data.selected_features.custom_feature_data.single.graph_data,
      });
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="mt-4">
      <div>
        <Input
          label="Enter the value for k-fold"
          fullWidth
          type="number"
          step={1}
          value={k_fold}
          onChange={(e) => setKFoldValue(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Radio.Group
          defaultValue={method}
          onChange={handleMethod}
          orientation="horizontal"
        >
          <Radio value="All" color="success">
            All
          </Radio>
          <Radio value="Custom" color="success">
            Custom
          </Radio>
          <Radio value="None" color="success">
            None
          </Radio>
        </Radio.Group>
      </div>
      {loading && (
        <div className="mt-6">
          <Progress
            value={progress}
            shadow
            color="success"
            status="secondary"
            striped
          />
        </div>
      )}
      {data && (
        <div>
          {data.selected_feature_data && (
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-2xl mb-2 font-medium">
                  Selected Features:
                </h1>
                <AgGridAutoDataComponent
                  download={true}
                  rowData={data.selected_feature_data}
                  height="250px"
                  rowHeight={30}
                  headerHeight={40}
                  paginationPageSize={5}
                />
              </div>
              <div>
                <h1 className="text-2xl mb-2 font-medium">Dropped Features:</h1>
                <AgGridAutoDataComponent
                  download={true}
                  rowData={data.dropped_feature_data}
                  height="250px"
                  rowHeight={30}
                  headerHeight={40}
                  paginationPageSize={5}
                />
              </div>
            </div>
          )}
          {data.single_selected && (
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-2xl mb-2 font-medium">
                  Selected Features:
                </h1>
                <AgGridAutoDataComponent
                  download={true}
                  rowData={data.single_selected}
                  height="250px"
                  rowHeight={30}
                  headerHeight={40}
                  paginationPageSize={5}
                />
              </div>
              <div>
                <h1 className="text-2xl mb-2 font-medium">Dropped Features:</h1>
                <AgGridAutoDataComponent
                  download={true}
                  rowData={data.single_dropped}
                  height="250px"
                  rowHeight={30}
                  headerHeight={40}
                  paginationPageSize={5}
                />
              </div>
            </div>
          )}
          {data.graph_data && (
            <>
              {data.graph_data.bar_plot && (
                <div className="flex justify-center mt-4">
                  <Plot
                    data={JSON.parse(data.graph_data.bar_plot).data}
                    layout={{
                      ...JSON.parse(data.graph_data.bar_plot).layout,
                      showlegend: true,
                    }}
                    config={{
                      editable: true,
                      responsive: true,
                    }}
                  />
                </div>
              )}
              {data.graph_data.scatter_plot && (
                <div className="flex justify-center mt-4">
                  <Plot
                    data={JSON.parse(data.graph_data.scatter_plot).data}
                    layout={{
                      ...JSON.parse(data.graph_data.scatter_plot).layout,
                      showlegend: true,
                    }}
                    config={{
                      editable: true,
                      responsive: true,
                    }}
                  />
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Plot
                  data={data.single_graph.data}
                  layout={{
                    ...data.single_graph.layout,
                    showlegend: true,
                  }}
                  config={{
                    editable: true,
                    responsive: true,
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BestOverallFeature;
