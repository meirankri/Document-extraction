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
import FileUseCase from "../usecase/FileUseCase";
import FSFilePdfRepository from "../services/FSFilePdfRepository";

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
    pdfFilesFirstPageExtracted = await fileUseCase.handleMultipleFiles();

    for await (const pdfFile of pdfFilesFirstPageExtracted) {
      const count = await getPageCount(pdfFile.file);

      expect(count).toBe(1);
    }
  });

  test("Test the creation of 1 pdf with all the first pages", async () => {
    const fileUseCase = new FileUseCase(pdfFileRepository, pdfFiles);

    const pdfFile = await fileUseCase.handleFiles();
    const pageCount = await getPageCount(pdfFile);
    expect(pageCount).toBe(pdfFilesFirstPageExtracted.length);
  });
});
