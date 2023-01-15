const to2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formatDateForDB = (date: Date) => {
  const year = to2Digits(date.getFullYear());
  const month = to2Digits(date.getMonth() + 1);
  const day = to2Digits(date.getDate());
  return `${year}-${month}-${day}`;
};
