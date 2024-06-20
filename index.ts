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

import { checkMimeType } from "./middelwares/multer";
import { checkDocumentId } from "./middelwares/document-id";
import {
  EnhancedFile,
  FileFromUpload,
  FileWithInfo,
  UploadedFiles,
} from "./types/interfaces";
import { isEmpty } from "./utils/checker";

import FileRepositoryFactory from "./factories/FileRepositoryFactory";
import documentAi from "./usecase/scripts/document-ai";
import { logger } from "./utils/logger";
import { ExtendedResponse } from "./types/interfaces";
import { deleteDocuments, getDocuments, insertDocument } from "./libs/sqlite";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firebaseFolder = process.env.UPLOAD_FOLDER || "";

app.post(
  "/upload",
  checkMimeType,
  checkDocumentId,
  async (req: Request, res: Response) => {
    const file = {
      ...req.file,
      type: "multer",
    };

    const documentID = req.body.documentID;

    const firebaseRepository = new FirebaseStorage();
    const storageUseCase = new StorageUseCase(
      firebaseRepository,
      FileRepositoryFactory
    );

    const pdfFile = await storageUseCase.convertFileToPDF(
      file as FileFromUpload
    );

    if (!pdfFile) {
      return res.status(500).send("Error converting files to pdf.");
    }
    let uploadedFile = "";
    try {
      uploadedFile = await storageUseCase.fileUpload(pdfFile, firebaseFolder);
    } catch (error) {
      logger({
        message: "Error uploading files",
        context: error,
      }).error();
      return res.status(500).send("Error uploading files.");
    }
    if (uploadedFile) {
      try {
        await insertDocument(documentID, uploadedFile);
      } catch (error) {
        logger({
          message: "Error calling inserting document function",
          context: error,
        }).error();
        return res
          .status(500)
          .json({ message: "Error inserting document.", error });
      }
    }
    res.status(200).send("Files uploaded.");
  }
);

app.post("/extract", async (req: Request, res: Response) => {
  const documents = await getDocuments();
  if (!documents) {
    return res.status(200).send("No documents found.");
  }
  const documentNames = documents.map((document) => document.documentName);

  const firebaseRepository = new FirebaseStorage();
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    FileRepositoryFactory
  );
  let filesFromFirebase: UploadedFiles = [];
  try {
    filesFromFirebase = await storageUseCase.getFilesByFileName(documentNames);
  } catch (error) {
    logger({
      message: "error getting files from firebase",
      context: error,
    });
  }

  if (isEmpty(filesFromFirebase) || filesFromFirebase.length < 2) {
    return res.status(400).send("Not enough scanned files.");
  }

  const fileUseCase = new FileUseCase(pdfFileRepository, filesFromFirebase);

  let scannedFilesAndData: FileWithInfo[] | null = null,
    scannedFilesToDelete: UploadedFiles | null = null;

  try {
    ({ scannedFilesAndData, scannedFilesToDelete } = await documentAi(
      filesFromFirebase
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
    const infosAndIDs = fileUseCase.combineInfoWithID(
      scannedFilesAndData,
      documents
    );
    if (scannedFilesToDelete && !isEmpty(scannedFilesToDelete)) {
      try {
        await storageUseCase.deleteFiles(scannedFilesToDelete);
        await deleteDocuments(
          scannedFilesToDelete.map((file) => (file as EnhancedFile)?.name)
        );
      } catch (error) {
        logger({
          message: "Error deleting files",
          context: { error, scannedFilesToDelete },
        }).error();
      }
    }

    try {
      for (let i = 0; i < infosAndIDs.length; i++) {
        const element = infosAndIDs[i];
        if (process.env.OCR_URL) {
          await fetch(process.env.OCR_URL, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(element),
          });
        }
      }
    } catch (error) {
      logger({
        message: "Error with the sending of the information to medical link",
        context: error,
      });
    }
    res.json(!isEmpty(infosAndIDs) ? infosAndIDs : { message: "NO_DATA" });
  } catch (error) {
    logger({
      message: "Error combine infos with ids",
      context: error,
    }).error();
    res.status(500).send("Error combine infos with ids");
  }
});

const PORT = process.env.PORT || 8080;

Sentry.setupExpressErrorHandler(app);

app.use(function onError(
  err: Error,
  req: Request,
  res: ExtendedResponse,
  next: Function
) {
  if (!err) {
    return next();
  }

  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
