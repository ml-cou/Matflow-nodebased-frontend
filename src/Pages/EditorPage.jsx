import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Panel,
  addEdge,
  useEdges,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import ChartNode from "../NodeBased/CustomNodes/ChartNode/ChartNode";
import EDANode from "../NodeBased/CustomNodes/EDANode/EDANode";
import TableNode from "../NodeBased/CustomNodes/TableNode/TableNode";
import UploadFile from "../NodeBased/CustomNodes/UploadFile/UploadFile";
import Sidebar from "../NodeBased/components/Sidebar/Sidebar";
import { handleOutputTable, handlePlotOptions } from "../util/NodeFunctions";

const nodeTypes = {
  upload: UploadFile,
  output_graph: ChartNode,
  output_table: TableNode,
  EDA: EDANode,
};

const initialNodes = [
  {
    id: uuid(),
    type: "upload",
    position: {
      x: 100,
      y: window.innerHeight / 2 - 200,
    },
  },
];

function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const reactFlowWrapper = useRef(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const rflow = useReactFlow();
  const edgeList = useEdges();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: uuid(),
        type,
        position,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodesDelete = (e) => {
    // console.log(e[0].id)
  };

  const onEdgesDelete = (e) => {
    // console.log(e)
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === e[0].target) return { ...val, data: undefined };
      return val;
    });
    console.log(tempNodes);
    rflow.setNodes(tempNodes);
  };

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem("flow"));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        rflow.setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, rflow.setViewport]);

  useEffect(() => {
    onRestore();
  }, []);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flow", JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onConnect = useCallback(
    async (params) => {
      const typeSource = rflow.getNode(params.source).type;
      const typeTarget = rflow.getNode(params.target).type;
      if (
        typeTarget === "output_table" ||
        typeTarget === "EDA" ||
        typeTarget === "output_graph"
      ) {
        const temp = edgeList.filter((val) => val.target === params.target);
        if (temp && temp.length > 0) {
          toast.error(`Connection limit of ${typeTarget} node is 1`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      }

      if (typeSource === "upload" && typeTarget === "output_table") {
        const ok = await handleOutputTable(rflow, params);
        if (!ok) return;
      }

      if (typeSource === "upload" && typeTarget === "EDA") {
        const ok = await handleOutputTable(rflow, params);
        if (!ok) return;
      }

      if (typeSource === "EDA" && typeTarget === "output_graph") {
        console.log(rflow);
        const ok = await handlePlotOptions(rflow, params);
        if (!ok) return;
      }

      setEdges((eds) => {
        const temp = {
          ...params,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: "#000",
          },
          style: { strokeWidth: 2, stroke: "#000" },
        };
        return addEdge(temp, eds);
      });
    },

    [nodes, rflow, edgeList]
  );

  return (
    <div className=" flex flex-col md:flex-row flex-1 h-screen bg-slate-200">
      <Sidebar />
      <div
        className="reactflow-wrapper h-full flex-grow"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          // fitView
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
        >
          <Background
            color="grey"
            variant={"dots"}
            gap={15}
            className="bg-slate-100"
          />
          <Panel position="top-right">
            <button
              className="bg-white p-3 px-6 tracking-wider font-medium shadow-lg rounded border-2 border-black"
              onClick={onSave}
            >
              Save
            </button>
          </Panel>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default EditorPage;
