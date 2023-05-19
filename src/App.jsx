import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import EditorPage from "./Pages/EditorPage";
import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login";
// import DnDFlow from "./Page/EditorPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/editor" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
      {/* <RouterProvider router={router} /> */}
    </>
  );
}

export default App;
