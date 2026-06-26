export const strokeQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "sex", type: "select", label: "Biological Sex", options: ["Female", "Male", "Other"] },
      { id: "married", type: "select", label: "Have you ever been married?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "work_type", type: "select", label: "What is your primary work type?", options: [{value: "Private", label: "Private Sector"}, {value: "Self-employed", label: "Self-Employed"}, {value: "Govt_job", label: "Government Job"}, {value: "children", label: "Student / Child"}, {value: "Never_worked", label: "Never Worked"}] },
      { id: "residence", type: "select", label: "Residence Type", options: [{value: "Urban", label: "Urban / City"}, {value: "Rural", label: "Rural / Countryside"}] }
    ]
  },
  {
    tier: 2,
    title: "Symptoms & Medical History",
    questions: [
      { id: "smoker", type: "select", label: "Do you smoke?", options: [{value: "never", label: "Never"}, {value: "past", label: "Past Smoker"}, {value: "current", label: "Current Smoker"}] },
      { id: "bmi", type: "select", label: "How would you describe your body weight?", options: [{value: "underweight", label: "Underweight"}, {value: "normal", label: "Normal/Average"}, {value: "overweight", label: "Overweight"}, {value: "obese", label: "Obese"}] },
      { id: "prior_heart_attack", type: "select", label: "Do you have any heart disease or have you had a heart attack?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] }
    ]
  },
  {
    tier: 3,
    title: "Clinical / Lab Values (Optional)",
    questions: [
      { id: "bp_known", type: "select", label: "Do you know if you have high blood pressure (Hypertension)?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, I do"}, {value: "dont_know", label: "I don't know"}] },
      { id: "glucose_known", type: "select", label: "Do you know if your average blood glucose is high?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, it is high"}, {value: "dont_know", label: "I don't know / Never tested"}] }
    ]
  }
];
