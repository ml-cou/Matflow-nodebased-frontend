import { Input, Radio } from "@nextui-org/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";

function ProgressiveFeature() {
  const [kFoldValue, setKFoldValue] = useState(2);
  const [method, setMethod] = useState("None");
  const featureSelection = useSelector(
    (state) => state.featureEngineering.feature_selection
  );
  const ESTIMATOR =
    featureSelection.data_type === "number"
      ? [
          "ExtraTreesRegressor",
          "RandomForestRegressor",
          "GradientBoostingRegressor",
          "XGBRegressor",
        ]
      : [
          "ExtraTreesClassifier",
          "RandomForestClassifier",
          "GradientBoostingClassifier",
          "XGBClassifier",
        ];
  const [estimator, setEstimator] = useState(ESTIMATOR[0]);

  return (
    <div className="mt-4">
      <div className="flex gap-8">
        <div className="w-full">
          <Input
            label="Enter the value for k-fold"
            fullWidth
            type="number"
            step={1}
            value={kFoldValue}
            onChange={(e) => setKFoldValue(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Select Estimator</p>
          <SingleDropDown
            columnNames={ESTIMATOR}
            initValue={estimator}
            onValueChange={setEstimator}
          />
        </div>
      </div>
      <div className="mt-4">
        <Radio.Group
          defaultValue={method}
          onChange={(e) => setMethod(e)}
          orientation="horizontal"
        >
          <Radio value="All" color="success">
            All
          </Radio>
          <Radio value="Custom" color="success">
            Custom
          </Radio>
          <Radio value="None" color="success">
            None
          </Radio>
        </Radio.Group>
      </div>
    </div>
  );
}

export default ProgressiveFeature;
