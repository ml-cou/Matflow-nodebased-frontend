import { AgGridReact } from "ag-grid-react";

function AgGridComponent({ rowData, columnDefs }) {
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      rowHeight={50}
      pagination
      paginationPageSize={10}
    ></AgGridReact>
  );
}

export default AgGridComponent;
