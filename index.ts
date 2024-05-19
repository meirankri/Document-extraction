import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { File as FileType } from "@google-cloud/storage";

import FileUseCase from "./usecase/File";
import { uploadMultiple } from "./libs/multer";
import FirebaseStorage from "./services/FirebaseStorage";

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
  const files = req.files as Express.Multer.File[];
  const firebaseRepository = new FirebaseStorage();
  const fileUseCase = new FileUseCase(firebaseRepository);
  let fileFromFirebase: File[] | FileType[];
  try {
    await fileUseCase.filesUpload(files, firebaseFolder);
    fileFromFirebase = await fileUseCase.getFiles(firebaseFolder);
  } catch (error) {
    fileFromFirebase = [];
    response = { error: "Error uploading files" };
  }
  const numberOfFiles = fileUseCase.getNumberOfFiles(fileFromFirebase);
  if (!numberOfFiles) {
    response = { message: "files count is under ten" };
  }
  {
    // suite du script
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

  res.json(response);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
