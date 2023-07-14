import { Checkbox, Input } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import SingleDropDown from "../../../../FunctionBased/Components/SingleDropDown/SingleDropDown";

function PiePlot() {
  const [showTitle, setShowTitle] = useState(false);
  const [title, setTitle] = useState();
  const [titleValue, setTitleValue] = useState("");
  const [label, setLabel] = useState(true);
  const [percentage, setPercentage] = useState(true);
  const gapRef = useRef();
  const [gap, setGap] = useState(0);

  return (
    <div className="grid gap-4 mt-4">
      <div className="w-full">
        <p className=" tracking-wide">Categorical Variable</p>
        <SingleDropDown
          columnNames={["stringColumn"]}
          //   onValueChange={setActiveStringColumn}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="" className="tracking-wide">
          Explode Value
        </label>
        <Input
          ref={gapRef}
          type="number"
          bordered
          min={0}
          max={0.1}
          color="success"
          placeholder="Expected value (0 - 0.1)."
          step={"0.01"}
          helperText="Press Enter to apply"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setGap(gapRef.current.value);
            }
          }}
        />
      </div>

      <div className="flex items-center gap-4 mt-4 tracking-wider">
        <Checkbox color="primary" onChange={(e) => setShowTitle(e.valueOf())}>
          Title
        </Checkbox>
        <Checkbox
          color="primary"
          isSelected={label}
          onChange={() => setLabel(!label)}
        >
          Label
        </Checkbox>
        <Checkbox
          color="primary"
          isSelected={percentage}
          onChange={() => setPercentage(!percentage)}
        >
          Percentage
        </Checkbox>
      </div>
      {showTitle && (
        <div className="mt-4">
          <Input
            clearable
            bordered
            size="lg"
            label="Input Title"
            placeholder="Enter your desired title"
            fullWidth
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            helperText="Press Enter to apply"
            onKeyDown={(e) => {
              if (e.key === "Enter") setTitle(titleValue);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PiePlot;
