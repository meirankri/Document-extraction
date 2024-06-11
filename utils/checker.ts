import { parse } from "file-type-mime";

export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      // Vérifier si tous les éléments du tableau sont null
      return obj.length === 0 || obj.every((element) => element === null);
    } else if (obj instanceof Map || obj instanceof Set) {
      return obj.size === 0;
    } else {
      return Object.entries(obj).length === 0;
    }
  }

  return false;
};

export const isPdf = (buffer: Buffer): boolean => {
  const pdfHeader = "%PDF-";
  const header = buffer.subarray(0, 5).toString("utf-8");
  return header === pdfHeader;
};

export const contentType = async (file: Buffer): Promise<string> => {
  const type = parse(file);

  return type ? type.mime : "";
};
