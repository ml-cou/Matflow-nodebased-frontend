import { Checkbox, Input, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setDatasetName,
  setSaveAsNew,
} from "../../../../Slices/FeatureEngineeringSlice";
import { setReRender } from "../../../../Slices/UploadedFileSlice";
import {
  fetchDataFromIndexedDB,
  updateDataInIndexedDB,
} from "../../../../util/indexDB";
import MultipleDropDown from "../../../Components/MultipleDropDown/MultipleDropDown";

function DropRow({
  csvData,
  type = "function",
  onValueChange = undefined,
  initValue = undefined,
}) {
  const [defaultValue, setDefaultValue] = useState("With Null");
  const allColumns = Object.keys(csvData[0]);
  const [selectedColumns, setSelectedColumns] = useState();
  const [savedAsNewDataset, setSavedAsNewDataset] = useState(false);
  const dispatch = useDispatch();
  const [add_to_pipeline, setAddToPipeline] = useState(false);
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const featureData = useSelector((state) => state.featureEngineering);
  const render = useSelector((state) => state.uploadedFile.rerender);

  useEffect(() => {
    if (initValue) {
      setDefaultValue(initValue.default_value);
      setSelectedColumns(initValue.select_columns);
    }
  }, []);

  useEffect(() => {
    if (type === "node") {
      onValueChange({
        default_value: defaultValue,
        select_columns: selectedColumns,
      });
    }
  }, [type, defaultValue, selectedColumns]);

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/drop_rows/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          default_value: defaultValue,
          select_columns: selectedColumns,
          file: csvData,
        }),
      });
      let Data = await res.json();

      let fileName = activeCsvFile.name;

      if (featureData.save_as_new) {
        fileName = featureData.dataset_name;
      }

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
      dispatch(setReRender(!render));
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
        <div className="w-full">
          <p>Default Value</p>
          <div>
            <Radio.Group
              orientation="horizontal"
              defaultValue="With Null"
              color="success"
              size={type === "node" ? "sm" : "md"}
              value={defaultValue}
              onChange={(e) => setDefaultValue(e)}
            >
              <Radio value="With Null">With Null</Radio>
            </Radio.Group>
          </div>
        </div>
        {type === "function" && (
          <Checkbox
            color="success"
            className="w-full"
            onChange={(e) => setAddToPipeline(e.valueOf())}
          >
            Add To Pipeline
          </Checkbox>
        )}
      </div>
      <div className="mt-4">
        <p>Select Columns</p>
        <MultipleDropDown
          columnNames={allColumns}
          setSelectedColumns={setSelectedColumns}
          defaultValue={selectedColumns}
        />
      </div>
      {type === "function" && (
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox
            color="success"
            onChange={(e) => {
              setSavedAsNewDataset(e.valueOf());
              dispatch(setSaveAsNew(e.valueOf()));
            }}
          >
            Save as New Dataset
          </Checkbox>
          {savedAsNewDataset && (
            <div>
              <Input
                label="New Dataset Name"
                fullWidth
                clearable
                onChange={(e) => {
                  dispatch(setDatasetName(e.target.value));
                }}
              />
            </div>
          )}
          <button
            className="self-start border-2 px-6 tracking-wider bg-primary-btn text-white font-medium rounded-md py-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default DropRow;
