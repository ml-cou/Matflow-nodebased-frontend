import React, { useEffect, useState } from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { HiOutlineDocumentReport, HiOutlinePuzzle } from "react-icons/hi";
import { MdOutlineDataset } from "react-icons/md";
import { RiFlowChart } from "react-icons/ri";
import { RxGear, RxRocket } from "react-icons/rx";
import { SlMagnifier } from "react-icons/sl";
import { TbBrain } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFunction } from "../../Slices/SideBarSlice";
import TreeView from "../TreeView/TreeView";

const functionTreeData = [
  {
    key: "0",
    label: "Dataset",
    icon: <MdOutlineDataset size={"20"} />,
    children: [
      {
        key: "0-0",
        label: "Display",
      },
      {
        key: "0-1",
        label: "Information",
      },
      {
        key: "0-2",
        label: "Statistics",
      },
      {
        key: "0-3",
        label: "Corelation",
      },
      {
        key: "0-4",
        label: "Duplicate",
      },
      {
        key: "0-5",
        label: "Group",
      },
    ],
  },
  {
    key: "1",
    label: "EDA",
    icon: <SlMagnifier size={"20"} />,
    children: [],
  },
  {
    key: "2",
    label: "Feature Engineering",
    icon: <RxGear size={"20"} />,
    children: [],
  },
  {
    key: "3",
    label: "Final Dataset",
    icon: <HiOutlineDocumentReport size={"20"} />,
    children: [],
  },
  {
    key: "4",
    label: "Pipeline",
    icon: <RiFlowChart size={"20"} />,
    children: [],
  },
  {
    key: "5",
    label: "Model Building",
    icon: <TbBrain size={"20"} />,
    children: [],
  },
  {
    key: "6",
    label: "Model Deployment",
    icon: <RxRocket size={"20"} />,
    children: [],
  },
  {
    key: "7",
    label: "Time Series Analysis",
    icon: <AiOutlineLineChart size={"20"} />,
    children: [],
  },
  {
    key: "8",
    label: "ReverseML",
    icon: <HiOutlinePuzzle size={"20"} />,
    children: [],
  },
];

function FunctionTab() {
  const activeCsvFile = useSelector((state) => state.uploadedFile.activeFile);
  const dispatch = useDispatch();
  const [activeLeaf, setActiveLeaf] = useState(null);

  useEffect(() => {
    const storedActiveLeaf = localStorage.getItem(`activeFunction`);
    dispatch(setActiveFunction(storedActiveLeaf));
  }, [dispatch]);

  return (
    <div className=" mt-4">
      {activeCsvFile ? (
        <TreeView treeData={functionTreeData} setActiveLeaf={setActiveLeaf} />
      ) : (
        <p className="mt-4 p-2 text-center text-white tracking-wide font-bold text-lg">
          Please select a file to <br /> view the functions.
        </p>
      )}
    </div>
  );
}

export default FunctionTab;
