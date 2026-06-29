export const strokeQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "gender", type: "select", label: "Biological Sex", options: ["Male", "Female"] },
      { id: "ever_married", type: "select", label: "Ever Married?", options: ["Yes", "No"] },
      { id: "work_type", type: "select", label: "Work Type", options: [
        { value: "Private", label: "Private sector" },
        { value: "Self-employed", label: "Self-employed" },
        { value: "Govt_job", label: "Government job" },
        { value: "children", label: "Student / Child" },
        { value: "Never_worked", label: "Never worked" }
      ]},
      { id: "Residence_type", type: "select", label: "Residence Type", options: ["Urban", "Rural"] },
      { id: "smoking_status", type: "select", label: "Smoking Status", options: [
        { value: "never smoked", label: "Never smoked" },
        { value: "formerly smoked", label: "Formerly smoked" },
        { value: "smokes", label: "Currently smokes" },
        { value: "Unknown", label: "Unknown / Prefer not to say" }
      ]}
    ]
  },
  {
    tier: 2,
    title: "Medical History & Clinical Measurements",
    questions: [
      { id: "hypertension", type: "select", label: "Do you have Hypertension (High Blood Pressure)?", options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
      ]},
      { id: "heart_disease", type: "select", label: "Do you have existing Heart Disease?", options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
      ]},
      { id: "bmi", type: "number", label: "Body Mass Index (BMI)", min: 10, max: 70, default: 25 },
      { id: "avg_glucose_level", type: "number", label: "Average Glucose Level (mg/dL)", min: 40, max: 300, default: 100 }
    ]
  }
];
