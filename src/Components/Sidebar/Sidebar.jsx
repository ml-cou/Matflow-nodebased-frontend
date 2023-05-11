
const Sidebar = () => {
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div className="md:h-full grid place-items-center md:max-w-sm">
          <aside className="bg-p2 p-4 m-2 rounded-sm shadow-sm ">
              <h3 className="font-bold text-white text-3xl mb-2">Node Packet</h3>
              <p className="text-white mb-4">Drag and Drop nodes onto your editor.</p>
              <div className="flex flex-col gap-4">
                  <div>
                      <h3 className="text-white font-bold text-xl mb-3">Input Nodes</h3>
                      <div className="flex">
                          <div className="bg-p3 px-4 py-4 rounded-sm text-[whitesmoke] text-sm cursor-pointer font-medium" onDragStart= {(event) => onDragStart(event, 'upload')} draggable>
                              Upload File
                          </div>
                      </div>
                  </div>
                  <div>
                      <h3 className="text-white font-bold text-xl mb-3">Output Nodes</h3>
                      <div className="flex">
                          <div className="bg-p1 px-4 py-4 rounded-sm text-[whitesmoke] text-sm cursor-pointer font-medium" onDragStart= {(event) => onDragStart(event, 'chart')} draggable>
                              Show Chart
                          </div>
                      </div>
                  </div>
              </div>
          </aside>
      </div>
    );
  };
  
  export default Sidebar
  
  {/* <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'input')} draggable>
  Input Node
  </div>
  <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'default')} draggable>
  Default Node
  </div>
  <div className="border border-p4 p-3 text-[whitesmoke] text-sm cursor-pointer" onDragStart={(event) => onDragStart(event, 'output')} draggable>
  Output Node
  </div> */}