// Tableau d'objets à envoyer
const dataObjects = [
  {
    info: {
      medicalExamination: "rapport holter",
      examinationDate: "15/01/2024",
      patientFirstname: "oumou",
      patientBirthDate: "30/7/1986",
      patientLastname: "doumbia",
    },
    documentID: 36,
  },
  {
    info: {
      examinationDate: "17/01/2024",
      patientLastname: "potey",
      medicalExamination: "rapport holter",
      patientBirthDate: "11/6/1953",
      patientFirstname: "annick",
    },
    documentID: 37,
  },
  {
    info: {
      medicalExamination: "rapport holter",
      examinationDate: "16/01/2024",
      patientFirstname: "cherifa",
      patientBirthDate: "8/7/1970",
      patientLastname: "hayani",
    },
    documentID: 38,
  },
  {
    info: {
      medicalExamination: "rapport holter",
      examinationDate: "16/01/2024",
      patientFirstname: "anne marie",
      patientBirthDate: "23/7/1965",
      patientLastname: "rosier",
    },
    documentID: 39,
  },
  {
    info: {
      medicalExamination: "rapport holter",
      patientFirstname: "claudie",
      patientBirthDate: "13/3/1963",
      examinationDate: "20/01/2024",
      patientLastname: "valet",
    },
    documentID: 43,
  },
  {
    info: {
      patientFirstname: "ali",
      examinationDate: "18/01/2024",
      medicalExamination: "rapport holter",
      patientBirthDate: "20/7/1940",
      patientLastname: "bendra",
    },
    documentID: 44,
  },
  {
    info: {
      patientBirthDate: "23/7/1943",
      patientLastname: "barguillet",
      patientFirstname: "danielle",
      medicalExamination: "rapport holter",
    },
    documentID: 45,
  },
  {
    info: {
      medicalExamination: "rapport holter",
      examinationDate: "16/01/2024",
      patientFirstname: "anne marie",
      patientBirthDate: "23/7/1965",
      patientLastname: "rosier",
    },
    documentID: 46,
  },
  {
    info: {
      examinationDate: "16/01/2024",
      patientLastname: "hayani",
      patientBirthDate: "8/7/1970",
      medicalExamination: "rapport holter",
      patientFirstname: "cherifa",
    },
    documentID: 47,
  },
  {
    info: {
      patientBirthDate: "11/6/1953",
      patientLastname: "potey",
      patientFirstname: "annick",
      medicalExamination: "rapport holter",
      examinationDate: "17/01/2024",
    },
    documentID: 48,
  },
];

// URL de l'API où les requêtes POST seront envoyées
const apiUrl = "https://medicallink-online.fr/api/ocrtext";

// Fonction pour envoyer un objet en tant que requête POST
async function sendPostRequest(data) {
  const dataFlat = {
    ...data.info,
    documentID: data.documentID,
  };
  console.log(dataFlat);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFlat),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Réponse reçue:", result);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête:", error);
  }
}

// Exécute la fonction pour chaque objet dans le tableau
dataObjects.forEach(sendPostRequest);
