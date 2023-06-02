import { useEffect, useRef, useState } from "react";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [mouseCoordinates, setMouseCoordinates] = useState<[number, number]>([0, 0])

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");
      const handleMouse = (event: MouseEvent) => {
        setMouseCoordinates([event.offsetX, event.offsetY])
      }

      canvas.addEventListener(
        "mousemove",
        handleMouse,
        false
      );

      setContext(context);

      return () => canvas.removeEventListener("mousemove", handleMouse)
    }
  }, []);  

  return { canvasRef, context, mouseCoordinates };
};
