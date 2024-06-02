import dotenv from "dotenv";
dotenv.config();
import path from "path";

import FileRepositoryFactory from "../factories/FileRepositoryFactory";
import FSFilePdfRepository from "../services/FSFilePdfRepository";
import FSStorage from "../services/FSStorageRepository";
import StorageUseCase from "../usecase/StorageUseCase";
import { EnhancedFile, UploadedFiles } from "../types/interfaces";

describe("Test different file types to PDF conversion ", () => {
  let files: UploadedFiles = [];
  let storageUseCase: StorageUseCase;
  beforeAll(async () => {
    const fsStorage = new FSStorage();
    storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);
    const relativePath = "./tests/uploads"; // Replace with your relative path
    const absolutePath = path.resolve(relativePath); // Convert to absolute path

    files = await storageUseCase.getFiles(absolutePath);
  });
  test("Test image to PDF conversion", async () => {
    const imageFile = files.find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".png" || mimetype === ".jpg" || mimetype === ".jpeg";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF([
      imageFile,
    ] as EnhancedFile[]);

    function isPdf(buffer: Buffer): boolean {
      const pdfHeader = "%PDF-";
      const header = buffer.subarray(0, 5).toString("utf-8");
      return header === pdfHeader;
    }

    expect(isPdf(pdfFiles[0].file)).toBe(true);
  });

  test("Test docx to PDF conversion", async () => {
    const imageFile = files.find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".docx" || mimetype === ".doc";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF([
      imageFile,
    ] as EnhancedFile[]);

    function isPdf(buffer: Buffer): boolean {
      const pdfHeader = "%PDF-";
      const header = buffer.subarray(0, 5).toString("utf-8");
      return header === pdfHeader;
    }

    expect(isPdf(pdfFiles[0].file)).toBe(true);
  });

  test("Test PDF to stay a PDF", async () => {
    const imageFile = files.find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".pdf";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF([
      imageFile,
    ] as EnhancedFile[]);

    function isPdf(buffer: Buffer): boolean {
      const pdfHeader = "%PDF-";
      const header = buffer.subarray(0, 5).toString("utf-8");
      return header === pdfHeader;
    }

    expect(isPdf(pdfFiles[0].file)).toBe(true);
  });
});
