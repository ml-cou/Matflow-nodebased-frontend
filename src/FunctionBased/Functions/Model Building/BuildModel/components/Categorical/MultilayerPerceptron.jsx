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

const DISPLAY_METRICES = ["Accuracy", "Precision", "Recall", "F1-Score"];

function MultilayerPerceptron({
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
  const [optimizedData, setOptimizedData] = useState({
    "Multiclass Average": "micro",
    activation: "relu",
    hidden_layer_sizes: 3,
    max_iter: 1000,
    alpha: 0.0001,
    learning_rate_init: 0.001,
    tol: 0.001,
  });

  useEffect(() => {
    dispatch(setModelSetting(optimizedData));
  }, [dispatch, optimizedData]);

  const [hData, setHData] = useState();
  const [loading, setLoading] = useState();

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
        {Type === "function" && (
          <h1 className="text-2xl font-medium tracking-wide mb-3">
            Model Settings
          </h1>
        )}
        <div
          className={`grid grid-cols-3 gap-8 ${
            Type === "node" && "!grid-cols-2 !gap-4"
          }`}
        >
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Hidden Layer Size"
            value={optimizedData.hidden_layer_sizes || 3}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                hidden_layer_sizes: e.target.value,
              })
            }
            step={1}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Max Iteration"
            value={optimizedData.max_iter || 1000}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                max_iter: e.target.value,
              })
            }
            step={1}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Alpha"
            value={optimizedData.alpha || 0.0001}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                alpha: e.target.value,
              })
            }
            step={0.0001}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Learning Rate"
            value={optimizedData.learning_rate_init || 0.001}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                learning_rate_init: e.target.value,
              })
            }
            step={0.001}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Tolerance"
            value={optimizedData.tol || 0.001}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                tol: e.target.value,
              })
            }
            step={0.001}
          />

          <div>
            <p>Activation Function</p>
            <SingleDropDown
              columnNames={["relu", "identity", "logistic", "tanh"]}
              initValue={optimizedData.activation || "relu"}
              onValueChange={(e) =>
                setOptimizedData({
                  ...optimizedData,
                  activation: e,
                })
              }
            />
          </div>

          <div>
            <p>Multiclass Average</p>
            <SingleDropDown
              columnNames={["micro", "macro", "weighted"]}
              initValue={optimizedData["Multiclass Average"] || "micro"}
              onValueChange={(e) =>
                setOptimizedData({
                  ...optimizedData,
                  "Multiclass Average": e,
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2">Display Metrices</p>
          <MultipleDropDown
            columnNames={DISPLAY_METRICES}
            defaultValue={optimizedData["Display Metrices"] || DISPLAY_METRICES}
            setSelectedColumns={(e) =>
              setOptimizedData({ ...optimizedData, "Display Metrices": e })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default MultilayerPerceptron;
