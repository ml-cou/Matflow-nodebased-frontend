import { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleModelEvaluation } from "../../../util/NodeFunctions";
import UpdateModelEvaluationNode from "../../UpdateNodes/UpdateModelEvaluationNode/UpdateModelEvaluationNode";

function ModelEvaluationNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const tempTable = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id && rflow.getNode(edge.target).type === "Table"
        );

      const tempGraph = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id && rflow.getNode(edge.target).type === "Graph"
        );

      // console.log({ tempTable, tempGraph });
      tempTable.length &&
        tempTable.forEach(async (val) => {
          await handleModelEvaluation(rflow, val, "table");
        });
      tempGraph.length &&
        tempGraph.forEach(async (val) => {
          await handleModelEvaluation(rflow, val, "graph");
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
          <span>Model Evaluation</span>
        </div>
      </div>
      {data && (
        <UpdateModelEvaluationNode
          visible={visible}
          setVisible={setVisible}
          nodeId={id}
          metrics={data.metrics_table}
        />
      )}
    </>
  );
}

export default ModelEvaluationNode;
