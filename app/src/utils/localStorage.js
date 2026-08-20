// 로컬스토리지 키(문자열)와 값(아무 js값)을 받아, 값을 문자열로 변환 후 해당 키-데이터를 로컬스토리지에 저장
export const saveLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// 로컬스토리지 키(문자열)에 들어있는 데이터를 가져옴
export const loadLocalStorageItem = key => {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) return null;

  try {
    return JSON.parse(savedValue);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

// 로컬스토리지 키(문자열)에 들어있는 데이터를 지움
export const deleteLocalStorageItem = key => {
  localStorage.removeItem(key);
};
