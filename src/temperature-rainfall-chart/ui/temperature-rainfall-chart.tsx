import { useState, useEffect } from "react";
import type { ItemData } from "../../types";
import { H1 } from "../../uikit/typography";
import { Button } from "../../uikit/button";
import { Chart } from "../../uikit/chart";
import "./temperature-rainfall-chart.css";
import { YearsSelect, type TYears } from "./years-select";
import { Stores } from "../lib/utils/indexedDB";
import { updateData } from "../lib/utils/update-data";

export const TemperatureRainfallChart = () => {
  const [years, setYears] = useState<TYears>([1981, 2006]);
  const [typeChart, setTypeChart] = useState<Stores>(Stores.Temperature);

  const [data, setData] = useState<Record<string, ItemData>>({});

  useEffect(() => {
    const abort = updateData(typeChart, years, setData);

    return () => abort();
  }, [typeChart, years]);

  return (
    <div className="temperature-rainfall-chart">
      <div>
        <H1>Архив метеослужбы</H1>
      </div>
      <div className="container">
        <div className="bar">
          <Button onClick={() => setTypeChart(Stores.Temperature)}>
            Температура
          </Button>
          <Button
            onClick={() => setTypeChart(Stores.Precipitation)}
            className="precipitation"
          >
            Осадки
          </Button>
        </div>
        <div className="content">
          <div className="filters">
            <YearsSelect value={years} onChange={setYears} />
          </div>
          <div className="container">
            <Chart
              data={Object.values(data)}
              customXLabel={(label: string) => {
                return `${label} г`;
              }}
              customYLabel={(label: string) => {
                return `${label}${
                  typeChart === Stores.Temperature ? "°" : "☂️"
                }`;
              }}
            >
              chart
            </Chart>
          </div>
        </div>
      </div>
    </div>
  );
};
