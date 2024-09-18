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

import {
  checkMimeType,
  checkMimeTypeAndDocumentIds,
} from "./middelwares/multer";
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
import { deleteDocuments, getDocuments, insertDocument } from "./libs/mysql";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const NUMBER_OF_FILES = process.env.NUMBER_OF_FILES || 2;

const firebaseFolder = process.env.UPLOAD_FOLDER || "";

interface FileInfo {
  file: Express.Multer.File;
  documentID: string;
}

interface CustomRequest extends Request {
  fileInfos?: FileInfo[];
}

export const handleFilesUpload = async (req: CustomRequest, res: Response) => {
  const fileInfos = req.fileInfos;

  if (!fileInfos || fileInfos.length === 0) {
    return res.status(400).json({ error: "No files provided" });
  }

  const firebaseRepository = new FirebaseStorage();
  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    FileRepositoryFactory
  );

  const results = [];

  for (const fileInfo of fileInfos) {
    try {
      const result = await processFile(fileInfo, storageUseCase);
      if (!result.success) {
        return res.status(500).json({
          message: "Error inserting document.",
          error: result.error,
        });
      }
      results.push(result);
    } catch (error) {
      logger({
        message: "Error processing file",
        context: { error, fileInfo },
      }).error();
      return res.status(500).json({
        message: "Error inserting document.",
        error: error,
      });
    }
  }

  res.status(200).json({ results });
};

async function processFile(fileInfo: FileInfo, storageUseCase: StorageUseCase) {
  const { file, documentID } = fileInfo;
  const fileWithType = { ...file, type: "multer" };

  const pdfFile = await storageUseCase.convertFileToPDF(
    fileWithType as FileFromUpload
  );

  if (!pdfFile) {
    throw new Error("Error converting file to PDF");
  }

  const uploadedFile = await storageUseCase.fileUpload(pdfFile, firebaseFolder);

  const documentIdParsed = parseInt(documentID, 10);
  if (isNaN(documentIdParsed)) {
    throw new Error("Invalid document ID");
  }

  const res = await insertDocument(documentIdParsed, uploadedFile);

  return { ...res, documentID };
}

app.post("/uploads", checkMimeTypeAndDocumentIds, handleFilesUpload);

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
        const documentIdParsed = parseInt(documentID, 10);
        await insertDocument(documentIdParsed, uploadedFile);
      } catch (error) {
        logger({
          message: "Error calling inserting document function",
          context: error,
        }).error();
        await storageUseCase.deleteFile(uploadedFile);

        return res
          .status(500)
          .json({ message: "Error inserting document.", error });
      }
    }
    res.status(200).json({ success: true });
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
    }).error();
  }

  if (
    isEmpty(filesFromFirebase) ||
    filesFromFirebase.length < (NUMBER_OF_FILES as number)
  ) {
    return res.status(200).send("Not enough scanned files.");
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
      const sentRequests = new Set<string>();

      for (let i = 0; i < infosAndIDs.length; i++) {
        const element = infosAndIDs[i];
        const elementFlat = {
          ...element.info,
          documentID: element.documentID,
          status: element.status,
        };
        const requestBody = JSON.stringify(elementFlat);

        if (!sentRequests.has(requestBody) && process.env.OCR_URL) {
          const response = await fetch(process.env.OCR_URL, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: requestBody,
          });

          logger({
            message: "Response from medical link",
            context: { response, elementFlat },
          }).info();

          sentRequests.add(requestBody);
        }
      }
    } catch (error) {
      logger({
        message: "Error with the sending of the information to medical link",
        context: error,
      }).error();
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

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  Sentry.captureException(reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  Sentry.captureException(error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
