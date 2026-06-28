import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Activity, CheckCircle, Lightbulb, Heart, Brain, Droplets } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

type DiseaseModel = 'heart' | 'stroke' | 'diabetes' | 'lung';

interface Question {
  id: string;
  label: string;
  type: 'number' | 'choice';
  options?: { label: string; value: string | number }[];
  defaultValue?: string | number;
  helpText?: string;
}

const heartQuestions: Question[] = [
  { id: 'age', label: 'What is your age?', type: 'number' },
  { id: 'sex', label: 'What is your biological sex?', type: 'choice', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }] },
  { id: 'cp', label: 'Do you experience chest pain?', type: 'choice', options: [{ label: 'Yes, typical tight/squeezing pain', value: 'TA' }, { label: 'Yes, but atypical/different pain', value: 'ATA' }, { label: 'Yes, but sharp/not heart-related', value: 'NAP' }, { label: 'No chest pain', value: 'ASY' }], helpText: 'Typical angina is a tight, squeezing pain caused by reduced blood flow to the heart.' },
  { id: 'resting_bp', label: 'What is your resting blood pressure (mmHg)?', type: 'number', defaultValue: 120, helpText: 'The pressure of your blood against your artery walls while resting. Normal is generally around 120/80 (enter the top number).' },
  { id: 'cholesterol', label: 'What is your cholesterol level (mg/dl)?', type: 'number', defaultValue: 200, helpText: 'A waxy substance in your blood. High levels can increase heart disease risk. Normal is usually under 200 mg/dL.' },
  { id: 'fbs', label: 'Is your blood sugar high before eating (Fasting > 120 mg/dl)?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }], helpText: 'Measures your blood sugar after an overnight fast. >120 mg/dl can indicate prediabetes or diabetes.' },
  { id: 'restecg', label: 'Resting ECG (Heart Rhythm Test) Results?', type: 'choice', options: [{ label: 'Normal', value: 'Normal' }, { label: 'Minor Abnormality (ST-T Wave)', value: 'ST' }, { label: 'Enlarged Heart Muscle (LVH)', value: 'LVH' }] },
  { id: 'max_hr', label: 'What is the highest heart rate you can reach during exercise?', type: 'number', defaultValue: 150, helpText: 'The highest your heart rate reached during intense exercise or a stress test.' },
  { id: 'exang', label: 'Do you feel chest pain or discomfort when you exercise?', type: 'choice', options: [{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }], helpText: 'Chest pain or discomfort that occurs specifically during physical activity.' },
  { id: 'oldpeak', label: 'Heart Stress During Exercise (User-friendly replacement for Oldpeak)', type: 'choice', options: [{ label: '0 - No symptoms during exercise', value: 0.0 }, { label: '1 - Mild breathlessness or tiredness', value: 0.8 }, { label: '2 - Chest discomfort or dizziness', value: 1.8 }, { label: '3 - Chest pain or severe breathlessness', value: 3.0 }], defaultValue: 0.0, helpText: 'Rate your level of discomfort or symptoms experienced specifically during physical activity.' },
  { id: 'slope', label: 'How severe are your symptoms during physical activity?', type: 'choice', options: [{ label: '✅ No or Mild Symptoms', value: 'Up' }, { label: '⚠️ Moderate Symptoms', value: 'Flat' }, { label: '🚨 Severe Symptoms', value: 'Down' }], helpText: 'This helps estimate your exercise recovery pattern (ST slope), an important indicator of heart stress.' }
];

const strokeQuestions: Question[] = [
  { id: 'age', label: 'What is your age?', type: 'number' },
  { id: 'gender', label: 'What is your gender?', type: 'choice', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] },
  { id: 'hypertension', label: 'Do you have high blood pressure?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }], helpText: 'A condition where the force of the blood against the artery walls is consistently too high (usually >130/80).' },
  { id: 'heart_disease', label: 'Do you have a history of heart disease?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'avg_glucose_level', label: 'What is your average blood sugar (glucose) level?', type: 'number', defaultValue: 100, helpText: 'The amount of sugar in your blood. Levels between 70-100 mg/dL are considered normal for fasting adults.' },
  { id: 'bmi', label: 'What is your Body Mass Index (BMI)?', type: 'number', defaultValue: 25, helpText: 'A measure of body fat based on height and weight. Normal range is typically 18.5 to 24.9.' },
  { id: 'smoking_status', label: 'What is your smoking status?', type: 'choice', options: [{ label: 'Never Smoked', value: 'never smoked' }, { label: 'Formerly Smoked', value: 'formerly smoked' }, { label: 'Smokes', value: 'smokes' }, { label: 'Unknown', value: 'Unknown' }] }
];

const diabetesQuestions: Question[] = [
  { id: 'gender', label: 'What is your gender?', type: 'choice', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] },
  { id: 'age', label: 'What is your age?', type: 'number' },
  { id: 'hypertension', label: 'Do you have hypertension (high blood pressure)?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'heart_disease', label: 'Do you have a history of heart disease?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'smoking_history', label: 'What is your smoking history?', type: 'choice', options: [{ label: 'Never', value: 'never' }, { label: 'Current', value: 'current' }, { label: 'Former', value: 'former' }, { label: 'No Info', value: 'No Info' }] },
  { id: 'bmi', label: 'What is your BMI?', type: 'number', defaultValue: 25 },
  { id: 'HbA1c_level', label: 'What is your average blood sugar over 3 months (HbA1c)?', type: 'number', defaultValue: 5.5, helpText: 'Average blood sugar levels over the past 3 months. Normal is below 5.7%.' },
  { id: 'blood_glucose_level', label: 'What is your blood glucose level?', type: 'number', defaultValue: 100, helpText: 'Current blood sugar level.' }
];

const lungQuestions: Question[] = [
  { id: 'age', label: 'What is your age?', type: 'number' },
  { id: 'smoker', label: 'Are you a smoker?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'yellow_fingers', label: 'Do you have yellow fingers?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }], helpText: 'Can be a physical sign of long-term heavy smoking or certain chronic illnesses.' },
  { id: 'anxiety', label: 'Do you suffer from anxiety?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'peer_pressure', label: 'Do you experience peer pressure?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'chronic_disease', label: 'Do you have a chronic disease?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'fatigue', label: 'Do you experience frequent fatigue?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'allergy', label: 'Do you have allergies?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'wheezing', label: 'Do you experience wheezing?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }], helpText: 'A high-pitched whistling sound made while breathing, often associated with narrowed airways.' },
  { id: 'alcohol', label: 'Do you consume alcohol frequently?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'coughing', label: 'Do you experience persistent coughing?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'shortness_of_breath', label: 'Do you experience shortness of breath?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'swallowing_difficulty', label: 'Do you have difficulty swallowing?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'chest_pain', label: 'Do you experience chest pain?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] }
];

const questionMaps: Record<DiseaseModel, Question[]> = {
  heart: heartQuestions,
  stroke: strokeQuestions,
  diabetes: diabetesQuestions,
  lung: lungQuestions
};

export function Predictions() {
  const { model } = useParams<{ model?: string }>();
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<DiseaseModel>((model as DiseaseModel) || 'heart');
  const [profile, setProfile] = useState<any>(null);
  
  // Game state
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [numInputValue, setNumInputValue] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // If URL changes, sync activeModel
  useEffect(() => {
    if (model && ['heart', 'stroke', 'diabetes', 'lung'].includes(model)) {
      setActiveModel(model as DiseaseModel);
    }
  }, [model]);

  const handleModelChange = (newModel: DiseaseModel) => {
    setActiveModel(newModel);
    navigate(`/patient/predictions/${newModel}`);
  };

  const questions = questionMaps[activeModel];
  const currentQuestion = questions[currentStep];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/patient/profile');
        setProfile(res.data);
      } catch (e) {
        console.error('Failed to load profile for predictions', e);
      }
    };
    loadProfile();
  }, []);

  // When model changes, reset everything
  useEffect(() => {
    setHasStarted(false);
    setCurrentStep(0);
    setAnswers({});
    setPredictionResult(null);
    setNumInputValue('');
  }, [activeModel]);

  // Pre-fill logic when landing on a new question
  useEffect(() => {
    if (!currentQuestion || !profile) return;
    
    // Check if we already have an answer in state
    if (answers[currentQuestion.id] !== undefined) {
      if (currentQuestion.type === 'number') {
        setNumInputValue(String(answers[currentQuestion.id]));
      }
      return;
    }

    // Otherwise, try to infer from profile
    let prefill: any = null;
    const qid = currentQuestion.id;

    if (qid === 'age') prefill = profile.age;
    else if (qid === 'bmi') prefill = profile.bmi;
    else if (qid === 'gender') prefill = profile.gender;
    else if (qid === 'sex') prefill = profile.gender === 'Female' ? 'F' : 'M';
    else if (qid === 'smoking_status') prefill = profile.smoking_status;
    else if (qid === 'smoking_history') prefill = profile.smoking_status || 'never';
    else if (qid === 'smoker') prefill = profile.smoking_status !== 'never' ? 1 : 0;
    else if (qid === 'heart_disease') prefill = profile.family_history?.heart_disease === 'yes' ? 1 : 0;
    else if (qid === 'hypertension') prefill = (profile.vitals?.blood_pressure_sys > 140) ? 1 : 0;
    else if (qid === 'avg_glucose_level' || qid === 'blood_glucose_level') prefill = profile.vitals?.blood_sugar;
    else if (qid === 'resting_bp') prefill = profile.vitals?.blood_pressure_sys;
    else if (qid === 'max_hr') prefill = profile.vitals?.heart_rate ? profile.vitals.heart_rate + 20 : undefined;
    
    if (prefill === undefined || prefill === null) {
      prefill = currentQuestion.defaultValue || '';
    }

    if (currentQuestion.type === 'number') {
      setNumInputValue(String(prefill));
    }
  }, [currentStep, currentQuestion, profile, answers]);

  const handleNext = async (val?: any) => {
    let answerToSave = val;
    if (currentQuestion.type === 'number') {
      if (!numInputValue) {
        toast.error('Please enter a value');
        return;
      }
      answerToSave = Number(numInputValue);
    }

    const newAnswers = { ...answers, [currentQuestion.id]: answerToSave };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finished
      submitPrediction(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitPrediction = async (finalAnswers: Record<string, any>) => {
    setIsLoading(true);
    setPredictionResult(null);

    let payload: any = {};

    if (activeModel === 'heart') {
      payload = {
        Age: finalAnswers.age,
        Sex: String(finalAnswers.sex),
        ChestPainType: String(finalAnswers.cp),
        RestingBP: Number(finalAnswers.resting_bp),
        Cholesterol: Number(finalAnswers.cholesterol),
        FastingBS: Number(finalAnswers.fbs),
        RestingECG: String(finalAnswers.restecg),
        MaxHR: Number(finalAnswers.max_hr),
        ExerciseAngina: String(finalAnswers.exang),
        Oldpeak: Number(finalAnswers.oldpeak),
        ST_Slope: String(finalAnswers.slope)
      };
    } else if (activeModel === 'stroke') {
      payload = {
        gender: String(finalAnswers.gender),
        age: finalAnswers.age,
        hypertension: finalAnswers.hypertension,
        heart_disease: finalAnswers.heart_disease,
        ever_married: "Yes",
        work_type: "Private",
        residence_type: "Urban",
        avg_glucose_level: Number(finalAnswers.avg_glucose_level),
        bmi: Number(finalAnswers.bmi),
        smoking_status: String(finalAnswers.smoking_status)
      };
    } else if (activeModel === 'diabetes') {
      payload = {
        gender: String(finalAnswers.gender),
        age: finalAnswers.age,
        hypertension: Number(finalAnswers.hypertension),
        heart_disease: Number(finalAnswers.heart_disease),
        smoking_history: String(finalAnswers.smoking_history),
        bmi: Number(finalAnswers.bmi),
        HbA1c_level: Number(finalAnswers.HbA1c_level),
        blood_glucose_level: Number(finalAnswers.blood_glucose_level)
      };
    } else if (activeModel === 'lung') {
      payload = {
        GENDER: profile?.gender === 'Female' ? "F" : "M",
        AGE: finalAnswers.age,
        SMOKING: finalAnswers.smoker,
        YELLOW_FINGERS: finalAnswers.yellow_fingers,
        ANXIETY: finalAnswers.anxiety,
        PEER_PRESSURE: finalAnswers.peer_pressure,
        CHRONIC_DISEASE: finalAnswers.chronic_disease,
        FATIGUE: finalAnswers.fatigue,
        ALLERGY: finalAnswers.allergy,
        WHEEZING: finalAnswers.wheezing,
        ALCOHOL_CONSUMING: finalAnswers.alcohol,
        COUGHING: finalAnswers.coughing,
        SHORTNESS_OF_BREATH: finalAnswers.shortness_of_breath,
        SWALLOWING_DIFFICULTY: finalAnswers.swallowing_difficulty,
        CHEST_PAIN: finalAnswers.chest_pain
      };
    }

    try {
      const res = await api.post(`/predict/${activeModel}`, payload);
      setPredictionResult(res.data);
      toast.success('Analysis complete');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate prediction');
      setHasStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const models = [
    { id: 'heart', name: 'Heart Disease', icon: <Heart /> },
    { id: 'stroke', name: 'Stroke Risk', icon: <Brain /> },
    { id: 'diabetes', name: 'Diabetes', icon: <Droplets /> },
    { id: 'lung', name: 'Lung Cancer', icon: <Activity /> }
  ];

  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Risk Predictor</h1>
        <p className="text-[var(--text-secondary)] mt-1">Interactive clinical risk assessment powered by ML.</p>
      </div>

      {!hasStarted && !predictionResult && !model && (
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => handleModelChange(m.id as DiseaseModel)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl min-w-[200px] transition-all duration-300 font-bold ${
                activeModel === m.id 
                  ? 'bg-[var(--primary)] text-white shadow-[0_8px_20px_-6px_var(--primary)] -translate-y-1' 
                  : 'bg-white text-[var(--text-secondary)] hover:bg-gray-50 border border-gray-100 shadow-sm'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              {m.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!hasStarted && !predictionResult && !isLoading && (
          <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ClayCard className="p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[var(--primary-soft)] text-[var(--primary)] rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
                {models.find(m => m.id === activeModel)?.icon}
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                {models.find(m => m.id === activeModel)?.name} Assessment
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md">
                You will be asked {questions.length} simple questions to evaluate your clinical risk. 
                Some answers have been pre-filled from your health profile.
              </p>
              <ClayButton onClick={() => setHasStarted(true)} className="px-12 py-4 text-lg">
                Start Assessment <ArrowRight className="inline ml-2" size={20} />
              </ClayButton>
            </ClayCard>
          </motion.div>
        )}

        {hasStarted && !isLoading && !predictionResult && (
          <motion.div key="game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
            <ClayCard className="overflow-hidden">
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 h-2">
                <motion.div 
                  className="h-full bg-[var(--primary)]" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <button 
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`p-2 rounded-full transition-colors ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[var(--text-secondary)] hover:bg-gray-100'}`}
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <span className="text-sm font-bold text-[var(--text-muted)] tracking-widest uppercase">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[200px] flex flex-col justify-center items-center text-center"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                      {currentQuestion.label}
                    </h3>

                    {currentQuestion.helpText && (
                      <div className="mb-8 max-w-lg mx-auto bg-[var(--primary-soft)] text-[var(--primary)] text-sm rounded-xl p-4 flex items-start gap-3 text-left">
                        <Lightbulb size={20} className="flex-shrink-0 mt-0.5" />
                        <p>{currentQuestion.helpText}</p>
                      </div>
                    )}
                    
                    {!currentQuestion.helpText && <div className="mb-8" />}

                    {currentQuestion.type === 'number' ? (
                      <div className="w-full max-w-sm space-y-6">
                        <input 
                          type="number" 
                          step="any"
                          value={numInputValue}
                          onChange={(e) => setNumInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          className="w-full h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-[var(--primary-soft)] focus:border-[var(--primary)] rounded-2xl outline-none transition-colors"
                          autoFocus
                        />
                        <ClayButton onClick={() => handleNext()} className="w-full h-14 text-lg">
                          Continue
                        </ClayButton>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                        {currentQuestion.options?.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNext(opt.value)}
                            className="h-20 px-6 rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-[var(--primary-soft)] dark:hover:bg-slate-700 hover:border-[var(--primary)] text-lg font-bold text-[var(--text-primary)] transition-all flex items-center justify-center hover:-translate-y-1 hover:shadow-lg"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ClayCard>
          </motion.div>
        )}

        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClayCard className="p-20 flex flex-col items-center justify-center text-center min-h-[400px]">
              <Activity className="w-16 h-16 text-[var(--primary)] animate-pulse mb-6" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analyzing Clinical Data...</h3>
              <p className="text-[var(--text-secondary)]">Running data through the {models.find(m => m.id === activeModel)?.name} ML model.</p>
            </ClayCard>
          </motion.div>
        )}

        {predictionResult && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <ClayCard className="p-8 md:p-12 text-center bg-gradient-to-b from-white to-gray-50 border-t-4 border-t-[var(--primary)]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[var(--success-soft)] text-[var(--success)] rounded-full flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
              </div>
              
              <h3 className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-xs mb-8">
                {models.find(m => m.id === activeModel)?.name} Analysis Complete
              </h3>
              
              <div className="mb-6 flex justify-center">
                <RiskBadge risk={predictionResult.risk_level.toLowerCase() as 'high' | 'medium' | 'low'} size="lg" />
              </div>
              
              <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
                {(predictionResult.risk_score * 100).toFixed(1)}<span className="text-3xl text-[var(--text-muted)]">%</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-8">Probability of condition present</p>
              
              <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm text-left border border-gray-100 mb-8">
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-[var(--info)]" />
                  Clinical Recommendation
                </h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {predictionResult.risk_level === 'High' 
                    ? 'The model has identified significant risk factors. Please consult with a healthcare professional immediately.'
                    : predictionResult.risk_level === 'Medium'
                      ? 'Some risk factors are elevated. We recommend scheduling a routine checkup to discuss these results.'
                      : 'Your risk profile appears normal. Continue maintaining a healthy lifestyle.'}
                </p>
              </div>
              
              <ClayButton variant="secondary" onClick={() => { setPredictionResult(null); setHasStarted(false); setCurrentStep(0); }}>
                Run Another Assessment
              </ClayButton>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
