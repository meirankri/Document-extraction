import { FileFromUpload, IFileRepository } from "../types/interfaces";
import FirebaseFilePdfRepository from "../services/FirebaseFilePdfRepository";
import FSFilePdfRepository from "../services/FSFilePdfRepository";

class FileRepositoryFactory {
  static createFileRepository(file: FileFromUpload): IFileRepository {
    if (file.type === "multer") {
      return new FirebaseFilePdfRepository();
    }
    if (file.type === "file") {
      return new FSFilePdfRepository();
    }
    throw new Error("File type not supported");
  }

  static deleteFilesRepository(): IFileRepository {
    return new FirebaseFilePdfRepository();
  }
  static deleteFileRepository(): IFileRepository {
    return new FirebaseFilePdfRepository();
  }
}

export default FileRepositoryFactory;
