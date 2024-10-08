export const roundNumber = (
  number: number,
  delimiter: number = 10
): number | null => {
  if (number < delimiter) return null;
  return Math.floor(number / 10) * 10;
};

export const tenIfMoreThanTen = (number: number): number | null =>
  number > 10 ? 10 : null;
