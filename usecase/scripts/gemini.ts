import { FileWithInfo, UploadedFiles } from "../../types/interfaces";
import FirebaseFilePdfRepository from "../../services/FirebaseFilePdfRepository";
import FileUseCase from "../FileUseCase";
import DataExtractionGeminiRepository from "../../services/DataExtractionGeminiRepository";
import DataExtractionUseCase from "../DataExtractionUseCase";
import EmailNotificationAWSRepository from "../../services/EmailNotificationAWSRepository";
import DataVerificationUseCase from "../DataVerificationUseCase";

const extractDataFromGemini = async (
  documents: UploadedFiles
): Promise<{
  readableFilesAndData: FileWithInfo[] | undefined;
  readableFilesToDelete: UploadedFiles | undefined;
}> => {
  const pdfFileRepository = new FirebaseFilePdfRepository();

  const fileUseCase = new FileUseCase(
    pdfFileRepository,
    documents as UploadedFiles
  );
  let readableFilesAndData, readableFilesToDelete;

  const multiplePdfs = await fileUseCase.handleMultipleFiles();
  if (!multiplePdfs) {
    return { readableFilesAndData, readableFilesToDelete };
  }
  const extractionDataRepository = new DataExtractionGeminiRepository();
  const extractionData = new DataExtractionUseCase(extractionDataRepository);
  const data = await extractionData.extractData(multiplePdfs);

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
        filesAndData: readableFilesAndData,
        filesToDelete: readableFilesToDelete,
      } = await verificationUseCase.verifyData(filesWithInfos));
    } catch (error) {
      console.error("verify data as not been run", error);
    }
  }
  return { readableFilesAndData, readableFilesToDelete };
};

export default extractDataFromGemini;
