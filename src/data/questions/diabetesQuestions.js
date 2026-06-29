export const diabetesQuestions = [
  {
    tier: 1,
    title: "Basic Demographics",
    questions: [
      { id: "Age", type: "number", label: "What is your age?", min: 18, max: 120, default: 45 },
      { id: "BMI", type: "number", label: "What is your Body Mass Index (BMI)?", min: 10, max: 70, default: 25 },
      { id: "Pregnancies", type: "number", label: "Number of times pregnant (0 if Male/None)", min: 0, max: 20, default: 0 }
    ]
  },
  {
    tier: 2,
    title: "Clinical Measurements",
    questions: [
      { id: "Glucose", type: "number", label: "Glucose Level (mg/dL)", min: 0, max: 400, default: 100 },
      { id: "BloodPressure", type: "number", label: "Diastolic Blood Pressure (mm Hg)", min: 0, max: 200, default: 80 },
      { id: "SkinThickness", type: "number", label: "Triceps skin fold thickness (mm)", min: 0, max: 100, default: 20 },
      { id: "Insulin", type: "number", label: "2-Hour serum insulin (mu U/ml)", min: 0, max: 900, default: 80 },
      { id: "DiabetesPedigreeFunction", type: "number", label: "Diabetes Pedigree Function (Genetics)", min: 0, max: 3, default: 0.5 }
    ]
  }
];
