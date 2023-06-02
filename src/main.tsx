import React from "react";
import ReactDOM from "react-dom/client";
import { TemperatureRainfallChart } from "./temperature-rainfall-chart";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TemperatureRainfallChart />
  </React.StrictMode>
);
