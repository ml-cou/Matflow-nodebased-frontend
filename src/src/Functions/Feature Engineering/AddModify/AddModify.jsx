import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";
import {
  setAddToPipeline,
  setColumnName,
  setDatasetName,
  setFile,
  setMethod,
  setOption,
  setSaveAsNew,
} from "../../../Slices/FeatureEngineeringSlice";
import { fetchDataFromIndexedDB } from "../../../util/indexDB";
import Add_ExtractText from "./Component/Add_ExtractText";
import Add_GroupCategorical from "./Component/Add_GroupCategorical";
import Add_GroupNumerical from "./Component/Add_GroupNumerical";
import Add_MathOperation from "./Component/Add_MathOperation";
import Add_NewColumn from "./Component/Add_NewColumn";

function AddModify() {
  const [currentOption, setCurrentOption] = useState("Add");
  const [currentMethod, setCurrentMethod] = useState("New Column");
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const [csvData, setCsvData] = useState();
  const [savedAsNewDataset, setSavedAsNewDataset] = useState(false);
  const dispatch = useDispatch();
  const featureData = useSelector((state) => state.featureEngineering);

  useEffect(() => {
    if (activeCsvFile && activeCsvFile.name) {
      const getData = async () => {
        const res = await fetchDataFromIndexedDB(activeCsvFile.name);
        setCsvData(res);
        dispatch(setFile(res));
      };

      getData();
    }
  }, [activeCsvFile, dispatch]);

  const handleOptionClicked = (e) => {
    setCurrentOption(e.target.value);
    if (e.target.value === "Add") setCurrentMethod("New Column");
    else setCurrentMethod("Math Operation");
    dispatch(setOption(e.target.value));
  };

  const handleInputChange = (e) => {
    dispatch(setColumnName(e.target.value));
  };

  const handleSave = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/feature_creation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(featureData),
    });
    const data = await res.json()
    console.log(data)
  };

  return (
    <div>
      <div className="flex justify-between items-end gap-8 mt-8">
        <div className="w-full flex flex-col">
          <label
            className="mb-1 text-lg tracking-wide font-medium"
            htmlFor="option"
          >
            Option
          </label>
          <select
            name=""
            id="option"
            className="py-[0.6rem] rounded-xl px-3"
            value={currentOption}
            onChange={handleOptionClicked}
          >
            <option value="Add">Add</option>
            <option value="Modify">Modify</option>
          </select>
        </div>
        <div className="w-full flex flex-col">
          <label className=" text-lg tracking-wide font-medium" htmlFor="">
            {currentOption === "Add" ? "New column name" : "Select Column"}
          </label>
          {currentOption === "Add" ? (
            <Input
              bordered
              color="success"
              className="mt-1"
              onChange={handleInputChange}
            />
          ) : (
            <SingleDropDown columnNames={["s"]} />
          )}
        </div>
        <div className="w-full flex flex-col">
          <label
            className="mb-1 text-lg tracking-wide font-medium"
            htmlFor="method"
          >
            Method
          </label>
          <select
            name=""
            id="method"
            className="py-[0.6rem] rounded-xl px-3"
            value={currentMethod}
            onChange={(e) => {
              setCurrentMethod(e.target.value);
              dispatch(setMethod(e.target.value));
            }}
          >
            {currentOption === "Add" && (
              <option value="New Column">New Column</option>
            )}
            <option value="Math Operation">Math Operation</option>
            <option value="Extract Text">Extract Text</option>
            <option value="Group Categorical">Group Categorical</option>
            <option value="Group Numerical">Group Numerical</option>
            {currentOption === "Modify" && (
              <>
                <option value="Replace Values">Replace Values</option>
                <option value="Progress Apply">Progress Apply</option>
              </>
            )}
          </select>
        </div>
        <div className="w-full flex flex-col">
          <Checkbox
            defaultSelected
            color="success"
            onChange={(e) => {
              dispatch(setAddToPipeline(e.valueOf()));
            }}
          >
            Add To Pipeline
          </Checkbox>
          <button className="border-2 tracking-wider w-max bg-transparent border-primary-btn py-1 text-sm px-5 hover:bg-primary-btn hover:text-white mt-2 rounded">
            Show Sample
          </button>
        </div>
      </div>
      <div className="mt-8">
        {csvData && currentMethod === "New Column" && (
          <Add_NewColumn csvData={csvData} />
        )}
        {csvData && currentMethod === "Math Operation" && (
          <Add_MathOperation csvData={csvData} />
        )}
        {csvData && currentMethod === "Extract Text" && (
          <Add_ExtractText csvData={csvData} />
        )}
        {csvData && currentMethod === "Group Categorical" && (
          <Add_GroupCategorical csvData={csvData} />
        )}
        {csvData && currentMethod === "Group Numerical" && (
          <Add_GroupNumerical csvData={csvData} />
        )}
      </div>
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
    </div>
  );
}

export default AddModify;
