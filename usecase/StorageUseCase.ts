import { roundNumber } from "../utils/number";
import { StorageRepository, UploadedFiles } from "../types/interfaces";

class StorageUseCase {
  constructor(private readonly storageRepository: StorageRepository) {}

  getFiles(folder: string): Promise<UploadedFiles> {
    return this.storageRepository.getAllFiles(folder);
  }

  getNumberOfFiles(files: UploadedFiles): number | null {
    return roundNumber(files.length);
  }

  getFile(name: string, folder: string) {
    return this.storageRepository.getFile(name, folder);
  }

  getOldestFilesByNumber(files: UploadedFiles, number: number) {
    return files.slice(0, number);
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

export default StorageUseCase;
