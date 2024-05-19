import { File as GoogleFile } from "@google-cloud/storage";

import {
  getAllFiles as firebaseGetAllFiles,
  uploadFile,
} from "../utils/firebase";
import { StorageRepository } from "./../types/interfaces";

class FirebaseStorage implements StorageRepository {
  getAllFiles(folder: string): Promise<File[] | GoogleFile[] | []> {
    return firebaseGetAllFiles(folder);
  }
  addFile(file: Express.Multer.File): Promise<string> {
    throw new Error("Method not implemented.");
  }
  uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return uploadFile(file, folder);
  }
}

export default FirebaseStorage;
