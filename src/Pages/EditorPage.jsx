import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, { Controls, Background, useNodesState, ReactFlowProvider, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import UploadFile from '../Components/UploadFile/UploadFile';
import ChartNode from '../Components/ChartNode/ChartNode';
import { useDispatch, useSelector } from 'react-redux';
import { removeImage } from '../Slices/ChartSlices';

const nodeTypes = {
  upload: UploadFile,
  chart: ChartNode
}

let id = 0;
const getId = () => `dndnode_${id++}`;

const initialNodes = [
  {id: getId(), type: 'upload', position: {x : 0, y : 0}}
];

function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const reactFlowWrapper = useRef(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const charImages = useSelector(state => state.charts.charts)
  const dispatch = useDispatch()

  // useEffect(() => {

  // }, [])

  const onConnect = useCallback((params) => setEdges((eds) => {
    let image = charImages.filter(c => c.id === params.source)[0]
    if(image) {
      image = image.imageUrl
      let tempNode = nodes.filter(n => n.id === params.target)[0];
      tempNode = {...tempNode, data: {imageUrl : image}}
      console.log(tempNode)
      const changedNode = nodes.filter(n => n.id !== params.target);
      changedNode.push(tempNode);
      setNodes(changedNode);
    }
    
    return addEdge(params, eds);
  }), [charImages, nodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodesDelete = (e) => {
    // console.log(e[0].id)
    dispatch(removeImage(e[0].id))
  }

  return (
    <div className=" flex flex-col md:flex-row flex-1 h-screen">
      <ReactFlowProvider>
      <Sidebar />
        <div className="reactflow-wrapper h-screen md:h-[unset] flex-grow" ref={reactFlowWrapper}>
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
            fitView
            onNodesDelete={onNodesDelete}
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default EditorPage;
