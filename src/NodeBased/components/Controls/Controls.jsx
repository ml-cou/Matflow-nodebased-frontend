import { ZoomIn, ZoomInMap, ZoomOut } from "@mui/icons-material";
import React, { useEffect } from "react";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
import {MdOutlineZoomInMap} from 'react-icons/md'
import { useReactFlow, useViewport } from "reactflow";

function Controls() {
  const rflow = useReactFlow();
  const { zoom } = useViewport();

  useEffect(() => {
    // console.log(zoom);
  }, [zoom]);

  return (
    <div className="bg-gray-300/40 rounded-lg px-2 py-1 flex items-center text-gray-700/80">
      <BiZoomIn size={18} className="hover:text-gray-900 cursor-pointer" onClick={rflow.zoomIn} />
      <span className="text-sm mx-2">{parseInt(rflow.getZoom() * 100)}%</span>
      <BiZoomOut onClick={rflow.zoomOut} size={18} className="hover:text-gray-900 cursor-pointer" />
      <MdOutlineZoomInMap onClick={rflow.fitView} size={18} className="ml-1 hover:text-gray-900 cursor-pointer" />
    </div>
  );
}

export default Controls;
