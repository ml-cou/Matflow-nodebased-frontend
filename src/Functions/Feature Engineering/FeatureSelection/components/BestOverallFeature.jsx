import { Input, Radio } from "@nextui-org/react";
import React, { useState } from "react";

function BestOverallFeature({ csvData }) {
  const [kFoldValue, setKFoldValue] = useState(2);
  const [method, setMethod] = useState("None");

  return (
    <div className="mt-4">
      <div>
        <Input
          label="Enter the value for k-fold"
          fullWidth
          type="number"
          step={1}
          value={kFoldValue}
          onChange={(e) => setKFoldValue(e.target.value)}
        />
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

export default BestOverallFeature;
