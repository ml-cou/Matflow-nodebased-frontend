import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromIndexedDB } from "../../util/indexDB";
import SingleDropDown from "../../Components/SingleDropDown/SingleDropDown";
import MultipleDropDown from "../../Components/MultipleDropDown/MultipleDropDown";

function CustomPlot() {
  const [csvData, setCsvData] = useState();
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const [numberColumn, setNumberColumn] = useState([]);
  const [stringColumn, setStringColumn] = useState([]);
  const [x_var, setX_var] = useState([])
  const [y_bar, setY_var] = useState('')
  const [activeHue, setActiveHue] = useState('')

  useEffect(() => {
    if (activeCsvFile && activeCsvFile.name) {
      const getData = async () => {
        const res = await fetchDataFromIndexedDB(activeCsvFile.name);
        setCsvData(res);

        const tempStringColumn = [];
        const tempNumberColumn = [];

        Object.entries(res[0]).forEach(([key, value]) => {
          if (typeof res[0][key] === "string") tempStringColumn.push(key);
          else tempNumberColumn.push(key);
        });

        setStringColumn(tempStringColumn);
        setNumberColumn(tempNumberColumn);
      };

      getData();
    }
  }, [activeCsvFile]);

  return (
    <div>
      <div className="flex items-center gap-8 mt-8">
        <div className="w-full">
          <p className="text-lg font-medium tracking-wide">X Variable</p>
          <MultipleDropDown columnNames={numberColumn} setSelectedColumns={setX_var} />
        </div>
        <div className="w-full">
          <p className="text-lg font-medium tracking-wide">Y Variable</p>
          <SingleDropDown columnNames={numberColumn} onValueChange={setY_var}  />
        </div>
        <div className="w-full flex flex-col tracking-wider">
          <p className="text-lg font-medium tracking-wide">Hue Variable</p>
          <SingleDropDown columnNames={stringColumn} onValueChange={setActiveHue}  />
        </div>
      </div>
    </div>
  );
}

export default CustomPlot;
