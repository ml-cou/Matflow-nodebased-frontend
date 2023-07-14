import { Checkbox, Input } from "@nextui-org/react";
import React, { useState } from "react";
import SingleDropDown from "../../../../FunctionBased/Components/SingleDropDown/SingleDropDown";

function ViolinPlot() {
  const [showTitle, setShowTitle] = useState(false);
  const [title, setTitle] = useState();
  const [dodge, setDodge] = useState(false);
  const [split, setSplit] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  return (
    <div className="grid gap-4 mt-4">
      <div className="w-full">
        <p className=" tracking-wide">Numerical Variable</p>
        <SingleDropDown
          columnNames={["numberColumn"]}
          // onValueChange={setActiveNumberColumn}
        />
      </div>
      <div className="w-full">
        <p className=" tracking-wide">Categorical Variable</p>
        <SingleDropDown
          columnNames={["stringColumn"]}
          //   onValueChange={setActiveStringColumn}
        />
      </div>

      <div className="w-full">
        <p className=" tracking-wide">Hue</p>
        <SingleDropDown
          //   onValueChange={["setActiveHueColumn"]}
          columnNames={["stringColumn"]}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <p>Orientation</p>
        <SingleDropDown columnNames={["Vertical", "Horizontal"]} />
      </div>
      <div className="flex items-center gap-4 mt-4 tracking-wider">
        <Checkbox color="primary" onChange={(e) => setShowTitle(e.valueOf())}>
          Title
        </Checkbox>
        <Checkbox color="success" onChange={(e) => setDodge(e.valueOf())}>
          Dodge
        </Checkbox>
        <Checkbox color="success" onChange={(e) => setSplit(e.valueOf())}>
          Split
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

export default ViolinPlot;
