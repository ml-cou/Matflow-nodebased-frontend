import { Collapse } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai";
import { fetchDataFromIndexedDB } from "../../../util/indexDB";

function Models({ csvData }) {
  const [allTrainDataset, setAllTrainDataset] = useState();
  const [allModels, setAllModels] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetchDataFromIndexedDB("models");
      let temp = {};
      res.forEach((val) => {
        temp = { ...temp, ...val };
      });
      setAllModels(temp);
      res = res.map((val) => Object.keys(val)[0]);
      setAllTrainDataset(res);
    };

    fetchData();
  }, []);

  if (
    !allModels ||
    allModels.length === 0 ||
    !allTrainDataset ||
    allTrainDataset.length === 0
  )
    return <div className="mt-8 text-3xl font-medium tracking-wide">Build a model first...</div>;

  return (
    <div className="my-8">
      <Collapse.Group accordion bordered>
        {allTrainDataset &&
          allTrainDataset.map((val, ind) => (
            <Collapse
              expanded={ind === 0}
              key={ind}
              title={
                <h1 className="text-xl font-medium tracking-wider">{val}</h1>
              }
            >
              <div className="grid gap-4">
                {Object.keys(allModels[val]).map((d, index) => (
                  <div key={index} className="grid grid-cols-3">
                    <h1 className="tracking-wide">{d}</h1>
                    <button className="border w-32 justify-self-center  flex items-center justify-center py-2 bg-green-500 rounded text-white font-medium tracking-wider text-sm">
                      Download{" "}
                      <span className="ml-2">
                        {" "}
                        <AiOutlineDownload />
                      </span>{" "}
                    </button>
                    <button className="border w-32 justify-self-center  flex items-center justify-center py-2 bg-red-500 rounded text-white font-medium tracking-wider text-sm">
                      Delete{" "}
                      <span className="ml-2">
                        {" "}
                        <AiOutlineDelete />{" "}
                      </span>{" "}
                    </button>
                  </div>
                ))}
              </div>
            </Collapse>
          ))}
      </Collapse.Group>
    </div>
  );
}

export default Models;
