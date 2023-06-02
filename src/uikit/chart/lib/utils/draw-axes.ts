import { HEIGHT, PADDING, WIDTH } from "../../constants";

// хочется сделать так, что бы ось имела центр на 0 и если есть минусовые значения то она сдвигалась по оси y
export const drawAxes = (context: CanvasRenderingContext2D, heightCenter: number) => {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = "black";
  const arrayIndent = 5;

  // Ось Y
  context.moveTo(PADDING, HEIGHT - PADDING);
  context.lineTo(PADDING, PADDING);
  // Немного удлиняем ось y
  context.lineTo(PADDING, PADDING - arrayIndent);

  // Ось x
  context.moveTo(PADDING, heightCenter + PADDING);
  context.lineTo(WIDTH - PADDING, heightCenter + PADDING);
  // Немного удлиняем ось x
  context.lineTo(WIDTH - PADDING + arrayIndent, heightCenter + PADDING);

  context.stroke();
};
