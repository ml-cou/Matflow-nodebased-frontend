import { Input, Radio } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";
import { setData } from "../../../../../Slices/FeatureEngineeringSlice";

function Add_NewColumn({ csvData }) {
  const [select_methods, setMethod] = useState("Input String");
  const columnNames = Object.keys(csvData[0]);
  const [input_string, setInputString] = useState("");
  const [select_field, setSelectField] = useState(columnNames[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setData({
        select_methods,
        input_string,
        select_field,
      })
    );
  }, [select_field, select_methods, input_string, dispatch]);

  return (
    <div>
      <div>
        <Radio.Group
          orientation="vertical"
          label="Select Methods"
          defaultValue={select_methods}
          onChange={(e) => setMethod(e)}
        >
          <Radio value="Input String" color="success">
            Input String
          </Radio>
          <Radio value="Copy Another Field" color="success">
            Copy Another Field
          </Radio>
        </Radio.Group>
      </div>
      <div className="mt-4">
        {select_methods === "Input String" ? (
          <div className="">
            <Input
              label="Input String"
              fullWidth
              clearable
              value={input_string}
              onChange={(e) => setInputString(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <p>Select Field</p>
            <SingleDropDown
              columnNames={columnNames}
              onValueChange={setSelectField}
              initValue={columnNames[0]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Add_NewColumn;
