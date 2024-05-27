export const removeExtension = (fileName: string): string =>
  fileName.split(".").slice(0, -1).join(".") || fileName;
