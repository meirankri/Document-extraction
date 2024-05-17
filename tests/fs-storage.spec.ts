import fs from 'fs';
import path from 'path';

import fsStorage from '../services/FSStorageService';
import File from '../api/usecase/File';
describe('test the file system storage class', () => {
  beforeAll(async () => {
    const directoryPath = path.join(__dirname, 'uploads');

    await fs.promises.mkdir(directoryPath, { recursive: true });

    const fichiers = [
      { nom: 'fichier1.pdf', contenu: 'Contenu du fichier 1' },
      { nom: 'fichier2.pdf', contenu: 'Contenu du fichier 2' },
      { nom: 'fichier3.pdf', contenu: 'Contenu du fichier 3' },
      { nom: '.gitignore', contenu: 'Contenu du fichier 3' },
    ];

    // Crée chaque fichier de manière asynchrone
    const operations = fichiers.map((fichier) => {
      const filePath = path.join(directoryPath, fichier.nom);
      return fs.promises.writeFile(filePath, fichier.contenu);
    });

    await Promise.all(operations);
  });

  afterAll(async () => {
    try {
      const directoryPath = path.join(__dirname, 'uploads');
      await fs.promises.rm(directoryPath, { recursive: true });
    } catch (err: unknown) {
      console.error(`Error during the removing of the folders : ${err}`);
    }
  });

  test('check the number of file of the upload folder except the gitignore', async () => {
    const storage = new fsStorage(`${__dirname}/uploads`);
    const file = new File(storage);
    const numberOfFiles = await file.getNumberOfFiles();
    console.log(numberOfFiles);

    expect(numberOfFiles).toEqual(3);
  });
});
