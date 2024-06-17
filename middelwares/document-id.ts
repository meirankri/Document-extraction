import { RequestHandler } from "express";

export const checkDocumentId: RequestHandler = (req, res, next) => {
  const documentID = req.body.documentID;
  if (!documentID) {
    return res.status(400).json({ error: "NO_DOCUMENT_ID" });
  }
  next();
};
