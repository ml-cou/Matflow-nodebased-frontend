import React from "react";
import { fetchDataFromIndexedDB, updateDataInIndexedDB } from "./util/indexDB";

const FilterableList = () => {
  const aa = async () => {
    await fetchDataFromIndexedDB("splittedDatasetName");
    await updateDataInIndexedDB("splittedDatasetName", [
      { ahnaf: ["file1", "file2"] },
    ]);
  };

  const bb = async () => {
    const temp = await fetchDataFromIndexedDB("splittedDatasetName");
    console.log(temp);
  };
  return (
    <div className="px-16">
      <button onClick={aa}>aa</button>
      <button onClick={bb}>bb</button>
    </div>
  );
};

export default FilterableList;
