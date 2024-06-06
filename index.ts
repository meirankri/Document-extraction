import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import FileUseCase from "./usecase/FileUseCase";
import StorageUseCase from "./usecase/StorageUseCase";
import DataExtractionUseCase from "./usecase/DataExtractionUseCase";

import FirebaseStorage from "./services/FirebaseStorage";
import FirebaseFilePdfRepository from "./services/FirebaseFilePdfRepository";

import { uploadMultiple } from "./libs/multer";
import {
  FileFromUpload,
  FileWithInfo,
  UploadedFiles,
} from "./types/interfaces";
import { isEmpty } from "./utils/checker";

import FileRepositoryFactory from "./factories/FileRepositoryFactory";
import documentAi from "./usecase/scripts/document-ai";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firebaseFolder = "documents";

app.post("/upload", uploadMultiple, async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const files =
    (Array.isArray(req.files) &&
      (req.files.map((file) => {
        const type: "multer" | "file" = "multer";
        return {
          ...file,
          type,
        };
      }) as Array<FileFromUpload>)) ||
    [];
  const firebaseRepository = new FirebaseStorage();
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    FileRepositoryFactory
  );
  const pdfFiles = await storageUseCase.convertFileToPDF(files);

  if (isEmpty(pdfFiles)) {
    return res.status(500).send("Error converting files to pdf.");
  }
  try {
    await storageUseCase.filesUpload(pdfFiles, firebaseFolder);
  } catch (error) {
    // peut etre envoyer un mail à l'admin
    console.error("Error uploading files", error);
    return res.status(500).send("Error uploading files.");
  }
  res.status(200).send("Files uploaded.");
});

app.post("/extract", async (req: Request, res: Response) => {
  const firebaseRepository = new FirebaseStorage();
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    FileRepositoryFactory
  );
  let filesFromFirebase: UploadedFiles = [];
  try {
    filesFromFirebase = await storageUseCase.getFiles(firebaseFolder, 10);
  } catch (error) {}
  if (isEmpty(filesFromFirebase)) {
    return res.status(500).send("Error getting files from firebase.");
  }

  const fileUseCase = new FileUseCase(pdfFileRepository, filesFromFirebase);

  let scannedFilesAndData: FileWithInfo[] | null = null,
    scannedFilesToDelete: UploadedFiles | null = null;
  if (isEmpty(filesFromFirebase) || filesFromFirebase.length < 10) {
    return res.status(500).send("Not enough scanned files.");
  }
  try {
    ({ scannedFilesAndData, scannedFilesToDelete } = await documentAi(
      filesFromFirebase as UploadedFiles
    ));
  } catch (error) {}

  if (!scannedFilesAndData) {
    return res
      .status(500)
      .send(
        "Extraction data failed because of documentAi script return null ."
      );
  }

  if (!isEmpty(scannedFilesAndData)) {
    try {
      const base64Files = await fileUseCase.filesToBase64([
        ...(scannedFilesAndData || []),
      ]);

      if (!isEmpty(scannedFilesToDelete)) {
        try {
          await storageUseCase.deleteFiles(scannedFilesToDelete);
        } catch (error) {
          console.error("Error deleting files", error, scannedFilesToDelete);
        }
      }

      res.json(base64Files);
    } catch (error) {
      console.error("Error converting files to base64", error);
      res.status(500).send("Error converting files to base64");
    }
  } else {
    res.status(500).send("Extraction data failed.");
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
