// Minimal IndexedDB access: one database, two object stores. IndexedDB holds
// far more than localStorage's ~5 MB, which image-heavy boards outgrow.
const DB_NAME = "draw";
const DB_VERSION = 1;

export type StoreName = "boards" | "meta";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("boards")) {
        db.createObjectStore("boards", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error ?? new Error("IndexedDB unavailable"));
    };
  });
  return dbPromise;
}

async function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  op: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = op(tx.objectStore(store));
    // Resolve on commit, not on request success: a quota error surfaces as a
    // transaction abort after the request itself has succeeded.
    tx.oncomplete = () => resolve(req.result);
    tx.onabort = tx.onerror = () =>
      reject(tx.error ?? req.error ?? new Error("IndexedDB transaction failed"));
  });
}

export function idbGet<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  return run<T | undefined>(store, "readonly", (s) => s.get(key));
}

export function idbGetAll<T>(store: StoreName): Promise<T[]> {
  return run<T[]>(store, "readonly", (s) => s.getAll());
}

export function idbPut(store: StoreName, value: unknown, key?: IDBValidKey): Promise<IDBValidKey> {
  return run(store, "readwrite", (s) => s.put(value, key));
}

export function idbDelete(store: StoreName, key: IDBValidKey): Promise<undefined> {
  return run(store, "readwrite", (s) => s.delete(key));
}
