import {
  getAllFiles as firebaseGetAllFiles,
  uploadFile,
  getFile,
  sortFilesByDate,
} from "../utils/firebase";
import {
  FileFromUpload,
  StorageRepository,
  UploadedFile,
  UploadedFiles,
} from "./../types/interfaces";

class FirebaseStorage implements StorageRepository {
  getFile(name: string, folder: string): UploadedFile {
    return getFile(name, folder);
  }
  getAllFiles(folder: string): Promise<UploadedFiles> {
    return firebaseGetAllFiles(folder, sortFilesByDate);
  }
  uploadFile(file: FileFromUpload, folder: string): Promise<string> {
    return uploadFile(file, folder);
  }
}

export default FirebaseStorage;
