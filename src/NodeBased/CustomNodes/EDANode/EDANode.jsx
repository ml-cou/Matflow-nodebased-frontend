import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  setNodeIdRedux,
  setPlotOptionRedux,
  setPlotRedux,
} from "../../../Slices/NodeBasedSlices/EDASlice";
import { handlePlotOptions } from "../../../util/NodeFunctions";
import UpdateEDANode from "../../UpdateNodes/UpdateEDANode/UpdateEDANode";

function EDANode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "output_graph"
        );
      temp.forEach(async (val) => {
        await handlePlotOptions(rflow, val);
      });
    })();
    if (data) {
      dispatch(setPlotOptionRedux(data.plotOption));
      dispatch(setPlotRedux(data.plot));
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setNodeIdRedux(id));
  }, [dispatch, visible]);

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
        <div className="grid place-items-center p-2 py-3 min-w-[80px]">
          <InsertChartOutlinedIcon />
          <span>EDA</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateEDANode
          visible={visible}
          setVisible={setVisible}
          csvData={data.table}
          id={id}
        />
      )}
    </>
  );
}

export default EDANode;
