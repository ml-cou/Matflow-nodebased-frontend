import { Input, Radio } from "@nextui-org/react";
import React, { useState } from "react";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";

function Add_NewColumn({ csvData }) {
  const [method, setMethod] = useState("input");
  const columnNames = Object.keys(csvData[0]);
  
  return (
    <div>
      <div>
        <Radio.Group
          orientation="vertical"
          label="Select Methods"
          defaultValue={method}
          onChange={(e) => setMethod(e)}
        >
          <Radio value="input" color="success">
            Input String
          </Radio>
          <Radio value="copy" color="success">
            Copy Another Field
          </Radio>
        </Radio.Group>
      </div>
      <div className="mt-4">
        {method === "input" ? (
          <div className="">
            <Input label="Input String" fullWidth clearable />
          </div>
        ) : (
          <div>
            <p>Select Field</p>
            <SingleDropDown columnNames={columnNames} />
          </div>
        )}
      </div>
      
    </div>
  );
}

export default Add_NewColumn;
