import dotenv from "dotenv";
dotenv.config();
import DataExtractionGeminiRepository from "../services/DataExtractionGeminiRepository";

import generateContent from "../utils/gemini";

jest.mock("../utils/gemini");

const mockGenerateContent = generateContent as jest.MockedFunction<
  typeof generateContent
>;

describe("DataExtractionGeminiRepository Tests", () => {
  const documents = [
    { file: Buffer.from("some data"), contentType: "application/pdf" },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful data extraction", async () => {
    const expectedData = { page: 1, details: "Sample Info" };
    mockGenerateContent.mockResolvedValue(expectedData);

    const repo = new DataExtractionGeminiRepository();
    const result = await repo.handleMultipleFiles(documents);

    expect(mockGenerateContent).toHaveBeenCalled();
    expect(result).toContainEqual(expectedData);
  });

  it("should handle errors during data extraction", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Failed to fetch data"));

    const repo = new DataExtractionGeminiRepository();
    await expect(repo.handleMultipleFiles(documents)).rejects.toThrow(
      "Failed to fetch data"
    );
  });
});
