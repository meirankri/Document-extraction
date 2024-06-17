import path from "path";

import FileRepositoryFactory from "../factories/FileRepositoryFactory";
import FSStorage from "../services/FSStorageRepository";
import StorageUseCase from "../usecase/StorageUseCase";
import { EnhancedFile, FileInfos, UploadedFiles } from "../types/interfaces";

export const getFilesFromUpload = async (): Promise<EnhancedFile[]> => {
  const fsStorage = new FSStorage();
  const storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);
  const relativePath = "./tests/uploads"; // Replace with your relative path
  const absolutePath = path.resolve(relativePath); // Convert to absolute path

  const files = (await storageUseCase.getFiles(absolutePath)) as EnhancedFile[];
  return files;
};

export const convertFilesToPDF = async (
  files: EnhancedFile[]
): Promise<{ files: UploadedFiles; info: FileInfos[] }> => {
  const fsStorage = new FSStorage();
  const storageUseCase = new StorageUseCase(fsStorage, FileRepositoryFactory);
  const pdfFiles = await storageUseCase.convertFilesToPDF(
    files as EnhancedFile[]
  );

  return {
    files: pdfFiles.map((file) => file.file),
    info: pdfFiles.map((file) => file.fileInfos),
  };
};

export const fakeData = [
  {
    page: 0,
    patientFirstname: "daniel",
    examinationDate: "05/04/2024",
    medicalExamination: "echographie cardiaque trans-thoracique",
    patientBirthDate: "11/12/1955",
    patientLastname: "leroy sismondino",
  },
  {
    page: 1,
    medicalExamination: "echographie et doppler des troncs supra aortiques",
    patientLastname: "alimi",
    patientFirstname: "beatrice",
    examinationDate: "15/06/2023",
  },
  {
    page: 2,
    patientBirthDate: "24/2/1940",
    patientFirstname: "marcel",
    patientLastname: "kerszner",
  },
  {
    page: 3,
    patientBirthDate: "24/1/1946",
    patientLastname: "trillaud",
    medicalExamination: "echodoppler arteriel des troncs supra-aortiques",
    patientFirstname: "paulette",
  },
  {
    page: 4,
    medicalExamination: "angioscanner thoracique",
    examinationDate: "16/03/2024",
    patientLastname: "ndjiekam",
    patientBirthDate: "5/3/1964",
    patientFirstname: "laurent",
  },
  {
    page: 5,
    medicalExamination: "angioscanner de l'aorte",
    examinationDate: "03/01/2024",
    patientLastname: "mirepoix",
    patientBirthDate: "26/12/1944",
    patientFirstname: "andree",
  },
  {
    page: 6,
    patientLastname: "mohamed",
    patientFirstname: "gamal el din",
  },
  {
    page: 7,
    patientBirthDate: "13/7/1949",
    patientFirstname: "fanny",
    patientLastname: "illouz",
  },
  {
    page: 8,
    medicalExamination: "rapport holter",
    patientFirstname: "charles",
    examinationDate: "16/04/2024",
    patientBirthDate: "25/8/1944",
    patientLastname: "dahan",
  },
];
