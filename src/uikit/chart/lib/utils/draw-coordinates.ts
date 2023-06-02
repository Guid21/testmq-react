import { PADDING } from "../../constants";
import { ItemData } from "../../../../types";
import { TTVRange } from "../../types";
import { getHexColor } from "./get-hex-color";

type TDrawCoordinatesParams = Readonly<{
  context: CanvasRenderingContext2D;
  data: ItemData[];
  tvRange: TTVRange;
  heightStep: number;
  widthStep: number;
  heightCenter: number;
}>;

export const drawCoordinates = ({
  data,
  context,
  tvRange,
  heightStep,
  widthStep,
  heightCenter,
}: TDrawCoordinatesParams) => {
  // расчитываем начальную точку
  const start = PADDING;

  // балванка куда будем записывать придедущую координату
  let prevCoordinates: [number, number] = [start, heightCenter];

  data.map(({ v: value }, index) => {
    const x = start + index * widthStep;

    let y = start;
    
    // расчитываем y
    if (value > 0) {
      // по сути плюсовые значаения - это центр по высоте - значение помноженное на высоту шага
      y += heightCenter - value * heightStep
    } else {
      // минусовые значения - это значение приведенное к модулю, умноженное на высоту шага и прибавленное ко всему этому коардината центральной оси
      y +=  Math.abs(value) * heightStep + heightCenter
    }

    const newCoordinates: [number, number] = [x, y];
    
    context.strokeStyle = getHexColor({
      value: value,
      minValue: tvRange.minV,
      maxValue: tvRange.maxV,
    });

    context.beginPath();
    context.moveTo(...prevCoordinates);
    context.lineTo(...newCoordinates);
    context.stroke();
    prevCoordinates = newCoordinates;
  });
};
