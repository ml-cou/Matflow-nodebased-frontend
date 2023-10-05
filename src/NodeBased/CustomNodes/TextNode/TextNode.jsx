import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import { BiText } from "react-icons/bi";
import { Handle, Position, useReactFlow } from "reactflow";

function TextNode({ id, data }) {
  // console.log(data);
  const [visible, setVisible] = useState(false);
  const rflow = useReactFlow();
  const theme = useTheme();
  const [result, setResult] = useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (data && data.type === "Classification Report") {
      const temp = data.result.replaceAll("\n", "<br />");
      setResult(temp);
    }
  }, [data]);

  return (
    <>
      <div
        className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        onDoubleClick={() => {
          setVisible(!visible);
        }}
      >
        <Handle type="target" position={Position.Left}></Handle>

        <div className="grid place-items-center gap-1 p-2 py-3 min-w-[80px]">
          <BiText size={25} />
          <span>Text</span>
        </div>
      </div>
      {data && (
        <Dialog
          open={visible}
          onClose={() => setVisible(false)}
          fullScreen={fullScreen}
          scroll="paper"
        >
          <span
            className="ml-auto p-2 cursor-pointer"
            onClick={() => setVisible(false)}
          >
            <CloseIcon color="action" />
          </span>

          {data.type && data.type === "Classification Report" ? (
            <div className="px-4 py-3">
              <pre dangerouslySetInnerHTML={{ __html: result }}></pre>
            </div>
          ) : (
            <div className="min-w-[400px] mx-auto w-full p-6 py-4 pt-0 mb-4">
              {data.type && (
                <h1 className="text-3xl tracking-wide font-semibold mb-3">
                  {data.type}
                </h1>
              )}
              <p className="text-xl font-medium">{data.result}</p>
            </div>
          )}
        </Dialog>
      )}
    </>
  );
}

export default TextNode;
