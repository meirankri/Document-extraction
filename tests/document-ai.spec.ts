import dotenv from "dotenv";
dotenv.config();
import DataExtractionDocumentAIRepository from "../services/DataExtractionDocumentAIRepository";

describe("Document AI", () => {
  test("it should extract data from document.entities", () => {
    const dataExtraction = new DataExtractionDocumentAIRepository();
    const result = dataExtraction.extractDataFromEntities(documentAi);
    expect(result).toMatchSnapshot([
      {
        page: 0,
        firstName: { value: "serge", confidence: 1 },
        lastName: { value: "siritzky", confidence: 1 },
      },
      {
        page: 1,
        examinationDate: { value: "5/4/2024", confidence: 1 },
        birthDate: { value: "11/12/1955", confidence: 1 },
        lastName: { value: "leroy sismondino", confidence: 1 },
        medicalExamination: {
          value: "echographie cardiaque trans-thoracique",
          confidence: 1,
        },
        firstName: { value: "daniel", confidence: 1 },
      },
      {
        page: 2,
        birthDate: { value: "28/11/1952", confidence: 1 },
        lastName: { value: "elmai,", confidence: 1 },
        firstName: { value: "faouzi", confidence: 1 },
        examinationDate: { value: "6/2/2024", confidence: 1 },
        medicalExamination: {
          value: "compte rendu",
          confidence: 0.1666666716337204,
        },
      },
      {
        page: 3,
        examinationDate: { value: "3/4/2024", confidence: 1 },
        lastName: { value: "leroy sismondino", confidence: 1 },
        birthDate: { value: "11/12/1955", confidence: 1 },
        firstName: { value: "daniel", confidence: 1 },
        medicalExamination: {
          value: "coronarographie et angiopíastie",
          confidence: 0.5,
        },
      },
      {
        page: 4,
        lastName: { value: "elmai", confidence: 1 },
        examinationDate: { value: "17/2/2024", confidence: 0.3333333432674408 },
        birthDate: { value: "28/11/1952", confidence: 0.6666666865348816 },
        firstName: { value: "faouzi", confidence: 1 },
        medicalExamination: {
          value: "compte-rendu d'hospitalisation prise en charge avc",
          confidence: 0.3333333432674408,
        },
      },
      {
        page: 5,
        examinationDate: { value: "27/2/2024", confidence: 1 },
        lastName: { value: "guillet", confidence: 1 },
        birthDate: { value: "27/2/1964", confidence: 1 },
        medicalExamination: {
          value: "echotomographie thyroidienne et cervicale",
          confidence: 1,
        },
        firstName: { value: "laurence", confidence: 1 },
      },
      {
        page: 6,
        examinationDate: { value: "27/2/2024", confidence: 1 },
        birthDate: { value: "27/2/1964", confidence: 1 },
        firstName: { value: "laurence", confidence: 1 },
        medicalExamination: {
          value: "echotomographie thyroidienne et cervicale",
          confidence: 1,
        },
        lastName: { value: "guillet", confidence: 1 },
      },
      {
        page: 7,
        birthDate: { value: "5/1/1952", confidence: 1 },
        firstName: { value: "jean pierre", confidence: 1 },
        lastName: { value: "avoignat", confidence: 1 },
      },
      {
        page: 8,
        firstName: { value: "laurence", confidence: 1 },
        examinationDate: { value: "27/2/2024", confidence: 1 },
        medicalExamination: {
          value: "echotomographie thyroidienne et cervicale",
          confidence: 1,
        },
        birthDate: { value: "27/2/1964", confidence: 1 },
        lastName: { value: "guillet", confidence: 1 },
      },
      {
        page: 9,
        medicalExamination: {
          value: "echotomographie thyroidienne et cervicale",
          confidence: 1,
        },
        birthDate: { value: "27/2/1964", confidence: 1 },
        lastName: { value: "guillet", confidence: 1 },
        examinationDate: { value: "27/2/2024", confidence: 1 },
        firstName: { value: "laurence", confidence: 1 },
      },
    ]);
  });
});

const documentAi = [
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "179",
          endIndex: "184",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Serge",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "0",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.40722596645355225,
                y: 0.349530428647995,
              },
              {
                x: 0.4507042169570923,
                y: 0.349530428647995,
              },
              {
                x: 0.4507042169570923,
                y: 0.3666802644729614,
              },
              {
                x: 0.40722596645355225,
                y: 0.3666802644729614,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "0",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "170",
          endIndex: "178",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "Siritzky",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "0",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.3331291973590851,
                y: 0.35157206654548645,
              },
              {
                x: 0.3949785530567169,
                y: 0.35157206654548645,
              },
              {
                x: 0.3949785530567169,
                y: 0.3691302537918091,
              },
              {
                x: 0.3331291973590851,
                y: 0.3691302537918091,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "1",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "776",
          endIndex: "786",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "05/04/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "1",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1940828412771225,
                y: 0.25147929787635803,
              },
              {
                x: 0.2769230902194977,
                y: 0.25147929787635803,
              },
              {
                x: 0.2769230902194977,
                y: 0.26077768206596375,
              },
              {
                x: 0.1940828412771225,
                y: 0.26077768206596375,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "2",
    normalizedValue: {
      text: "2024-04-05",
      dateValue: {
        year: 2024,
        month: 4,
        day: 5,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "748",
          endIndex: "758",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "11/12/1955",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "1",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.3349112570285797,
                y: 0.20752324163913727,
              },
              {
                x: 0.41479289531707764,
                y: 0.20752324163913727,
              },
              {
                x: 0.41479289531707764,
                y: 0.21851225197315216,
              },
              {
                x: 0.3349112570285797,
                y: 0.21851225197315216,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "3",
    normalizedValue: {
      text: "1955-12-11",
      dateValue: {
        year: 1955,
        month: 12,
        day: 11,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "705",
          endIndex: "721",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "LEROY SISMONDINO",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "1",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.19585798680782318,
                y: 0.1424344927072525,
              },
              {
                x: 0.3372780978679657,
                y: 0.1424344927072525,
              },
              {
                x: 0.3372780978679657,
                y: 0.15131023526191711,
              },
              {
                x: 0.19585798680782318,
                y: 0.15131023526191711,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "4",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "655",
          endIndex: "693",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "Echographie Cardiaque Trans-Thoracique",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "1",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.30000001192092896,
                y: 0.11496195942163467,
              },
              {
                x: 0.7005917429924011,
                y: 0.11496195942163467,
              },
              {
                x: 0.7005917429924011,
                y: 0.1318681389093399,
              },
              {
                x: 0.30000001192092896,
                y: 0.1318681389093399,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "5",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "722",
          endIndex: "728",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "DANIEL",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "1",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.34260356426239014,
                y: 0.1428571492433548,
              },
              {
                x: 0.39289939403533936,
                y: 0.1428571492433548,
              },
              {
                x: 0.39289939403533936,
                y: 0.15173287689685822,
              },
              {
                x: 0.34260356426239014,
                y: 0.15173287689685822,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "6",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "2986",
          endIndex: "2996",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "28/11/1952",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "2",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.6469194293022156,
                y: 0.2857745885848999,
              },
              {
                x: 0.7304502129554749,
                y: 0.2857745885848999,
              },
              {
                x: 0.7304502129554749,
                y: 0.29421696066856384,
              },
              {
                x: 0.6469194293022156,
                y: 0.29421696066856384,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "7",
    normalizedValue: {
      text: "1952-11-28",
      dateValue: {
        year: 1952,
        month: 11,
        day: 28,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "2932",
          endIndex: "2938",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "ELMAI,",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "2",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.33116114139556885,
                y: 0.2684676945209503,
              },
              {
                x: 0.39277252554893494,
                y: 0.2684676945209503,
              },
              {
                x: 0.39277252554893494,
                y: 0.2802870273590088,
              },
              {
                x: 0.33116114139556885,
                y: 0.2802870273590088,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "8",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "2939",
          endIndex: "2945",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "FAOUZI",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "2",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.3981042802333832,
                y: 0.2676234841346741,
              },
              {
                x: 0.4650473892688751,
                y: 0.2676234841346741,
              },
              {
                x: 0.4650473892688751,
                y: 0.27944281697273254,
              },
              {
                x: 0.3981042802333832,
                y: 0.27944281697273254,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "9",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "2815",
          endIndex: "2825",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "06/02/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "2",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.4863744080066681,
                y: 0.12663571536540985,
              },
              {
                x: 0.5841231942176819,
                y: 0.12663571536540985,
              },
              {
                x: 0.5841231942176819,
                y: 0.13676656782627106,
              },
              {
                x: 0.4863744080066681,
                y: 0.13676656782627106,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "10",
    normalizedValue: {
      text: "2024-02-06",
      dateValue: {
        year: 2024,
        month: 2,
        day: 6,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "2826",
          endIndex: "2838",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "Compte rendu",
    mentionId: "",
    confidence: 0.1666666716337204,
    pageAnchor: {
      pageRefs: [
        {
          page: "2",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.13921800255775452,
                y: 0.17349092662334442,
              },
              {
                x: 0.3281990587711334,
                y: 0.17349092662334442,
              },
              {
                x: 0.3281990587711334,
                y: 0.19586323201656342,
              },
              {
                x: 0.13921800255775452,
                y: 0.19586323201656342,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "11",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "4339",
          endIndex: "4349",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "03/04/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "3",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.6473372578620911,
                y: 0.06889264285564423,
              },
              {
                x: 0.7461538314819336,
                y: 0.06889264285564423,
              },
              {
                x: 0.7461538314819336,
                y: 0.08072696626186371,
              },
              {
                x: 0.6473372578620911,
                y: 0.08072696626186371,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "12",
    normalizedValue: {
      text: "2024-04-03",
      dateValue: {
        year: 2024,
        month: 4,
        day: 3,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "4374",
          endIndex: "4390",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "LEROY SISMONDINO",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "3",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.37396448850631714,
                y: 0.10608622431755066,
              },
              {
                x: 0.6029585599899292,
                y: 0.10608622431755066,
              },
              {
                x: 0.6029585599899292,
                y: 0.11834319680929184,
              },
              {
                x: 0.37396448850631714,
                y: 0.11834319680929184,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "13",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "4401",
          endIndex: "4411",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "11/12/1955",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "3",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.7023668885231018,
                y: 0.11115807294845581,
              },
              {
                x: 0.7650887370109558,
                y: 0.11115807294845581,
              },
              {
                x: 0.7650887370109558,
                y: 0.11792054027318954,
              },
              {
                x: 0.7023668885231018,
                y: 0.11792054027318954,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "14",
    normalizedValue: {
      text: "1955-12-11",
      dateValue: {
        year: 1955,
        month: 12,
        day: 11,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "4391",
          endIndex: "4397",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Daniel",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "3",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.6189349293708801,
                y: 0.10608622431755066,
              },
              {
                x: 0.6893491148948669,
                y: 0.10608622431755066,
              },
              {
                x: 0.6893491148948669,
                y: 0.11834319680929184,
              },
              {
                x: 0.6189349293708801,
                y: 0.11834319680929184,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "15",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "4304",
          endIndex: "4335",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "Coronarographie et Angiopíastie",
    mentionId: "",
    confidence: 0.5,
    pageAnchor: {
      pageRefs: [
        {
          page: "3",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.6017751693725586,
                y: 0.05198647454380989,
              },
              {
                x: 0.9497041702270508,
                y: 0.05198647454380989,
              },
              {
                x: 0.9497041702270508,
                y: 0.06720203161239624,
              },
              {
                x: 0.6017751693725586,
                y: 0.06720203161239624,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "16",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "5506",
          endIndex: "5511",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "ELMAI",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.7405437231063843,
                y: 0.18747355043888092,
              },
              {
                x: 0.7884160876274109,
                y: 0.18747355043888092,
              },
              {
                x: 0.7884160876274109,
                y: 0.19678375124931335,
              },
              {
                x: 0.7405437231063843,
                y: 0.19678375124931335,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "17",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "6971",
          endIndex: "6981",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "13/02/2024",
    mentionId: "",
    confidence: 0.3333333432674408,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.4869976341724396,
                y: 0.4049936532974243,
              },
              {
                x: 0.5685579180717468,
                y: 0.4049936532974243,
              },
              {
                x: 0.5685579180717468,
                y: 0.4134574830532074,
              },
              {
                x: 0.4869976341724396,
                y: 0.4134574830532074,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "18",
    normalizedValue: {
      text: "2024-02-13",
      dateValue: {
        year: 2024,
        month: 2,
        day: 13,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "6985",
          endIndex: "6995",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "17/02/2024",
    mentionId: "",
    confidence: 0.3333333432674408,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.6128841638565063,
                y: 0.40457046031951904,
              },
              {
                x: 0.6938534379005432,
                y: 0.40457046031951904,
              },
              {
                x: 0.6938534379005432,
                y: 0.4138806462287903,
              },
              {
                x: 0.6128841638565063,
                y: 0.4138806462287903,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "19",
    normalizedValue: {
      text: "2024-02-17",
      dateValue: {
        year: 2024,
        month: 2,
        day: 17,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8074",
          endIndex: "8084",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "28/11/1952",
    mentionId: "",
    confidence: 0.6666666865348816,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.16489361226558685,
                y: 0.9475243091583252,
              },
              {
                x: 0.22340425848960876,
                y: 0.9475243091583252,
              },
              {
                x: 0.22340425848960876,
                y: 0.9559881687164307,
              },
              {
                x: 0.16489361226558685,
                y: 0.9559881687164307,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "20",
    normalizedValue: {
      text: "1952-11-28",
      dateValue: {
        year: 1952,
        month: 11,
        day: 28,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "5499",
          endIndex: "5505",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "FAOUZI",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.673758864402771,
                y: 0.18747355043888092,
              },
              {
                x: 0.7334515452384949,
                y: 0.18747355043888092,
              },
              {
                x: 0.7334515452384949,
                y: 0.19678375124931335,
              },
              {
                x: 0.673758864402771,
                y: 0.19678375124931335,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "21",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "6917",
          endIndex: "6967",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "COMPTE-RENDU D'HOSPITALISATION PRISE EN CHARGE AVC",
    mentionId: "",
    confidence: 0.3333333432674408,
    pageAnchor: {
      pageRefs: [
        {
          page: "4",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.26891252398490906,
                y: 0.3842572867870331,
              },
              {
                x: 0.7760047316551208,
                y: 0.3842572867870331,
              },
              {
                x: 0.7760047316551208,
                y: 0.39652982354164124,
              },
              {
                x: 0.26891252398490906,
                y: 0.39652982354164124,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "22",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8590",
          endIndex: "8600",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "27/02/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "5",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10810811072587967,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.1898680329322815,
              },
              {
                x: 0.10810811072587967,
                y: 0.1898680329322815,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "23",
    normalizedValue: {
      text: "2024-02-27",
      dateValue: {
        year: 2024,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8550",
          endIndex: "8557",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "GUILLET",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "5",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1269095242023468,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.1626223921775818,
              },
              {
                x: 0.1269095242023468,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "24",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8576",
          endIndex: "8586",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "27/02/1964",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "5",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1474735587835312,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.17624521255493164,
              },
              {
                x: 0.1474735587835312,
                y: 0.17624521255493164,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "25",
    normalizedValue: {
      text: "1964-02-27",
      dateValue: {
        year: 1964,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8660",
          endIndex: "8701",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "ECHOTOMOGRAPHIE THYROIDIENNE ET CERVICALE",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "5",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10987073928117752,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.29374203085899353,
              },
              {
                x: 0.10987073928117752,
                y: 0.29374203085899353,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "26",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "8558",
          endIndex: "8566",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Laurence",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "5",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.20211516320705414,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.1626223921775818,
              },
              {
                x: 0.20211516320705414,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "27",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "10756",
          endIndex: "10766",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "27/02/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "6",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10810811072587967,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.1898680329322815,
              },
              {
                x: 0.10810811072587967,
                y: 0.1898680329322815,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "28",
    normalizedValue: {
      text: "2024-02-27",
      dateValue: {
        year: 2024,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "10742",
          endIndex: "10752",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "27/02/1964",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "6",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1474735587835312,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.17624521255493164,
              },
              {
                x: 0.1474735587835312,
                y: 0.17624521255493164,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "29",
    normalizedValue: {
      text: "1964-02-27",
      dateValue: {
        year: 1964,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "10724",
          endIndex: "10732",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Laurence",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "6",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.20211516320705414,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.1626223921775818,
              },
              {
                x: 0.20211516320705414,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "30",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "10826",
          endIndex: "10867",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "ECHOTOMOGRAPHIE THYROIDIENNE ET CERVICALE",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "6",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10987073928117752,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.29374203085899353,
              },
              {
                x: 0.10987073928117752,
                y: 0.29374203085899353,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "31",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "10716",
          endIndex: "10723",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "GUILLET",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "6",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1269095242023468,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.1626223921775818,
              },
              {
                x: 0.1269095242023468,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "32",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "12624",
          endIndex: "12633",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "5/01/1952",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "7",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1022823303937912,
                y: 0.2604895234107971,
              },
              {
                x: 0.19061706960201263,
                y: 0.2604895234107971,
              },
              {
                x: 0.19061706960201263,
                y: 0.2779720425605774,
              },
              {
                x: 0.1022823303937912,
                y: 0.2779720425605774,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "33",
    normalizedValue: {
      text: "1952-01-05",
      dateValue: {
        year: 1952,
        month: 1,
        day: 5,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "12599",
          endIndex: "12610",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "JEAN PIERRE",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "7",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1018596813082695,
                y: 0.1946386992931366,
              },
              {
                x: 0.20921386778354645,
                y: 0.1946386992931366,
              },
              {
                x: 0.20921386778354645,
                y: 0.2097902148962021,
              },
              {
                x: 0.1018596813082695,
                y: 0.2097902148962021,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "34",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "12590",
          endIndex: "12598",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "AVOIGNAT",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "7",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.008875739760696888,
                y: 0.1934731900691986,
              },
              {
                x: 0.09002535790205002,
                y: 0.1934731900691986,
              },
              {
                x: 0.09002535790205002,
                y: 0.2086247056722641,
              },
              {
                x: 0.008875739760696888,
                y: 0.2086247056722641,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "35",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "13772",
          endIndex: "13780",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Laurence",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "8",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.20211516320705414,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.1626223921775818,
              },
              {
                x: 0.20211516320705414,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "36",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "13804",
          endIndex: "13814",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "27/02/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "8",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10810811072587967,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.1898680329322815,
              },
              {
                x: 0.10810811072587967,
                y: 0.1898680329322815,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "37",
    normalizedValue: {
      text: "2024-02-27",
      dateValue: {
        year: 2024,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "13874",
          endIndex: "13915",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "ECHOTOMOGRAPHIE THYROIDIENNE ET CERVICALE",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "8",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10987073928117752,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.29374203085899353,
              },
              {
                x: 0.10987073928117752,
                y: 0.29374203085899353,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "38",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "13790",
          endIndex: "13800",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "27/02/1964",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "8",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1474735587835312,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.17624521255493164,
              },
              {
                x: 0.1474735587835312,
                y: 0.17624521255493164,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "39",
    normalizedValue: {
      text: "1964-02-27",
      dateValue: {
        year: 1964,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "13764",
          endIndex: "13771",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "GUILLET",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "8",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1269095242023468,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.1626223921775818,
              },
              {
                x: 0.1269095242023468,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "40",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "16040",
          endIndex: "16081",
        },
      ],
      content: "",
    },
    type: "medical-examination",
    mentionText: "ECHOTOMOGRAPHIE THYROIDIENNE ET CERVICALE",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "9",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10987073928117752,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.2805449068546295,
              },
              {
                x: 0.5793184638023376,
                y: 0.29374203085899353,
              },
              {
                x: 0.10987073928117752,
                y: 0.29374203085899353,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "41",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "15956",
          endIndex: "15966",
        },
      ],
      content: "",
    },
    type: "birth-date",
    mentionText: "27/02/1964",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "9",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1474735587835312,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.1681566685438156,
              },
              {
                x: 0.23090481758117676,
                y: 0.17624521255493164,
              },
              {
                x: 0.1474735587835312,
                y: 0.17624521255493164,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "42",
    normalizedValue: {
      text: "1964-02-27",
      dateValue: {
        year: 1964,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "15930",
          endIndex: "15937",
        },
      ],
      content: "",
    },
    type: "patient-lastname",
    mentionText: "GUILLET",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "9",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.1269095242023468,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.15410813689231873,
              },
              {
                x: 0.19800235331058502,
                y: 0.1626223921775818,
              },
              {
                x: 0.1269095242023468,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "43",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "15970",
          endIndex: "15980",
        },
      ],
      content: "",
    },
    type: "date-examination",
    mentionText: "27/02/2024",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "9",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.10810811072587967,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.18177947402000427,
              },
              {
                x: 0.19212691485881805,
                y: 0.1898680329322815,
              },
              {
                x: 0.10810811072587967,
                y: 0.1898680329322815,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "44",
    normalizedValue: {
      text: "2024-02-27",
      dateValue: {
        year: 2024,
        month: 2,
        day: 27,
      },
      structuredValue: "dateValue",
    },
    provenance: null,
    redacted: false,
  },
  {
    properties: [],
    textAnchor: {
      textSegments: [
        {
          startIndex: "15938",
          endIndex: "15946",
        },
      ],
      content: "",
    },
    type: "patient-firstname",
    mentionText: "Laurence",
    mentionId: "",
    confidence: 1,
    pageAnchor: {
      pageRefs: [
        {
          page: "9",
          layoutId: "",
          boundingPoly: {
            vertices: [],
            normalizedVertices: [
              {
                x: 0.20211516320705414,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.15410813689231873,
              },
              {
                x: 0.2755581736564636,
                y: 0.1626223921775818,
              },
              {
                x: 0.20211516320705414,
                y: 0.1626223921775818,
              },
            ],
          },
          confidence: 0,
        },
      ],
    },
    id: "45",
    normalizedValue: null,
    provenance: null,
    redacted: false,
  },
];
