import React from "react";
import { useSelector } from "react-redux";
import DatasetDisplay from "../../Functions/Dataset/DatasetDisplay";
import DatasetInformation from "../../Functions/Dataset/DatasetInformation";
import DatasetStatistics from "../../Functions/Dataset/DatasetStatistics";
import DatasetCorrelation from "../../Functions/Dataset/DatasetCorrelation";

function DashBoardRight() {
  const activeFunction = useSelector((state) => state.sideBar.activeFunction);
  const activeFile = useSelector((state) => state.uploadedFile.activeFile);

  return (
    <div className="flex-grow h-full overflow-y-auto px-6">
      {activeFunction && activeFile ? (
        <>
          {activeFunction && activeFunction === "Display" && <DatasetDisplay />}
          {activeFunction && activeFunction === "Information" && (
            <DatasetInformation />
          )}
          {activeFunction && activeFunction === "Statistics" && (
            <DatasetStatistics />
          )}
          {activeFunction && activeFunction === "Corelation" && (
            <DatasetCorrelation />
          )}
        </>
      ) : (
        <div className="w-full h-full grid place-content-center">
          <h1 className="text-3xl tracking-wide text-center">
            Please select a function to continue...
          </h1>
        </div>
      )}
    </div>
  );
}

export default DashBoardRight;
