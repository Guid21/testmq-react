import type { TTVRange } from "../../types";
import { PADDING, WIDTH, HEIGHT } from "../../constants";
import { getMaxEdge } from "./get-max-edge";

const getSpace = (distance: number, array: string[]) =>
  distance / (array.length - 1);

const getAveragedArray = (min: number, max: number) => {
  let step = 1;

  const difference = max - min;

  if (difference > 10) {
    step = Math.ceil(difference / 10);
  }

  const result: string[] = [];

  // Похорошему вынести логику форматирования и проведения даты к году, но мне показалось в данном задание это излишне
  const formattedValue = (value: number) =>
    value.toFixed(1).replace(/\.0+$/, "");

  for (let i = min; i < max; i += step) {
    result.push(formattedValue(i));
  }
  result.push(formattedValue(max));

  return result;
};

type TDrawLabelParams = Readonly<{
  context: CanvasRenderingContext2D;
  start: [number, number];
  end: [number, number];
  text: string;
  direction: "vertical" | "horizontal";
  indentY: number
  indentX: number
}>;

const drawLabel = ({
  context,
  start,
  end,
  text,
  direction = "horizontal", // TODO: deprecated оказалось не нужно, решил не выпиливать, может пригодится, придется впиливать по новой
  indentY,
  indentX
}: TDrawLabelParams) => {
  const isVertical = direction === "vertical";

  context.beginPath();
  context.moveTo(...start);
  context.lineTo(...end);
  context.stroke();

  let x = start[0] + indentX;
  let y = start[1] + indentY;

  if (isVertical) {
    x = end[0] - indentX;
    y = end[1] + indentY;
  }

  context.save(); // запоминаем начальное состояние контекста
  context.translate(x, y); // перемещаем начало координат на позицию надписи
  isVertical && context.rotate(Math.PI / 2); // поворачиваем контекст на 90 градусов по часовой стрелки
  context.font = "14px Arial";
	context.fillStyle = 'black';
  context.fillText(text, 0, 0);
  context.restore(); // восстанавливаем начальное состояние контекста
};

type TDrawYearsLabelsParams = Readonly<{
  context: CanvasRenderingContext2D;
  tvRange: TTVRange;
  heightCenter: number;
  customXLabel: (label: string) => string;
}>;

const drawYearsLabels = ({
  tvRange,
  context,
  heightCenter,
  customXLabel
}: TDrawYearsLabelsParams) => {
  // расчитывае ширину холста
  const width = WIDTH - PADDING * 2;
  // расчитываем начальную точку
  const start = PADDING;

  // узнаем какой у нас минимальный и максимальный год
  const minYear = new Date(tvRange.minT).getFullYear();
  const maxYear = new Date(tvRange.maxT).getFullYear() + 1; // все года заканчиваются в декабре, по сути надо всегда + год

  // расчитываем колличество шагов
  const yearsAveragedArray = getAveragedArray(minYear, maxYear);

  // расчитываем растояние между ними
  const space = getSpace(width, yearsAveragedArray);
  

  // рисуем каждый год
  yearsAveragedArray.forEach((year, index) => {
    const x = start + space * index;
    const y = heightCenter + PADDING;
    const isFirst = index === 0;

    // не показываем первый год, он попадает на ось криво получается, надо отдельно его обработать(еще придумать как красиво это сделать)
    if (isFirst ) {
      return
    }

    drawLabel({
      context,
      start: [x, y],
      end: [x, y + 5],
      text: customXLabel(year),
      direction: "horizontal",
      indentX: -17,
      indentY: 17
    });
  });
};

type TDrawValueLabelsParams = Readonly<{
  context: CanvasRenderingContext2D;
  tvRange: TTVRange;
  customYLabel: (label: string) => string;
}>;

const drawValueLabels = ({
  tvRange,
  context,
  customYLabel
}: TDrawValueLabelsParams) => {
  // расчитываем высоту нашего холста
  const height = HEIGHT - PADDING * 2;
  // понимаю где начинается наш холст
  const start = PADDING;

  // расчитываем колличество шагов
  const valuesAveragedArray = getAveragedArray(
    -Math.abs(tvRange.minV),
    Math.abs(tvRange.maxV)
  );

  // расчитываем пространство между шагами
  const space = getSpace(height, valuesAveragedArray);

  // Рисуем сверху вниз, поэтому value надо развернуть
  valuesAveragedArray.reverse().forEach((value, index, arr) => {
    const x = PADDING;
    const y = start + space * index;

    drawLabel({
      context,
      start: [x, y],
      end: [x + 5, y],
      text: customYLabel(value),
      direction: "horizontal",
      indentX: 7,
      indentY: 4
    });
  });
};

type TDrawAxisLabelsParams = Readonly<{
  context: CanvasRenderingContext2D;
  tvRange: TTVRange;
  heightCenter: number;
  customYLabel: (label: string) => string;
  customXLabel: (label: string) => string;
}>;

export const drawAxisLabels = ({
  tvRange,
  context,
  heightCenter,
  customYLabel,
  customXLabel,
}: TDrawAxisLabelsParams) => {
  drawYearsLabels({ tvRange, context, heightCenter, customXLabel });
  drawValueLabels({ tvRange, context, customYLabel });
};
