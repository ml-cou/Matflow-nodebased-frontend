import React, { useState } from "react";
import { AiOutlineMergeCells } from "react-icons/ai";
import { Handle, Position, useReactFlow } from "reactflow";
import UpdateMergeDatasetNode from "../../UpdateNodes/UpdateMergeDatasetNode/UpdateMergeDatasetNode";

function MergeDatasetNode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  return (
    <>
      <div
        className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        onDoubleClick={() => {
          setVisible(!visible);
        }}
      >
        <Handle type="source" position={Position.Right}></Handle>
        <Handle
          type="target"
          id="a"
          className="top-4"
          position={Position.Left}
        ></Handle>
        <Handle
          type="target"
          id="b"
          className="top-16"
          position={Position.Left}
        ></Handle>
        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          <AiOutlineMergeCells className="text-[rgba(0,0,0,1)]" size={"25"} />
          <span>Merge Dataset</span>
        </div>
      </div>
      {data && Object.keys(data).length >= 2 && (
        <UpdateMergeDatasetNode
          visible={visible}
          setVisible={setVisible}
          table1={Object.values(data)[0]}
          table2={Object.values(data)[1]}
          nodeId={id}
        />
      )}
    </>
  );
}

export default MergeDatasetNode;
