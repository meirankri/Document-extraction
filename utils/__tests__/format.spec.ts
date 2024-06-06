import {
  removeExtension,
  removeAccents,
  removeSpecialCharactersAndHyphens,
  compose,
} from "../format";

describe("removeExtension", () => {
  test("should remove the file extension", () => {
    expect(removeExtension("example.txt")).toBe("example");
  });

  test("should handle filenames without an extension", () => {
    expect(removeExtension("filename")).toBe("filename");
  });

  test("should handle filenames with multiple dots", () => {
    expect(removeExtension("example.tar.gz")).toBe("example.tar");
  });
});

describe("removeAccents", () => {
  test("should remove accents from string", () => {
    expect(removeAccents("àáâãäåçèéêëìíîïðñòóôõöùúûüýÿ")).toBe(
      "aaaaaaceeeeiiiionooooouuuuyy"
    );
  });

  test("should handle strings without accents", () => {
    expect(removeAccents("test")).toBe("test");
  });
});

describe("removeSpecialCharactersAndHyphens", () => {
  test("should replace hyphens with spaces and remove special characters", () => {
    expect(removeSpecialCharactersAndHyphens("hello-world!")).toBe(
      "hello world"
    );
  });

  test("should handle strings without special characters or hyphens", () => {
    expect(removeSpecialCharactersAndHyphens("hello world")).toBe(
      "hello world"
    );
  });
});

describe("compose", () => {
  test("should remove accents and then special characters and hyphens", () => {
    const input = "Café-au-lait! Quelle journée!";

    const processText = compose(
      removeAccents,
      removeSpecialCharactersAndHyphens
    );

    const result = processText(input);
    expect(result).toBe("Cafe au lait Quelle journee");
  });
});
