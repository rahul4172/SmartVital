import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { api } from '../../api/axios';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ForecastData {
  model: string;
  historical: { day: number; risk: number }[];
  forecast: { days_out: number; projected_risk: number }[];
  slope: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function RiskForecasting() {
  const [modelType, setModelType] = useState<'heart' | 'stroke' | 'diabetes'>('heart');
  const [data, setData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchForecast = async (model: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/patient/forecast?model=${model}`);
      setData(res.data);
    } catch (e) {
      console.error('Failed to load forecast', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(modelType);
  }, [modelType]);

  // Prepare chart data combining historical and forecast
  const chartData = React.useMemo(() => {
    if (!data || !data.historical || data.historical.length === 0) return [];
    
    // Historical points
    const hist = data.historical.map(h => ({
      day: h.day,
      type: 'historical',
      risk: parseFloat((h.risk * 100).toFixed(1)),
      projected: null
    }));

    // Last historical point connects to forecast
    const lastHist = hist[hist.length - 1];
    
    // Forecast points
    const fore = (data.forecast || []).map(f => ({
      day: lastHist.day + f.days_out,
      type: 'forecast',
      risk: null,
      projected: parseFloat((f.projected_risk * 100).toFixed(1))
    }));

    return [...hist, { ...lastHist, projected: lastHist.risk }, ...fore];
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Risk Forecasting Engine</h1>
        <p className="text-[var(--text-secondary)] mt-1">AI-driven trajectory analysis projecting your clinical risk over the next 90 days.</p>
      </div>

      {/* Model Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl max-w-md">
        <button 
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${modelType === 'heart' ? 'bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setModelType('heart')}
        >
          Heart Disease
        </button>
        <button 
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${modelType === 'stroke' ? 'bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setModelType('stroke')}
        >
          Stroke Risk
        </button>
        <button 
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${modelType === 'diabetes' ? 'bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setModelType('diabetes')}
        >
          Diabetes Risk
        </button>
      </div>

      {isLoading || !data ? (
        <ClayCard className="p-8 h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
        </ClayCard>
      ) : data.historical.length < 2 ? (
        <ClayCard className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Not Enough Data</h2>
          <p className="text-[var(--text-secondary)] max-w-md">
            The Risk Forecasting engine requires at least 2 historical predictions for {modelType} disease to calculate a trajectory. Head over to the Predictions dashboard to generate more data points!
          </p>
        </ClayCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <ClayCard className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">90-Day Trajectory</h2>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: 'var(--text-muted)' }} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `Day ${val}`}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fill: 'var(--text-muted)' }} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value: number) => [`${value}%`, 'Risk']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    
                    {/* Current Day Line */}
                    {data.historical.length > 0 && (
                      <ReferenceLine x={data.historical[data.historical.length - 1].day} stroke="var(--primary)" strokeDasharray="3 3" />
                    )}

                    {/* Historical Line */}
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="var(--text-primary)" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'var(--text-primary)' }} 
                      activeDot={{ r: 6 }} 
                      name="Historical"
                    />
                    
                    {/* Forecast Line */}
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      stroke="var(--danger)" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: 'var(--danger)' }} 
                      name="Projected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--text-primary)]"></div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Historical Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--danger)]"></div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">AI Projection (Linear Regression)</span>
                </div>
              </div>
            </ClayCard>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <ClayCard className={`p-8 border-t-4 text-center ${
                data.trend === 'increasing' ? 'border-t-[var(--danger)]' : 
                data.trend === 'decreasing' ? 'border-t-[var(--success)]' : 
                'border-t-[var(--warning)]'
              }`}>
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-6">Trend Analysis</h3>
                
                <div className="flex justify-center mb-4">
                  {data.trend === 'increasing' ? <TrendingUp size={48} className="text-red-500" /> : data.trend === 'decreasing' ? <TrendingDown size={48} className="text-green-500" /> : <Minus size={48} className="text-gray-500" />}
                </div>
                
                <h4 className="text-2xl font-bold text-[var(--text-primary)] capitalize mb-2">
                  {data.trend} Risk
                </h4>
                
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                  Based on your last 10 predictive models, your risk trajectory is currently trending {data.trend}.
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">30-Day Outlook</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {(data.forecast[0].projected_risk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">60-Day Outlook</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {(data.forecast[1].projected_risk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">90-Day Outlook</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {(data.forecast[2].projected_risk * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </ClayCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <ClayCard className="p-6 bg-gradient-to-br from-[var(--primary)] to-blue-800 text-white border-0">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Clinical Insight
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {data.trend === 'increasing' 
                    ? 'Your risk profile is steadily increasing. Immediate lifestyle intervention or medication review is strongly advised to flatten the curve.'
                    : data.trend === 'decreasing'
                    ? 'Excellent progress. Your current regimen and lifestyle habits are successfully lowering your overall risk profile.'
                    : 'Your risk profile has stabilized. Continue monitoring and adhering to your prescribed care plan.'}
                </p>
              </ClayCard>
            </motion.div>
          </div>
          
        </div>
      )}
    </div>
  );
}
