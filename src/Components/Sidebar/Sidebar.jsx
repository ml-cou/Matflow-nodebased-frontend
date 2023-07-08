import { Collapse } from "@nextui-org/react";

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
        <Collapse.Group bordered>
          <Collapse
            title={
              <h1 className="font-medium tracking-wider">Input/Output Nodes</h1>
            }
          >
            <div className="grid grid-cols-3 gap-4">
              <button
                className="border-2 px-2 py-3 rounded-md shadow text-sm "
                onDragStart={(event) => onDragStart(event, "upload")}
                draggable
              >
                Upload File
              </button>
              <button
                className="border-2 px-2 py-3 rounded-md shadow text-sm "
                onDragStart={(event) => onDragStart(event, "output_graph")}
                draggable
              >
                Graph
              </button>
              <button
                className="border-2 px-2 py-3 rounded-md shadow text-sm "
                onDragStart={(event) => onDragStart(event, "output_table")}
                draggable
              >
                Table
              </button>
            </div>
          </Collapse>
        </Collapse.Group>
        {/* <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-white font-bold text-xl mb-3">Input Nodes</h3>
            <div className="flex">
              <div
                className="bg-p3 px-4 py-4 rounded-sm text-[whitesmoke] text-sm cursor-pointer font-medium"
                onDragStart={(event) => onDragStart(event, "upload")}
                draggable
              >
                Upload File
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-3">Output Nodes</h3>
            <div className="flex">
              <div
                className="bg-p1 px-4 py-4 rounded-sm text-[whitesmoke] text-sm cursor-pointer font-medium"
                onDragStart={(event) => onDragStart(event, "chart")}
                draggable
              >
                Show Chart
              </div>
            </div>
          </div>
        </div> */}
      </aside>
    </div>
  );
};

export default Sidebar;

{
  /* <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'input')} draggable>
  Input Node
  </div>
  <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'default')} draggable>
  Default Node
  </div>
  <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'output')} draggable>
  Output Node
  </div> */
}
