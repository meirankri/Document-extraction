import { findMostSimilarExamination } from "../medical"; // Assure-toi de corriger le chemin d'importation

describe("findMostSimilarExamination", () => {
  test("should return null if variable is undefined", () => {
    const exams = ["Physics", "Chemistry", "Mathematics"];
    expect(findMostSimilarExamination(undefined, exams)).toBeNull();
  });

  test("should return null if no exams are similar", () => {
    const variable = "History";
    const exams = ["Physics", "Chemistry", "Mathematics"];
    expect(findMostSimilarExamination(variable, exams)).toBeNull();
  });

  test("should return null if an exam are vaguely similar", () => {
    const variable = "History";
    const exams = ["Physics", "historycity", "Mathematics"];
    expect(findMostSimilarExamination(variable, exams)).toBeNull();
  });

  test("should return the most similar exam", () => {
    const variable = "history and medicine";
    const exams = ["Physics", "History", "Mathematics", "History and medicine"];
    expect(findMostSimilarExamination(variable, exams)).toBe(
      "History and medicine"
    );
  });

  test("should handle cases with accents and special characters correctly", () => {
    const variable = "Café-au-lait";
    const exams = ["Café au lait", "Coffee", "Tea"];
    expect(findMostSimilarExamination(variable, exams)).toBe("Café au lait");
  });
});
