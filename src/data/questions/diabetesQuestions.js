export const diabetesQuestions = [
  {
    tier: 1,
    title: "Basic Demographics",
    questions: [
      { id: "Age", type: "number", label: "What is your age?", min: 18, max: 120, default: 45 },
      { id: "BMI", type: "number", label: "Body Mass Index (BMI). Use calculator: weight(kg) / height(m)²", min: 10, max: 70, default: 25 },
      { id: "Pregnancies", type: "number", label: "Number of pregnancies (0 if male or none)", min: 0, max: 20, default: 0 }
    ]
  },
  {
    tier: 2,
    title: "Clinical Measurements",
    questions: [
      { id: "Glucose", type: "number", label: "Plasma Glucose Concentration (mg/dL) — fasting blood sugar", min: 0, max: 400, default: 100 },
      { id: "BloodPressure", type: "number", label: "Diastolic Blood Pressure (mm Hg) — lower number", min: 0, max: 200, default: 80 },
      { id: "SkinThickness", type: "number", label: "Triceps Skin Fold Thickness (mm) — leave 20 if unknown", min: 0, max: 100, default: 20 },
      { id: "Insulin", type: "number", label: "2-Hour Serum Insulin (mu U/ml) — leave 80 if unknown", min: 0, max: 900, default: 80 },
      { id: "DiabetesPedigreeFunction", type: "number", label: "Diabetes Pedigree Function (family history score, 0.0–2.5)", min: 0, max: 3, default: 0.47 }
    ]
  }
];
