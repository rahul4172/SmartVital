export const lungQuestions = [
  {
    tier: 1,
    title: "Demographics & Habits",
    questions: [
      { id: "AGE", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "GENDER", type: "select", label: "Biological Sex", options: [{value: "M", label: "Male"}, {value: "F", label: "Female"}] },
      { id: "SMOKING", type: "select", label: "Do you smoke?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "ALCOHOL_CONSUMING", type: "select", label: "Do you consume alcohol?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] }
    ]
  },
  {
    tier: 2,
    title: "Symptoms & Conditions",
    questions: [
      { id: "YELLOW_FINGERS", type: "select", label: "Do you have yellow fingers?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "ANXIETY", type: "select", label: "Do you experience anxiety?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "PEER_PRESSURE", type: "select", label: "Peer pressure?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "CHRONIC_DISEASE", type: "select", label: "Do you have chronic disease?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "FATIGUE", type: "select", label: "Do you experience fatigue?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "ALLERGY", type: "select", label: "Do you have allergies?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "WHEEZING", type: "select", label: "Do you wheeze?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "COUGHING", type: "select", label: "Do you cough often?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "SHORTNESS_OF_BREATH", type: "select", label: "Experience shortness of breath?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "SWALLOWING_DIFFICULTY", type: "select", label: "Swallowing difficulty?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] },
      { id: "CHEST_PAIN", type: "select", label: "Chest pain?", options: [{value: 1, label: "No"}, {value: 2, label: "Yes"}] }
    ]
  }
];
