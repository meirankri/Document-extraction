import path from "path";
import sqlite3 from "sqlite3";
import { logger } from "../utils/logger";
import { DocumentsData } from "../types/interfaces";

const dbPath = path.join(
  (global as any).__basedir,
  process.env.NODE_ENV === "production" ? "../" : "",
  "extract-data.db"
);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger({
      message: "Error opening database",
      context: err.message,
    }).error();
  } else {
    logger({
      message: "Connected to the SQLite database.",
    }).info();
  }
});

export default db;

export const insertDocument = (
  documentID: string,
  documentName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO documents (document_id, document_name) VALUES (?, ?)`;
    db.run(query, [documentID, documentName], (err) => {
      if (err) {
        logger({
          message: "Error inserting document to sqlite",
          context: { err, documentID },
        }).error();

        return reject(err.message);
      }
      return resolve("");
    });
  });
};

export const getDocuments = (
  numberOfDocuments: number = 10
): Promise<DocumentsData[] | false> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT document_id, document_name FROM documents LIMIT ?`;
    db.all(
      query,
      [numberOfDocuments],
      (err, rows: { document_id: string; document_name: string }[]) => {
        if (err) {
          logger({
            message: "Error getting documents from sqlite",
            context: err,
          }).error();
          return reject(false);
        }
        const documents = rows.map(
          (row: { document_id: string; document_name: string }) => {
            return {
              documentID: row.document_id,
              documentName: row.document_name,
            };
          }
        );
        return resolve(documents);
      }
    );
  });
};

export const deleteDocuments = (documentIDs: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const placeholders = documentIDs.map(() => "?").join(", ");
    const query = `DELETE FROM documents WHERE document_name IN (${placeholders})`;

    db.run(query, documentIDs, function (err) {
      if (err) {
        logger({
          message: "Error deleting documents from sqlite",
          context: err,
        }).error();
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
