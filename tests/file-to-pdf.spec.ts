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

    const pdfFiles = await storageUseCase.convertFileToPDF([
      imageFile,
    ] as EnhancedFile[]);

    expect(isPdf(pdfFiles[0].file)).toBe(true);
  });

  test("Test docx to PDF conversion", async () => {
    const docFiles = (files as EnhancedFile[]).filter((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".docx" || mimetype === ".doc";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF(
      docFiles as EnhancedFile[]
    );

    expect(pdfFiles.length).toBe(docFiles.length);
    pdfFiles.forEach((pdf) => {
      expect(isPdf(pdf.file)).toBe(true);
    });
  }, 10000);

  test("Test PDF to stay a PDF", async () => {
    const imageFile = (files as EnhancedFile[]).find((file) => {
      const mimetype = file?.name
        ? path.extname(file.name).toLowerCase()
        : undefined;
      return mimetype === ".pdf";
    });

    const pdfFiles = await storageUseCase.convertFileToPDF([
      imageFile,
    ] as EnhancedFile[]);

    expect(isPdf(pdfFiles[0].file)).toBe(true);
  });
});
