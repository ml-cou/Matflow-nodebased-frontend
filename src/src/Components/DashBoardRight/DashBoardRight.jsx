import { useSelector } from "react-redux";
import DatasetCorrelation from "../../Functions/Dataset/DatasetCorrelation";
import DatasetDisplay from "../../Functions/Dataset/DatasetDisplay";
import DatasetDuplicates from "../../Functions/Dataset/DatasetDuplicates";
import DatasetGroup from "../../Functions/Dataset/DatasetGroup";
import DatasetInformation from "../../Functions/Dataset/DatasetInformation";
import DatasetStatistics from "../../Functions/Dataset/DatasetStatistics";
import BarPlot from "../../Functions/EDA/BarPlot";
import BoxPlot from "../../Functions/EDA/BoxPlot";
import CountPlot from "../../Functions/EDA/CountPlot";
import Histogram from "../../Functions/EDA/Histogram";
import LinePlot from "../../Functions/EDA/LinePlot";
import PiePlot from "../../Functions/EDA/PiePlot";
import RegPlot from "../../Functions/EDA/RegPlot";
import ScatterPlot from "../../Functions/EDA/ScatterPlot";
import ViolinPlot from "../../Functions/EDA/ViolinPlot";
import AddModify from "../../Functions/Feature Engineering/AddModify/AddModify";
import CustomPlot from "../../Functions/EDA/CustomPlot";

function DashBoardRight() {
  const activeFunction = useSelector((state) => state.sideBar.activeFunction);
  const activeFile = useSelector((state) => state.uploadedFile.activeFile);

  return (
    <div className="flex-grow h-full overflow-y-auto px-6">
      {activeFunction && activeFile ? (
        <>
          {/* Dataset Functions */}

          {activeFunction &&
            (activeFunction === "Display" || activeFunction === "Dataset") && (
              <DatasetDisplay />
            )}
          {activeFunction && activeFunction === "Information" && (
            <DatasetInformation />
          )}
          {activeFunction && activeFunction === "Statistics" && (
            <DatasetStatistics />
          )}
          {activeFunction && activeFunction === "Corelation" && (
            <DatasetCorrelation />
          )}
          {activeFunction && activeFunction === "Duplicate" && (
            <DatasetDuplicates />
          )}
          {activeFunction && activeFunction === "Group" && <DatasetGroup />}

          {/* EDA Functions */}

          {activeFunction &&
            (activeFunction === "Bar Plot" || activeFunction === "EDA") && (
              <BarPlot />
            )}
          {activeFunction && activeFunction === "Pie Plot" && <PiePlot />}
          {activeFunction && activeFunction === "Count Plot" && <CountPlot />}
          {activeFunction && activeFunction === "Box Plot" && <BoxPlot />}
          {activeFunction && activeFunction === "Histogram" && <Histogram />}
          {activeFunction && activeFunction === "Violin Plot" && <ViolinPlot />}
          {activeFunction && activeFunction === "Scatter Plot" && (
            <ScatterPlot />
          )}
          {activeFunction && activeFunction === "Reg Plot" && <RegPlot />}
          {activeFunction && activeFunction === "Line Plot" && <LinePlot />}
          {activeFunction && activeFunction === "Custom Plot" && <CustomPlot />}

          {/* Feature Engineering Functions */}

          {activeFunction &&
            (activeFunction === "Add/Modify" ||
              activeFunction === "Feature Engineering") && <AddModify />}
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
