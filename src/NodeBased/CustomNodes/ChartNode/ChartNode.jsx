import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Modal } from "@nextui-org/react";
import React, { useState } from "react";
import Plot from "react-plotly.js";
import { Handle, Position } from "reactflow";

function ChartNode({ id, data }) {
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const [isFullScreen, setIsFullScreen] = useState(true);

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]" onDoubleClick={handler}>
        {/* <Handle type="source" position={Position.Right}></Handle> */}
        <Handle type="target" position={Position.Left}></Handle>
        <div className="grid place-items-center p-2 py-3 min-w-[80px]">
          <AutoGraphOutlinedIcon color="action" />
          <span>Graph</span>
        </div>
      </div>
      <Modal
        closeButton
        width="700px"
        fullScreen={isFullScreen}
        aria-labelledby="modal-title"
        open={visible}
        scroll
        onClose={closeHandler}
      >
        <Modal.Header>
          <h1 className="text-3xl tracking-wide font-semibold">Data Graph</h1>
          <span
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute left-0 top-0 translate-x-1/2 translate-y-1/2"
          >
            {isFullScreen ? (
              <FullscreenExitIcon color="action" />
            ) : (
              <FullscreenIcon color="action" />
            )}
          </span>
        </Modal.Header>
        <Modal.Body>
          <div>
            {data && data.graph && (
              <div className="flex justify-center mt-4">
                <Plot
                  data={data.graph?.data}
                  layout={{ ...data.graph.layout, showlegend: true }}
                  config={{
                    scrollZoom: true,
                    editable: true,
                    responsive: true,
                  }}
                />
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChartNode;
