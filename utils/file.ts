import { FirebaseFile } from "../types/interfaces";

export const bufferToBase64 = (buffer: Buffer) => {
  return Buffer.from(buffer).toString("base64");
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

const streamToBase64 = (stream: NodeJS.ReadableStream): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => {
      const base64String = Buffer.concat(chunks).toString("base64");
      resolve(base64String);
    });
  });
};

// Fonction pour convertir le contenu d'un File en base64
export const convertFirebaseFileToBase64 = async (
  file: FirebaseFile
): Promise<string> => {
  const stream = file.createReadStream();
  return streamToBase64(stream);
};
