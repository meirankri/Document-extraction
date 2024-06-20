import dotenv from "dotenv";
dotenv.config();
import path from "path";

import FileRepositoryFactory from "../factories/FileRepositoryFactory";
import FSStorage from "../services/FSStorageRepository";
import StorageUseCase from "../usecase/StorageUseCase";
import { EnhancedFile } from "../types/interfaces";
import { getFilesFromUpload } from "./upload.fixture";
import { isPdf } from "../utils/checker";

describe("Test different file types to PDF conversion ", () => {
  let files: EnhancedFile[] = [];
  let storageUseCase: StorageUseCase;
  beforeAll(async () => {
    const fsStorage = new FSStorage();
    storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);

    files = await getFilesFromUpload();
  });
  test("Test image to PDF conversion", async () => {
    const imageFile = (files as EnhancedFile[]).find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".png" || mimetype === ".jpg" || mimetype === ".jpeg";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF(
      imageFile as EnhancedFile
    );
    if (!pdfFiles) throw new Error("No image to  pdf files found");
    expect(isPdf(pdfFiles.file)).toBe(true);
  }, 10000);

  test("Test docx to PDF conversion", async () => {
    const docFile = (files as EnhancedFile[]).find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".doc";
    });
    const docxFile = (files as EnhancedFile[]).find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".docx";
    });

    const pdfDocFile = await storageUseCase.convertFileToPDF(
      docFile as EnhancedFile
    );
    if (!pdfDocFile) throw new Error("No doc pdf files found");
    const pdfDocxFile = await storageUseCase.convertFileToPDF(
      docxFile as EnhancedFile
    );
    if (!pdfDocxFile) throw new Error("No docx pdf files found");

    expect(isPdf(pdfDocFile.file)).toBe(true);
    expect(isPdf(pdfDocxFile.file)).toBe(true);
  }, 15000);

  test("Test PDF to stay a PDF", async () => {
    const imageFile = (files as EnhancedFile[]).find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".pdf";
    });

    const pdfFile = await storageUseCase.convertFileToPDF(
      imageFile as EnhancedFile
    );
    if (!pdfFile) throw new Error("No pdf files found");
    expect(isPdf(pdfFile.file)).toBe(true);
  });
});
