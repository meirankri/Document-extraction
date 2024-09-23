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

      const { medicalExamination, checkingMessage } = await this.checkFields(
        {
          info: resultInfo,
          file,
        },
        medicalExaminationMap
      );

      if (checkingMessage !== "success") {
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

      filesToDelete.push(file);
      filesAndData.push({
        info: {...resultInfo, medicalExamination: medicalExamination || ""},
        file,
        status: checkingMessage === "success" ? 1 : 2,
      });
    }

    return { filesAndData, filesToDelete };
  }

  private async checkFields(
    fileWithInfo: FileWithInfo,
    medicalExaminationMap: ObjectType
  ): Promise<{ medicalExamination: string | undefined, checkingMessage: string }> {
    const fieldsToCheck: [
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

    for (let i = 0; i < fieldsToCheck.length; i++) {
      if (!fileWithInfo.info[fieldsToCheck[i]]) {
        return { medicalExamination: "", checkingMessage: "Un champ manquant" };
      }
    }
    if (!isValidDate(fileWithInfo.info.patientBirthDate)) {
      return { medicalExamination: "", checkingMessage: "La date de naissance n'est pas une date" };
    }

    const medicalExamination = findMostSimilarExamination(
      fileWithInfo.info.medicalExamination,
      medicalExaminationMap
    ) || fileWithInfo.info.medicalExamination

    const checkingMessage = medicalExamination
      ? "success"
      : "L'examen médical n'a pas été trouvé";

    return { medicalExamination, checkingMessage }; 
  }
}

export default DataVerificationUseCase;
