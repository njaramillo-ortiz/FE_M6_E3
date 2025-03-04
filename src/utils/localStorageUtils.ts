export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    console.log("Guardando en LocalStorage", key, data); 
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    console.log("Recuperando de LocalStorage", key, data); 
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error("Error al recuperar de LocalStorage:", error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    console.log("Eliminando de LocalStorage", key); 
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error al eliminar de LocalStorage:", error);
  }
};

export const saveUserCredentials = (username: string, password: string): void => {
  const credentials = { username, password };
  saveToLocalStorage("userCredentials", credentials);
};

export const getUserCredentials = (): { username: string; password: string } | null => {
  const credentials = getFromLocalStorage("userCredentials");
  console.log("Credenciales recuperadas", credentials); 
  return credentials;
};

export const removeUserCredentials = (): void => {
  removeFromLocalStorage("userCredentials");
};
