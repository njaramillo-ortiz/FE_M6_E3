
const DB_NAME = "appointmentDB";
const DB_VERSION = 1;
const STORE_NAME = "appointments";

let db: IDBDatabase | null = null;

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(`Error al abrir la base de datos: ${event}`);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    };
  });
};

const addAppointment = (appointment: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject("Base de datos no abierta");
    }

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add(appointment);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(`Error al agregar cita: ${event}`);
  });
};

const getAppointments = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject("Base de datos no abierta");
    }

    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(`Error al obtener citas: ${event}`);
  });
};

export { openDatabase, addAppointment, getAppointments };
