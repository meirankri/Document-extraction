import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import FileUseCase from "./usecase/FileUseCase";
import StorageUseCase from "./usecase/StorageUseCase";
import DataExtractionUseCase from "./usecase/DataExtractionUseCase";

import FirebaseStorage from "./services/FirebaseStorage";
import FirebaseFilePdfRepository from "./services/FirebaseFilePdfRepository";

import { uploadMultiple } from "./libs/multer";
import { FileFromUpload, UploadedFiles } from "types/interfaces";
import { isEmpty } from "./utils/checker";
import DataExtractionDocumentAIRepository from "./services/DataExtractionDocumentAIRepository";
import DataVerificationUseCase from "./usecase/DataVerificationUseCase";
import EmailNotificationAWSRepository from "./services/EmailNotificationAWSRepository";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firebaseFolder = "documents";
// TODO comprendre pourquoi les variables ne se chargent pas dans les autres fichiers alors que j'ai bien mis dotenv.config
app.post("/upload", uploadMultiple, async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const files = req.files as FileFromUpload[];
  const firebaseRepository = new FirebaseStorage();
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const storageUseCase = new StorageUseCase(
    firebaseRepository,
    pdfFileRepository
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
  }
  let filesFromFirebase: UploadedFiles = [];
  try {
    filesFromFirebase = await storageUseCase.getFiles(firebaseFolder);
  } catch (error) {}
  if (isEmpty(filesFromFirebase)) {
    return res.status(500).send("Error getting files from firebase.");
  }

  const fileUseCase = new FileUseCase(pdfFileRepository, filesFromFirebase);
  const { scannedPdfs, notScannedPdfs } = await fileUseCase.checkIfItsScanned();
  console.log("scannedPdfs", scannedPdfs);

  if (!isEmpty(scannedPdfs)) {
    const pdfFileRepository = new FirebaseFilePdfRepository();
    const fileUseCase = new FileUseCase(
      pdfFileRepository,
      scannedPdfs as UploadedFiles
    );
    const pdfBytes = await fileUseCase.handleFiles();
    console.log("pdf", pdfBytes);

    const extractionDataRepository = new DataExtractionDocumentAIRepository();
    const extractionData = new DataExtractionUseCase(extractionDataRepository);
    const data = await extractionData.extractData(pdfBytes);

    const filesWithInfos = extractionData.linkFileWithInfos(
      scannedPdfs as UploadedFiles,
      data
    );

    const notificationRepository = new EmailNotificationAWSRepository();
    const verificationUseCase = new DataVerificationUseCase(
      notificationRepository
    );
    let filesAndData, filesToDelete;
    try {
      ({ filesAndData, filesToDelete } = await verificationUseCase.verifyData(
        filesWithInfos
      ));
    } catch (error) {
      console.error("verify data as not been run", error);
      res.status(500).send("error with the verification of the datas");
    }
    if (filesAndData) {
      const base64Files = await fileUseCase.filesToBase64(filesAndData);
      res.json(base64Files);
    }
  }
});

// app.post("/uploadGen", uploadMultiple, async (req: Request, res: Response) => {
//   let response: object = {};

//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No files uploaded.");
//   }
//   const files = req.files as FileFromUpload[];
//   const firebaseRepository = new FirebaseStorage();
//   const pdfFileRepository = new FirebaseFilePdfRepository();

//   const storageUseCase = new StorageUseCase(
//     firebaseRepository,
//     pdfFileRepository
//   );
//   const pdfFiles = await storageUseCase.convertFileToPDF(files);
//   let fileFromFirebase: UploadedFiles;
//   try {
//     await storageUseCase.filesUpload(files, firebaseFolder);
//     fileFromFirebase = await storageUseCase.getFiles(firebaseFolder);
//   } catch (error) {
//     fileFromFirebase = [];
//     response = { error: "Error uploading files" };
//   }

//   const fileUseCase = new FileUseCase(pdfFileRepository, fileFromFirebase);
//   const multipleFiles = await fileUseCase.handleMultipleFiles();
//   const extractionDataRepository = new DataExtractionGeminiRepository();
//   const extractionData = new DataExtractionUseCase(extractionDataRepository);
//   const data = await extractionData.extractData(multipleFiles);

//   // streamGenerateContent(Buffer.from(file).toString("base64"));
// });

// app.post("/uploadDoc", uploadMultiple, async (req: Request, res: Response) => {
//   let response: object = {};

//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No files uploaded.");
//   }
//   const files = req.files as FileFromUpload[];
//   const firebaseRepository = new FirebaseStorage();
//   const storageUseCase = new StorageUseCase(firebaseRepository);
//   let fileFromFirebase: UploadedFiles;
//   try {
//     await storageUseCase.filesUpload(files, firebaseFolder);
//     fileFromFirebase = await storageUseCase.getFiles(firebaseFolder, 10);
//   } catch (error) {
//     fileFromFirebase = [];
//     response = { error: "Error uploading files" };
//   }

//   const numberOfFiles = storageUseCase.getLastTenFiles(fileFromFirebase);

//   if (!numberOfFiles) {
//     response = { message: "files count is under ten" };
//     res.json(response);
//   } else {
//     const pdfFileRepository = new FirebaseFilePdfRepository();
//     const fileUseCase = new FileUseCase(pdfFileRepository, fileFromFirebase);
//     const pdfBytes = await fileUseCase.handleFiles();
//     const documentInformations = await processDocument(pdfBytes);
//   }
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
