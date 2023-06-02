import { useEffect } from "react";
import { ItemData } from "../../../../types";
import { drawAxes } from "../utils/draw-axes";
import { calculateTVRange } from "../utils/calculate-t-v-range";
import { drawAxisLabels } from "../utils/draw-axis-labels";
import { drawCoordinates } from "../utils/draw-coordinates";
import { HEIGHT, WIDTH, PADDING } from "../../constants";
import { drawHint } from "../utils/draw-hint";

type TUseDraw = Readonly<{
  context: CanvasRenderingContext2D | null;
  data: ItemData[];
  customYLabel: (label: string) => string;
  customXLabel: (label: string) => string;
  mouseCoordinates: [number, number];
}>;

export const useDraw = ({
  data,
  context,
  customYLabel,
  customXLabel,
  mouseCoordinates
}: TUseDraw) => {
  useEffect(() => {
    if (context && data.length > 0) {
      // Если у нас данные изменились, будем зачищать лист
      context.clearRect(0, 0, WIDTH, HEIGHT);

      // получим минимальные и максимальные значения даты и температуры/осдков
      const tvRange = calculateTVRange(data);

      // получим шаг и центральную точку оси y
      const heightStep =
        (HEIGHT - PADDING * 2) /
        (Math.abs(tvRange.minV) + Math.abs(tvRange.maxV));
      const heightCenter = heightStep * Math.abs(tvRange.maxV);
      // получим шаг оси x
      const widthStep = (WIDTH - PADDING * 2) / data.length;

      // отрисуем координаты снизу, чтобы они не перекрывали наш график
      drawCoordinates({
        context,
        data,
        tvRange,
        heightStep,
        widthStep,
        heightCenter,
      });

      // отрисуем наши оси
      drawAxes(context, heightCenter);

      // отрисуем наши метки осей
      drawAxisLabels({
        context,
        tvRange,
        heightCenter,
        customYLabel,
        customXLabel,
      });

      // решил попробовать отрисовать подсказку
      drawHint({ mouseCoordinates, widthStep, data, heightCenter, context, heightStep, customYLabel });
    }
  }, [context, data, mouseCoordinates]);
};
