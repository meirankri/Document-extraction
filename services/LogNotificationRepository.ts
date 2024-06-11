import { File as GoogleFile } from "@google-cloud/storage";
import { FileWithInfo, INotificationRepository } from "../types/interfaces";
import {
  convertFirebaseFileToBase64,
  convertFileToBase64,
} from "../utils/file";
import { logger } from "../utils/logger";

class LogNotificationRepository implements INotificationRepository {
  async notifyUser(
    fileWithInfo: FileWithInfo,
    checkingMessage: string
  ): Promise<boolean> {
    const fileWithInfoString = Object.entries(fileWithInfo.info)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const content = `
    Ce document n'a pas pu etre classer à cause de: ${checkingMessage}
    voici les champs recuperer ${fileWithInfoString}
    `;
    let attachement: string | null = null;
    if (fileWithInfo.file instanceof GoogleFile) {
      attachement = await convertFirebaseFileToBase64(fileWithInfo.file);
    }
    if (fileWithInfo.file instanceof File) {
      attachement = await convertFileToBase64(fileWithInfo.file);
    }

    // logger({
    //   message: "log notification",
    //   context: { file: attachement, content },
    // }).info();

    return Promise.resolve(true);
  }
}

export default LogNotificationRepository;
