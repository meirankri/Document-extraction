import mysql, { RowDataPacket } from "mysql2/promise";
import { logger } from "../utils/logger";
import { DocumentsData, ObjectType } from "../types/interfaces";

const db = () => {
  return mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });
};

export default db;

export const insertDocument = async (
  documentID: number,
  documentName: string
): Promise<void> => {
  const conn = await db();
  try {
    await conn.execute(
      "INSERT INTO documents (document_id, document_name) VALUES (?, ?)",
      [documentID, documentName]
    );
  } catch (error) {
    logger({
      message: "Error inserting document to mysql",
      context: error,
    }).error();
  }
};

export const getDocuments = async (
  numberOfDocuments: number = 10
): Promise<DocumentsData[] | false> => {
  const conn = await db();
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT document_id, document_name FROM documents LIMIT ${numberOfDocuments}`
    );
    if (Array.isArray(rows)) {
      const documents = rows.map((row) => {
        return {
          documentID: row.document_id,
          documentName: row.document_name,
        };
      });
      return documents;
    } else {
      logger({
        message: "Documents Rows is not an array.",
        context: rows,
      }).error();
      return false;
    }
  } catch (error) {
    logger({
      message: "Error getting documents from mysql",
      context: error,
    }).error();
    return false;
  }
};

export const deleteDocuments = async (
  documentNames: string[]
): Promise<boolean> => {
  const conn = await db();
  try {
    const placeholders = documentNames
      .map(() => "document_name = ? or")
      .join(" ")
      .replace(/\s+or(?=\s*$)/i, "");

    const [result] = await conn.execute(
      `DELETE FROM documents WHERE ${placeholders}`,
      documentNames
    );
    if ("affectedRows" in result) {
      return !!result.affectedRows;
    }
    return false;
  } catch (error) {
    logger({
      message: "Error deleting documents from mysql",
      context: error,
    }).error();
    return false;
  }
};

export const medicalExaminationMap = async (): Promise<{
  [key: string]: string;
}> => {
  const conn = await db();
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      "select c.name as coordonance, mt.name as medicalType from coordonance c inner join medicalType mt on c.typeID = mt.id;"
    );
    const examsMap: ObjectType = {};

    if (Array.isArray(rows)) {
      rows.forEach((row) => {
        examsMap[row.coordonance] = row.medicalType;
      });
    }

    return examsMap;
  } catch (error) {
    logger({
      message: "Error getting medical examinations from mysql",
      context: error,
    }).error();
    return {};
  }
};
