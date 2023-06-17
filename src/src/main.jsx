import { NextUIProvider, createTheme } from "@nextui-org/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
const theme = createTheme({
  type: "light",
  theme: {
    colors: {
      success: "#208059",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <NextUIProvider theme={theme}>
        <App />
      </NextUIProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
