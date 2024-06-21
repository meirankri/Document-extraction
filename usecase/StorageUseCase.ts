import { tenIfMoreThanTen } from "../utils/number";
import {
  BufferAndFileInfo,
  FileFromUpload,
  StorageRepository,
  UploadedFiles,
} from "../types/interfaces";
import FileRepositoryFactory from "../factories/FileRepositoryFactory";
import { logger } from "../utils/logger";

class StorageUseCase {
  private fileRepositoryFactory: typeof FileRepositoryFactory;

  constructor(
    private readonly storageRepository: StorageRepository,
    fileRepository: typeof FileRepositoryFactory
  ) {
    this.fileRepositoryFactory = fileRepository;
  }

  async deleteFiles(files: UploadedFiles | null) {
    if (!files) {
      return;
    }
    return this.fileRepositoryFactory
      .deleteFilesRepository()
      .deleteFiles(files);
  }

  getFiles(folder: string, numberOfFiles?: number): Promise<UploadedFiles> {
    return this.storageRepository.getAllFiles(folder, numberOfFiles);
  }

  async getFilesByFileName(names: string[]): Promise<UploadedFiles> {
    return this.storageRepository.getFilesByFileName(names);
  }

  getLastTenFiles(files: UploadedFiles): number | null {
    return tenIfMoreThanTen(files.length);
  }

  async convertFilesToPDF(
    files: FileFromUpload[]
  ): Promise<BufferAndFileInfo[]> {
    const pdfFiles = [];
    for await (const file of files) {
      const pdf = await this.fileRepositoryFactory
        .createFileRepository(file)
        .fileToPDF(file);

      if (!pdf) {
        logger({
          message: "Error converting file to pdf",
          context: file,
        }).error();
        continue;
      }
      const fileInfo = this.fileRepositoryFactory
        .createFileRepository(file)
        .getFileInfo(file);
      pdfFiles.push({
        file: pdf,
        fileInfos: fileInfo,
      });
    }
    return pdfFiles;
  }

  async convertFileToPDF(
    file: FileFromUpload
  ): Promise<BufferAndFileInfo | null> {
    const pdf = await this.fileRepositoryFactory
      .createFileRepository(file)
      .fileToPDF(file);

    if (!pdf) {
      logger({
        message: "Error converting file to pdf",
        context: file,
      }).error();
      return null;
    }
    const fileInfo = this.fileRepositoryFactory
      .createFileRepository(file)
      .getFileInfo(file);
    return {
      file: pdf,
      fileInfos: fileInfo,
    };
  }

  getFile(name: string, folder: string) {
    return this.storageRepository.getFile(name, folder);
  }

  async fileUpload(file: BufferAndFileInfo, folder: string) {
    return this.storageRepository.uploadFile(file, folder);
  }

  async filesUpload(files: BufferAndFileInfo[], folder: string) {
    const filesPromises: Promise<string>[] = [];
    for (const file of files) {
      filesPromises.push(this.storageRepository.uploadFile(file, folder));
    }
    return Promise.all(filesPromises)
      .catch((error) => {
        logger({
          message: "Error uploading files",
          context: error,
        }).error();
        return error;
      })
      .then((filesNames) => filesNames);
  }
}

export default StorageUseCase;
