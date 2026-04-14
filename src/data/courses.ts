// auto-generated data model
export type MaterialType = "pdf" | "slides" | "video" | "notes" | "assignment" | "html";

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  estimatedMinutes: number;
  dateAdded: string; 
  fileName: string;
}

export interface Week {
  id: number;
  title: string;
  materials: Material[];
}

export interface Subject {
  name: string;
  code: string;
  icon: string;
  color: string;
  weeks: Week[];
}

export interface Semester {
  id: number;
  label: string;
  status: "completed" | "ongoing" | "upcoming";
  subjects: Subject[];
}

export const semesters: Semester[] = [
  {
    id: 1,
    label: "Semester 1",
    status: "ongoing",
    subjects: [
  {
    "name": "Algorithmic Thinking and Its Application",
    "code": "ATA",
    "icon": "🧠",
    "color": "from-cyan-500 to-blue-600",
    "weeks": [
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-ATAW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 29,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-ATAW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 13,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW3.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-ATAW4html",
            "title": "W4",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW4.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-ATAW5L1W6L1html",
            "title": "W5L1&W6L1",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW5L1&W6L1.html"
          },
          {
            "id": "m-ATAW5L2W5L3html",
            "title": "W5L2&W5L3",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW5L2&W5L3.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-ATAW6L2html",
            "title": "W6L2",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW6L2.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-ATAW7L1html",
            "title": "W7L1",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW7L1.html"
          },
          {
            "id": "m-ATAW7L2html",
            "title": "W7L2",
            "type": "html",
            "estimatedMinutes": 11,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW7L2.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-ATAW8L1html",
            "title": "W8L1",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW8L1.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-ATAW9L1html",
            "title": "W9L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW9L1.html"
          },
          {
            "id": "m-ATAW9L2W10L1html",
            "title": "W9L2&W10L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW9L2&W10L1.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-ATAW10L2W11L1W11L2html",
            "title": "W10L2,W11L1&W11L2",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW10L2,W11L1&W11L2.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-ATAW12L1html",
            "title": "W12L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW12L1.html"
          },
          {
            "id": "m-ATAW12L2html",
            "title": "W12L2",
            "type": "html",
            "estimatedMinutes": 12,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW12L2.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-ATAW13L1html",
            "title": "W13L1",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW13L1.html"
          },
          {
            "id": "m-ATAW13L2html",
            "title": "W13L2",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "ATAW13L2.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Basics of Data Analytics",
    "code": "BDA",
    "icon": "📊",
    "color": "from-blue-500 to-indigo-600",
    "weeks": [
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-BDAW3L1html",
            "title": "W3L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW3L1.html"
          },
          {
            "id": "m-BDAW3L2html",
            "title": "W3L2",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW3L2.html"
          },
          {
            "id": "m-BDAW3L3html",
            "title": "W3L3",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW3L3.html"
          },
          {
            "id": "m-BDAW3L4html",
            "title": "W3L4",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW3L4.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-BDAW4L1html",
            "title": "W4L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW4L1.html"
          },
          {
            "id": "m-BDAW4L2html",
            "title": "W4L2",
            "type": "html",
            "estimatedMinutes": 11,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW4L2.html"
          },
          {
            "id": "m-BDAW4L3html",
            "title": "W4L3",
            "type": "html",
            "estimatedMinutes": 11,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW4L3.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-BDAW5L1html",
            "title": "W5L1",
            "type": "html",
            "estimatedMinutes": 30,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW5L1.html"
          },
          {
            "id": "m-BDAW5L2html",
            "title": "W5L2",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW5L2.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-BDAW6L1html",
            "title": "W6L1",
            "type": "html",
            "estimatedMinutes": 26,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW6L1.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-BDAW8L1html",
            "title": "W8L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW8L1.html"
          },
          {
            "id": "m-BDAW8l2html",
            "title": "W8l2",
            "type": "html",
            "estimatedMinutes": 8,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW8l2.html"
          },
          {
            "id": "m-BDAW8L3html",
            "title": "W8L3",
            "type": "html",
            "estimatedMinutes": 11,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW8L3.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-BDAW9L1html",
            "title": "W9L1",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW9L1.html"
          },
          {
            "id": "m-BDAW9L2html",
            "title": "W9L2",
            "type": "html",
            "estimatedMinutes": 8,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW9L2.html"
          },
          {
            "id": "m-BDAW9L3html",
            "title": "W9L3",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW9L3.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-BDAW10L1html",
            "title": "W10L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW10L1.html"
          },
          {
            "id": "m-BDAW10L2html",
            "title": "W10L2",
            "type": "html",
            "estimatedMinutes": 13,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW10L2.html"
          },
          {
            "id": "m-BDAW10L3html",
            "title": "W10L3",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW10L3.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-BDAW11L1html",
            "title": "W11L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW11L1.html"
          },
          {
            "id": "m-BDAW11L2html",
            "title": "W11L2",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW11L2.html"
          },
          {
            "id": "m-BDAW11L3html",
            "title": "W11L3",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW11L3.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-BDAW12L1html",
            "title": "W12L1",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW12L1.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-BDAW13L1html",
            "title": "W13L1",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW13L1.html"
          },
          {
            "id": "m-BDAW13L2html",
            "title": "W13L2",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW13L2.html"
          }
        ]
      },
      {
        "id": 14,
        "title": "Week 14 Lectures",
        "materials": [
          {
            "id": "m-BDAW14L1html",
            "title": "W14L1",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW14L1.html"
          }
        ]
      },
      {
        "id": 15,
        "title": "Week 15 Lectures",
        "materials": [
          {
            "id": "m-BDAW15L1html",
            "title": "W15L1",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "BDAW15L1.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Foundation of Statistics and Probability",
    "code": "FSP",
    "icon": "📐",
    "color": "from-indigo-500 to-purple-600",
    "weeks": [
      {
        "id": 1,
        "title": "Week 1 Lectures",
        "materials": [
          {
            "id": "m-FSPW1L1html",
            "title": "W1L1",
            "type": "html",
            "estimatedMinutes": 10,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW1L1.html"
          }
        ]
      },
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-FSPW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 12,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-FSPW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW3.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-FSPW4html",
            "title": "W4",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW4.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-FSPW5html",
            "title": "W5",
            "type": "html",
            "estimatedMinutes": 34,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW5.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-FSPW6L1W6L2html",
            "title": "W6L1&W6L2",
            "type": "html",
            "estimatedMinutes": 19,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW6L1&W6L2.html"
          },
          {
            "id": "m-FSPW6L3html",
            "title": "W6L3",
            "type": "html",
            "estimatedMinutes": 19,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW6L3.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-FSPW7L1html",
            "title": "W7L1",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW7L1.html"
          },
          {
            "id": "m-FSPW7L2html",
            "title": "W7L2",
            "type": "html",
            "estimatedMinutes": 9,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW7L2.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-FSPW8L1W8L2W8L3html",
            "title": "W8L1&W8L2&W8L3",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW8L1&W8L2&W8L3.html"
          },
          {
            "id": "m-FSPW8L4html",
            "title": "W8L4",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW8L4.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-FSPW9L1W9L2W9L3html",
            "title": "W9L1W9L2&W9L3",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW9L1W9L2&W9L3.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-FSPW10L1L2html",
            "title": "W10L1&L2",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW10L1&L2.html"
          },
          {
            "id": "m-FSPW10L3html",
            "title": "W10L3",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW10L3.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-FSPW11html",
            "title": "W11",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW11.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-FSPW12html",
            "title": "W12",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW12.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-FSPW13html",
            "title": "W13",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "FSPW13.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Linear Algebra and Numerical Analysis",
    "code": "LANA",
    "icon": "🔢",
    "color": "from-purple-500 to-pink-600",
    "weeks": [
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-LANAW2L1W2L2html",
            "title": "W2L1&W2L2",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW2L1&W2L2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-LANAW3L1LANAW3L2LANAW3L3LANAW3L4html",
            "title": "W3L1 LANAW3L2 LANAW3L3&LANAW3L4",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW3L1_LANAW3L2_LANAW3L3&LANAW3L4.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-LANAW4L1LANAW4L2html",
            "title": "W4L1&LANAW4L2",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW4L1&LANAW4L2.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-LANAW5html",
            "title": "W5",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW5.html"
          },
          {
            "id": "m-LANAW5L1html",
            "title": "W5L1",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW5L1.html"
          },
          {
            "id": "m-LANAW5L2html",
            "title": "W5L2",
            "type": "html",
            "estimatedMinutes": 20,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW5L2.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-LANAW6W7html",
            "title": "W6&W7",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW6&W7.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-LANAW8html",
            "title": "W8",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW8.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-LANAW9html",
            "title": "W9",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW9.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-LANAW10html",
            "title": "W10",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW10.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-LANAW11html",
            "title": "W11",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW11.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-LANAW12W13html",
            "title": "W12&W13",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "LANAW12&W13.html"
          }
        ]
      }
    ]
  }
]
  },
  {
    id: 2,
    label: "Semester 2",
    status: "ongoing",
    subjects: [
  {
    "name": "Foundations of AI",
    "code": "FAI",
    "icon": "🤖",
    "color": "from-teal-500 to-emerald-600",
    "weeks": [
      {
        "id": 1,
        "title": "Week 1 Lectures",
        "materials": [
          {
            "id": "m-FAIW1html",
            "title": "W1",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW1.html"
          }
        ]
      },
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-FAIW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-FAIW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 17,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW3.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-FAIW4L1W4L2html",
            "title": "W4L1&W4L2",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW4L1&W4L2.html"
          },
          {
            "id": "m-FAIW4L3html",
            "title": "W4L3",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW4L3.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-FAIW5L1html",
            "title": "W5L1",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW5L1.html"
          },
          {
            "id": "m-FAIW5L2html",
            "title": "W5L2",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW5L2.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-FAIW6html",
            "title": "W6",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW6.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-FAIW7html",
            "title": "W7",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW7.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-FAIW8html",
            "title": "W8",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW8.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-FAIW9W10html",
            "title": "W9&W10",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW9&W10.html"
          },
          {
            "id": "m-FAIW9W101html",
            "title": "W9&W10 (1)",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW9&W10 (1).html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-FAIW11html",
            "title": "W11",
            "type": "html",
            "estimatedMinutes": 30,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW11.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-FAIW12html",
            "title": "W12",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW12.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-FAIW13html",
            "title": "W13",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "FAIW13.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Numerical Optimization",
    "code": "NO",
    "icon": "📈",
    "color": "from-orange-500 to-red-600",
    "weeks": [
      {
        "id": 1,
        "title": "Week 1 Lectures",
        "materials": [
          {
            "id": "m-NOW1L1html",
            "title": "W1L1",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "NOW1L1.html"
          },
          {
            "id": "m-NOW1L2html",
            "title": "W1L2",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "NOW1L2.html"
          }
        ]
      },
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-NOW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "NOW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-NOW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 15,
            "dateAdded": "2025-08-01",
            "fileName": "NOW3.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-NOW4html",
            "title": "W4",
            "type": "html",
            "estimatedMinutes": 26,
            "dateAdded": "2025-08-01",
            "fileName": "NOW4.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-NOW5L1W5L2html",
            "title": "W5L1&W5L2",
            "type": "html",
            "estimatedMinutes": 32,
            "dateAdded": "2025-08-01",
            "fileName": "NOW5L1&W5L2.html"
          },
          {
            "id": "m-NOW5L3W5L4html",
            "title": "W5L3&W5L4",
            "type": "html",
            "estimatedMinutes": 28,
            "dateAdded": "2025-08-01",
            "fileName": "NOW5L3&W5L4.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-NOW6html",
            "title": "W6",
            "type": "html",
            "estimatedMinutes": 22,
            "dateAdded": "2025-08-01",
            "fileName": "NOW6.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-NOW7html",
            "title": "W7",
            "type": "html",
            "estimatedMinutes": 27,
            "dateAdded": "2025-08-01",
            "fileName": "NOW7.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-NOW8L2W9html",
            "title": "W8L2&W9",
            "type": "html",
            "estimatedMinutes": 20,
            "dateAdded": "2025-08-01",
            "fileName": "NOW8L2&W9.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-NOW10html",
            "title": "W10",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "NOW10.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-NOW11html",
            "title": "W11",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "NOW11.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-NOW12html",
            "title": "W12",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "NOW12.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-NOW13html",
            "title": "W13",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "NOW13.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Probability and Random Processes",
    "code": "PRP",
    "icon": "🎲",
    "color": "from-rose-500 to-pink-600",
    "weeks": [
      {
        "id": 1,
        "title": "Week 1 Lectures",
        "materials": [
          {
            "id": "m-PRPW1html",
            "title": "W1",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW1.html"
          }
        ]
      },
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-PRPW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-PRPW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 14,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW3.html"
          },
          {
            "id": "m-PRPW31html",
            "title": "W3(1)",
            "type": "html",
            "estimatedMinutes": 13,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW3(1).html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-PRPW4html",
            "title": "W4",
            "type": "html",
            "estimatedMinutes": 20,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW4.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-PRPW5L1html",
            "title": "W5L1",
            "type": "html",
            "estimatedMinutes": 18,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW5L1.html"
          },
          {
            "id": "m-PRPW5L2W5L3html",
            "title": "W5L2&W5L3",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW5L2&W5L3.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-PRPW6html",
            "title": "W6",
            "type": "html",
            "estimatedMinutes": 26,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW6.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-PRPW7html",
            "title": "W7",
            "type": "html",
            "estimatedMinutes": 35,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW7.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-PRPW8html",
            "title": "W8",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW8.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-PRPW9html",
            "title": "W9",
            "type": "html",
            "estimatedMinutes": 34,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW9.html"
          }
        ]
      },
      {
        "id": 10,
        "title": "Week 10 Lectures",
        "materials": [
          {
            "id": "m-PRPW10html",
            "title": "W10",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW10.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-PRPW11html",
            "title": "W11",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW11.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-PRPW12html",
            "title": "W12",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW12.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-PRPW13html",
            "title": "W13",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "PRPW13.html"
          }
        ]
      }
    ]
  },
  {
    "name": "Visual Storytelling & Design",
    "code": "VSD",
    "icon": "🎨",
    "color": "from-fuchsia-500 to-purple-600",
    "weeks": [
      {
        "id": 1,
        "title": "Week 1 Lectures",
        "materials": [
          {
            "id": "m-VSDW13html",
            "title": "W1 (3)",
            "type": "html",
            "estimatedMinutes": 20,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW1 (3).html"
          }
        ]
      },
      {
        "id": 2,
        "title": "Week 2 Lectures",
        "materials": [
          {
            "id": "m-VSDW2html",
            "title": "W2",
            "type": "html",
            "estimatedMinutes": 35,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW2.html"
          }
        ]
      },
      {
        "id": 3,
        "title": "Week 3 Lectures",
        "materials": [
          {
            "id": "m-VSDW3html",
            "title": "W3",
            "type": "html",
            "estimatedMinutes": 16,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW3.html"
          }
        ]
      },
      {
        "id": 4,
        "title": "Week 4 Lectures",
        "materials": [
          {
            "id": "m-VSDW4html",
            "title": "W4",
            "type": "html",
            "estimatedMinutes": 26,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW4.html"
          }
        ]
      },
      {
        "id": 5,
        "title": "Week 5 Lectures",
        "materials": [
          {
            "id": "m-VSDW5html",
            "title": "W5",
            "type": "html",
            "estimatedMinutes": 23,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW5.html"
          }
        ]
      },
      {
        "id": 6,
        "title": "Week 6 Lectures",
        "materials": [
          {
            "id": "m-VSDW6html",
            "title": "W6",
            "type": "html",
            "estimatedMinutes": 28,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW6.html"
          }
        ]
      },
      {
        "id": 7,
        "title": "Week 7 Lectures",
        "materials": [
          {
            "id": "m-VSDW7L1html",
            "title": "W7L1",
            "type": "html",
            "estimatedMinutes": 21,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW7L1.html"
          },
          {
            "id": "m-VSDW7L2W8L1W8L2html",
            "title": "W7L2 W8L1&W8L2",
            "type": "html",
            "estimatedMinutes": 24,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW7L2_W8L1&W8L2.html"
          }
        ]
      },
      {
        "id": 8,
        "title": "Week 8 Lectures",
        "materials": [
          {
            "id": "m-VSDW8L3W9L1html",
            "title": "W8L3&W9L1",
            "type": "html",
            "estimatedMinutes": 25,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW8L3&W9L1.html"
          }
        ]
      },
      {
        "id": 9,
        "title": "Week 9 Lectures",
        "materials": [
          {
            "id": "m-VSDW9L2W10html",
            "title": "W9L2&W10",
            "type": "html",
            "estimatedMinutes": 37,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW9L2&W10.html"
          }
        ]
      },
      {
        "id": 11,
        "title": "Week 11 Lectures",
        "materials": [
          {
            "id": "m-VSDW11L1html",
            "title": "W11L1",
            "type": "html",
            "estimatedMinutes": 29,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW11L1.html"
          },
          {
            "id": "m-VSDW11L2W12L1html",
            "title": "W11L2&W12L1",
            "type": "html",
            "estimatedMinutes": 32,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW11L2&W12L1.html"
          }
        ]
      },
      {
        "id": 12,
        "title": "Week 12 Lectures",
        "materials": [
          {
            "id": "m-VSDW12L2W12L3html",
            "title": "W12L2&W12L3",
            "type": "html",
            "estimatedMinutes": 32,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW12L2&W12L3.html"
          }
        ]
      },
      {
        "id": 13,
        "title": "Week 13 Lectures",
        "materials": [
          {
            "id": "m-VSDW13html",
            "title": "W13",
            "type": "html",
            "estimatedMinutes": 29,
            "dateAdded": "2025-08-01",
            "fileName": "VSDW13.html"
          }
        ]
      }
    ]
  }
]
  }
];

export function getSemester(id: number): Semester | undefined {
  return semesters.find((s) => s.id === id);
}

export function getSubject(semId: number, code: string): Subject | undefined {
  const sem = getSemester(semId);
  return sem?.subjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function getWeek(semId: number, code: string, weekId: number): Week | undefined {
  const subject = getSubject(semId, code);
  return subject?.weeks.find((w) => w.id === weekId);
}

export function getTotalMinutes(weeks: Week[]): number {
  return weeks.reduce(
    (total, week) =>
      total + week.materials.reduce((wTotal, m) => wTotal + m.estimatedMinutes, 0),
    0
  );
}

export function getTotalMaterials(weeks: Week[]): number {
  return weeks.reduce((total, week) => total + week.materials.length, 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getMaterialIcon(type: MaterialType): string {
  switch (type) {
    case "html": return "📄";
    case "pdf": return "📄";
    case "slides": return "📊";
    case "video": return "🎬";
    case "notes": return "📝";
    case "assignment": return "✏️";
  }
}

export function getMaterialLabel(type: MaterialType): string {
  switch (type) {
    case "html": return "Notes";
    case "pdf": return "PDF";
    case "slides": return "Slides";
    case "video": return "Video";
    case "notes": return "Notes";
    case "assignment": return "Assignment";
  }
}
