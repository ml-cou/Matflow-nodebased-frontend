import React, { useEffect, useState } from "react";
import { TbCirclesRelation } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  setActiveID,
  setNodeType,
  setRightSidebarData,
} from "../../../Slices/SideBarSlice";
import { handleDatasetCorrelation } from "../../../util/NodeFunctions";
import UpdateCorelationNode from "../../UpdateNodes/UpdateCorelationNode/UpdateCorelationNode";

function CorelationNode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();
  const type = rflow.getNode(id).type;
  const dispatch = useDispatch();
  const activeID = useSelector((state) => state.sideBar.active_id);

  useEffect(() => {
    (async function () {
      const tempTable = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id && rflow.getNode(edge.target).type === "Table"
        );

      const tempGraph = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id && rflow.getNode(edge.target).type === "Graph"
        );

      tempTable.forEach(async (val) => {
        await handleDatasetCorrelation(rflow, val, "table");
      });

      tempGraph.forEach(async (val) => {
        await handleDatasetCorrelation(rflow, val, "graph");
      });
    })();
  }, [data]);

  return (
    <>
      <div
        className="relative flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
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
          <TbCirclesRelation size={25} />
          <span>Correlation</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateCorelationNode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          nodeId={id}
        />
      )}
    </>
  );
}

export default CorelationNode;
