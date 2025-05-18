export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateForm = (fields) => {
  return Object.values(fields).every((val) => val?.trim() !== "");
};
