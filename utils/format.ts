export const removeExtension = (fileName: string): string =>
  fileName.split(".").slice(0, -1).join(".") || fileName;

export const removeAccents = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ð/g, "o");

export const removeSpecialCharactersAndHyphens = (texte: string): string => {
  texte = texte.replace(/-/g, " ");
  return texte.replace(/[^a-zA-Z0-9\s]/g, "");
};

export const compose = (...funcs: Function[]): Function => {
  return (initialValue: any) => {
    return funcs.reduce((acc, currentFunc) => currentFunc(acc), initialValue);
  };
};
