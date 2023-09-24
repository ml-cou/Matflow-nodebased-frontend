import styled from "@emotion/styled";
import { Slider, Stack } from "@mui/material";
import { Input, Loading } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setHyperparameterData,
  setModelSetting,
} from "../../../../../../Slices/ModelBuilding";
import MultipleDropDown from "../../../../../Components/MultipleDropDown/MultipleDropDown";
import NextTable from "../../../../../Components/NextTable/NextTable";
import SingleDropDown from "../../../../../Components/SingleDropDown/SingleDropDown";

const DISPLAY_METRICES = [
  "R-Squared",
  "Mean Absolute Error",
  "Mean Squared Error",
  "Root Mean Squared Error",
];

const CRITERION = [
  "friedman_mse",
  "squared_error",
  "absolute_error",
  "poisson",
];

const MAX_FEATURE = ["sqrt", "log2", "None"];

function RandomForestRegression({
  train,
  test,
  Type = "function",
  initValue = undefined,
  onValueChange = undefined,
}) {
  const hyperparameterOption = useSelector(
    (state) => state.modelBuilding.hyperparameter
  );
  const regressor = useSelector((state) => state.modelBuilding.regressor);
  const type = useSelector((state) => state.modelBuilding.type);
  const target_variable = useSelector(
    (state) => state.modelBuilding.target_variable
  );
  const dispatch = useDispatch();
  const [hData, setHData] = useState();
  const [optimizedData, setOptimizedData] = useState({
    min_samples_leaf: 1,
    min_samples_split: 2,
    "Display Metrices": DISPLAY_METRICES,
    max_features: "sqrt",
    max_depth: 0,
    criterion: "friedman_mse",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Type === "node" && initValue) {
      // console.log(initValue)
      setOptimizedData({
        ...optimizedData,
        ...initValue,
      });
    }
  }, []);

  useEffect(() => {
    dispatch(setModelSetting(optimizedData));
    if (Type === "node") {
      onValueChange(optimizedData);
    }
  }, [dispatch, optimizedData]);

  const handleOptimization = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://127.0.0.1:8000/api/hyperparameter_optimization/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            train,
            test,
            [type === "regressor" ? "regressor" : "classifier"]: regressor,
            type,
            target_var: target_variable,
            ...hyperparameterOption,
          }),
        }
      );
      const data = await res.json();
      
      setHData(data);
      setOptimizedData({ ...optimizedData, ...data.param });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      {Type === "function" && (
        <div>
          <h1 className="text-2xl font-medium tracking-wide mb-2">
            Hyperparameter Optimization Settings
          </h1>
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full flex flex-col justify-start gap-4 mt-2">
              <div className="w-full">
                <p className="mb-1">
                  Number of iterations for hyperparameter search
                </p>
                <Input
                  onChange={(e) =>
                    dispatch(
                      setHyperparameterData({
                        ...hyperparameterOption,
                        "Number of iterations for hyperparameter search":
                          e.target.value,
                      })
                    )
                  }
                  fullWidth
                  bordered
                  color="success"
                  type="number"
                />
              </div>
              <div className="w-full">
                <p className="mb-1">Number of cross-validation folds</p>
                <Input
                  onChange={(e) =>
                    dispatch(
                      setHyperparameterData({
                        ...hyperparameterOption,
                        "Number of cross-validation folds": e.target.value,
                      })
                    )
                  }
                  fullWidth
                  bordered
                  color="success"
                  type="number"
                />
              </div>
              <div className="w-full">
                <p className="mb-1">Random state for hyperparameter search</p>
                <Input
                  onChange={(e) =>
                    dispatch(
                      setHyperparameterData({
                        ...hyperparameterOption,
                        "Random state for hyperparameter search":
                          e.target.value,
                      })
                    )
                  }
                  fullWidth
                  bordered
                  color="success"
                  type="number"
                />
              </div>
            </div>
            <div className="w-full">
              {hData && hData.result && (
                <>
                  <p className="mb-2 font-medium tracking-wide">
                    Best Estimator
                  </p>
                  <NextTable rowData={hData.result} />
                </>
              )}
              {loading && (
                <div className="grid place-content-center h-full">
                  <Loading size="lg" color={"success"}>
                    Fetching Data...
                  </Loading>
                </div>
              )}
            </div>
          </div>
          <button
            className="self-start border-2 px-4 tracking-wider border-primary-btn text-black font-medium text-sm rounded-md py-2 mt-6"
            onClick={handleOptimization}
            disabled={loading}
          >
            Run Optimization
          </button>
        </div>
      )}
      <div className="mt-8">
        <h1 className="text-2xl font-medium tracking-wide mb-3">
          Model Settings
        </h1>
        <div
          className={`grid grid-cols-3 gap-8 ${
            Type === "node" && "!grid-cols-2 !gap-4"
          }`}
        >
          <div>
            <p>Criterion</p>
            <SingleDropDown
              columnNames={CRITERION}
              initValue={optimizedData.criterion}
              onValueChange={(e) =>
                setOptimizedData({ ...optimizedData, criterion: e })
              }
            />
          </div>
          <div>
            <p>Max Features</p>
            <SingleDropDown
              columnNames={MAX_FEATURE}
              initValue={optimizedData.max_features}
              onValueChange={(e) =>
                setOptimizedData({ ...optimizedData, max_features: e })
              }
            />
          </div>
        </div>
        <div>
          <div className="mt-4">
            <p className="mb-12">Min. Samples Split</p>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <span>2</span>
              <PrettoSlider
                aria-label="Auto Bin Slider"
                min={2}
                max={10}
                step={1}
                value={optimizedData.min_samples_split}
                onChange={(e, v) =>
                  setOptimizedData({
                    ...optimizedData,
                    min_samples_split: v,
                  })
                }
                valueLabelDisplay="on"
                color="primary"
              />
              <span>10</span>
            </Stack>
          </div>
          <div className="mt-4">
            <p className="mb-12">Max Depth</p>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <span>1</span>
              <PrettoSlider
                aria-label="Auto Bin Slider"
                min={1}
                max={100}
                step={1}
                value={optimizedData.max_depth}
                onChange={(e, v) =>
                  setOptimizedData({
                    ...optimizedData,
                    max_depth: v,
                  })
                }
                valueLabelDisplay="on"
                color="primary"
              />
              <span>100</span>
            </Stack>
          </div>
          <div className="mt-4">
            <p className="mb-12">Min. Samples Leaf</p>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <span>1</span>
              <PrettoSlider
                aria-label="Auto Bin Slider"
                min={1}
                max={10}
                step={1}
                value={optimizedData.min_samples_leaf}
                onChange={(e, v) =>
                  setOptimizedData({
                    ...optimizedData,
                    min_samples_leaf: v,
                  })
                }
                valueLabelDisplay="on"
                color="primary"
              />
              <span>10</span>
            </Stack>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2">Display Metrices</p>
          <MultipleDropDown
            columnNames={DISPLAY_METRICES}
            defaultValue={optimizedData["Display Metrices"]}
            setSelectedColumns={(e) =>
              setOptimizedData({ ...optimizedData, "Display Metrices": e })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default RandomForestRegression;

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});
