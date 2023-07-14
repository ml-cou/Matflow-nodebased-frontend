import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";
import { setData } from "../../../../../Slices/FeatureEngineeringSlice";

function Add_GroupNumerical({ csvData }) {
  const [nGroups, setNGroups] = useState(2);
  const columnNames = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "number"
  );
  const [nGroupData, setNGroupData] = useState([
    {
      min_value: 0,
      max_value: 0,
      operator: "==",
      value: 0,
      bin_value: 0,
      use_operator: false,
    },
    {
      min_value: 0,
      max_value: 0,
      operator: "==",
      value: 0,
      bin_value: 0,
      use_operator: false,
    },
  ]);
  const [bin_column, setBin_column] = useState("");
  const [show_bin_dict, setShow_bin_dict] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setData({
        bin_column,
        show_bin_dict,
        n_groups: nGroups,
        n_group_data: nGroupData,
      })
    );
  }, [bin_column, show_bin_dict, nGroups, nGroupData, dispatch]);

  const handleValueChange = (e, ind, key) => {
    const tempNGroupData = nGroupData.map((val, i) => {
      if (i === ind) return { ...val, [key]: e };
      return val;
    });
    setNGroupData(tempNGroupData);
  };

  return (
    <div>
      <div className="flex gap-8 mb-4">
        <Input
          label="N Groups"
          value={nGroups}
          onChange={(e) => {
            const val = e.target.value;
            setNGroups(val);
            if (val < nGroupData.length)
              setNGroupData(nGroupData.slice(0, val));
            else {
              const temp = JSON.parse(JSON.stringify(nGroupData));
              while (val - temp.length > 0) {
                temp.push({
                  min_value: 0,
                  max_value: 0,
                  operator: "==",
                  value: 0,
                  bin_value: 0,
                  use_operator: false,
                });
              }
              setNGroupData(temp);
            }
          }}
          type="number"
        />
        <div className="flex-grow">
          <p>Bin Column</p>
          <SingleDropDown
            columnNames={columnNames}
            onValueChange={setBin_column}
          />
        </div>
        <Checkbox
          color="success"
          onChange={(e) => setShow_bin_dict(e.valueOf())}
        >
          Show Bin Dict
        </Checkbox>
      </div>
      <div className="mt-8">
        {nGroupData.map((val, index) => {
          return (
            <div key={index} className="flex gap-8 mt-4">
              <div className="flex w-full gap-8">
                {val.use_operator ? (
                  <>
                    <div className="w-full flex flex-col">
                      <label htmlFor="" className="mb-2 text-sm">
                        Operator
                      </label>
                      <select
                        name=""
                        id=""
                        className="p-2 rounded-lg"
                        value={val.operator}
                        onChange={(e) =>
                          handleValueChange(e.target.value, index, "operator")
                        }
                      >
                        <option value="==">==</option>
                        <option value="!=">!=</option>
                        <option value="<">{"<"}</option>
                        <option value=">">{">"}</option>
                        <option value="<=">{"<="}</option>
                        <option value=">=">{">="}</option>
                      </select>
                    </div>
                    <Input
                      label="Value"
                      type="number"
                      value={val.value}
                      fullWidth
                      onChange={(e) =>
                        handleValueChange(e.target.value, index, "value")
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Min Value"
                      type="number"
                      fullWidth
                      value={val.min_value}
                      onChange={(e) =>
                        handleValueChange(e.target.value, index, "min_value")
                      }
                    />
                    <Input
                      label="Max Value"
                      type="number"
                      fullWidth
                      value={val.max_value}
                      onChange={(e) =>
                        handleValueChange(e.target.value, index, "max_value")
                      }
                    />
                  </>
                )}
                <Input
                  label="Bin Value"
                  type="number"
                  fullWidth
                  value={val.bin_value}
                  onChange={(e) =>
                    handleValueChange(e.target.value, index, "bin_value")
                  }
                />
              </div>
              <Checkbox
                color="success"
                className="w-60"
                onChange={(e) =>
                  handleValueChange(e.valueOf(), index, "use_operator")
                }
              >
                Use Operator
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Add_GroupNumerical;
