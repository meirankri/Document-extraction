import {
  getAllFiles as firebaseGetAllFiles,
  uploadFile,
  getFile,
  sortFilesByDate,
} from "../utils/firebase";
import {
  FileInfos,
  StorageRepository,
  UploadedFile,
  UploadedFiles,
} from "../types/interfaces";

class FirebaseStorage implements StorageRepository {
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
  uploadFile(
    file: { file: Buffer; fileInfos: FileInfos },
    folder: string
  ): Promise<string> {
    return uploadFile(file, folder);
  }
}

export default FirebaseStorage;
