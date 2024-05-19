import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const config = {
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);

export const bucket = admin
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET);
