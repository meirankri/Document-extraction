import path from "path";
import sqlite3 from "sqlite3";
import { logger } from "../utils/logger";

const dbPath = path.join((global as any).__basedir, "extract-data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export default db;

export const insertDocument = (
  documentID: string,
  documentName: string
): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO documents (document_id, document_name) VALUES (?, ?)`;
    db.run(query, [documentID, documentName], (err) => {
      if (err) {
        logger({
          message: "Error inserting document to sqlite",
          context: err,
        }).error();
        return reject(false);
      }
      return resolve(true);
    });
  });
};
