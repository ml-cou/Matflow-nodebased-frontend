import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleTestTrainDataset } from "../../../util/NodeFunctions";
import UpdateTestTrainDatasetNode from "../../UpdateNodes/UpdateTestTrainDatasetNode/UpdateTestTrainDatasetNode";

function TestTrainDatasetNode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            (rflow.getNode(edge.target).type === "Build Model" ||
              rflow.getNode(edge.target).type ===
                "Hyper-parameter Optimization")
        );
      temp.forEach(async (val) => {
        await handleTestTrainDataset(rflow, val);
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
        <Handle type="source" position={Position.Top} id="test"></Handle>
        <Handle type="source" position={Position.Bottom} id="train"></Handle>
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
      {data && data.whatKind && (
        <UpdateTestTrainDatasetNode
          visible={visible}
          setVisible={setVisible}
          whatKind={data.whatKind}
          nodeId={id}
        />
      )}
    </>
  );
}

export default TestTrainDatasetNode;
