import { Table } from "@nextui-org/react";
import React from "react";

function NextTable({ rowData }) {
  
  const columnName = Object.keys(rowData[0]);
  return (
    <Table shadow={false} lined striped>
      <Table.Header>
        {columnName.map((val, ind) => (
          <Table.Column key={ind}>{val}</Table.Column>
        ))}
      </Table.Header>
      <Table.Body>
        {rowData.map((val, ind) => {
          return (
            <Table.Row key={ind}>
              {columnName.map((v, i) => {
                return (
                  <Table.Cell key={i}>
                    {typeof val[v] === "string" || typeof val[v] === "number"
                      ? val[v]
                      : JSON.stringify(val[v])}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default NextTable;
