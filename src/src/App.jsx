import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./Pages/EditorPage";
import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import TempPage from "./TempPage";
// import DnDFlow from "./Page/EditorPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="/editor" element={<EditorPage />}></Route> */}
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/temp" element={<TempPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
