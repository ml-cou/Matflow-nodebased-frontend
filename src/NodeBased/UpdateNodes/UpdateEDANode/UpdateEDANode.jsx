import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Modal } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactFlow } from "reactflow";
import SingleDropDown from "../../../FunctionBased/Components/SingleDropDown/SingleDropDown";
import BarPlot from "./plots/BarPlot";
import BoxPlot from "./plots/BoxPlot";
import CountPlot from "./plots/CountPlot";
import CustomPlot from "./plots/CustomPlot";
import Histogram from "./plots/Histogram";
import LinePlot from "./plots/LinePlot";
import PiePlot from "./plots/PiePlot";
import RegPlot from "./plots/RegPlot";
import ScatterPlot from "./plots/ScatterPlot";
import ViolinPlot from "./plots/ViolinPlot";

const PLOT = [
  "Bar Plot",
  "Pie Plot",
  "Count Plot",
  "Histogram",
  "Box Plot",
  "Violin Plot",
  "Scatter Plot",
  "Reg Plot",
  "Line Plot",
  "Custom Plot",
];

function UpdateEDANode({ visible, setVisible, csvData }) {
  const rflow = useReactFlow();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [plotType, setPlotType] = useState(PLOT[0]);
  const dispatch = useDispatch();
  const nodeId = useSelector((state) => state.EDA.nodeId);
  const nodeDetails = rflow.getNode(nodeId);
  const [plotOption, setPlotOption] = useState();

  useEffect(() => {
    if (nodeDetails && nodeDetails.data && nodeDetails.data.plot)
      setPlotType(nodeDetails.data.plot);
  }, [nodeDetails]);

  useEffect(() => {
    const tempNodes = rflow.getNodes().map((node) => {
      if (node.id === nodeId)
        return { ...node, data: { ...node.data, plot: plotType } };
      return node;
    });
    rflow.setNodes(tempNodes);
  }, [plotType]);

  const handleSave = () => {
    const tempNode = {
      ...nodeDetails,
      data: {
        ...nodeDetails.data,
        plot: plotType,
        plotOption,
      },
    };
    const tempNodes = rflow.getNodes().map((node) => {
      if (node.id === nodeId) return tempNode;
      return node;
    });
    rflow.setNodes(tempNodes);
  };

  return (
    <div>
      <Modal
        closeButton
        width="700px"
        aria-labelledby="modal-title"
        open={visible}
        scroll
        fullScreen={isFullScreen}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <h1 className="text-3xl font-medium tracking-wide">
            Edit EDA Options
          </h1>
          <span
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute left-0 top-0 translate-x-1/2 translate-y-1/2"
          >
            {isFullScreen ? (
              <FullscreenExitIcon color="action" />
            ) : (
              <FullscreenIcon color="action" />
            )}
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="min-h-[400px] pb-8 max-w-5xl mx-auto w-full">
            <div className="w-full">
              <p className="tracking-wide">Plot Type</p>
              <SingleDropDown
                columnNames={PLOT}
                initValue={plotType}
                onValueChange={(e) => {
                  setPlotType(e);
                }}
              />
            </div>
            {plotType === "Bar Plot" && (
              <BarPlot csvData={csvData} setPlotOption={setPlotOption} />
            )}
            {plotType === "Box Plot" && <BoxPlot csvData={csvData} />}
            {plotType === "Pie Plot" && <PiePlot csvData={csvData} />}
            {plotType === "Count Plot" && <CountPlot csvData={csvData} />}
            {plotType === "Violin Plot" && <ViolinPlot csvData={csvData} />}
            {plotType === "Scatter Plot" && <ScatterPlot csvData={csvData} />}
            {plotType === "Reg Plot" && <RegPlot csvData={csvData} />}
            {plotType === "Line Plot" && <LinePlot csvData={csvData} />}
            {plotType === "Custom Plot" && <CustomPlot csvData={csvData} />}
            {plotType === "Histogram" && <Histogram csvData={csvData} />}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t-2 shadow border-gray-200">
          <div className="flex items-center gap-4">
            <button
              className="font-medium border-2 p-2 px-4 text-lg tracking-wider border-gray-500 rounded"
              onClick={() => {
                setVisible(false);
              }}
            >
              Close
            </button>
            <button
              className="font-medium border-2 p-2 px-4 text-lg tracking-wider bg-black text-white rounded"
              onClick={() => {
                handleSave();
                setVisible(false);
              }}
            >
              Save
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateEDANode;
