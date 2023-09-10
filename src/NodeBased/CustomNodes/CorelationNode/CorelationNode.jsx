import React, { useEffect, useState } from "react";
import { TbCirclesRelation } from "react-icons/tb";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleDatasetCorrelation } from "../../../util/NodeFunctions";
import UpdateCorelationNode from "../../UpdateNodes/UpdateCorelationNode/UpdateCorelationNode";

function CorelationNode({ id, data }) {
  console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const tempTable = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_table"
        );

      const tempGraph = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_graph"
        );

      tempTable.forEach(async (val) => {
        await handleDatasetCorrelation(rflow, val, "table");
      });

      tempGraph.forEach(async (val) => {
        await handleDatasetCorrelation(rflow, val, "graph");
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
          <TbCirclesRelation size={25} />
          <span>Correlation</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateCorelationNode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          nodeId={id}
        />
      )}
    </>
  );
}

export default CorelationNode;
