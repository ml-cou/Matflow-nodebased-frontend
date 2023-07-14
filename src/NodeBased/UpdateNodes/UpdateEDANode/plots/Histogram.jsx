import { Slider, Stack } from "@mui/material";
import { Checkbox, Input } from "@nextui-org/react";
import React, { useState } from "react";
import SingleDropDown from "../../../../FunctionBased/Components/SingleDropDown/SingleDropDown";
import styled from "styled-components";

const AGGREGATE = ["probability", "count", "frequency", "percent", "density"];

function Histogram() {
  const [showTitle, setShowTitle] = useState(false);
  const [title, setTitle] = useState();
  const [KDE, setKDE] = useState(false);
  const [legend, setLegend] = useState(false);
  const [showAutoBin, setShowAutoBin] = useState(true);
  const [autoBinValue, setAutoBinValue] = useState(10);
  const [titleValue, setTitleValue] = useState("");

  return (
    <div className="grid gap-4 mt-4">
      <div className="w-full">
        <p className=" tracking-wide">Variable</p>
        <SingleDropDown
          columnNames={["numberColumn"]}
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
      <div className="w-full">
        <p className=" tracking-wide">Aggregate Statistics</p>
        <SingleDropDown
          //   onValueChange={["setActiveHueColumn"]}
          columnNames={AGGREGATE}
          initValue={AGGREGATE[0]}
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
        <Checkbox
          color="success"
          isSelected={showAutoBin}
          onChange={(e) => setShowAutoBin(e.valueOf())}
        >
          Auto Bin
        </Checkbox>
        <Checkbox color="success" onChange={(e) => setKDE(e.valueOf())}>
          KDE
        </Checkbox>
        <Checkbox color="success" onChange={(e) => setLegend(e.valueOf())}>
          Legend
        </Checkbox>
      </div>
      {!showAutoBin && (
        <div className="mt-12">
          <Stack spacing={1} direction="row" sx={{ mb: 1 }} alignItems="center">
            <span>1</span>
            <PrettoSlider
              aria-label="Auto Bin Slider"
              min={1}
              max={35}
              step={1}
              defaultValue={10}
              value={autoBinValue}
              onChange={(e) => setAutoBinValue(e.target.value)}
              valueLabelDisplay="on"
              color="primary"
            />
            <span>35</span>
          </Stack>
        </div>
      )}
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

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default Histogram;
