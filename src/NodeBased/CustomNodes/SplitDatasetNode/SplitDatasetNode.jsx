import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import UpdateSplitDatasetNode from "../../UpdateNodes/UpdateSplitDatasetNode/UpdateSplitDatasetNode";

import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { useDispatch, useSelector } from "react-redux";
import { setActiveID, setNodeType, setRightSidebarData } from "../../../Slices/SideBarSlice";
import { handleSplitDataset } from "../../../util/NodeFunctions";

function SplitDatasetNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();
  const type = rflow.getNode(id).type;
  const dispatch = useDispatch();
  const activeID = useSelector((state) => state.sideBar.active_id);

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "Test-Train Dataset"
        );
      temp.forEach(async (val) => {
        await handleSplitDataset(rflow, val);
      });
    })();
  }, [data]);

  return (
    <>
      <div
        className="flex relative bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        onDoubleClick={() => {
          setVisible(!visible);
        }}
        onClick={() => {
          dispatch(setRightSidebarData(data));
          dispatch(setNodeType(type));
          dispatch(setActiveID(id));
        }}
      >
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>
        {activeID === id && (
          <div className="absolute w-2.5 h-2.5 rounded-full top-0 left-0 translate-x-1/2 translate-y-1/2 bg-green-700"></div>
        )}
        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          <SplitscreenIcon />
          <span>Split Dataset</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateSplitDatasetNode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          nodeId={id}
        />
      )}
    </>
  );
}

export default SplitDatasetNode;
