import { Checkbox, Input, Loading } from "@nextui-org/react";
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

function DecisionTreeClassification({ train, test }) {
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
    min_samples_split: 2,
    min_samples_leaf: 2,
    random_state: 2,
    criterion: "gini",
    none: true,
  });
  const [hData, setHData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setModelSetting(optimizedData));
  }, [dispatch, optimizedData]);

  const handleOptimization = async () => {
    try {
      setLoading(true);
      console.log("first");
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
      let data = await res.json();

      console.log(data);
      setHData({ ...data, result: JSON.parse(data.result) });
      setOptimizedData({ ...optimizedData, ...data.param });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
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
          <div className="w-full">
            {hData && hData.result && (
              <>
                <p className="mb-2 font-medium tracking-wide">Best Estimator</p>
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
            label="Min. Samples Split"
            value={optimizedData.min_samples_split || 2}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                min_samples_split: e.target.value,
              })
            }
            step={1}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Min. Samples Leaf"
            value={optimizedData.min_samples_leaf || 2}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                min_samples_leaf: e.target.value,
              })
            }
            step={1}
          />
          <Input
            type="number"
            fullWidth
            bordered
            color="success"
            label="Random State"
            value={optimizedData.random_state || 2}
            onChange={(e) =>
              setOptimizedData({
                ...optimizedData,
                random_state: e.target.value,
              })
            }
            step={1}
          />

          <div>
            <p>Criterion</p>
            <SingleDropDown
              columnNames={["gini", "entropy", "log_loss"]}
              initValue={optimizedData.criterion || "gini"}
              onValueChange={(e) =>
                setOptimizedData({
                  ...optimizedData,
                  criterion: e,
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
          <Checkbox
            color="success"
            defaultSelected
            onChange={(e) =>
              setOptimizedData({ ...optimizedData, none: e.valueOf() })
            }
          >
            None
          </Checkbox>
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

export default DecisionTreeClassification;
