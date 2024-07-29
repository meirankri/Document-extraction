import Multer, { MulterError } from "multer";
import { RequestHandler } from "express";
import { logger } from "../utils/logger";

const multer = Multer({
  storage: Multer.memoryStorage(),
});

const authorizedExtensions = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

export const checkMimeType: RequestHandler = (req, res, next) => {
  multer.single("file")(req, res, function (err: any) {
    const file = req.file;
    if (err instanceof MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Failed to upload files.", err });
    }
    if (!file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    if (!authorizedExtensions.includes(file.mimetype)) {
      return res.status(400).json({
        message: "INVALID_FILE_TYPE",
        error: `Invalid file type. Received: ${
          file.mimetype
        }, but expected one of: ${authorizedExtensions.join(", ")}`,
      });
    }

    next();
  });
};
export const checkMimeTypeAndDocumentIds: RequestHandler = (req, res, next) => {
  multer.array("files")(req, res, function (err: any) {
    if (err instanceof MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      logger({
        message: "Error uploading files",
        context: err,
      }).error();

      return res.status(500).json({ error: "Error while uploading files" });
    }

    const files = req.files as Express.Multer.File[];
    let documentIDs = [];
    try {
      documentIDs = req.body.documentIDs
        ? JSON.parse(req.body.documentIDs)
        : [];
    } catch (error) {
      logger({
        message: "Error parsing documentIDs",
        context: error,
      }).error();
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!Array.isArray(documentIDs) || documentIDs.length !== files.length) {
      return res.status(400).json({
        error:
          "DocumentIDs must be an array with the same length as the number of files uploaded",
      });
    }

    const fileInfos = files.map((file, index) => ({
      file,
      documentID: documentIDs[index],
    }));

    const invalidFiles = fileInfos.filter(
      (fileInfo) => !authorizedExtensions.includes(fileInfo.file.mimetype)
    );

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        message: "INVALID_FILE_TYPE",
        error: `File type invalid. Receive : ${invalidFiles
          .map((fileInfo) => fileInfo.file.mimetype)
          .join(", ")}, but expected one of : ${authorizedExtensions.join(
          ", "
        )}`,
      });
    }

    const invalidDocumentIDs = fileInfos.filter(
      (fileInfo) =>
        !Number.isInteger(Number(fileInfo.documentID)) ||
        Number(fileInfo.documentID) <= 0
    );

    if (invalidDocumentIDs.length > 0) {
      return res.status(400).json({
        message: "INVALID_DOCUMENT_ID",
        error: `DocumentID(s) invalide(s) : ${invalidDocumentIDs
          .map((fileInfo) => fileInfo.documentID)
          .join(", ")}`,
      });
    }

    req.fileInfos = fileInfos;
    next();
  });
};

declare module "express-serve-static-core" {
  interface Request {
    fileInfos?: { file: Express.Multer.File; documentID: string }[];
  }
}
