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
    children: [
      {
        key: "1-0",
        label: "Bar Plot",
      },
      {
        key: "1-1",
        label: "Pie Plot",
      },
      {
        key: "1-2",
        label: "Count Plot",
      },
      {
        key: "1-3",
        label: "Histogram",
      },
      {
        key: "1-4",
        label: "Box Plot",
      },
      {
        key: "1-5",
        label: "Violin Plot",
      },
      {
        key: "1-6",
        label: "Scatter Plot",
      },
      {
        key: "1-7",
        label: "Reg Plot",
      },
      {
        key: "1-8",
        label: "Line Plot",
      },
      {
        key: "1-9",
        label: "Custom Plot",
      },
    ],
  },
  {
    key: "2",
    label: "Feature Engineering",
    icon: <RxGear size={"20"} />,
    children: [
      {
        key: "2-0",
        label: "Add/Modify",
      },
      {
        key: "2-1",
        label: "Change Dtype",
      },
      {
        key: "2-2",
        label: "Alter Field Name",
      },
      {
        key: "2-3",
        label: "Imputation",
      },
      {
        key: "2-4",
        label: "Encoding",
      },
      {
        key: "2-5",
        label: "Scaling",
      },
      {
        key: "2-6",
        label: "Drop Column",
      },
      {
        key: "2-7",
        label: "Drop Rows",
      },
      {
        key: "2-8",
        label: "Merge Dataset",
      },
      {
        key: "2-9",
        label: "Append Dataset",
      },
      {
        key: "2-10",
        label: "Feature Selection",
      },
      {
        key: "2-11",
        label: "Cluster",
      },
    ],
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
    children: [
      {
        key: "5-0",
        label: "Split Dataset",
      },
      {
        key: "5-1",
        label: "Build Model",
      },
      {
        key: "5-2",
        label: "Model Evaluation",
      },
      {
        key: "5-3",
        label: "Model Prediction",
      },
      {
        key: "5-4",
        label: "Models",
      },
    ],
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
    <div className="overflow-y-auto mt-4">
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
