// Lung cancer model uses values: 1 = No, 2 = Yes (for binary fields)
// GENDER: 'M' or 'F'
// Field IDs here use underscores; backend maps them to space-separated column names

export const lungQuestions = [
  {
    tier: 1,
    title: "Demographics & Key Habits",
    questions: [
      { id: "AGE", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "GENDER", type: "select", label: "Biological Sex", options: [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" }
      ]},
      { id: "SMOKING", type: "select", label: "Do you smoke or have you smoked?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "ALCOHOL_CONSUMING", type: "select", label: "Do you consume alcohol regularly?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "ANXIETY", type: "select", label: "Do you experience anxiety?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]}
    ]
  },
  {
    tier: 2,
    title: "Symptoms & Conditions",
    questions: [
      { id: "YELLOW_FINGERS", type: "select", label: "Do you have yellow fingers (nicotine staining)?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "PEER_PRESSURE", type: "select", label: "Have you felt peer pressure regarding smoking?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "CHRONIC_DISEASE", type: "select", label: "Do you have any chronic disease?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "FATIGUE", type: "select", label: "Do you experience frequent fatigue?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "ALLERGY", type: "select", label: "Do you have allergies?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "WHEEZING", type: "select", label: "Do you wheeze when breathing?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "COUGHING", type: "select", label: "Do you have a persistent cough?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "SHORTNESS_OF_BREATH", type: "select", label: "Do you experience shortness of breath?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "SWALLOWING_DIFFICULTY", type: "select", label: "Do you have difficulty swallowing?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]},
      { id: "CHEST_PAIN", type: "select", label: "Do you experience chest pain?", options: [
        { value: 1, label: "No" },
        { value: 2, label: "Yes" }
      ]}
    ]
  }
];
