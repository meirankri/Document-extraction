import path from "path";

import FileRepositoryFactory from "../factories/FileRepositoryFactory";
import FSStorage from "../services/FSStorageRepository";
import StorageUseCase from "../usecase/StorageUseCase";
import { EnhancedFile, FileInfos, UploadedFiles } from "../types/interfaces";

export const getFilesFromUpload = async (): Promise<EnhancedFile[]> => {
  const fsStorage = new FSStorage();
  const storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);
  const relativePath = "./tests/uploads"; // Replace with your relative path
  const absolutePath = path.resolve(relativePath); // Convert to absolute path

  const files = (await storageUseCase.getFiles(absolutePath)) as EnhancedFile[];
  return files;
};

export const convertFilesToPDF = async (
  files: EnhancedFile[]
): Promise<{ files: UploadedFiles; info: FileInfos[] }> => {
  const fsStorage = new FSStorage();
  const storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);
  const pdfFiles = await storageUseCase.convertFileToPDF(
    files as EnhancedFile[]
  );

  return {
    files: pdfFiles.map((file) => file.file),
    info: pdfFiles.map((file) => file.fileInfos),
  };
};
