import { Input, Progress, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";

function ProgressiveFeature() {
  const [kFoldValue, setKFoldValue] = useState(2);
  const [option, setOption] = useState("None");
  const d_type = useSelector((state) => state.featureSelection.data_type);
  const ESTIMATOR =
    d_type === "number"
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
  const [loading, setLoading] = useState();
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev + 5 < 100) return prev + 5;
          return prev;
        });
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleChange = async e => {
    setOption(e);
    if(e === 'All') {

    } else if(e === 'None') {
      setData()
      setProgress(0)
    }
  }

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
          defaultValue={option}
          onChange={handleChange}
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
      {loading && (
        <div className="mt-6">
          <Progress
            value={progress}
            shadow
            color="success"
            status="secondary"
            striped
          />
        </div>
      )}
    </div>
  );
}

export default ProgressiveFeature;
