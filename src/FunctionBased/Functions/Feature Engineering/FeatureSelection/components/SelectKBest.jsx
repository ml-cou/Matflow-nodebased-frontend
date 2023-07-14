import styled from "@emotion/styled";
import { Slider, Stack } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";

function SelectKBest({ csvData }) {
  const allNumberColumn = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "number"
  );
  const featureSelection = useSelector(
    (state) => state.featureEngineering.feature_selection
  );
  const [feature_number, setFeatureNumber] = useState(1);
  const [score_function, setScoreFunction] = useState(
    featureSelection.data_type === "number" ? "f_regression" : "f_classif"
  );
  const [display_type, setDisplayType] = useState("Table");

  return (
    <div className="mt-4">
      <div className="flex items-center gap-8">
        <div className="w-full">
          <p>Select number of features to keep:</p>
          <div className="mt-12">
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <span>1</span>
              <PrettoSlider
                aria-label="Auto Bin Slider"
                min={1}
                max={allNumberColumn.length}
                step={1}
                defaultValue={1}
                value={feature_number}
                onChange={(e) => setFeatureNumber(e.target.value)}
                valueLabelDisplay="on"
                color="primary"
              />
              <span>{allNumberColumn.length}</span>
            </Stack>
          </div>
        </div>
        <div className="w-full">
          <p>Select Score Function:</p>
          <SingleDropDown
            columnNames={
              featureSelection.data_type === "number"
                ? ["f_regression", "mutual_info_regression"]
                : ["f_classif", "mutual_info_classif"]
            }
            initValue={score_function}
            onValueChange={setScoreFunction}
          />
        </div>
      </div>
      {featureSelection.data_type === "string" && (
        <div className="mt-4">
          <p>Display Type</p>
          <SingleDropDown
            columnNames={["Graph", "Table"]}
            initValue={"Table"}
            onValueChange={setDisplayType}
          />
        </div>
      )}
    </div>
  );
}

export default SelectKBest;

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
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
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});
