import dotenv from "dotenv";
dotenv.config();
require("./instrument.js");
const Sentry = require("@sentry/node");
(global as any).__basedir = __dirname;

import express, { Request, Response } from "express";
import FileUseCase from "./usecase/FileUseCase";
import StorageUseCase from "./usecase/StorageUseCase";

import FirebaseStorage from "./services/FirebaseStorage";
import FirebaseFilePdfRepository from "./services/FirebaseFilePdfRepository";

import { checkMimeType } from "./libs/multer";
import {
  FileFromUpload,
  FileWithInfo,
  UploadedFiles,
} from "./types/interfaces";
import { isEmpty } from "./utils/checker";

import FileRepositoryFactory from "./factories/FileRepositoryFactory";
import documentAi from "./usecase/scripts/document-ai";
import { logger } from "./utils/logger";
import { ExtendedResponse } from "./types/interfaces";
import db from "./libs/sqlite";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firebaseFolder = "documents";

app.post("/upload", checkMimeType, async (req: Request, res: Response) => {
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
  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    FileRepositoryFactory
  );

  const pdfFiles = await storageUseCase.convertFileToPDF(files);

  if (isEmpty(pdfFiles)) {
    return res.status(500).send("Error converting files to pdf.");
  }
  try {
    const response = await storageUseCase.filesUpload(pdfFiles, firebaseFolder);
    if (response.error) {
      logger({
        message: "response.error uploading files",
        context: response.error,
      }).error();
      return res.status(500).send("Error uploading files.");
    }
  } catch (error) {
    logger({
      message: "Error uploading files",
      context: error,
    }).error();
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
    return res.status(400).send("Not enough scanned files.");
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

  try {
    const base64Files = await fileUseCase.filesToBase64([
      ...(scannedFilesAndData || []),
    ]);

    if (!isEmpty(scannedFilesToDelete)) {
      try {
        await storageUseCase.deleteFiles(scannedFilesToDelete);
      } catch (error) {
        logger({
          message: "Error deleting files",
          context: { error, scannedFilesToDelete },
        }).error();
      }
    }

    res.json(!isEmpty(base64Files) ? base64Files : { message: "NO_DATA" });
  } catch (error) {
    logger({
      message: "Error converting files to base64",
      context: error,
    }).error();
    res.status(500).send("Error converting files to base64");
  }
});

const PORT = process.env.PORT || 8080;

Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(
  err: Error,
  req: Request,
  res: ExtendedResponse,
  next: Function
) {
  // Assurez-vous que le middleware d'erreur ne s'active que lorsqu'il y a vraiment une erreur.
  if (!err) {
    return next();
  }

  // The error id is attached to `res.sҽntry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  console.log("debug-sentry");
  // res.send("Hello Sentry World!");
  throw new Error("My first Sentry error!");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
