import { FileWithInfo, UploadedFiles } from "../../types/interfaces";
import FirebaseFilePdfRepository from "../../services/FirebaseFilePdfRepository";
import FileUseCase from "../FileUseCase";
import DataExtractionUseCase from "../DataExtractionUseCase";
import EmailNotificationAWSRepository from "../../services/EmailNotificationAWSRepository";
import DataVerificationUseCase from "../DataVerificationUseCase";
import DataExtractionDocumentAIRepository from "../../services/DataExtractionDocumentAIRepository";

const documentAi = async (
  documents: UploadedFiles
): Promise<{
  scannedFilesAndData: FileWithInfo[] | null;
  scannedFilesToDelete: UploadedFiles | null;
}> => {
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const fileUseCase = new FileUseCase(
    pdfFileRepository,
    documents as UploadedFiles
  );
  const pdfBytes = await fileUseCase.handleFiles();

  const extractionDataRepository = new DataExtractionDocumentAIRepository();
  const extractionData = new DataExtractionUseCase(extractionDataRepository);
  let scannedFilesAndData = null,
    scannedFilesToDelete = null;

  if (!pdfBytes) {
    return { scannedFilesAndData, scannedFilesToDelete };
  }
  try {
    const data = await extractionData.extractData(pdfBytes);
    if (data) {
      const filesWithInfos = extractionData.linkFileWithInfos(
        documents as UploadedFiles,
        data
      );

      const notificationRepository = new EmailNotificationAWSRepository();
      const verificationUseCase = new DataVerificationUseCase(
        notificationRepository
      );

      try {
        ({
          filesAndData: scannedFilesAndData,
          filesToDelete: scannedFilesToDelete,
        } = await verificationUseCase.verifyData(filesWithInfos));
      } catch (error) {
        console.error("verify data as not been run", error);
      }
    }
  } catch (error) {
    console.error("Error extracting data", error);
  }
  return { scannedFilesAndData, scannedFilesToDelete };
};

export default documentAi;
