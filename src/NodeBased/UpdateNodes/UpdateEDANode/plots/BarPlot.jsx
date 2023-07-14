import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useReactFlow } from "reactflow";
import SingleDropDown from "../../../../FunctionBased/Components/SingleDropDown/SingleDropDown";

function BarPlot({ csvData, setPlotOption }) {
  const stringColumn = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "string"
  );
  const numberColumn = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "number"
  );
  const nodeId = useSelector((state) => state.EDA.nodeId);
  const rflow = useReactFlow();
  const [activeStringColumn, setActiveStringColumn] = useState("");
  const [activeNumberColumn, setActiveNumberColumn] = useState("");
  const [activeHueColumn, setActiveHueColumn] = useState("");
  const [orientation, setOrientation] = useState("Vertical");
  const [showTitle, setShowTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [title, setTitle] = useState();
  const [annotate, setAnnotate] = useState(false);

  useEffect(() => {
    const nodeDetails = rflow.getNode(nodeId);
    if (nodeDetails.data && nodeDetails.data.plotOption) {
      const temp = nodeDetails.data.plotOption;
      setActiveHueColumn(temp.hue);
      setActiveNumberColumn(temp.num);
      setActiveStringColumn(temp.cat);
      setOrientation(temp.orient);
      setTitle(temp.title);
      setAnnotate(temp.annote);
    }
  }, []);

  useEffect(() => {
    setPlotOption({
      cat: activeStringColumn || "-",
      num: activeNumberColumn || "-",
      hue: activeHueColumn || "-",
      orient: orientation,
      annote: annotate,
      title: title || "",
    });
  }, [
    activeNumberColumn,
    activeHueColumn,
    activeStringColumn,
    orientation,
    title,
    annotate,
  ]);

  return (
    <div className="grid gap-4 mt-4">
      <div className="w-full">
        <p className=" tracking-wide">Categorical Variable</p>
        <SingleDropDown
          columnNames={stringColumn}
          initValue={activeStringColumn}
          onValueChange={setActiveStringColumn}
        />
      </div>
      <div className="w-full">
        <p className=" tracking-wide">Numerical Variable</p>
        <SingleDropDown
          columnNames={numberColumn}
          initValue={activeNumberColumn}
          onValueChange={setActiveNumberColumn}
        />
      </div>
      <div className="w-full">
        <p className=" tracking-wide">Hue</p>
        <SingleDropDown
          columnNames={stringColumn}
          initValue={activeHueColumn}
          onValueChange={setActiveHueColumn}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <p>Orientation</p>
        <SingleDropDown
          columnNames={["Vertical", "Horizontal"]}
          onValueChange={setOrientation}
          initValue={orientation}
        />
      </div>
      <div className="flex items-center gap-4 mt-4 tracking-wider">
        <Checkbox color="primary" onChange={(e) => setShowTitle(e.valueOf())}>
          Title
        </Checkbox>
        <Checkbox
          color="primary"
          isSelected={annotate}
          onChange={(e) => setAnnotate(e.valueOf())}
        >
          Annotate
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
            value={title}
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

export default BarPlot;
