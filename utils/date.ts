import { parse, isValid } from "date-fns";
import { enGB } from "date-fns/locale";

export const isValidDate = (date: string | null | undefined): boolean => {
  if (!date) return false;
  const parsedDate = parse(date, "P", new Date(), { locale: enGB });
  return isValid(parsedDate);
};
