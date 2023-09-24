import { Download, DownloadDone } from "@mui/icons-material";
import React from "react";
import { Handle, Position } from "reactflow";

function ModelNode({ id, data }) {
  console.log(data);
  return (
    <>
      <div
        className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        // onDoubleClick={() => {
        //   setVisible(!visible);
        // }}
      >
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>

        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          {/* <RiFileEditLine size={"25"} /> */}
          {data && data.model ? (
            <span>{data.model.name}</span>
          ) : (
            <span>Model</span>
          )}
          {data && data.model && (
            <div className="mx-auto">
              <button className="border-2 border-gray-600 rounded shadow px-1 hover:bg-black hover:border-black hover:text-white" title="Download Model">
                <Download fontSize="small" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ModelNode;
