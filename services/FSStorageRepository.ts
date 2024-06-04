import fs from "fs";
import path from "path";
import {
  BufferAndFileInfo,
  EnhancedFile,
  StorageRepository,
  UploadedFile,
} from "../types/interfaces";

class FSStorageRepository implements StorageRepository {
  async getAllFiles(
    directoryPath: string,
    numberOfFiles: number
  ): Promise<UploadedFile[]> {
    try {
      const files = await fs.promises.readdir(directoryPath);
      const fileInfos: EnhancedFile[] = await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(directoryPath, file);
          const stats = await fs.promises.stat(fullPath);
          return {
            type: "file",
            name: file,
            path: fullPath,
            size: stats.size,
            isDirectory: stats.isDirectory(),
            modifiedTime: stats.mtime,
          };
        })
      );

      fileInfos.sort(
        (a, b) => a.modifiedTime.getTime() - b.modifiedTime.getTime()
      );

      return fileInfos.slice(0, numberOfFiles);
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  }
  uploadFile(file: BufferAndFileInfo, folder: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getFile(name: string, folder: string): UploadedFile {
    throw new Error("Method not implemented.");
  }
}

export default FSStorageRepository;
