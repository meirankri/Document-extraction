import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import FileUseCase from "./usecase/FileUseCase";
import StorageUseCase from "./usecase/StorageUseCase";
import DataExtractionUseCase from "./usecase/DataExtractionUseCase";

import FirebaseStorage from "./services/FirebaseStorage";
import FirebaseFilePdfRepository from "./services/FirebaseFilePdfRepository";

import { uploadMultiple } from "./libs/multer";
import { FileFromUpload, UploadedFiles } from "./types/interfaces";
import { isEmpty } from "./utils/checker";
import DataExtractionDocumentAIRepository from "./services/DataExtractionDocumentAIRepository";
import DataVerificationUseCase from "./usecase/DataVerificationUseCase";
import EmailNotificationAWSRepository from "./services/EmailNotificationAWSRepository";
import DataExtractionGeminiRepository from "./services/DataExtractionGeminiRepository";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firebaseFolder = "documents";
//TODO faire en sorte que si l'extraction de données échoue, on n'envoie pas de notif et on ne supprime pas le fichier
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
  const { scannedPdfs, readableScannedPdfs } =
    await fileUseCase.checkIfItsScanned();
  console.log("scannedPdfs", scannedPdfs);

  let scannedFilesAndData, scannedFilesToDelete;
  // if (!isEmpty(scannedPdfs)) {
  //   const fileUseCase = new FileUseCase(
  //     pdfFileRepository,
  //     scannedPdfs as UploadedFiles
  //   );
  //   const pdfBytes = await fileUseCase.handleFiles();
  //   console.log("pdf", pdfBytes);

  //   const extractionDataRepository = new DataExtractionDocumentAIRepository();
  //   const extractionData = new DataExtractionUseCase(extractionDataRepository);
  //   const data = await extractionData.extractData(pdfBytes);

  //   if (data) {
  //     const filesWithInfos = extractionData.linkFileWithInfos(
  //       scannedPdfs as UploadedFiles,
  //       data
  //     );

  //     const notificationRepository = new EmailNotificationAWSRepository();
  //     const verificationUseCase = new DataVerificationUseCase(
  //       notificationRepository
  //     );

  //     try {
  //       ({
  //         filesAndData: scannedFilesAndData,
  //         filesToDelete: scannedFilesToDelete,
  //       } = await verificationUseCase.verifyData(filesWithInfos));
  //     } catch (error) {
  //       console.error("verify data as not been run", error);
  //       res.status(500).send("error with the verification of the datas");
  //     }
  //   }
  // }

  // console.log("scanned data finish");

  let readableFilesAndData, readableFilesToDelete;

  if (!isEmpty(readableScannedPdfs)) {
    const fileUseCase = new FileUseCase(
      pdfFileRepository,
      readableScannedPdfs as UploadedFiles
    );
    const multiplePdfs = await fileUseCase.handleMultipleFiles();
    const extractionDataRepository = new DataExtractionGeminiRepository();
    const extractionData = new DataExtractionUseCase(extractionDataRepository);
    const data = await extractionData.extractData(multiplePdfs);
    console.log("not scanned data extracted finish");

    if (data) {
      const filesWithInfos = extractionData.linkFileWithInfos(
        readableScannedPdfs as UploadedFiles,
        data
      );
      const notificationRepository = new EmailNotificationAWSRepository();
      const verificationUseCase = new DataVerificationUseCase(
        notificationRepository
      );
      try {
        ({
          filesAndData: readableFilesAndData,
          filesToDelete: readableFilesToDelete,
        } = await verificationUseCase.verifyData(filesWithInfos));
      } catch (error) {
        console.error("verify data as not been run", error);
        res.status(500).send("error with the verification of the datas");
      }
    }
  }
  console.log(readableScannedPdfs);

  if (!isEmpty(scannedFilesAndData) || !isEmpty(readableFilesAndData)) {
    try {
      const base64Files = await fileUseCase.filesToBase64([
        ...(scannedFilesAndData || []),
        ...(readableFilesAndData || []),
      ]);
      res.json(base64Files);
    } catch (error) {
      console.error("Error converting files to base64", error);
      res.status(500).send("Error converting files to base64");
    }
  } else {
    res.status(500).send("Extraction data failed.");
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
