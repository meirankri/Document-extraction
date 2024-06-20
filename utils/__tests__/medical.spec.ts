import { findMostSimilarExamination } from "../medical";

describe("findMostSimilarExamination", () => {
  const examsMap = {
    Audiogramme: "Audiology Test",
    Audiométrie: "Hearing Measurement",
    "Prothèse auditive": "Hearing Aid Service",
    Échodoppler: "Echo-Doppler Test",
  };

  test("should return null for undefined input", () => {
    expect(findMostSimilarExamination(undefined, examsMap)).toBeNull();
  });

  test("should return null when no matches are found", () => {
    expect(findMostSimilarExamination("X-ray", examsMap)).toBeNull();
  });

  test("should handle accents and special characters correctly", () => {
    expect(findMostSimilarExamination("Audiometrie", examsMap)).toBe(
      "Hearing Measurement"
    );
    expect(findMostSimilarExamination("échodoppler", examsMap)).toBe(
      "Echo-Doppler Test"
    );
  });

  test("should return correct examination when an exact match is found", () => {
    expect(findMostSimilarExamination("Audiogramme", examsMap)).toBe(
      "Audiology Test"
    );
  });

  test("should be case insensitive", () => {
    expect(findMostSimilarExamination("audiogramme", examsMap)).toBe(
      "Audiology Test"
    );
  });
});
