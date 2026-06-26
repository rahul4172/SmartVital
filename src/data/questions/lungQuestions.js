export const lungQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "sex", type: "select", label: "Biological Sex", options: ["Male", "Female"] },
      { id: "smoker", type: "select", label: "Do you smoke?", options: [{value: "never", label: "Never"}, {value: "past", label: "Past Smoker"}, {value: "current", label: "Current Smoker"}] },
      { id: "alcohol", type: "select", label: "Do you consume alcohol regularly?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] }
    ]
  },
  {
    tier: 2,
    title: "Symptoms & History",
    questions: [
      { id: "coughing", type: "select", label: "Do you have a persistent cough?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "shortness_of_breath", type: "select", label: "Do you experience shortness of breath?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "fatigue", type: "select", label: "Do you frequently feel fatigued or exhausted?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "chest_pain", type: "select", label: "Do you experience chest pain?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "wheezing", type: "select", label: "Do you experience wheezing when you breathe?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "swallowing_difficulty", type: "select", label: "Do you have difficulty swallowing?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "yellow_fingers", type: "select", label: "Have you noticed any yellowing of your fingers?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] }
    ]
  },
  {
    tier: 3,
    title: "Other Medical Factors",
    questions: [
      { id: "allergy", type: "select", label: "Do you have severe allergies?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "anxiety", type: "select", label: "Do you suffer from chronic anxiety?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "peer_pressure", type: "select", label: "Are you often exposed to secondhand smoke or environmental pollutants?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "chronic_disease", type: "select", label: "Do you have any other chronic lung diseases (like COPD or Asthma)?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] }
    ]
  }
];
