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
  { id: 'Age', label: 'What is your age?', type: 'number' },
  { id: 'Heart_Rate', label: 'Resting heart rate (bpm)? (Average is 72)', type: 'number', defaultValue: 72 },
  { id: 'Diabetes', label: 'Do you have diabetes?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'Family_History', label: 'Family history of heart disease?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'Smoking', label: 'Do you smoke?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'Alcohol_Consumption', label: 'Alcohol Consumption (drinks/week)', type: 'number', defaultValue: 0 },
  { id: 'Exercise_Hours_Per_Week', label: 'Exercise Hours Per Week', type: 'number', defaultValue: 2 },
  { id: 'Diet', label: 'Diet Quality', type: 'choice', options: [{ label: 'Healthy (Veggies, balanced)', value: 'Healthy' }, { label: 'Average', value: 'Average' }, { label: 'Unhealthy (Fast food)', value: 'Unhealthy' }] }
];

const strokeQuestions: Question[] = [
  { id: 'age', label: 'What is your age?', type: 'number' },
  { id: 'gender', label: 'What is your gender?', type: 'choice', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] },
  { id: 'hypertension', label: 'Do you have high blood pressure?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'heart_disease', label: 'Do you have a history of heart disease?', type: 'choice', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
  { id: 'ever_married', label: 'Have you ever been married?', type: 'choice', options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }] },
  { id: 'work_type', label: 'Work Type', type: 'choice', options: [{ label: 'Private Sector', value: 'Private' }, { label: 'Self-employed', value: 'Self-employed' }, { label: 'Government Job', value: 'Govt_job' }, { label: 'Never Worked/Student', value: 'Never_worked' }] },
  { id: 'Residence_type', label: 'Residence Type', type: 'choice', options: [{ label: 'Urban (City)', value: 'Urban' }, { label: 'Rural (Country)', value: 'Rural' }] },
  { id: 'avg_glucose_level', label: 'Average blood sugar level? (Leave at 100 if unknown)', type: 'number', defaultValue: 100 },
  { id: 'bmi', label: 'What is your BMI? (Leave at 25 if unknown)', type: 'number', defaultValue: 25 },
  { id: 'smoking_status', label: 'Smoking Status', type: 'choice', options: [{ label: 'Never Smoked', value: 'never smoked' }, { label: 'Formerly Smoked', value: 'formerly smoked' }, { label: 'Smokes Currently', value: 'smokes' }] }
];

const diabetesQuestions: Question[] = [
  { id: 'Age', label: 'What is your age?', type: 'number' },
  { id: 'Pregnancies', label: 'Number of pregnancies (Enter 0 if male/none)', type: 'number', defaultValue: 0 },
  { id: 'Glucose', label: 'Average blood sugar level? (Leave at 100 if unknown)', type: 'number', defaultValue: 100 },
  { id: 'BloodPressure', label: 'Resting blood pressure? (Leave at 80 if unknown)', type: 'number', defaultValue: 80 },
  { id: 'body_type', label: 'How would you describe your body type?', type: 'choice', options: [{label: 'Lean / Athletic', value: 'lean'}, {label: 'Average', value: 'average'}, {label: 'Overweight', value: 'overweight'}] },
  { id: 'family_history', label: 'Do you have a family history of diabetes?', type: 'choice', options: [{label: 'Strong family history', value: 'strong'}, {label: 'Some family history', value: 'some'}, {label: 'None', value: 'none'}] }
];

const lungQuestions: Question[] = [
  { id: 'AGE', label: 'What is your age?', type: 'number' },
  { id: 'GENDER', label: 'Gender', type: 'choice', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }] },
  { id: 'SMOKING', label: 'Do you smoke?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'YELLOW_FINGERS', label: 'Yellow Fingers?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'ANXIETY', label: 'Anxiety?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'PEER_PRESSURE', label: 'Peer Pressure?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'CHRONIC_DISEASE', label: 'Chronic Disease?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'FATIGUE', label: 'Fatigue?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'ALLERGY', label: 'Allergy?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'WHEEZING', label: 'Wheezing?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'ALCOHOL_CONSUMING', label: 'Consume Alcohol?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'COUGHING', label: 'Coughing?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'SHORTNESS_OF_BREATH', label: 'Shortness of Breath?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'SWALLOWING_DIFFICULTY', label: 'Swallowing Difficulty?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] },
  { id: 'CHEST_PAIN', label: 'Chest Pain?', type: 'choice', options: [{ label: 'Yes', value: 2 }, { label: 'No', value: 1 }] }
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
        Age: finalAnswers.Age,
        Heart_Rate: finalAnswers.Heart_Rate,
        Diabetes: finalAnswers.Diabetes,
        Family_History: finalAnswers.Family_History,
        Smoking: finalAnswers.Smoking,
        Alcohol_Consumption: finalAnswers.Alcohol_Consumption,
        Exercise_Hours_Per_Week: finalAnswers.Exercise_Hours_Per_Week,
        Diet: String(finalAnswers.Diet)
      };
    } else if (activeModel === 'stroke') {
      payload = {
        gender: String(finalAnswers.gender),
        age: finalAnswers.age,
        hypertension: finalAnswers.hypertension,
        heart_disease: finalAnswers.heart_disease,
        ever_married: String(finalAnswers.ever_married),
        work_type: String(finalAnswers.work_type),
        Residence_type: String(finalAnswers.Residence_type),
        avg_glucose_level: Number(finalAnswers.avg_glucose_level),
        bmi: Number(finalAnswers.bmi),
        smoking_status: String(finalAnswers.smoking_status)
      };
    } else if (activeModel === 'diabetes') {
      let bmi = 25;
      let skinThickness = 20;
      let insulin = 80;
      
      if (finalAnswers.body_type === 'lean') {
        bmi = 20; skinThickness = 15; insulin = 60;
      } else if (finalAnswers.body_type === 'overweight') {
        bmi = 30; skinThickness = 30; insulin = 120;
      }

      let dpf = 0.3;
      if (finalAnswers.family_history === 'strong') dpf = 0.8;
      else if (finalAnswers.family_history === 'some') dpf = 0.5;

      payload = {
        Pregnancies: finalAnswers.Pregnancies,
        Glucose: finalAnswers.Glucose,
        BloodPressure: finalAnswers.BloodPressure,
        SkinThickness: skinThickness,
        Insulin: insulin,
        BMI: bmi,
        DiabetesPedigreeFunction: dpf,
        Age: finalAnswers.Age
      };
    } else if (activeModel === 'lung') {
      payload = {
        GENDER: String(finalAnswers.GENDER),
        AGE: finalAnswers.AGE,
        SMOKING: finalAnswers.SMOKING,
        YELLOW_FINGERS: finalAnswers.YELLOW_FINGERS,
        ANXIETY: finalAnswers.ANXIETY,
        PEER_PRESSURE: finalAnswers.PEER_PRESSURE,
        CHRONIC_DISEASE: finalAnswers.CHRONIC_DISEASE,
        FATIGUE: finalAnswers.FATIGUE,
        ALLERGY: finalAnswers.ALLERGY,
        WHEEZING: finalAnswers.WHEEZING,
        ALCOHOL_CONSUMING: finalAnswers.ALCOHOL_CONSUMING,
        COUGHING: finalAnswers.COUGHING,
        SHORTNESS_OF_BREATH: finalAnswers.SHORTNESS_OF_BREATH,
        SWALLOWING_DIFFICULTY: finalAnswers.SWALLOWING_DIFFICULTY,
        CHEST_PAIN: finalAnswers.CHEST_PAIN
      };
    }

    try {
      const res = await api.post(`/predict/${activeModel}`, payload);
      setPredictionResult(res.data);
      toast.success('Analysis complete');
    } catch (error: any) {
      let errMsg = 'Failed to generate prediction';
      if (error.response?.data?.detail) {
        errMsg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((d: any) => `${d.loc?.[d.loc.length-1] || 'Field'}: ${d.msg}`).join(', ')
          : error.response.data.detail;
      }
      toast.error(errMsg);
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
                <RiskBadge risk={(predictionResult?.risk_level || 'low').toLowerCase() as 'high' | 'medium' | 'low'} size="lg" />
              </div>
              
              <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
                {((predictionResult?.risk_score || 0) * 100).toFixed(1)}<span className="text-3xl text-[var(--text-muted)]">%</span>
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
