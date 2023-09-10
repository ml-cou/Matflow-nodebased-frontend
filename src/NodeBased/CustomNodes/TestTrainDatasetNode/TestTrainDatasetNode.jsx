import React from "react";
import { Handle, Position } from "reactflow";

function TestTrainDatasetNode({ id, data }) {
  console.log(data);
  return (
    <div className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]">
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left}></Handle>
      <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
        {!data ? (
          <>
            {/* <SplitscreenIcon /> */}
            <span>Test-Train Dataset</span>
          </>
        ) : (
          <div className="grid gap-2">
            <button className="border p-2 text-xs border-gray-600 rounded shadow-sm hover:bg-black hover:text-gray-200 font-medium text-gray-700">
              {data.test_dataset_name}
            </button>
            <button className="border p-2 text-xs border-gray-600 rounded shadow-sm hover:bg-black hover:text-gray-200 font-medium text-gray-700">
              {data.train_dataset_name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestTrainDatasetNode;
