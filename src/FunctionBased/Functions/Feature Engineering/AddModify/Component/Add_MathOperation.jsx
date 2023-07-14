import { Textarea } from "@nextui-org/react";
import React from "react";
import { useDispatch } from "react-redux";
import { setData } from "../../../../../Slices/FeatureEngineeringSlice";

function Add_MathOperation({ csvData }) {
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    let tempData = {
      new_value_operation: e.target.value,
    };
    dispatch(setData(tempData));
  };
  return (
    <div>
      <p>New Value Operation</p>
      <Textarea fullWidth minRows={6} onChange={handleInputChange} />
      <p className="flex flex-col text-sm text-gray-500 tracking-wide mt-1">
        <span>{"<math expression> <column name>. example: 10 ** Height"}</span>
        <span>Separate all expression with space (including parenthesis).</span>
        <span>Example: Weight / ( Height ** 2 )</span>
      </p>
    </div>
  );
}

export default Add_MathOperation;
