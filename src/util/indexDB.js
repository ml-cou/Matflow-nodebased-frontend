import Papa from 'papaparse'

const fetchDataFromIndexedDB = (name) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["data"], "readonly");
      const objectStore = transaction.objectStore("data");
      const getDataRequest = objectStore.getAll();

      getDataRequest.onsuccess = (event) => {
        const data = event.target.result;
        resolve(data);
      };

      transaction.onerror = (event) => {
        console.error("IndexedDB transaction error:", event.target.error);
        reject(event.target.error);
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

const storeDataInIndexedDB = (data, name) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["data"], "readwrite");
      const objectStore = transaction.objectStore("data");

      transaction.onerror = (event) => {
        console.error("IndexedDB transaction error:", event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        resolve();
      };

      data.forEach((item) => {
        objectStore.add(item);
      });
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

const deleteIndexedDB = (name) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(name);

    request.onerror = (event) => {
      console.error("Error deleting IndexedDB database:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = () => {
      console.log("IndexedDB database deleted successfully");
      resolve();
    };
  });
};

const parseCsv = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

function fixMismatchedColumns(parsedData) {
  const maxColumns = Math.max(...parsedData.map(row => row.length));

  // Align columns for each row
  const alignedData = parsedData.map(row => {
    if (row.length < maxColumns) {
      // Add empty values or placeholders for missing columns
      const missingColumns = maxColumns - row.length;
      return [...row, ...Array(missingColumns).fill('')];
    } else if (row.length > maxColumns) {
      // Truncate extra columns
      return row.slice(0, maxColumns);
    } else {
      // Row already has the correct column count
      return row;
    }
  });

  return alignedData;
}

export { fetchDataFromIndexedDB, storeDataInIndexedDB, parseCsv, deleteIndexedDB, fixMismatchedColumns };
