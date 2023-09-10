import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Modal } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { BsTable } from "react-icons/bs";
import { Handle, Position } from "reactflow";
import AgGridComponent from "../../../FunctionBased/Components/AgGridComponent/AgGridComponent";

function TableNode({ id, data }) {
  const [colDefs, setColDefs] = useState(null);
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (data && data.table) {
      let tempColDefs =
        data.table.length > 0
          ? Object.keys(data.table[0]).map((key) => ({
              headerName: key,
              field: key,
              valueGetter: (params) => {
                return params.data[key];
              },
            }))
          : [];

      if (tempColDefs && tempColDefs.length - 1 >= 0)
        tempColDefs = tempColDefs.slice(tempColDefs.length-1).concat(tempColDefs.slice(0, tempColDefs.length-1));
      console.log(tempColDefs);
      setColDefs(tempColDefs);
    }
  }, [data]);

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <div
        className="flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)]"
        onDoubleClick={handler}
      >
        {/* <Handle type="source" position={Position.Right}></Handle> */}
        <Handle type="target" position={Position.Left}></Handle>
        <div className="grid place-items-center p-2 py-3 min-w-[80px]">
          <BsTable size={20} />
          <span>Table</span>
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
          <h1 className="text-3xl tracking-wide font-semibold">Data Table</h1>
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
          {!colDefs || colDefs.length === 0 || !data || !data.table ? (
            <h3 className="text-xl tracking-wide font-medium text-center">
              No table data found.
            </h3>
          ) : (
            <div
              className="ag-theme-alpine py-2"
              style={{ height: "600px", width: "100%" }}
            >
              <AgGridComponent rowData={data.table} columnDefs={colDefs} />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TableNode;
