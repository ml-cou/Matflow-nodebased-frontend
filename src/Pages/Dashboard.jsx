import { useEffect } from "react";
import { useDispatch } from "react-redux";
import DashBoardLeft from "../Components/DashBoardLeft/DashBoardLeft";
import DashBoardRight from "../Components/DashBoardRight/DashBoardRight";
import DashBoardTop from "../Components/DashBoardTop/DashBoardTop";
import { setActiveFunction } from "../Slices/SideBarSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFunction(localStorage.getItem("activeFunction")));
  }, [dispatch]);

  return (
    <div className="h-screen">
      <DashBoardTop />
      <div style={{ height: "calc(100% - 3.91rem)" }} className="flex gap-4">
        <DashBoardLeft />
        <DashBoardRight />
      </div>
    </div>
  );
}
