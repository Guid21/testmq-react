import { ComponentProps } from "react";
import "./chart.css";
import { ItemData } from "../../../types";
import { HEIGHT, WIDTH } from "../constants";
import { useCanvas } from "../lib/hooks/use-canvas";
import { useDraw } from "../lib/hooks/use-draw";

type DeepReadonly<T> = { readonly [P in keyof T]: T[P] };

type TChartProps = ComponentProps<"canvas"> &
  DeepReadonly<{
    data: ItemData[];
    customYLabel: (label: string) => string;
    customXLabel: (label: string) => string;
  }>;

// окей, самое интересное
export const Chart = ({
  data,
  customXLabel,
  customYLabel,
  ...rest
}: TChartProps) => {
  // Логика подключения к канвасу через реф
  const { canvasRef, context, mouseCoordinates } = useCanvas();
  // А в этом хуке будем рисовать
  useDraw({ context, data, customXLabel, customYLabel, mouseCoordinates });

  return (
    <canvas
      ref={canvasRef}
      id="chart"
      width={`${WIDTH}px`}
      height={`${HEIGHT}px`}
      className="chart"
      {...rest}
    />
  );
};
