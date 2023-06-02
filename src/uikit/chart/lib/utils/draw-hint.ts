import { ItemData } from "../../../../types";
import { PADDING, WIDTH } from "../../constants";

type TDrawHintParams = Readonly<{
context: CanvasRenderingContext2D;
  mouseCoordinates: [number, number];
  data: ItemData[];
  widthStep: number
  heightCenter: number
  heightStep: number
  customYLabel: (label: string) => string;
}>;

export const drawHint = ({ mouseCoordinates, data, widthStep, heightCenter, heightStep, context, customYLabel }: TDrawHintParams) => {
  const mouseX = mouseCoordinates?.[0];

  // расчитываем начальную точку
  const start = PADDING;

  // если мышка в облости видимости по оси x то надо отрисовать подсказку
  if (mouseX && mouseX > start && mouseX < WIDTH - PADDING) {
    // находим ближайшую коардинату к этому x
    // const (x - start) = start + index * widthStep;
    const index = Math.floor((mouseX - start) / widthStep);
    
    // окей теперь вычислим точку на у которой будет подсказка
    const {v: value, t: date} = data[index]
    
    const drawX = start + index * widthStep;

    let drawY = start;
    
    // расчитываем y
    if (value > 0) {
      // по сути плюсовые значаения - это центр по высоте - значение помноженное на высоту шага
      drawY += heightCenter - value * heightStep
    } else {
      // минусовые значения - это значение приведенное к модулю, умноженное на высоту шага и прибавленное ко всему этому коардината центральной оси
      drawY +=  Math.abs(value) * heightStep + heightCenter
    }
    
    // окей, теперь нарисуем кружок в этом месте
    context.beginPath();
	context.arc(drawX, drawY, 3, 0, 2*Math.PI, false);
	context.fillStyle = 'red';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.stroke();

    // по хорошему надо высчитывать помещается ли подсказка и зависимости от этого отражать ее, но решил не реализовывать, так как этого не было в задании, а улучшать можно долго
    // а теперь саму подсказку
    context.save(); // запоминаем начальное состояние контекста
    context.translate(drawX + 5, drawY - 5); // перемещаем начало координат на позицию надписи c учетом смещения
    // нарисум квадратик
    context.beginPath();
    context.rect(0, 0, 117, 35);
    context.closePath();
    context.strokeStyle = "black";
    context.fillStyle = "white";
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.font = "14px Arial";
    context.fillText(`Date: ${new Date(date).toLocaleDateString('ru-RU')}`, 5, 14);

    context.fillText(`Value: ${customYLabel(value.toString())}`, 5, 30);
    context.restore(); // восстанавливаем начальное состояние контекста
  }
};
