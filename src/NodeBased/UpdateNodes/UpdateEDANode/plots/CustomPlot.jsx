import React from "react";
import SingleDropDown from "../../../../FunctionBased/Components/SingleDropDown/SingleDropDown";

function CustomPlot() {
  return (
    <div className="grid gap-4 mt-4">
      <div className="w-full">
        <p className=" tracking-wide">X Variable</p>
        <SingleDropDown
          columnNames={["numberColumn"]}
          //   onValueChange={setActiveStringColumn}
        />
      </div>
      <div className="w-full">
        <p className=" tracking-wide">Y Variable</p>
        <SingleDropDown
          columnNames={["numberColumn"]}
          // onValueChange={setActiveNumberColumn}
        />
      </div>
      <div className="w-full">
        <p className=" tracking-wide">Hue</p>
        <SingleDropDown
          //   onValueChange={["setActiveHueColumn"]}
          columnNames={["stringColumn"]}
        />
      </div>
    </div>
  );
}

export default CustomPlot;
