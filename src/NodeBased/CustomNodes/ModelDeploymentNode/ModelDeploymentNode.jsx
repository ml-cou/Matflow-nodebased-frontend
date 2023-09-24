import React, { useState } from "react";
import { RxRocket } from "react-icons/rx";
import { Handle, Position, useReactFlow } from "reactflow";
import UpdateModelDeploymentNode from "../../UpdateNodes/UpdateModelDeploymentNode/UpdateModelDeploymentNode";

function ModelDeploymentNode({ id, data }) {
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
          <RxRocket size={"25"} />
          <span>Model Deployment</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateModelDeploymentNode
          visible={visible}
          setVisible={setVisible}
          nodeId={id}
          csvData={data.table}
        />
      )}
    </>
  );
}

export default ModelDeploymentNode;
