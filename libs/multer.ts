import Multer from "multer";

const multer = Multer({
  storage: Multer.memoryStorage(),
});

export const uploadMultiple = multer.array("files"); // Autoriser jusqu'à 5 fichiers
