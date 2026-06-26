export const diabetesQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "sex", type: "select", label: "Biological Sex", options: ["Female", "Male", "Other"] },
      { id: "smoker", type: "select", label: "Do you smoke?", options: [{value: "never", label: "Never"}, {value: "past", label: "Past Smoker"}, {value: "current", label: "Current Smoker"}] },
      { id: "bmi", type: "select", label: "How would you describe your body weight?", options: [{value: "underweight", label: "Underweight"}, {value: "normal", label: "Normal/Average"}, {value: "overweight", label: "Overweight"}, {value: "obese", label: "Obese"}] }
    ]
  },
  {
    tier: 2,
    title: "Symptoms & Medical History",
    questions: [
      { id: "thirsty", type: "select", label: "Do you feel excessively thirsty?", options: [{value: "never", label: "No"}, {value: "sometimes", label: "Sometimes"}, {value: "often", label: "Yes, often"}] },
      { id: "urinate", type: "select", label: "Do you urinate more frequently than usual (especially at night)?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "prior_heart_attack", type: "select", label: "Do you have any heart disease or have you had a heart attack?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] }
    ]
  },
  {
    tier: 3,
    title: "Clinical / Lab Values (Optional)",
    questions: [
      { id: "bp_known", type: "select", label: "Do you know if you have high blood pressure (Hypertension)?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, I do"}, {value: "dont_know", label: "I don't know"}] },
      { id: "hba1c_known", type: "select", label: "Have you been told your HbA1c is high?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, it is high (over 6.5%)"}, {value: "dont_know", label: "I don't know / Never tested"}] },
      { id: "glucose_known", type: "select", label: "Do you know if your fasting blood glucose is high?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, it is high (over 126 mg/dL)"}, {value: "dont_know", label: "I don't know / Never tested"}] }
    ]
  }
];
