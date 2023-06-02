import { ItemData } from "../../../types";
import { getData } from "../../../utils";
import { TYears } from "../../ui/years-select";
import { Stores, addItems, getStoreData, initDB } from "./indexedDB";

// P.S. диструктуризация дорогая, но решил, что там где я ее использую это оправдано
export const updateData = (
  typeChart: Stores,
  years: TYears,
  setData: React.Dispatch<React.SetStateAction<Record<string, ItemData>>>
) => {
  let status = true;

  // оставил самовызывающуся функуию
  (async () => {
    const statusDB = await initDB();

    if (!statusDB) {
      throw new Error("DB не запустилась");
    }

    const startYear = years[0];
    const finishYear = years[1];

    // Кажется интересным, отрисовывать по месяцам, таким образом можно быстро обновлять БД и не фризить

    // очищаем нашу дату
    setData({});

    // для начала получим список месяцов со списками дат, думаю это можно сделать синхронно
    const getMonthArray = (startYear: number, finishYear: number) => {
      const monthArray: string[][] = [];

      // окей, побежали по годам
      for (let year = startYear; year <= finishYear; year++) {
        const date = new Date(year, 0, 1, 1); // устанавливаем начальную дату на 1 января года

        // бежим пока год не закончится
        while (date.getFullYear() === year) {
          // окей все года начинаются с января
          let currentMonth = 0;
          // создадим болванку, куда будем складывать даты месяца
          let month: string[] = [];

          // здесь будем бежать пока месяц не закончится
          while (date.getMonth() === currentMonth && currentMonth < 12) {
            const dateString = date.toISOString().substring(0, 10); // конвертируем дату в строку формата yyyy-MM-dd
            month.push(dateString); // добавляем ткущую дату в месяц
            date.setDate(date.getDate() + 1); // увеличиваем день на 1

            // проверям, что еще месяц не сменился
            if (currentMonth !== date.getMonth()) {
              monthArray.push([...month]); // добавляем наш месяц
              currentMonth += 1; // конкатенируем месяц
              month = []; // сбрасываем болванку нашего месяца
            }
          }
        }
      }

      return monthArray;
    };
    const monthArray = getMonthArray(startYear, finishYear);

    // отлично, у нас есть месяца и их даты, все это отсартировано и быстро работает даже для 120 лет
    // давайте теперь работать с каждым месяцем отдельно, так как у нас максимум может быть 1440 месяцев, можно воспользоваться рекурсией
    const droveToWorkWithMonths = async (monthArray: string[][]) => {
      // прерываем работу, если вызвали колбек остановки
      if (!status) {
        return;
      }
      const currentMonth = monthArray[0];
      const nextMonthArrays = monthArray.slice(1);

      const startDate = currentMonth[0]; // достаем начальную дату
      const finishDate = currentMonth.slice(-1)[0]; // достаем конечную дату (в последних браузерах slice должен работать)

      const result = await getStoreData(typeChart, [startDate, finishDate]); // достаем из бд нужный месяц
      const resultDate = result.map(({ t }) => t); // достаем даты из результата
      const hasAllDate = currentMonth.reduce<boolean>(
        (acc, date) => acc && resultDate.includes(date),
        true
      ); // проверим, все ли даты нашлись

      // если все даты найдены, то просто обновляем наш стор
      if (hasAllDate) {
        // прерываем работу, если вызвали колбек остановки
        if (!status) {
          return;
        }
        setData((prev) => ({
          ...prev,
          ...result.reduce((acc, value) => ({ ...acc, [value.t]: value }), {}),
        }));
      } else {
        // если данных нет, то сначала пытаемся их получить, и доавить в дб, и после этого обновить сам стор

        const serverData = await getData<ItemData>(`../data/${typeChart}.json`); // получаем данные с сервера
        // перекладываю данные с сервера в мапу, что бы не бегать каждый раз по ней (чередз редьюс с деструктурезацией ну очень дорого было)
        const serverDataMap: Record<string, ItemData> = {};
        serverData.forEach((item) => (serverDataMap[item.t] = item));

        const items = currentMonth.reduce(
          (acc, date) => ({ ...acc, [date]: serverDataMap[date] }),
          {}
        ); // делаем работу сервера, достаем выборку нужных дат

        // прерываем работу, если вызвали колбек остановки
        if (!status) {
          return;
        }
        // отлично, давайте покажем пользователю, что у на сеть
        setData((prev) => ({ ...prev, ...items }));

        // затем положим в бд
        addItems(typeChart, ...(Object.values(items) as ItemData[]));
      }

      if (nextMonthArrays.length > 0) {
        // начнем работать со следующим месяцем
        setTimeout(() => droveToWorkWithMonths(nextMonthArrays), 0);
      }
    };
    droveToWorkWithMonths(monthArray);
  })();

  return () => {
    status = false;
  };
};
