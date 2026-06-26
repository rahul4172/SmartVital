export const heartQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "sex", type: "select", label: "Biological Sex", options: ["Male", "Female"] },
      { id: "smoker", type: "select", label: "Do you smoke?", options: [{value: "never", label: "Never"}, {value: "past", label: "Past Smoker"}, {value: "current", label: "Current Smoker"}] },
      { id: "exercise", type: "select", label: "How often do you exercise?", options: [{value: "never", label: "Never"}, {value: "rarely", label: "1-2 times a week"}, {value: "often", label: "3-4 times a week"}, {value: "daily", label: "Almost every day"}] }
    ]
  },
  {
    tier: 2,
    title: "Symptoms & History",
    questions: [
      { id: "chest_during_activity", type: "select", label: "Do you experience chest pain or discomfort during physical activity?", options: [{value: "never", label: "Never"}, {value: "sometimes", label: "Sometimes"}, {value: "often", label: "Often"}, {value: "always", label: "Every time I exert myself"}] },
      { id: "chest_rest", type: "select", label: "Do you experience chest pain while resting?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}, {value: "na", label: "Not Sure / Not Applicable"}] },
      { id: "shortness_of_breath", type: "select", label: "Do you experience shortness of breath easily?", options: [{value: "never", label: "Never"}, {value: "sometimes", label: "Sometimes"}, {value: "often", label: "Often"}] },
      { id: "leg_pain_walking", type: "select", label: "Do your legs cramp or hurt when walking?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "prior_heart_attack", type: "select", label: "Have you ever had a heart attack?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}] },
      { id: "family_history", type: "select", label: "Does anyone in your immediate family have heart disease?", options: [{value: "no", label: "No"}, {value: "yes", label: "Yes"}, {value: "not_sure", label: "Not Sure"}] }
    ]
  },
  {
    tier: 3,
    title: "Clinical / Lab Values (Optional)",
    questions: [
      { id: "bp_known", type: "select", label: "Do you know if you have high blood pressure?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, it is high"}, {value: "dont_know", label: "I don't know"}] },
      { id: "chol_known", type: "select", label: "Do you have high cholesterol?", options: [{value: "no", label: "No / Normal"}, {value: "yes_high", label: "Yes, it is high"}, {value: "dont_know", label: "I don't know"}] },
      { id: "fbs_known", type: "select", label: "Is your fasting blood sugar above 120 mg/dl?", options: [{value: "below_120", label: "No"}, {value: "above_120", label: "Yes"}, {value: "dont_know", label: "I don't know"}] },
      { id: "restecg_known", type: "select", label: "Have you ever had an abnormal ECG/EKG?", options: [{value: "normal", label: "No, it was normal"}, {value: "mild_abnormal", label: "Yes, mild abnormality (ST-T)"}, {value: "lv_hypertrophy", label: "Yes, LV Hypertrophy"}, {value: "dont_know", label: "I don't know / Never had one"}] }
    ]
  }
];
