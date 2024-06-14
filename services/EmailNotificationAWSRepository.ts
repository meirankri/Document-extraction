import { File as GoogleFile } from "@google-cloud/storage";
import { FirebaseFile } from "../types/interfaces";
import { FileWithInfo, INotificationRepository } from "../types/interfaces";
import { sendEmailWithAttachment } from "../utils/email";
import {
  convertFirebaseFileToBase64,
  convertFileToBase64,
} from "../utils/file";

class EmailNotificationAWSRepository implements INotificationRepository {
  async notifyUser(
    fileWithInfo: FileWithInfo,
    checkingMessage: string
  ): Promise<boolean> {
    const fileWithInfoString = Object.entries(fileWithInfo.info || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const content = `
    Ce document n'a pas pu etre classer à cause de ${checkingMessage}
    voici les champs recuperer ${fileWithInfoString}
    `;
    let attachement: string | null = null;
    if (fileWithInfo.file instanceof GoogleFile) {
      attachement = await convertFirebaseFileToBase64(fileWithInfo.file);
    }
    // if (fileWithInfo.file instanceof File) {
    //   attachement = await convertFileToBase64(fileWithInfo.file);
    // }

    return sendEmailWithAttachment({
      mailTo: process.env.MAIL_TO || "",
      emailContent: content,
      emailSubject: "Ce document n'a pas été classé",
      file: attachement,
    });
  }
}

export default EmailNotificationAWSRepository;
