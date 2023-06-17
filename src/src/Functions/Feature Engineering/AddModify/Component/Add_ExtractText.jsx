import { Textarea } from "@nextui-org/react";
import React from "react";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";

function Add_ExtractText({ csvData }) {
  const stringColumns = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "string"
  );

  return (
    <div className="flex gap-8 mb-10">
      <div className="w-[70%]">
        <Textarea
          label="Regex Pattern"
          helperText="Example: ([A-Za-z]+)\."
          fullWidth
          minRows={6}
        />
      </div>
      <div className="w-[30%]">
        <p>Extract From</p>
        <SingleDropDown columnNames={stringColumns} />
      </div>
    </div>
  );
}

export default Add_ExtractText;
