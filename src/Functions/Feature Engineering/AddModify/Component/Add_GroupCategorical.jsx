import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MultipleDropDown from "../../../../Components/MultipleDropDown/MultipleDropDown";
import SingleDropDown from "../../../../Components/SingleDropDown/SingleDropDown";
import { setData } from "../../../../Slices/FeatureEngineeringSlice";

function Add_GroupCategorical({ csvData }) {
  const [nGroups, setNGroups] = useState(2);
  const columnNames = Object.keys(csvData[0]).filter(
    (val) => typeof csvData[0][val] === "number"
  );
  const [nGroupData, setNGroupData] = useState([
    {
      group_name: "",
      group_members: [],
      others: false,
    },
    {
      group_name: "",
      group_members: [],
      others: false,
    },
  ]);
  const [groupColumn, setGroupColumn] = useState("");
  const [groupMembers, setGroupMembers] = useState();
  const [sort_value, setSort_value] = useState(true);
  const [show_group, setShow_group] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setData({
        n_groups: nGroups,
        group_column: groupColumn,
        n_group_data: nGroupData,
        sort_value,
        show_group,
      })
    );
  }, [nGroups, nGroupData, sort_value, show_group, groupColumn, dispatch]);

  useEffect(() => {
    if (groupColumn) {
      let temp = csvData.map((val) => val[groupColumn].toString());
      let temp1 = new Set(temp);
      temp1 = [...temp1];
      // console.log(temp1)
      setGroupMembers(temp1);
    }

    // console.log('first')
  }, [groupColumn, csvData]);

  const handleChange = (e, ind) => {
    const temp = nGroupData.map((val, i) => {
      if (i === ind) {
        return { ...val, group_name: e.target.value };
      }
      return val;
    });
    setNGroupData(temp);
  };

  const handleMultipleDropdown = (colName, index = 0) => {
    const temp = nGroupData.map((val, i) => {
      if (i === index) {
        return { ...val, group_members: colName };
      }
      return val;
    });
    setNGroupData(temp);
  };

  const handleOtherChange = (val, ind) => {
    const temp = nGroupData.map((d, i) => {
      if (i === ind) {
        return { ...d, others: val };
      }
      return d;
    });
    setNGroupData(temp);
  };

  return (
    <div className="mt-12">
      <div className="flex gap-8 mb-4">
        <Input
          label="N Groups"
          value={nGroups}
          onChange={(e) => {
            const val = e.target.value;
            setNGroups(val);
            if (val < nGroupData.length) setNGroupData(nGroupData.slice(0, val));
            else {
              const temp = JSON.parse(JSON.stringify(nGroupData));
              while (val - temp.length > 0) {
                temp.push({
                  group_name: "",
                  group_members: [],
                  others: false,
                });
              }
              setNGroupData(temp);
            }
          }}
          type="number"
        />
        <div className="flex-grow">
          <p>Group Column</p>
          <SingleDropDown
            columnNames={columnNames}
            onValueChange={setGroupColumn}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Checkbox
            defaultSelected={true}
            color="success"
            onChange={(e) => setSort_value(e.valueOf())}
          >
            Sort Value
          </Checkbox>
          <Checkbox
            color="success"
            onChange={(e) => setShow_group(e.valueOf())}
          >
            Show Group
          </Checkbox>
        </div>
      </div>
      <div className="mt-8">
        {nGroupData.map((val, index) => {
          return (
            <div key={index} className="flex gap-8 mt-4 items-center ">
              <div>
                <Input
                  label="Group Name"
                  fullWidth
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="flex-grow">
                <p>Group Members</p>
                <MultipleDropDown
                  columnNames={groupMembers || []}
                  setSelectedColumns={handleMultipleDropdown}
                  curInd={index}
                  disabled={nGroupData[index].others}
                />
              </div>
              {index === nGroups - 1 && (
                <Checkbox
                  onChange={(e) => handleOtherChange(e.valueOf(), index)}
                >
                  Others
                </Checkbox>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Add_GroupCategorical;
