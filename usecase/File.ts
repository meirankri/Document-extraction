import { File as FileType } from "@google-cloud/storage";
import { roundNumber } from "../utils/number";
import { StorageRepository } from "../types/interfaces";

class FileUseCase {
  constructor(private readonly storageRepository: StorageRepository) {}

  async getFiles(folder: string): Promise<FileType[] | File[] | []> {
    return this.storageRepository.getAllFiles(folder);
  }

  getNumberOfFiles(files: FileType[] | File[] | []): number | null {
    return roundNumber(files.length);
  }

  async filesUpload(files: Express.Multer.File[], folder: string) {
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

export default FileUseCase;
