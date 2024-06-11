import {
  FileWithInfo,
  INotificationRepository,
  UploadedFile,
} from "../types/interfaces";
import { isValidDate } from "../utils/date";
import { findMostSimilarExamination } from "../utils/medical";
import { medicalExaminations } from "../constants/medical";

class DataVerificationUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  async verifyData(filesWithInfo: FileWithInfo[]): Promise<{
    filesAndData: FileWithInfo[];
    filesToDelete: UploadedFile[];
  }> {
    const filesAndData: FileWithInfo[] = [];
    const filesToDelete: UploadedFile[] = [];

    for await (const fileInfo of filesWithInfo) {
      const { info = {}, file } = fileInfo;
      delete info.page;

      const resultInfo = { ...info };

      const checkingMessage = this.checkFields({ info: resultInfo, file });

      if (checkingMessage === "success") {
        filesAndData.push({ info: resultInfo, file });
        filesToDelete.push(file);
      } else {
        try {
          const mailSended = await this.notificationRepository.notifyUser(
            fileInfo,
            checkingMessage
          );
          if (mailSended) {
            filesToDelete.push(file);
          }
        } catch (error) {
          console.error(
            "This file has not been sent to email to be reclassified",
            fileInfo,
            error
          );
        }
      }
    }

    return { filesAndData, filesToDelete };
  }

  private checkFields(fileWithInfo: FileWithInfo): string {
    const filedsToCheck: [
      "patientFirstname",
      "patientLastname",
      "medicalExamination",
      "patientBirthDate"
    ] = [
      "patientFirstname",
      "patientLastname",
      "medicalExamination",
      "patientBirthDate",
    ];

    for (let i = 0; i < filedsToCheck.length; i++) {
      if (!fileWithInfo.info[filedsToCheck[i]]) {
        return "Un champ manquant";
      }
    }
    if (!isValidDate(fileWithInfo.info.patientBirthDate)) {
      return "La date de naissance n'est pas une date";
    }

    const medicalExamination = findMostSimilarExamination(
      fileWithInfo.info.medicalExamination,
      medicalExaminations
    );

    return medicalExamination
      ? "success"
      : "L'examen médical n'a pas été trouvé";
  }
}

export default DataVerificationUseCase;
