import { Checkbox } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import MultipleDropDown from "../../../Components/MultipleDropDown/MultipleDropDown";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataFromIndexedDB, updateDataInIndexedDB } from "../../../util/indexDB";
import { toast } from "react-toastify";
import { setReRender } from "../../../Slices/UploadedFileSlice";

const Method = ["Ordinal Encoding", "One-Hot Encoding", "Target Encoding"];

function Encoding({ csvData }) {
  const allStringColumn = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "string"
  );
  const allNumberColumn = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "number"
  );
  const [stringColumn, setStringColumn] = useState(allStringColumn[0]);
  const [method, setMethod] = useState(Method[0]);
  const [add_to_pipeline, setAddToPipeline] = useState(false);
  const [stringValues, setStringValues] = useState();
  const [data, setData] = useState({});
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const render = useSelector((state) => state.uploadedFile.rerender);
  const dispatch = useDispatch()

  useEffect(() => {
    if (method === Method[0]) {
      let temp = csvData.map((val) => val[stringColumn]);
      temp = new Set(temp);
      temp = [...temp];
      setStringValues(temp);
    }
  }, [method, stringColumn, csvData]);

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/encoding/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          select_column: stringColumn,
          method,
          data,
          file: csvData
        }),
      });
      let Data = await res.json();

      let fileName = activeCsvFile.name;
      // console.log(featureData)

      const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
      const fileExist = uploadedFiles.filter((val) => val.name === fileName);

      if (fileExist.length === 0) {
        uploadedFiles.push({ name: fileName });
      }
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

      const temp = await fetchDataFromIndexedDB(fileName);
      await updateDataInIndexedDB(fileName, Data);

      toast.success(
        `Data updated successfully!`,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      dispatch(setReRender(!render))
    } catch (error) {
      toast.error("Something went wrong. Please try again", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-8">
        <div className="w-full">
          <p>Select Column</p>
          <SingleDropDown
            initValue={allStringColumn[0]}
            columnNames={allStringColumn}
            onValueChange={setStringColumn}
          />
        </div>
        <div className="w-full">
          <p>Select Method</p>
          <SingleDropDown
            columnNames={Method}
            initValue={Method[0]}
            onValueChange={(val) => {
              setMethod(val);
              setData({});
            }}
          />
        </div>
        <Checkbox
          color="success"
          className="w-full"
          onChange={(e) => setAddToPipeline(e.valueOf())}
        >
          Add To Pipeline
        </Checkbox>
      </div>

      {method === "Ordinal Encoding" && (
        <div className="mt-8">
          <div className="flex items-center gap-12">
            <Checkbox
              color="success"
              onChange={(e) => setData({ ...data, start_from_0: e.valueOf() })}
            >
              Start from 0
            </Checkbox>
            <Checkbox
              color="success"
              onChange={(e) => setData({ ...data, include_nan: e.valueOf() })}
            >
              Include NaN
            </Checkbox>
            <Checkbox
              color="success"
              onChange={(e) => setData({ ...data, sort_values: e.valueOf() })}
            >
              Sort Values
            </Checkbox>
          </div>
          <div className="mt-4">
            <p>Set Value Order</p>
            <MultipleDropDown
              columnNames={stringValues}
              setSelectedColumns={(val) =>
                setData({ ...data, set_value_order: val })
              }
            />
          </div>
        </div>
      )}

      {method === "One-Hot Encoding" && (
        <div className="mt-4">
          <Checkbox
            color="success"
            className="mt-4"
            onChange={(e) => setData({ ...data, drop_first: e.valueOf() })}
          >
            Drop First
          </Checkbox>
        </div>
      )}

      {method === "Target Encoding" && (
        <div className="mt-4">
          <p>Select Target</p>
          <SingleDropDown
            columnNames={allNumberColumn}
            onValueChange={(val) => setData({ ...data, select_target: val })}
          />
        </div>
      )}

      <button
        className="self-start border-2 px-6 tracking-wider bg-primary-btn text-white font-medium rounded-md py-2 mt-8"
        onClick={handleSave}
      >
        Submit
      </button>
    </div>
  );
}

export default Encoding;
