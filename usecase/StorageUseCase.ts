import { tenIfMoreThanTen } from "../utils/number";
import {
  BufferAndFileInfo,
  FileFromUpload,
  FileInfos,
  IFileRepository,
  PDF,
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

  getLastTenFiles(files: UploadedFiles): number | null {
    return tenIfMoreThanTen(files.length);
  }

  async convertFileToPDF(
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

  getFile(name: string, folder: string) {
    return this.storageRepository.getFile(name, folder);
  }

  async filesUpload(files: BufferAndFileInfo[], folder: string) {
    const filesPromises: Promise<string>[] = [];
    for (const file of files) {
      filesPromises.push(this.storageRepository.uploadFile(file, folder));
    }
    return Promise.all(filesPromises)
      .catch((error) => {
        console.error("error bulk upload", error);
        return error;
      })
      .then((filesNames) => filesNames);
  }
}

export default StorageUseCase;
