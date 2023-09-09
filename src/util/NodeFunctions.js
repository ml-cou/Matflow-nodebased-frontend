import { toast } from "react-toastify";
import * as stats from "simple-statistics";
import * as Stat from "statistics.js";

const EDA_LINK = {
  "Bar Plot": "eda_barplot",
  "Box Plot": "eda_boxplot",
  "Count Plot": "eda_countplot",
  "Custom Plot": "eda_customplot",
  Histogram: "eda_histogram",
  "Line Plot": "eda_lineplot",
  "Pie Plot": "eda_pieplot",
  "Reg Plot": "eda_regplot",
  "Scatter Plot": "eda_scatterplot",
  "Violin Plot": "eda_violinplot",
};

const raiseErrorToast = (rflow, params, error) => {
  // Error paile connected node er data delete kore dibe
  const tempNodes = rflow.getNodes().map((val) => {
    if (val.id === params.target) return { ...val, data: {} };
    return val;
  });
  rflow.setNodes(tempNodes);

  toast.error(error, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const handleOutputTable = async (rflow, params) => {
  try {
    const csvFile = rflow.getNode(params.source).data;

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return { ...val, data: { table: csvFile.table } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handlePlotOptions = async (rflow, params) => {
  try {
    // const { plot, plotOption, nodeId } = Plot;
    const file = rflow.getNode(params.source).data;
    if (!file || !file.table) {
      throw new Error("File not found.");
    }
    if (Object.keys(file.plotOption).length === 0) return true;

    const url = `http://127.0.0.1:8000/api/${
      EDA_LINK[file.plot || "Bar Plot"]
    }/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...file.plotOption,
        file: file.table,
      }),
    });
    let data = await res.json();
    data = JSON.parse(data);

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target) return { ...val, data: { graph: data } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleReverseML = async (rflow, params) => {
  try {
    const { table, reverseml } = rflow.getNode(params.source).data;
    console.log("first");
    if (!table) throw new Error("Check your file in upload node.");
    const res = await fetch("http://127.0.0.1:8000/api/reverseml/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: table,
        "Select Feature": reverseml["Select Feature"],
        "Select Target Variable": reverseml["Select Target Variable"],
        "Enter Values": reverseml["Enter Values"],
      }),
    });
    const data = await res.json();

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target) return { ...val, data: { table: data } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const isItTimeSeriesFile = async (rflow, params) => {
  try {
    const { table, timeSeries } = rflow.getNode(params.source).data;

    let option = { file: table };
    if (timeSeries && timeSeries.target_variable)
      option = { ...option, select_column: timeSeries.target_variable };
    else option = { ...option, select_column: "" };

    const res = await fetch("http://127.0.0.1:8000/api/time_series/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(option),
    });
    const data = await res.json();
    if ("error" in data && data.error) {
      toast.warn("No date-time column found in the dataset.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target) return { ...val, data: { table } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleTimeSeriesAnalysis = async (rflow, params) => {
  try {
    const { table, timeSeries } = rflow.getNode(params.source).data;
    if (!timeSeries) return;
    console.log(timeSeries);
    const res = await fetch("http://127.0.0.1:8000/api/time_series_analysis/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: table,
        date: timeSeries.date,
        select_column: timeSeries.target_variable,
      }),
    });
    const data = await res.json();

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return { ...val, data: { graph: JSON.parse(data.graph) } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleFileForMergeDataset = async (rflow, params) => {
  try {
    const fileNode = rflow.getNode(params.source).data;
    const targetNodeFile = rflow.getNode(params.target).data;

    if (
      typeof targetNodeFile === "object" &&
      Object.keys(targetNodeFile).length === 2
    ) {
      throw new Error("Can't accept more than two dataset to merge");
    }

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { ...val.data, [fileNode["file_name"]]: fileNode.table },
        };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleMergeDataset = async (rflow, params) => {
  try {
    const { merge } = rflow.getNode(params.source).data;

    if (!merge) throw new Error("Check Merge Dataset Node.");

    const res = await fetch("http://127.0.0.1:8000/api/merge_dataset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        how: merge.how,
        left_dataframe: merge.left_dataframe,
        right_dataframe: merge.right_dataframe,
        file: merge.table1,
        file2: merge.table2,
      }),
    });

    let data = await res.json();
    data = JSON.parse(data);

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return { ...val, data: { table: data, file_name: merge.dataset_name } };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleAppendDataset = async (rflow, params) => {
  try {
    const { append } = rflow.getNode(params.source).data;

    if (!append) throw new Error("Check Append Dataset Node.");

    const res = await fetch("http://127.0.0.1:8000/api/append/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(append),
    });

    let data = await res.json();
    data = JSON.parse(data);

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: append.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);
    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleAddModify = async (rflow, params) => {
  try {
    let { addModify } = rflow.getNode(params.source).data;
    // console.log(addModify);
    if (!addModify) throw new Error("Check Add/Modify Node.");
    if (addModify.option === "Add") {
      addModify.select_column = addModify.column_name;
    }
    const res = await fetch("http://127.0.0.1:8000/api/feature_creation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addModify),
    });

    let data = await res.json();
    // console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: addModify.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleChangeDtype = async (rflow, params) => {
  try {
    let { changeDtype } = rflow.getNode(params.source).data;
    // console.log(changeDtype);
    if (!changeDtype) throw new Error("Check Change Dtype Node.");

    const res = await fetch("http://127.0.0.1:8000/api/change_dtype/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changeDtype),
    });

    let data = await res.json();
    // console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: changeDtype.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleAlterFieldName = async (rflow, params) => {
  try {
    let { alterFieldName } = rflow.getNode(params.source).data;

    if (!alterFieldName) throw new Error("Check Alter Field Name Node.");

    const res = await fetch("http://127.0.0.1:8000/api/alter_field_name/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alterFieldName),
    });

    let data = await res.json();
    // console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: alterFieldName.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleDropRowColumn = async (rflow, params) => {
  try {
    let { dropColumnRow } = rflow.getNode(params.source).data;

    if (!dropColumnRow) throw new Error("Check Drop Row/Column Node.");
    let url = "http://127.0.0.1:8000/api/drop_column/";
    if (dropColumnRow.dropOption === "Row")
      url = "http://127.0.0.1:8000/api/drop_rows/";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        default_value: dropColumnRow.default_value,
        select_columns: dropColumnRow.select_columns,
        file: dropColumnRow.file,
      }),
    });

    let data = await res.json();
    // console.log(data)
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: dropColumnRow.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleScaling = async (rflow, params) => {
  try {
    let { scaling } = rflow.getNode(params.source).data;

    if (!scaling) throw new Error("Check Scaling Node.");
    let url = "http://127.0.0.1:8000/api/scaling/";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scaling),
    });

    let data = await res.json();
    console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: scaling.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleEncoding = async (rflow, params) => {
  try {
    let { encoding } = rflow.getNode(params.source).data;

    if (!encoding) throw new Error("Check Encoding Node.");
    let url = "http://127.0.0.1:8000/api/encoding/";
    // console.log(encoding)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encoding),
    });

    let data = await res.json();
    console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: data, file_name: encoding.dataset_name },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleCluster = async (rflow, params, outputType) => {
  try {
    let { cluster } = rflow.getNode(params.source).data;

    if (!cluster) throw new Error("Check Cluster Node.");
    let url = "http://127.0.0.1:8000/api/cluster/";
    // console.log(encoding)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cluster),
    });

    let data = await res.json();
    console.log(data);
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: {
            [outputType === "table" ? "table" : "graph"]:
              outputType === "table" ? data.table : JSON.parse(data.graph),
          },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleDatasetInformation = (rflow, params) => {
  let { table: rowData } = rflow.getNode(params.source).data;

  const columns = Object.keys(rowData[0] || {});
  const columnInfo = [];

  columns.forEach((column) => {
    const uniqueValues = new Set();
    let nonNullCount = 0;

    if (column !== "id") {
      rowData.forEach((row) => {
        const value = row[column];
        if (value !== undefined && value !== null) {
          uniqueValues.add(value);
          nonNullCount++;
        }
      });

      const nullCount = rowData.length - nonNullCount;
      const nullPercentage = (nullCount / rowData.length) * 100;
      const dtype = typeof rowData[0][column];

      columnInfo.push({
        column,
        uniqueValues: uniqueValues.size,
        nonNullCount,
        nullPercentage,
        dtype,
      });
    }
  });

  const tempNodes = rflow.getNodes().map((val) => {
    if (val.id === params.target)
      return {
        ...val,
        data: {
          table: columnInfo,
        },
      };
    return val;
  });
  rflow.setNodes(tempNodes);
  return true;
};

export const handleDatasetStatistics = (rflow, params) => {
  let { table: rowData } = rflow.getNode(params.source).data;

  let columns = Object.keys(rowData[0] || {});
  const columnStatsData = [];
  columns = columns.filter((item) => {
    const dtype = typeof rowData[0][item];
    return dtype === "number";
  });

  columns.forEach((column) => {
    if (column !== "id") {
      let values = rowData
        .map((row) => parseFloat(row[column]))
        .filter((value) => !isNaN(value));
      const count = values.length;
      if (count > 0) {
        const min = stats.min(values).toFixed(3);
        const max = stats.max(values).toFixed(3);
        const std = stats.standardDeviation(values).toFixed(3);

        const mean = stats.mean(values).toFixed(3);
        const percentile25 = stats.quantile(values, 0.25).toFixed(3);
        const median = stats.quantile(values, 0.5).toFixed(3);
        const percentile75 = stats.quantile(values, 0.75).toFixed(3);

        columnStatsData.push({
          column,
          count,
          min,
          max,
          std,
          mean,
          "25%": percentile25,
          "50%": median,
          "75%": percentile75,
        });
      }
    }
  });

  const tempNodes = rflow.getNodes().map((val) => {
    if (val.id === params.target)
      return {
        ...val,
        data: {
          table: columnStatsData,
        },
      };
    return val;
  });
  rflow.setNodes(tempNodes);
  return true;
};

export const handleDatasetCorrelation = async (rflow, params, outputType) => {
  try {
    const { table: rowData, correlation } = rflow.getNode(params.source).data;

    if (!correlation) throw new Error("Check Corelation Node");

    const calculateCorrelations = (data) => {
      let columnNames = Object.keys(data[0]);
      columnNames = columnNames.filter(
        (val) => typeof data[0][val] === "number" && val !== "id"
      );
      const correlations = {};

      for (let i = 0; i < columnNames.length; i++) {
        const column1 = columnNames[i];
        correlations[column1] = {};

        for (let j = 0; j < columnNames.length; j++) {
          const column2 = columnNames[j];
          const column1Data = [];
          const column2Data = [];
          const tempData = [];

          for (let k = 0; k < data.length; k++) {
            const val1 = parseFloat(data[k][column1]);
            const val2 = parseFloat(data[k][column2]);

            if (!isNaN(val1) && !isNaN(val2)) {
              column1Data.push(val1);
              column2Data.push(val2);

              tempData.push({
                [column1]: val1,
                [column2]: val2,
              });
            }
          }

          const bodyVars = {
            [column1]: "metric",
            [column2]: "metric",
          };

          const temp = new Stat(tempData, bodyVars);
          // Calculate the correlation coefficient using simple-statistics correlation function
          const l = Object.keys(bodyVars);

          if (correlation.method === "spearman") {
            const cc = temp.spearmansRho(l[0], l[l.length === 1 ? 0 : 1], true);

            // // Store the correlation coefficient in the correlations object
            correlations[column1][column2] = cc.rho.toFixed(3);
          } else if (correlation.method === "pearson") {
            const cc = temp.correlationCoefficient(
              l[0],
              l[l.length === 1 ? 0 : 1]
            );

            // // Store the correlation coefficient in the correlations object
            correlations[column1][column2] =
              cc.correlationCoefficient.toFixed(3);
          }
        }
      }

      return correlations;
    };

    let cor = calculateCorrelations(rowData);

    if (correlation.method === "kendall") {
      const resp = await fetch(
        "http://127.0.0.1:8000/api/display_correlation/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: rowData,
          }),
        }
      );
      let { data } = await resp.json();

      cor = JSON.parse(data);
      let columnName = Object.keys(cor[0]);
      columnName = columnName.filter((val) => val !== "id");
      let newData = [];
      for (let i = 0; i < columnName.length; i++) {
        const { id, ...rest } = cor[i];
        newData.push({ ...rest, column_name: columnName[i] });
      }
      console.log({ newData });
      cor = newData;
    } else {
      let ind = 0;
      const columnName = Object.keys(cor);
      cor = Object.values(cor);
      cor = cor.map((val) => {
        return { ...val, column_name: columnName[ind++] };
      });
    }

    const columnNames = Object.keys(rowData[0]);
    let colWithInd = {};
    for (let i = 0; i < columnNames.length; i++) {
      colWithInd = { ...colWithInd, [columnNames[i]]: i };
    }

    const columnSelected = new Set(correlation.show_column);

    let tempData = JSON.parse(JSON.stringify(cor));
    for (let i = 0; i < columnNames.length; i++) {
      if (columnSelected.has(columnNames[i])) continue;
      const colInd = colWithInd[columnNames[i]];
      for (let j = 0; j < tempData.length; j++) {
        if (colInd === j) tempData[j] = {};
        delete tempData[j][columnNames[i]];
      }
    }
    console.log(tempData);
    tempData = tempData.filter((val) => Object.keys(val).length !== 0);

    cor = tempData;

    let graphData = undefined;
    if (outputType === "graph") {
      const res = await fetch(
        "http://127.0.0.1:8000/api/display_correlation_heatmap/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: cor,
          }),
        }
      );
      const data = await res.json();
      graphData = JSON.parse(data);
    }

    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: {
            [outputType === "table" ? "table" : "graph"]:
              outputType === "table" ? cor : graphData,
          },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};

export const handleDatasetGroup = async (rflow, params) => {
  try {
    let { group } = rflow.getNode(params.source).data;

    if (!group) throw new Error("Check Group Node.");
    let url = "http://127.0.0.1:8000/api/display_group/";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: group.file,
        group_var: group.selectedColumn,
        agg_func: group.agg_func,
      }),
    });

    let { data } = await res.json();
    console.log(JSON.parse(data));
    const tempNodes = rflow.getNodes().map((val) => {
      if (val.id === params.target)
        return {
          ...val,
          data: { table: JSON.parse(data) },
        };
      return val;
    });
    rflow.setNodes(tempNodes);

    return true;
  } catch (error) {
    raiseErrorToast(rflow, params, error.message);
    return false;
  }
};
