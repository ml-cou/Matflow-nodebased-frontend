import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import React from "react";
import {
  AiOutlineFile,
  AiOutlineGroup,
  AiOutlineLineChart,
  AiOutlineMergeCells,
} from "react-icons/ai";
import { BiStats, BiText } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { GrTableAdd } from "react-icons/gr";
import { HiOutlineDocumentDuplicate, HiOutlinePuzzle } from "react-icons/hi";
import { RiFileEditLine } from "react-icons/ri";
import { RxRocket } from "react-icons/rx";
import { TbCirclesRelation } from "react-icons/tb";

export const FEATURE_ENGINEERING = [
  {
    key: "2-0",
    label: "Add/Modify",
    icon: <RiFileEditLine className="text-[rgba(0,0,0,0.54)]" size={"20"} />,
  },
  {
    key: "2-1",
    label: "Change Dtype",
    icon: <AutoFixHighOutlinedIcon color="action" />,
  },
  {
    key: "2-2",
    label: "Alter Field Name",
    icon: <TextFieldsOutlinedIcon color="action" />,
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
    label: "Drop Column/Rows",
    icon: <RemoveCircleOutlineOutlinedIcon color="action" />,
  },
  {
    key: "2-9",
    label: "Append Dataset",
    icon: <GrTableAdd className="opacity-70" size={"20"} />,
  },
  {
    key: "2-10",
    label: "Merge Dataset",
    icon: (
      <AiOutlineMergeCells className="text-[rgba(0,0,0,0.54)]" size={"20"} />
    ),
  },
  {
    key: "2-11",
    label: "Feature Selection",
  },
  {
    key: "2-12",
    label: "Cluster",
  },
];

export const DATASET_NODES = [
  {
    key: "0-1",
    icon: <InfoOutlinedIcon color="action" />,
    label: "Information",
  },
  {
    key: "0-2",
    label: "Statistics",
    icon: <BiStats size={20} className="text-[rgba(0,0,0,0.54)]" />,
  },
  {
    key: "0-3",
    label: "Corelation",
    icon: <TbCirclesRelation size={20} className="text-[rgba(0,0,0,0.54)]" />,
  },
  {
    key: "0-4",
    label: "Duplicate",
    icon: (
      <HiOutlineDocumentDuplicate
        size={20}
        className="text-[rgba(0,0,0,0.54)]"
      />
    ),
  },
  {
    key: "0-5",
    label: "Group",
    icon: <AiOutlineGroup size={20} className="text-[rgba(0,0,0,0.54)]" />,
  },
];

export const MODEL_BUILDING = [
  {
    key: "5-0",
    label: "Split Dataset",
    icon: <SplitscreenIcon color="action" />,
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
    label: "Hyper-parameter Optimization",
  },
];

export const FUNCTION_NODES = [
  {
    key: "1",
    label: "EDA",
    icon: <InsertChartOutlinedIcon color="action" />,
    children: [],
  },

  // {
  //   key: "3",
  //   label: "Final Dataset",
  //   icon: (
  //     <HiOutlineDocumentReport
  //       className="text-[rgba(0,0,0,0.54)]"
  //       size={"20"}
  //     />
  //   ),
  //   children: [],
  // },
  // {
  //   key: "4",
  //   label: "Pipeline",
  //   icon: <RiFlowChart className="text-[rgba(0,0,0,0.54)]" size={"20"} />,
  //   children: [],
  // },
  {
    key: "6",
    label: "Model Deployment",
    icon: <RxRocket className="text-[rgba(0,0,0,0.54)]" size={"20"} />,
    children: [],
  },
  {
    key: "7",
    label: "Time Series Analysis",
    icon: (
      <AiOutlineLineChart className="text-[rgba(0,0,0,0.54)]" size={"20"} />
    ),
    children: [],
  },
  {
    key: "8",
    label: "ReverseML",
    icon: <HiOutlinePuzzle className="text-[rgba(0,0,0,0.54)]" size={"20"} />,
    children: [],
  },
];

export const IO_NODES = [
  {
    key: "0-0-1",
    label: "Upload File",
    icon: <CloudUploadOutlinedIcon color="action" />,
  },
  {
    key: "0-0-2",
    label: "Graph",
    icon: <AutoGraphOutlinedIcon color="action" />,
  },
  {
    key: "0-0-3",
    label: "Table",
    icon: <BsTable className="text-[rgba(0,0,0,0.54)]" size={20} />,
  },
  {
    key: "0-0-4",
    label: "Test-Train Dataset",
  },
  {
    key: "0-0-5",
    label: "Model",
  },
  {
    key: "0-0-6",
    label: "Text",
    icon: <BiText className="text-[rgba(0,0,0,0.54)]" size={20} />,
  },
  {
    key: "0-0-7",
    label: "File",
    icon: <AiOutlineFile className="text-[rgba(0,0,0,0.54)]" size={20} />,
  },
];

export let NODES = {
  "Upload File": [
    "Table",
    ...DATASET_NODES.map((val) => val.label),
    ...FUNCTION_NODES.map((val) => val.label),
    ...FEATURE_ENGINEERING.map((val) => val.label),
    "Split Dataset",
  ],
  Graph: [],
  Table: [],
  Text: [],
  File: [
    "Table",
    ...DATASET_NODES.map((val) => val.label),
    ...FUNCTION_NODES.map((val) => val.label),
    ...FEATURE_ENGINEERING.map((val) => val.label),
    "Split Dataset",
  ],
  EDA: ["Graph"],
  ReverseML: ["Table"],
  "Time Series Analysis": ["Graph"],
  "Model Deployment": ["Table", "Text"],
  "Split Dataset": ["Test-Train Dataset"],
  "Test-Train Dataset": ["Build Model", "Hyper-parameter Optimization", "File"],
  "Hyper-parameter Optimization": ["Build Model"],
  "Build Model": ["Model"],
  Model: ["Model Deployment", "Model Evaluation", "Model Prediction"],
  "Model Evaluation": ["Table", "Graph"],
  "Model Prediction": ["Graph", "Table", "Text"],
};

DATASET_NODES.forEach((val) => {
  if (val.label === "Corelation")
    NODES = { ...NODES, [val.label]: ["Table", "Graph"] };
  else NODES = { ...NODES, [val.label]: ["Table"] };
});

FEATURE_ENGINEERING.forEach((val) => {
  if (val.label === "Cluster" || val.label === "Feature Selection")
    NODES = { ...NODES, [val.label]: ["Table", "Graph"] };
  else NODES = { ...NODES, [val.label]: ["File"] };
});
