import dotenv from "dotenv";
dotenv.config();
import { FileWithInfo } from "../types/interfaces";
import DataExtractionDocumentAIRepository from "../services/DataExtractionDocumentAIRepository";
import LogNotificationRepository from "../services/LogNotificationRepository";
import { EnhancedFile, UploadedFiles } from "../types/interfaces";
import { convertFilesToPDF, getFilesFromUpload } from "./upload.fixture";
import DataExtractionUseCase from "../usecase/DataExtractionUseCase";
import DataVerificationUseCase from "../usecase/DataVerificationUseCase";
describe("Data Verification", () => {
  let data = [
    {
      page: 0,
      patientFirstname: "serge",
      patientLastname: "siritzky",
    },
    {
      page: 1,
      examinationDate: "5/4/2024",
      patientBirthDate: "11/12/1955",
      patientLastname: "leroy sismondino",
      medicalExamination: "ORTHOPLASTIE",
      patientFirstname: "daniel",
    },
    {
      page: 2,
      patientBirthDate: "28/11/1952",
      patientLastname: "elmai,",
      patientFirstname: "faouzi",
      examinationDate: "6/2/2024",
      medicalExamination: "compte rendu",
    },
  ];
  let files: EnhancedFile[] = [];
  let pdfFiles: UploadedFiles = [];
  beforeAll(async () => {
    files = await getFilesFromUpload();
    ({ files: pdfFiles } = await convertFilesToPDF(files as EnhancedFile[]));
  }, 10000);
  test("test regrouping of files and data", async () => {
    const extractionDataRepository = new DataExtractionDocumentAIRepository();
    const extractionData = new DataExtractionUseCase(extractionDataRepository);
    const filesWithInfos = extractionData.linkFileWithInfos(pdfFiles, data);
    const notificationRepository = new LogNotificationRepository();
    const verificationUseCase = new DataVerificationUseCase(
      notificationRepository
    );
    let scannedFilesAndData: FileWithInfo[] | null;
    let scannedFilesToDelete: UploadedFiles | null;
    ({
      filesAndData: scannedFilesAndData,
      filesToDelete: scannedFilesToDelete,
    } = await verificationUseCase.verifyData(filesWithInfos));

    expect(scannedFilesAndData).toEqual([
      {
        info: {
          examinationDate: "5/4/2024",
          patientBirthDate: "11/12/1955",
          patientLastname: "leroy sismondino",
          medicalExamination: "ORTHOPLASTIE",
          patientFirstname: "daniel",
        },
        file: expect.any(Buffer),
      },
    ]);
  }, 10000);
});
