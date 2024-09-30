import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 必要に応じてCSSファイルも読み込み

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
