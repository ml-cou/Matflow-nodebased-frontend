import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React from "react";
import { Handle, Position } from "reactflow";

function InformationNode({id, data}) {
    console.log(data)
  return (
    <div className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]">
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left}></Handle>
      <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
        <InfoOutlinedIcon />
        <span>Information</span>
      </div>
    </div>
  );
}

export default InformationNode;
