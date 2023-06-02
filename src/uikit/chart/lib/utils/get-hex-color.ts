// Вспомогательная функция для преобразования HSV в RGB
function hsvToRgb(h: number, s: number, v: number) {
  var c = v * s;
  var x = c * (1 - Math.abs((h / 60) % 2 - 1));
  var m = v - c;
  var rgb;

  if (h >= 0 && h < 60) {
    rgb = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    rgb = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    rgb = [0, c, x];
  } else if (h >= 180 && h < 240) {
    rgb = [0, x, c];
  } else if (h >= 240 && h < 300) {
    rgb = [x, 0, c];
  } else {
    rgb = [c, 0, x];
  }

  var r = Math.round((rgb[0] + m) * 255);
  var g = Math.round((rgb[1] + m) * 255);
  var b = Math.round((rgb[2] + m) * 255);

  return { r: r, g: g, b: b };
}

type TGetHexColorParams = Readonly<{
  value: number;
  minValue: number;
  maxValue: number;
}>;

export function getHexColor({ value: temperature, minValue: minTemperature, maxValue: maxTemperature }: TGetHexColorParams) {
  const blueHue = 240; // Голубой цвет (HSV)
  const redHue = 0; // Красный цвет (HSV)

  // Ограничиваем температуру в пределах минимальной и максимальной
  temperature = Math.max(Math.min(temperature, maxTemperature), minTemperature);

  // Нормализуем температуру в диапазоне от 0 до 1
  var normalizedTemperature =
    (temperature - minTemperature) / (maxTemperature - minTemperature);

  // Вычисляем значение оттенка в HSV пространстве
  var hue = blueHue + (redHue - blueHue) * normalizedTemperature;

  // Преобразуем HSV в RGB
  var color = hsvToRgb(hue, 1, 1);

  // Конвертируем значения RGB в шестнадцатеричный формат
  var redHex = Math.round(color.r).toString(16).padStart(2, "0");
  var greenHex = Math.round(color.g).toString(16).padStart(2, "0");
  var blueHex = Math.round(color.b).toString(16).padStart(2, "0");

  // Формируем цветовой код в формате HEX
  var colorHex = "#" + redHex + greenHex + blueHex;

  return colorHex;
}
