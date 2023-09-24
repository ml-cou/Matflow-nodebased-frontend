import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import UpdateBuildModelNode from "../../UpdateNodes/UpdateBuildModelNode/UpdateBuildModelNode";

function BuildModelNode({ id, data }) {
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
        <Handle type="target" position={Position.Left}></Handle>
        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          {/* <HiOutlinePuzzle size={"25"} /> */}
          <span>Build Model</span>
        </div>
      </div>
      {data && data.testTrain && (
        <UpdateBuildModelNode
          visible={visible}
          setVisible={setVisible}
          nodeData={data.testTrain}
          nodeId={id}
        />
      )}
    </>
  );
}

export default BuildModelNode;
