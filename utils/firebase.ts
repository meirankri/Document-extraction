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

export const getAllFiles = async (folder: string): Promise<File[] | []> => {
  try {
    const [files] = await bucket.getFiles({
      prefix: folder,
    });

    return files || [];
  } catch (error) {
    console.error("Failed to retrieve files:", error);
    return [];
  }
};
