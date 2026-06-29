export const heartQuestions = [
  {
    tier: 1,
    title: "Basic Demographics & Lifestyle",
    questions: [
      { id: "Age", type: "number", label: "What is your age?", min: 18, max: 120, default: 50 },
      { id: "Heart_Rate", type: "number", label: "Resting Heart Rate (bpm)", min: 40, max: 200, default: 72 },
      { id: "Diet", type: "select", label: "Diet Quality", options: [
        { value: "Healthy", label: "🥗 Healthy (fruits, veg, lean protein)" },
        { value: "Average", label: "🍽️ Average (mixed diet)" },
        { value: "Unhealthy", label: "🍔 Unhealthy (fast food, processed)" }
      ]},
      { id: "Exercise_Hours_Per_Week", type: "number", label: "Exercise Hours Per Week", min: 0, max: 40, default: 2 },
      { id: "Alcohol_Consumption", type: "number", label: "Alcohol Consumption (drinks per week)", min: 0, max: 50, default: 0 }
    ]
  },
  {
    tier: 2,
    title: "Medical History",
    questions: [
      { id: "Diabetes", type: "select", label: "Do you have Diabetes?", options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
      ]},
      { id: "Family_History", type: "select", label: "Family History of Heart Disease?", options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
      ]},
      { id: "Smoking", type: "select", label: "Do you smoke?", options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
      ]}
    ]
  }
];
