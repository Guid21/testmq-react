import { ItemData } from "../../../../types";
import { TTVRange } from "../../types";

type TCalculateTVRangeParams = ItemData[];
type TCalculateTVRangeReturn = Readonly<TTVRange>;

export const calculateTVRange = (
  data: TCalculateTVRangeParams
): TCalculateTVRangeReturn => {
  let minT = data[0]?.t;
  let maxT = data[0]?.t;
  let minV = data[0]?.v;
  let maxV = data[0]?.v;

  for (let i = 1; i < data.length; i++) {
    let current = data[i];

    if (current.t < minT) minT = current.t;
    if (current.t > maxT) maxT = current.t;
    if (current.v < minV) minV = current.v;
    if (current.v > maxV) maxV = current.v;
  }

  return { minT, maxT, minV, maxV };
};