import { Select } from "../../uikit/select";
import "./years-select.css";
import { generateYearsArray } from "../lib/utils/generate-years-array";
import { useMemo, useRef } from "react";

type TStartYear = number;
type TFinishYear = number;
export type TYears = [TStartYear, TFinishYear];

type TYearsSelectProps = Readonly<{
  value: TYears;
  onChange: (value: TYears) => void;
}>;

// Данные доступны за 125 лет, но в соответствии с заданием, необходимо отображать данные за последние 120 лет
const YEARS_COUNT = 120;

export const YearsSelect = ({ value, onChange }: TYearsSelectProps) => {
  const { current: yearsArray } = useRef(generateYearsArray(YEARS_COUNT));
  const startYear = value[0];
  const finishYear = value[1];

  const startYearOptions = useMemo(
    () => yearsArray.filter((year) => year <= finishYear),
    [yearsArray, finishYear]
  );
  const finishYearOptions = useMemo(
    () => yearsArray.filter((year) => year >= startYear),
    [yearsArray, startYear]
  );

  return (
    <div className="years-select">
      <Select
        className="start-year"
        value={startYear}
        onChange={(event) => onChange([Number(event.target.value), finishYear])}
      >
        {startYearOptions.map((year) => (
          <option value={year} key={year}>{year}</option>
        ))}
      </Select>
      <Select
        className="finish-year"
        value={finishYear}
        onChange={(event) => onChange([startYear, Number(event.target.value)])}
      >
        {finishYearOptions.map((year) => (
          <option value={year} key={year}>{year}</option>
        ))}
      </Select>
    </div>
  );
};
