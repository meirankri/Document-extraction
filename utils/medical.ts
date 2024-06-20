import { ObjectType } from "../types/interfaces";
import {
  compose,
  removeAccents,
  removeSpecialCharactersAndHyphens,
} from "./format";

export const findMostSimilarExamination = (
  variable: string | undefined,
  examsMap: ObjectType
): string | null => {
  if (!variable) return null;

  const processText = compose(removeAccents, removeSpecialCharactersAndHyphens);

  const normalizedSearchText = processText(variable).toLowerCase();
  for (const key in examsMap) {
    if (examsMap.hasOwnProperty(key)) {
      const normalizedKey = processText(key).toLowerCase();
      if (normalizedKey === normalizedSearchText) {
        return examsMap[key];
      }
    }
  }

  return null;
};

const calculateSimilarity = (s1: string, s2: string): number => {
  let longer = s1.length > s2.length ? s1 : s2;
  let shorter = s1.length > s2.length ? s2 : s1;
  let maxLen = 0;

  for (let i = 0; i < shorter.length; i++) {
    for (let j = i + 1; j <= shorter.length; j++) {
      let substr = shorter.substring(i, j);
      if (longer.includes(substr) && substr.length > maxLen) {
        maxLen = substr.length;
      }
    }
  }

  return maxLen / longer.length;
};
