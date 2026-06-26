import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCcw, Activity } from 'lucide-react';
import clsx from 'clsx';

export default function ResultCard({ disease, result, onReset }) {
  if (!result) return null;

  const { risk_score, insight, shap_data, lime_data, narrative } = result;
  
  const riskPercentage = (risk_score * 100).toFixed(1);
  const isHighRisk = risk_score > 0.6;
  const isModerateRisk = risk_score > 0.3 && risk_score <= 0.6;
  
  const getRiskColor = () => {
    if (isHighRisk) return 'text-danger bg-danger/10 border-danger/20';
    if (isModerateRisk) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-success bg-success/10 border-success/20';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Card */}
      <Card className="border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg overflow-hidden">
        <div className={clsx("p-6 text-center border-b", getRiskColor())}>
          <h2 className="text-xl font-bold mb-2">{disease} Risk Assessment</h2>
          <div className="text-5xl font-black tracking-tight mb-2">
            {riskPercentage}%
          </div>
          <p className="font-medium">
            {isHighRisk ? 'High Risk Detected' : isModerateRisk ? 'Moderate Risk Detected' : 'Low Risk Detected'}
          </p>
        </div>
        <CardContent className="p-8">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
              <Activity className="w-5 h-5 text-medical-blue" /> AI Diagnostic Insight
            </h3>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {narrative || insight}
            </p>
          </div>

          {/* Explainability Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* SHAP Data */}
            {shap_data && shap_data.length > 0 && (
              <div className="bg-slate-50 dark:bg-dark-bg p-6 rounded-xl border border-slate-100 dark:border-dark-border">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Top Risk Drivers (SHAP)</h4>
                <div className="space-y-4">
                  {shap_data.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feat.feature}</span>
                      <span className={clsx(
                        "text-xs px-2.5 py-1 rounded-full font-medium",
                        feat.direction === 'increases risk' ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
                      )}>
                        {feat.direction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIME Data */}
            {lime_data && lime_data.length > 0 && (
              <div className="bg-slate-50 dark:bg-dark-bg p-6 rounded-xl border border-slate-100 dark:border-dark-border">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Local Explanations (LIME)</h4>
                <div className="space-y-4">
                  {lime_data.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-4">{feat.plain_condition || feat.condition}</span>
                      <span className={clsx(
                        "text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap",
                        feat.direction === 'risk factor' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      )}>
                        {feat.direction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
              <RefreshCcw className="w-4 h-4 mr-2" /> Start New Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
