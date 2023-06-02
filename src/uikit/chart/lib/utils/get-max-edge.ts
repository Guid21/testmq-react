export const getMaxEdge = (minV: number, maxV: number) => {
  const maxValue = minV > maxV ? minV : maxV;
  const absValue = Math.abs(maxValue);

  return absValue;
};
