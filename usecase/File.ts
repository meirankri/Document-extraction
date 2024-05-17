import { StorageRepository } from "../types/interfaces";

class File {
  constructor(private readonly storageRepository: StorageRepository) {}

  async getNumberOfFiles() {
    return this.storageRepository.getNumberOfFiles();
  }
}

export default File;
