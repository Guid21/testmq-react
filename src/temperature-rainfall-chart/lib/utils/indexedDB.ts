import { ItemData } from "../../../types";

const DB_NAME = "test-mq";
let request: IDBOpenDBRequest;
let version = 1;
let db: IDBDatabase;

export enum Stores {
  Precipitation = "precipitation",
  Temperature = "temperature",
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    const indexedDB =
      window.indexedDB ||
      ((window as any).webkitIndexedDB as unknown as IDBFactory) ||
      ((window as any).mozIndexedDB as unknown as IDBFactory) ||
      ((window as any).msIndexedDB as unknown as IDBFactory);
    request = indexedDB.open(DB_NAME, version);

    request.onupgradeneeded = (event) => {
      
      db = (event?.target as any).result;
      if (!db.objectStoreNames.contains(Stores.Precipitation)) {
        db.createObjectStore(Stores.Precipitation, { keyPath: "t" });
      }
      if (!db.objectStoreNames.contains(Stores.Temperature)) {
        db.createObjectStore(Stores.Temperature, { keyPath: "t" });
      }
    };

    request.onsuccess = (event) => {
      
      db = (event?.target as any).result;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addItem = (
  storeName: Stores,
  data: ItemData
): Promise<ItemData | string | null> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(
      storeName,
      "readwrite"
      // {
      //   durability: "relaxed",
      // }
    );
    const store = transaction.objectStore(storeName);
    store.add(data);
    resolve(data);

    transaction.onerror = (event) => {
      if (request.error?.name == "ConstraintError") {
        event.preventDefault(); // предотвращаем отмену транзакции
        event.stopPropagation(); // предотвращаем всплытие ошибки
        // ...можно попробовать использовать другой ключ...
      } else {
        // неизвестная ошибка
        // транзакция будет отменена
        transaction?.abort();
      }
    };
  });
};

// Предполагаю, что в 1 потока по 100 записей и с задержкой в 100мс все будет хорошо работать
export const addItems = (storeName: Stores, ...items: ItemData[]) => {
  const COUNT_ITEMS = 100;
  const TIME_INTERVAL = 100;

  for (let i = 0; i < COUNT_ITEMS && i < items.length; i++) {
    addItem(storeName, items[i]);
  }

  const nextItems = items.slice(COUNT_ITEMS);

  if (nextItems.length > 0) {
    setTimeout(() => addItems(storeName, ...nextItems), TIME_INTERVAL);
  }
};

export const getStoreData = (
  storeName: Stores,
  [startDate, finishDate]: [string, string]
): Promise<ItemData[]> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const res = store.getAll(IDBKeyRange.bound(startDate, finishDate));
    res.onsuccess = async () => {
      resolve(res.result);
    };

    res.onerror = () => {
      console.log(res.error);
      resolve([])
    };
  });
};
