export const strokeQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "gender", type: "select", label: "Biological Sex", options: ["Male", "Female"] },
      { id: "ever_married", type: "select", label: "Ever Married?", options: ["Yes", "No"] },
      { id: "work_type", type: "select", label: "Work Type", options: ["Private", "Self-employed", "Govt_job", "children", "Never_worked"] },
      { id: "Residence_type", type: "select", label: "Residence Type", options: ["Urban", "Rural"] },
      { id: "smoking_status", type: "select", label: "Smoking Status", options: ["never smoked", "formerly smoked", "smokes", "Unknown"] }
    ]
  },
  {
    tier: 2,
    title: "Medical History",
    questions: [
      { id: "hypertension", type: "select", label: "Do you have Hypertension?", options: [{value: 0, label: "No"}, {value: 1, label: "Yes"}] },
      { id: "heart_disease", type: "select", label: "Do you have Heart Disease?", options: [{value: 0, label: "No"}, {value: 1, label: "Yes"}] },
      { id: "bmi", type: "number", label: "Body Mass Index (BMI)", min: 10, max: 70, default: 25 },
      { id: "avg_glucose_level", type: "number", label: "Average Glucose Level (mg/dL)", min: 40, max: 300, default: 100 }
    ]
  }
];
