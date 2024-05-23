import express, { Request, Response } from "express";
import dotenv from "dotenv";

import StorageUseCase from "./usecase/StorageUseCase";
import { uploadMultiple } from "./libs/multer";
import FirebaseStorage from "./services/FirebaseStorage";
import { FileFromUpload, UploadedFiles } from "types/interfaces";
import FirebaseFilePdfRepository from "./services/FirebaseFilePdfRepository";
import FileUseCase from "./usecase/FileUseCase";
import { processDocument } from "./utils/documentAi";
// import RoundNumberChecker from '../utils/roundNumberChecker';
// import FileProcessor from '../services/FileProcessor';
// import DataExtractor from '../services/DataExtractor';
// import DataVerifier from '../services/DataVerifier';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async () => {
  console.log("Hello World");
});

const firebaseFolder = "documents";
app.post("/upload", uploadMultiple, async (req: Request, res: Response) => {
  let response: object = {};

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const files = req.files as FileFromUpload[];
  const firebaseRepository = new FirebaseStorage();
  const storageUseCase = new StorageUseCase(firebaseRepository);
  let fileFromFirebase: UploadedFiles;
  try {
    await storageUseCase.filesUpload(files, firebaseFolder);
    fileFromFirebase = await storageUseCase.getFiles(firebaseFolder);
  } catch (error) {
    fileFromFirebase = [];
    response = { error: "Error uploading files" };
  }

  const numberOfFiles = storageUseCase.getNumberOfFiles(fileFromFirebase);

  if (!numberOfFiles) {
    response = { message: "files count is under ten" };
    res.json(response);
  } else {
    const pdfFileRepository = new FirebaseFilePdfRepository();
    const fileUseCase = new FileUseCase(pdfFileRepository, fileFromFirebase);
    const pdfBytes = await fileUseCase.handleFiles(numberOfFiles);
    await processDocument(pdfBytes);
    res.setHeader("Content-Disposition", 'attachment; filename="download.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));
  }

  // try {
  //   const filesPromises: Promise<string>[] = [];
  //   files.forEach(async (file) => {
  //     filesPromises.push(uploadFileToFirebase(file));
  //   });
  //   const filesUrls = await Promise.all(filesPromises);
  //   console.log("names", filesUrls);
  // } catch (error) {
  //   console.error("error bulk upload", error);
  // }

  // const storageService = new StorageService(
  //   path.join(__dirname, process.env.UPLOAD_FOLDER || "")
  // );
  // const file = new File(storageService);

  // const numberOfFiles = await file.getNumberOfFiles();
  // if (!numberOfFiles) {
  //   response = { error: "No files found" };
  // }
  // const roundedNumber = roundNumber(numberOfFiles);
  // if (!roundedNumber) response = { message: "files is under 10" };
  // else response = { message: numberOfFiles };
  // const files = req.files as Express.Multer.File[];

  // for (const file of files) {
  //   await storageService.addFile(file);
  // }

  // const checker = new RoundNumberChecker(storageService);
  // if (await checker.isRoundNumber()) {
  //   const oldestFiles = await storageService.getOldestFiles(10);
  //   const fileProcessor = new FileProcessor(storageService);
  //   await fileProcessor.processFiles(oldestFiles);

  //   const dataExtractor = new DataExtractor();
  //   for (const file of oldestFiles) {
  //     const data = await dataExtractor.extractAndCleanData(file);
  //     const verifier = new DataVerifier();
  //     await verifier.verifyData(data);
  //   }
  // }

  // res.json(response);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
