import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleCluster } from "../../../util/NodeFunctions";
import UpdateClusterNode from "../../UpdateNodes/UpdateClusterNode/UpdateClusterNode";

function ClusterNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const tempGraph = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_graph"
        );

      const tempTable = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_table"
        );
      tempGraph.forEach(async (val) => {
        await handleCluster(rflow, val, "graph");
      });
      tempTable.forEach(async (val) => {
        await handleCluster(rflow, val, "table");
      });
    })();
  }, [data, rflow]);

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
          {/* <RiFileEditLine size={"25"} /> */}
          <span>Cluster</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateClusterNode
          visible={visible}
          setVisible={setVisible}
          nodeId={id}
          csvData={data.table}
        />
      )}
    </>
  );
}

export default ClusterNode;
