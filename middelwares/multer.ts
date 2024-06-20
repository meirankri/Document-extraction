import Multer, { MulterError } from "multer";
import { RequestHandler } from "express";

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
