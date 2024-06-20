import {
  getAllFiles as firebaseGetAllFiles,
  uploadFile,
  getFile,
  sortFilesByDate,
  getFilesByFileName,
} from "../utils/firebase";
import {
  BufferAndFileInfo,
  StorageRepository,
  UploadedFile,
  UploadedFiles,
} from "../types/interfaces";

class FirebaseStorage implements StorageRepository {
  getFilesByFileName(names: string[]): Promise<UploadedFiles> {
    return getFilesByFileName(names);
  }
  getFile(name: string, folder: string): UploadedFile {
    return getFile(name, folder);
  }
  getAllFiles(folder: string, numberOfFiles?: number): Promise<UploadedFiles> {
    return firebaseGetAllFiles({
      folder,
      maxResults: numberOfFiles,
      sortedFunction: sortFilesByDate,
    });
  }
  uploadFile(file: BufferAndFileInfo, folder: string): Promise<string> {
    return uploadFile(file, folder);
  }
}

export default FirebaseStorage;
