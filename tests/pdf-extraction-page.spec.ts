import dotenv from "dotenv";
dotenv.config();

import {
  EnhancedFile,
  ExtractDataArgument,
  FileInfos,
  UploadedFiles,
} from "../types/interfaces";

import { convertFilesToPDF, getFilesFromUpload } from "./upload.fixture";
import { getPageCount } from "../utils/pdfLib";
import FSFilePdfRepository from "../services/FSFilePdfRepository";
import FileUseCase from "../usecase/FileUseCase";

describe("Test the pdf extraction use case", () => {
  let files: UploadedFiles = [];
  let pdfFiles: UploadedFiles = [];
  let info: FileInfos[] = [];
  let pdfFilesFirstPageExtracted: ExtractDataArgument = [];
  let pdfFileRepository: FSFilePdfRepository;
  beforeAll(async () => {
    files = await getFilesFromUpload();
    ({ files: pdfFiles, info } = await convertFilesToPDF(
      files as EnhancedFile[]
    ));
  });

  test("Test the extraction of the first page of a PDF", async () => {
    pdfFileRepository = new FSFilePdfRepository();

    const fileUseCase = new FileUseCase(pdfFileRepository, pdfFiles);
    pdfFilesFirstPageExtracted =
      (await fileUseCase.handleMultipleFiles()) || [];

    for await (const pdfFile of pdfFilesFirstPageExtracted) {
      const count = await getPageCount(pdfFile.file);

      expect(count).toBe(1);
    }
  });

  test("Test the creation of 1 pdf with all the first pages", async () => {
    const fileUseCase = new FileUseCase(pdfFileRepository, pdfFiles);

    const pdfFile = await fileUseCase.handleFiles();
    const pageCount = pdfFile ? await getPageCount(pdfFile) : 0;
    expect(pageCount).toBe(pdfFilesFirstPageExtracted.length);
  });
  const handleMultipleFilesMock = jest
    .spyOn(FileUseCase.prototype, "handleMultipleFiles")
    .mockImplementation(async () => {
      return null;
    });

  test("It should return null if the pdf extraction fails", async () => {
    const pdfFileRepository = new FSFilePdfRepository();
    const fileUseCase = new FileUseCase(pdfFileRepository, []);
    const pdfFilesFirstPageExtracted = await fileUseCase.handleFiles();
    expect(handleMultipleFilesMock).toHaveBeenCalled();
    expect(pdfFilesFirstPageExtracted).toBeNull();
  });
});
