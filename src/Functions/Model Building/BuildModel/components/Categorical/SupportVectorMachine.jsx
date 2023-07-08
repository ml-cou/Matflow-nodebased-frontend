import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MultipleDropDown from "../../../../../Components/MultipleDropDown/MultipleDropDown";
import SingleDropDown from "../../../../../Components/SingleDropDown/SingleDropDown";
import {
  setHyperparameterData,
  setModelSetting,
} from "../../../../../Slices/ModelBuilding";

const DISPLAY_METRICES = ["Accuracy", "Precision", "Recall", "F1-Score"];

function SupportVectorMachine({ train, test }) {
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
    C: 1,
    tol: 0.001,
    degree: 3,
    kernel: 'linear',
    gamma: 'scale'
  });

  useEffect(() => {
    dispatch(setModelSetting(optimizedData));
  }, [optimizedData, dispatch]);

  const handleOptimization = async () => {
    try {
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
      setOptimizedData({...optimizedData, ...data});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium tracking-wide mb-2">
          Hyperparameter Optimization Settings
        </h1>
        <div className="grid grid-cols-2 gap-4 items-center">
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
                    "Random state for hyperparameter search": e.target.value,
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
        <button
          className="self-start border-2 px-4 tracking-wider border-primary-btn text-black font-medium text-sm rounded-md py-2 mt-6"
          onClick={handleOptimization}
        >
          Run Optimization
        </button>
      </div>
      <div className="mt-8">
        <h1 className="text-2xl font-medium tracking-wide mb-3">
          Model Settings
        </h1>
        <div className="grid grid-cols-3 gap-8">
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="C"
            value={optimizedData.C || 1}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                C: e.target.value,
              })
            }
            step={0.01}
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
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Polinomial Degree"
            value={optimizedData.degree || 3}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                degree: e.target.value,
              })
            }
            step={1}
          />

          <div>
            <p>Kernel</p>
            <SingleDropDown
              columnNames={["linear", "poly", "rbf", "sigmoid"]}
              initValue={optimizedData.kernel || "linear"}
              onValueChange={(e) =>
                setOptimizedData({
                  ...optimizedData,
                  kernel: e,
                })
              }
            />
          </div>
          <div>
            <p>Gamma</p>
            <SingleDropDown
              columnNames={["scale", "auto"]}
              initValue={optimizedData.gamma || "scale"}
              onValueChange={(e) =>
                setOptimizedData({
                  ...optimizedData,
                  gamma: e,
                })
              }
            />
          </div>
          <div>
            <p>Multiclass Average</p>
            <SingleDropDown
              columnNames={["micro", "macro", "weighted"]}
              initValue={"micro"}
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
            defaultValue={DISPLAY_METRICES}
          />
        </div>
      </div>
    </div>
  );
}

export default SupportVectorMachine;
