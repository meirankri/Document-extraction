import { roundNumber } from "./number";

describe("test the number utils", () => {
  test("round 11 to 10", () => {
    const number = 11;
    const result = roundNumber(number);
    expect(result).toEqual(10);
  });
  test("round 29 to 30", () => {
    const number = 30;
    const result = roundNumber(number);
    expect(result).toEqual(30);
  });
  test("round 85 to 80", () => {
    const number = 85;
    const result = roundNumber(number);
    expect(result).toEqual(80);
  });
  test("return null if under delimiter", () => {
    const number = 9;
    const delimiter = 10;
    const result = roundNumber(number, delimiter);
    expect(result).toEqual(null);
  });
});
