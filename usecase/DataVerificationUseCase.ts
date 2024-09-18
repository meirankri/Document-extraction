import { medicalExaminationMap as medicalExaminationMapQuery } from "../libs/mysql";
import {
  FileWithInfo,
  INotificationRepository,
  UploadedFile,
  ObjectType,
} from "../types/interfaces";
import { isValidDate } from "../utils/date";
import { findMostSimilarExamination } from "../utils/medical";
import { logger } from "../utils/logger";

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
    const medicalExaminationMap = await medicalExaminationMapQuery();
    for await (const fileInfo of filesWithInfo) {
      const { info = {}, file } = fileInfo;
      delete info.page;

      const resultInfo = { ...info };

      const checkingMessage = await this.checkFields(
        {
          info: resultInfo,
          file,
        },
        medicalExaminationMap
      );

      if (checkingMessage === "success") {
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
          logger({
            message: "This file has not been sent to email to be reclassified",
            context: { fileInfo, error },
          }).error();
        }
      }
      filesAndData.push({
        info: resultInfo,
        file,
        status: checkingMessage === "success" ? 1 : 2,
      });
    }

    return { filesAndData, filesToDelete };
  }

  private async checkFields(
    fileWithInfo: FileWithInfo,
    medicalExaminationMap: ObjectType
  ): Promise<string> {
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
      medicalExaminationMap
    );

    return medicalExamination
      ? "success"
      : "L'examen médical n'a pas été trouvé";
  }
}

export default DataVerificationUseCase;
