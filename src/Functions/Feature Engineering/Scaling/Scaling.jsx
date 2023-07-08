import { Checkbox, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MultipleDropDown from "../../../Components/MultipleDropDown/MultipleDropDown";
import {
  fetchDataFromIndexedDB,
  updateDataInIndexedDB,
} from "../../../util/indexDB";
import { setReRender } from "../../../Slices/UploadedFileSlice";

function Scaling({ csvData }) {
  const allColumns = Object.keys(csvData[0]);
  const [selectedColumns, setSelectedColumns] = useState();
  const [option, setOption] = useState("Select Columns");
  const [defaultValue, setDefaultValue] = useState("Blank");
  const [method, setMethod] = useState("Min-Max Scaler");
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const render = useSelector((state) => state.uploadedFile.rerender);
  const dispatch = useDispatch()

  useEffect(() => {
    if (defaultValue === "Blank") setSelectedColumns([]);
    if (defaultValue === "All") setSelectedColumns(Object.keys(csvData[0]));
    if (defaultValue === "Numerical")
      setSelectedColumns(
        Object.keys(csvData[0]).filter(
          (val) => typeof csvData[0][val] === "number"
        )
      );
    if (defaultValue === "Categorical")
      setSelectedColumns(
        Object.keys(csvData[0]).filter(
          (val) => typeof csvData[0][val] === "string"
        )
      );
  }, [defaultValue, csvData]);

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scaling/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          options: option,
          method,
          default_value: defaultValue,
          select_column: selectedColumns,
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

      toast.success(`Data updated successfully!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-lg font-medium" htmlFor="">
            Options
          </label>
          <select
            className="px-2 py-3 rounded-md bg-transparent border-2 border-gray-300 cursor-pointer hover:border-primary-btn"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            name=""
            id=""
          >
            <option value="Select Columns">Select Columns</option>
            <option value="Select All Except">Select All Except</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-lg font-medium" htmlFor="">
            Method
          </label>
          <select
            className="px-2 py-3 rounded-md bg-transparent border-2 border-gray-300 cursor-pointer hover:border-primary-btn"
            name=""
            id=""
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="Min-Max Scaler">Min-Max Scaler</option>
            <option value="Standard Scaler">Standard Scaler</option>
            <option value="Robust Scaler">Robust Scaler</option>
          </select>
        </div>
        <Checkbox className="w-full" color="success">
          Add To Pipeline
        </Checkbox>
      </div>
      <div className="mt-4">
        <p>Default Value</p>
        <div>
          <Radio.Group
            orientation="horizontal"
            defaultValue="Blank"
            color="success"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e)}
          >
            <Radio value="Blank">Blank</Radio>
            <Radio value="All">All</Radio>
            <Radio value="Numerical">Numerical</Radio>
            <Radio value="Categorical">Categorical</Radio>
          </Radio.Group>
        </div>
        <div className="mt-4">
          <p>{option}</p>
          <MultipleDropDown
            columnNames={allColumns}
            setSelectedColumns={setSelectedColumns}
            defaultValue={selectedColumns}
          />
        </div>
      </div>
      <button
        className="self-start border-2 px-6 tracking-wider bg-primary-btn text-white font-medium rounded-md py-2 mt-8"
        onClick={handleSave}
      >
        Submit
      </button>
    </div>
  );
}

export default Scaling;
