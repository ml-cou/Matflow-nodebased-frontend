import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  handleModelPrediction,
  handleModelPredictionText,
} from "../../../util/NodeFunctions";
import UpdateModelPredictionNode from "../../UpdateNodes/UpdateModelPredictionNode/UpdateModelPredictionNode";

function ModelPredictionNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            (rflow.getNode(edge.target).type === "Table" ||
              rflow.getNode(edge.target).type === "Graph")
        );

      const tempText = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id && rflow.getNode(edge.target).type === "Text"
        );
      temp.forEach(async (val) => {
        await handleModelPrediction(rflow, val);
      });

      tempText.forEach(async (val) => {
        await handleModelPredictionText(rflow, val);
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
        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          {/* <HiOutlinePuzzle size={"25"} /> */}
          <span>Model Prediction</span>
        </div>
      </div>
      {data && (
        <UpdateModelPredictionNode
          visible={visible}
          setVisible={setVisible}
          nodeId={id}
        />
      )}
    </>
  );
}

export default ModelPredictionNode;
