import React, { useEffect, useState } from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Handle, Position, useReactFlow } from "reactflow";
import UpdateTimeSeriesNode from "../../UpdateNodes/UpdateTimeSeriesNpde/UpdateTimeSeriesNode";
import { handleTimeSeriesAnalysis } from "../../../util/NodeFunctions";

function TimeSeriesNode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_graph"
        );
      temp.forEach(async (val) => {
        await handleTimeSeriesAnalysis(rflow, val);
      });
    })();
  }, [data]);

  return (
    <>
      <div
        className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        onDoubleClick={() => {
          setVisible(!visible);
        }}
      >
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>
        <div className="grid place-items-center p-3 px-4 min-w-[80px]">
          <AiOutlineLineChart className="text-[rgba(0,0,0,0.54)]" size={"30"} />
          <span className="mt-1 text-center text-sm">
            Time Series <br /> Analysis
          </span>
        </div>
      </div>
      {data && data.table && (
        <UpdateTimeSeriesNode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          nodeId={id}
        />
      )}
    </>
  );
}

export default TimeSeriesNode;
