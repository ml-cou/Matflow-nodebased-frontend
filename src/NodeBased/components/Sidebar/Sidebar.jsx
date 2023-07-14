import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import { Collapse } from "@nextui-org/react";
import { AiOutlineGroup, AiOutlineLineChart } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentReport,
  HiOutlinePuzzle,
} from "react-icons/hi";
import { RiFlowChart } from "react-icons/ri";
import { RxRocket } from "react-icons/rx";
import { TbCirclesRelation } from "react-icons/tb";
const FUNCTION_NODES = [
  {
    key: "0",
    label: "Dataset",
    // icon: <MdOutlineDataset size={"20"} />,
    children: [
      {
        key: "0-1",
        icon: <InfoOutlinedIcon color="action" />,
        label: "Information",
      },
      {
        key: "0-2",
        label: "Statistics",
        icon: <BiStats size={20} />,
      },
      {
        key: "0-3",
        label: "Corelation",
        icon: <TbCirclesRelation size={20} />,
      },
      {
        key: "0-4",
        label: "Duplicate",
        icon: <HiOutlineDocumentDuplicate size={20} />,
      },
      {
        key: "0-5",
        label: "Group",
        icon: <AiOutlineGroup size={20} />,
      },
    ],
  },
  {
    key: "1",
    label: "EDA",
    icon: <InsertChartOutlinedIcon color="action" />,
    children: [],
  },
  {
    key: "2",
    label: "Feature Engineering",
    // icon: <RxGear size={"20"} />,
    children: [
      {
        key: "2-0",
        label: "Add/Modify",
        icon: <SettingsSuggestOutlinedIcon color="action" />,
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
    icon: (
      <HiOutlineDocumentReport
        className="text-[rgba(0,0,0,0.54)]"
        size={"25"}
      />
    ),
    children: [],
  },
  {
    key: "4",
    label: "Pipeline",
    icon: <RiFlowChart className="text-[rgba(0,0,0,0.54)]" size={"25"} />,
    children: [],
  },
  {
    key: "5",
    label: "Model Building",
    // icon: <TbBrain className='text-[rgba(0,0,0,0.54)]' size={"20"} />,
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
    icon: <RxRocket className="text-[rgba(0,0,0,0.54)]" size={"25"} />,
    children: [],
  },
  {
    key: "7",
    label: "Time Series Analysis",
    icon: (
      <AiOutlineLineChart className="text-[rgba(0,0,0,0.54)]" size={"25"} />
    ),
    children: [],
  },
  {
    key: "8",
    label: "ReverseML",
    icon: <HiOutlinePuzzle className="text-[rgba(0,0,0,0.54)]" size={"25"} />,
    children: [],
  },
];

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full grid place-items-center w-96">
      <aside className="bg-white h-full w-full p-4 border-l-2 shadow-2xl ">
        <h3 className="font-bold  text-3xl mb-2">Node Packet</h3>
        <p className=" mb-4">Drag and Drop nodes onto your editor.</p>
        <div className="grid gap-4">
          <Collapse.Group bordered>
            <Collapse
              title={
                <h1 className="font-medium tracking-wider">
                  Input/Output Nodes
                </h1>
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <button
                  className="grid gap-1 place-items-center border-2 px-2 py-3 rounded-md shadow text-sm "
                  onDragStart={(event) => onDragStart(event, "upload")}
                  draggable
                >
                  <CloudUploadOutlinedIcon color="action" />
                  <span>Upload File</span>
                </button>
                <button
                  className="grid gap-1 place-items-center border-2 px-2 py-3 rounded-md shadow text-sm "
                  onDragStart={(event) => onDragStart(event, "output_graph")}
                  draggable
                >
                  <AutoGraphOutlinedIcon color="action" />
                  <span>Graph</span>
                </button>
                <button
                  className="grid gap-1 place-items-center border-2 px-2 py-3 rounded-md shadow text-sm "
                  onDragStart={(event) => onDragStart(event, "output_table")}
                  draggable
                >
                  <BsTable className="text-[rgba(0,0,0,0.54)]" size={20} />
                  <span>Table</span>
                </button>
              </div>
            </Collapse>
          </Collapse.Group>
          <Collapse.Group bordered>
            <Collapse
              title={
                <h1 className="font-medium tracking-wider">Function Nodes</h1>
              }
            >
              <div className="grid grid-cols-3 gap-4">
                {FUNCTION_NODES.map((node) => {
                  if (node.children.length === 0) {
                    return (
                      <button
                        key={node.key}
                        className="grid gap-1 place-items-center border-2 px-2 py-3 rounded-md shadow text-sm "
                        onDragStart={(event) => onDragStart(event, node.label)}
                        draggable
                      >
                        {node.icon && <span>{node.icon}</span>}
                        <span>{node.label}</span>
                      </button>
                    );
                  }
                })}
              </div>
            </Collapse>
          </Collapse.Group>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

// {FUNCTION_NODES.map((node) => {
//   if (node.children.length > 0)
//     return (
//       <Collapse.Group key={node.key} bordered>
//         <Collapse
//           title={
//             <h1 className="font-medium tracking-wider">
//               {node.label} Nodes
//             </h1>
//           }
//         >
//           <div className="grid grid-cols-3 gap-4">
//             {node.children.map((child) => (
//               <button
//                 key={child.key}
//                 className="grid gap-1 place-items-center border-2 px-2 py-3 rounded-md shadow text-sm "
//                 onDragStart={(event) =>
//                   onDragStart(event, child.label)
//                 }
//                 draggable
//               >
//                 {child.icon && <span>{child.icon}</span>}
//                 <span>{child.label}</span>
//               </button>
//             ))}
//           </div>
//         </Collapse>
//       </Collapse.Group>
//     );
// })}
