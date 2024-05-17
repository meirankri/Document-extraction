import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

// Configurer dotenv pour charger le fichier .env en fonction de NODE_ENV

import StorageService from "./services/FSStorageService";
import File from "./usecase/File";
import { roundNumber } from "./utils/number";
// import RoundNumberChecker from '../utils/roundNumberChecker';
// import FileProcessor from '../services/FileProcessor';
// import DataExtractor from '../services/DataExtractor';
// import DataVerifier from '../services/DataVerifier';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_FOLDER || "dist/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).array("files");
app.get("/", () => {
  console.log(process.env);
});
app.post("/upload", async (req: Request, res: Response) => {
  console.log("Uploading files");

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);

      return res.status(500).send(err);
    }
  });
  const storageService = new StorageService(
    path.join(__dirname, process.env.UPLOAD_FOLDER || "")
  );
  const file = new File(storageService);
  let response: object = {};

  const numberOfFiles = await file.getNumberOfFiles();
  if (!numberOfFiles) {
    response = { error: "No files found" };
  }
  const roundedNumber = roundNumber(numberOfFiles);
  if (!roundedNumber) response = { message: "files is under 10" };
  else response = { message: numberOfFiles };
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
