import { Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";
import { setData } from "../../../../../Slices/FeatureEngineeringSlice";

function Add_ExtractText({ csvData }) {
  const data = useSelector((state) => state.featureEngineering.data);
  const stringColumns = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "string"
  );
  const [regex, setRegex] = useState("");
  const [extract_from, setExtract_from] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setData({...data, regex, extract_from}))
  }, [regex, extract_from, dispatch])

  return (
    <div className="flex gap-8 mb-10">
      <div className="w-[70%]">
        <Textarea
          label="Regex Pattern"
          helperText="Example: ([A-Za-z]+)\."
          fullWidth
          value={regex}
          onChange={(e) => {
            setRegex(e.target.value);
          }}
          minRows={6}
        />
      </div>
      <div className="w-[30%]">
        <p>Extract From</p>
        <SingleDropDown
          columnNames={stringColumns}
          onValueChange={setExtract_from}
        />
      </div>
    </div>
  );
}

export default Add_ExtractText;
