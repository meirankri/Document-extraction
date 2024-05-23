import { File } from "@google-cloud/storage";

import { bucket } from "../libs/firebase";

export const uploadFile = (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  const fileRef = bucket.file(`${folder}/${Date.now()}-${file.originalname}`);
  const blobStream = fileRef.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      cacheControl: "public, max-age=31536000",
    },
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on("error", (error: Error) =>
        reject({ message: "error with firebase upload", error, file })
      )
      .on("finish", () => {
        resolve(`File uploaded successfully: ${file.originalname}`);
      })
      .end(file.buffer);
  });
};

export const deleteFile = async (filePath: string): Promise<string> => {
  try {
    await bucket.file(filePath).delete();
    return `File deleted successfully: ${filePath}`;
  } catch (error: unknown) {
    throw new Error(`Failed to delete the file: ${error}`);
  }
};

export const getFile = (name: string, folder: string): File | null => {
  try {
    return bucket.file(`${folder}/${name}`);
  } catch (error) {
    console.error("Failed to retrieve file:", error);
    return null;
  }
};

export const getAllFiles = async (
  folder: string,
  sortedFunction?: Function
): Promise<File[] | []> => {
  try {
    const [files] = await bucket.getFiles({
      prefix: folder,
    });
    if (!sortedFunction) return files || [];

    return sortedFunction(files) || [];
  } catch (error) {
    console.error("Failed to retrieve files:", error);
    return [];
  }
};

export const sortFilesByDate = (
  files: File[],
  order: "desc" | "asc" = "asc"
): File[] => {
  return files.sort((a, b) => {
    const timeA = a.metadata.timeCreated ?? new Date(0).toISOString();
    const timeB = b.metadata.timeCreated ?? new Date(0).toISOString();

    return order === "asc" ? (timeA < timeB ? -1 : 1) : timeA > timeB ? -1 : 1;
  });
};
