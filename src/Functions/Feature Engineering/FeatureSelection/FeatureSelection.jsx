import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleDropDown from "../../../Components/SingleDropDown/SingleDropDown";
import { setFeatureSelection } from "../../../Slices/FeatureEngineeringSlice";
import BestOverallFeature from "./components/BestOverallFeature";
import MutualInformation from "./components/MutualInformation";
import ProgressiveFeature from "./components/ProgressiveFeature";
import SelectKBest from "./components/SelectKBest";

const SELECTION_METHOD = [
  "Best Overall Features",
  "SelectKBest",
  "Mutual Information",
  "Progressive Feature Selection with Cross-Validation",
];

function FeatureSelection({ csvData }) {
  const allColumnNames = Object.keys(csvData[0]);
  const [target_variable, setTargetVariable] = useState("");
  const [selection_method, setSelectionMethod] = useState("");
  const dispatch = useDispatch();

  return (
    <div className="mt-8">
      <div>
        <p>Target Variable</p>
        <SingleDropDown
          columnNames={allColumnNames}
          onValueChange={(e) => {
            setTargetVariable(e);
            setSelectionMethod(SELECTION_METHOD[0]);
            dispatch(
              setFeatureSelection({
                target_variable: e,
                data_type: typeof csvData[0][e],
              })
            );
          }}
        />
      </div>
      {target_variable && (
        <div className="mt-4">
          <p>Select feature selection method:</p>
          <SingleDropDown
            columnNames={SELECTION_METHOD}
            initValue={SELECTION_METHOD[0]}
            onValueChange={setSelectionMethod}
          />
        </div>
      )}
      {selection_method === SELECTION_METHOD[0] && (
        <BestOverallFeature csvData={csvData} />
      )}
      {selection_method === SELECTION_METHOD[1] && (
        <SelectKBest csvData={csvData} />
      )}
      {selection_method === SELECTION_METHOD[2] && (
        <MutualInformation csvData={csvData} />
      )}
      {selection_method === SELECTION_METHOD[3] && (
        <ProgressiveFeature csvData={csvData} />
      )}
    </div>
  );
}

export default FeatureSelection;
