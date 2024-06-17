import { File } from "@google-cloud/storage";

import { bucket } from "../libs/firebase";
import { BufferAndFileInfo } from "../types/interfaces";
import { removeExtension } from "./format";

export const uploadFile = (
  file: BufferAndFileInfo,
  folder: string,
  mimetype: string = "application/pdf",
  ext: string = "pdf"
): Promise<string> => {
  const fileRef = bucket.file(
    `${folder}/${Date.now()}-${removeExtension(file.fileInfos.filename)}.${ext}`
  );
  const blobStream = fileRef.createWriteStream({
    metadata: {
      contentType: mimetype,
      cacheControl: "public, max-age=31536000",
    },
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on("error", (error: Error) =>
        reject({ message: "error with firebase upload", error, file })
      )
      .on("finish", async () => {
        resolve(fileRef.name);
      })
      .end(file.file);
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

export const getAllFiles = async ({
  folder,
  maxResults,
  sortedFunction,
}: {
  folder: string;
  maxResults?: number;
  sortedFunction?: (files: File[]) => File[];
}): Promise<File[] | []> => {
  try {
    const normalizedFolder = folder.endsWith("/") ? folder : `${folder}/`;

    const [files] = await bucket.getFiles({
      prefix: normalizedFolder,
    });

    const filteredFiles = files.filter((file) => !file.name.endsWith("/"));
    const limitedFiles = maxResults
      ? filteredFiles.slice(0, maxResults)
      : filteredFiles;
    if (!sortedFunction) return limitedFiles || [];

    return sortedFunction(limitedFiles) || [];
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
