import {
  compose,
  removeAccents,
  removeSpecialCharactersAndHyphens,
} from "./format";

export const findMostSimilarExamination = (
  variable: string | undefined,
  exams: string[]
): string | null => {
  if (!variable) return null;

  const processText = compose(removeAccents, removeSpecialCharactersAndHyphens);

  for (const exam of exams) {
    if (
      processText(exam).toLowerCase() === processText(variable).toLowerCase()
    ) {
      return exam;
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
