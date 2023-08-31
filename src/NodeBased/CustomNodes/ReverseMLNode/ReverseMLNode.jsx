import React, { useEffect, useState } from "react";
import { HiOutlinePuzzle } from "react-icons/hi";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleReverseML } from "../../../util/NodeFunctions";
import UpdateReverseMLNode from "../../UpdateNodes/UpdateReverseMLNode/UpdateReverseMLNode";

function ReverseMLNode({ id, data }) {
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
            rflow.getNode(edge.target).type === "output_table"
        );
      temp.forEach(async (val) => {
        await handleReverseML(rflow, val);
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
          <HiOutlinePuzzle size={"25"} />
          <span>ReverseML</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateReverseMLNode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          nodeId={id}
        />
      )}
    </>
  );
}

export default ReverseMLNode;
