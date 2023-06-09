import styled from "@emotion/styled";
import { Slider, Stack } from "@mui/material";
import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setReRender } from "../../../../Slices/UploadedFileSlice";
import {
  fetchDataFromIndexedDB,
  updateDataInIndexedDB,
} from "../../../../util/indexDB";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";

function SplitDataset({ csvData }) {
  const columnNames = Object.keys(csvData[0]);
  const [target_variable, setTargetVariable] = useState("");
  const [stratify, setStratify] = useState("");
  const [whatKind, setWhatKind] = useState("");
  const [trainDataName, setTrainDataName] = useState("");
  const [testDataName, setTestDataName] = useState("");
  const [splittedName, setSplittedName] = useState("");
  const [test_size, setTestSize] = useState(0.5);
  const [shuffle, setShuffle] = useState(false);
  const [random_state, setRandomState] = useState(1);
  const dispatch = useDispatch();
  const render = useSelector((state) => state.uploadedFile.rerender);
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);

  useEffect(() => {
    if (target_variable) {
      const temp =
        typeof csvData[0][target_variable] === "number"
          ? "Continuous"
          : "Categorical";
      setWhatKind(temp);
      setTestDataName(
        activeCsvFile.name +
          "_" +
          Object.keys(csvData[0]).filter((val) => val === target_variable)[0]
      );
      setTrainDataName(
        activeCsvFile.name +
          "_" +
          Object.keys(csvData[0]).filter((val) => val === target_variable)[0]
      );
      setSplittedName(
        activeCsvFile.name +
          "_" +
          Object.keys(csvData[0]).filter((val) => val === target_variable)[0]
      );
    }
  }, [target_variable, csvData, activeCsvFile]);

  const handleSave = async () => {
    try {
      if (!trainDataName || !testDataName)
        throw new Error("Dataset name field cannot be empty");

      const res = await fetch("http://127.0.0.1:8000/api/split_dataset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_variable,
          stratify,
          test_size,
          random_state,
          shuffle,
          file: csvData,
        }),
      });
      const data = await res.json();

      const tempTrainName = "train_" + trainDataName;
      const tempTestName = "test_" + testDataName;

      const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
      let fileExist = uploadedFiles.filter((val) => val.name === tempTrainName);

      if (fileExist.length === 0) {
        uploadedFiles.push({ name: tempTrainName, type: whatKind });
      } else throw new Error("Name of this Dataset Already Exist");

      fileExist = uploadedFiles.filter((val) => val.name === tempTestName);

      if (fileExist.length === 0) {
        uploadedFiles.push({ name: tempTestName, type: whatKind });
      } else throw new Error("Name of this Dataset Already Exist");

      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

      await fetchDataFromIndexedDB(tempTrainName);
      await updateDataInIndexedDB(tempTrainName, data.train);

      await fetchDataFromIndexedDB(tempTestName);
      await updateDataInIndexedDB(tempTestName, data.test);

      const datasetName = await fetchDataFromIndexedDB("splitted_dataset");

      datasetName.forEach((val) => {
        if (Object.keys(val)[0] === splittedName)
          throw new Error("Dataset Name already exist.");
      });

      await updateDataInIndexedDB("splitted_dataset", [
        ...datasetName,
        {
          [splittedName]: [
            whatKind,
            tempTrainName,
            tempTestName,
            target_variable,
            activeCsvFile.name,
          ],
        },
      ]);

      dispatch(setReRender(!render));
      toast.success("Dataset Splitted Successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error(JSON.stringify(error.message), {
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
          <p>
            Target Variable{" "}
            <span className="font-bold tracking-wide text-primary-btn text-lg">
              {whatKind && `(${whatKind})`}
            </span>{" "}
          </p>
          <SingleDropDown
            columnNames={columnNames}
            onValueChange={setTargetVariable}
          />
        </div>
        <div className="w-full">
          <p>Stratify</p>
          <SingleDropDown
            columnNames={["-", ...columnNames]}
            onValueChange={setStratify}
          />
        </div>
      </div>
      <div className="flex items-center mt-12 gap-8">
        <div className="w-full">
          <Input
            required
            label="Test Size"
            size="lg"
            fullWidth
            type="number"
            step={0.01}
            value={test_size}
            onChange={(e) => setTestSize(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Random State</p>
          <div className="mt-2">
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <span>0</span>
              <PrettoSlider
                aria-label="Random State Slider"
                min={0}
                max={1000}
                step={1}
                value={random_state}
                onChange={(e) => setRandomState(e.target.value)}
                valueLabelDisplay="on"
                color="primary"
              />
              <span>1000</span>
            </Stack>
          </div>
        </div>
        <Checkbox color="success" onChange={(e) => setShuffle(e.valueOf())}>
          Shuffle
        </Checkbox>
      </div>
      <div className="mt-12 flex  gap-4">
        <div className="w-full">
          <Input
            required
            label="Train Data Name"
            fullWidth
            color="success"
            size="xl"
            labelLeft="train_"
            value={trainDataName}
            onChange={(e) => setTrainDataName(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Input
            required
            label="Test Data Name"
            fullWidth
            size="xl"
            color="success"
            value={testDataName}
            onChange={(e) => setTestDataName(e.target.value)}
            labelLeft="test_"
          />
        </div>
        <div className="w-full">
          <Input
            required
            label="Splitted Dataset Name"
            fullWidth
            size="xl"
            helperColor="success"
            value={splittedName}
            onChange={(e) => setSplittedName(e.target.value)}
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

export default SplitDataset;

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 22,
    width: 22,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(90deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -0%) rotate(135deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(-135deg)",
    },
  },
});
