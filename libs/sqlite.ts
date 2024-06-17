import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join((global as any).__basedir, "extract-data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, document_id TEXT, document_name TEXT)",
      (err) => {
        if (err) {
          console.error("Error creating table", err.message);
        } else {
          console.log("Table 'documents' created or already exists.");
        }
      }
    );
  }
});

export default db;
