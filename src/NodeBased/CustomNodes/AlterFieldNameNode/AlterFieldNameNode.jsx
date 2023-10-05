import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { handleAlterFieldName } from "../../../util/NodeFunctions";
import UpdateAlterFieldNameNode from "../../UpdateNodes/UpdateAlterFieldNameNode/UpdateAlterFieldNameNode";

function AlterFieldNameNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();

  useEffect(() => {
    (async function () {
      const temp = rflow
        .getEdges()
        .filter(
          (edge) =>
            edge.source === id &&
            rflow.getNode(edge.target).type === "Upload File"
        );
      temp.forEach(async (val) => {
        await handleAlterFieldName(rflow, val);
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

        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          <TextFieldsOutlinedIcon />
          <span>Alter Field Name</span>
        </div>
      </div>
      {data && data.table && (
        <UpdateAlterFieldNameNode
          visible={visible}
          setVisible={setVisible}
          nodeId={id}
          csvData={data.table}
        />
      )}
    </>
  );
}

export default AlterFieldNameNode;
