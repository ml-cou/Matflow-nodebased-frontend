import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";
import {
  setDatasetName,
  setFile,
  setSaveAsNew,
} from "../../../Slices/FeatureEngineeringSlice";
import { setReRender } from "../../../Slices/UploadedFileSlice";
import {
  fetchDataFromIndexedDB,
  updateDataInIndexedDB,
} from "../../../util/indexDB";

function AlterFieldName({ csvData }) {
  const dispatch = useDispatch();
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);

  const [numberOfColumns, setNumberOfColumns] = useState(1);
  const [columnNames, setColumnNames] = useState();
  const [savedAsNewDataset, setSavedAsNewDataset] = useState(false);
  const [data, setData] = useState([{ column_name: "", new_field_name: "" }]);
  const featureData = useSelector((state) => state.featureEngineering);
  const render = useSelector((state) => state.uploadedFile.rerender);

  useEffect(() => {
    if (activeCsvFile && activeCsvFile.name) {
      const getData = async () => {
        setColumnNames(Object.keys(csvData[0]));
        dispatch(setFile(csvData));
      };

      getData();
    }
  }, [activeCsvFile, dispatch, csvData]);

  const handleChange = (val, index, key) => {
    const temp = data.map((d, ind) => {
      if (ind === index) return { ...d, [key]: val };
      return d;
    });
    setData(temp);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/alter_field_name/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number_of_columns: numberOfColumns,
          data,
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
    <div className="my-8">
      <div className="flex gap-4 max-w-3xl items-center">
        <div className="basis-2/3">
          <Input
            label="Number of columns"
            value={numberOfColumns}
            onChange={(e) => {
              const val = e.target.value;
              setNumberOfColumns(val);
              if (val < data.length) setData(data.slice(0, val));
              else {
                const temp = JSON.parse(JSON.stringify(data));
                while (val - temp.length > 0) {
                  temp.push({
                    column_name: "",
                    new_field_name: "",
                  });
                }
                setData(temp);
              }
            }}
            type="number"
            step={1}
            fullWidth
          />
        </div>
        <div className="basis-1/3">
          <Checkbox color="success">Add to pipeline</Checkbox>
        </div>
      </div>
      <div className="mt-8">
        {csvData && columnNames &&
          data.map((val, index) => {
            return (
              <div key={index} className="flex items-end gap-8 mt-6">
                <div className="w-full">
                  <p>Column {index + 1}</p>
                  <SingleDropDown
                    columnNames={columnNames}
                    onValueChange={(e) => handleChange(e, index, "column_name")}
                  />
                </div>
                <Input
                  fullWidth
                  label="New Field Name"
                  placeholder="New name."
                  value={val.new_field_name}
                  onChange={(e) =>
                    handleChange(e.target.value, index, "new_field_name")
                  }
                />
              </div>
            );
          })}
      </div>
      <div className="mt-8 flex flex-col gap-4">
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

export default AlterFieldName;
