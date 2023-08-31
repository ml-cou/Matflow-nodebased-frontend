import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Handle, Position, useReactFlow } from "reactflow";
import { parseCsv } from "../../../util/indexDB";

function UploadFile({ id, data }) {
  const [file, setFile] = useState(null);
  const rflow = useReactFlow();
  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const changeHandler = (event) => {
    event.preventDefault();

    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      let tempData;
      (async function () {
        tempData = await parseCsv(file);
        const tempNode = rflow.getNodes().map((val) => {
          if (val.id === id)
            return {
              ...val,
              data: {
                ...val.data,
                file_name: file.name,
                table: tempData,
              },
            };
          return val;
        });
        rflow.setNodes(tempNode);
      })();
    }
  }, [file, rflow]);

  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`flex bg-white border-2 border-black shadow-[6px_6px_0_1px_rgba(0,0,0,0.7)] ${
        dragging ? "border-blue-500" : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left}></Handle>
      {!data || !data.file_name ? (
        <div className="grid place-items-center p-2">
          <label htmlFor="upload-file" className="text-center">
            <CloudUploadOutlinedIcon color="black" />
            <p className="text-sm mt-1">Drag & drop to upload a file.</p>
          </label>
          <input
            ref={inputRef}
            type="file"
            id="upload-file"
            hidden
            onChange={changeHandler}
          />
        </div>
      ) : (
        <div className="grid place-items-center p-2 py-3 min-w-[100px]">
          <InsertDriveFileOutlinedIcon />
          <p className="text-light tracking-wide text-sm mt-1">
            {data.file_name}
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadFile;
