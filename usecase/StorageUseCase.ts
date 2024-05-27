import { tenIfMoreThanTen } from "../utils/number";
import {
  FileFromUpload,
  FileInfos,
  IFileRepository,
  PDF,
  StorageRepository,
  UploadedFiles,
} from "../types/interfaces";

class StorageUseCase {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly fileRepository: IFileRepository
  ) {}

  getFiles(folder: string, numberOfFiles?: number): Promise<UploadedFiles> {
    return this.storageRepository.getAllFiles(folder, numberOfFiles);
  }

  getLastTenFiles(files: UploadedFiles): number | null {
    return tenIfMoreThanTen(files.length);
  }

  async convertFileToPDF(
    files: FileFromUpload[]
  ): Promise<{ file: Buffer; fileInfos: FileInfos }[]> {
    const pdfFiles = [];
    for await (const file of files) {
      const pdf = await this.fileRepository.fileToPDF(file);
      if (!pdf) {
        // voir ce qu'il faut faire peut etre envoyer un mail avec les infos
        continue;
      }

      pdfFiles.push({
        file: pdf,
        fileInfos: {
          filename: file.originalname,
          ext: "pdf",
          mimetype: "application/pdf",
        },
      });
    }
    return pdfFiles;
  }

  getFile(name: string, folder: string) {
    return this.storageRepository.getFile(name, folder);
  }

  async filesUpload(
    files: { file: Buffer; fileInfos: FileInfos }[],
    folder: string
  ) {
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
