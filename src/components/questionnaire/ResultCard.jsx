import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield, Activity, AlertTriangle, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

const ResultCard = ({ disease, result }) => {
  // Use fallbacks for missing properties
  const { 
    disease: resultDisease,
    risk_level = "Unknown", 
    risk_score = 0, 
    preventive_actions = [], 
    shap_data = [],
    narrative = ""
  } = result || {};

  const displayDisease = resultDisease || disease;

  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'MODERATE': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'VERY HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const RiskIcon = () => {
    switch (risk_level?.toUpperCase()) {
      case 'LOW': return <ShieldCheck className="w-12 h-12 text-green-500" />;
      case 'MODERATE': return <Shield className="w-12 h-12 text-yellow-500" />;
      case 'HIGH': return <ShieldAlert className="w-12 h-12 text-orange-500" />;
      case 'VERY HIGH': return <AlertTriangle className="w-12 h-12 text-red-500" />;
      default: return <Activity className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-4xl mx-auto space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <RiskIcon />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white capitalize">{displayDisease} Risk Profile</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(risk_level)}`}>
                {risk_level.toUpperCase()} Risk
              </span>
            </div>
          </div>
        </div>
        
        {/* Probability Gauge */}
        <div className="text-center bg-black/40 p-4 rounded-xl border border-white/5 min-w-[150px]">
          <div className="text-sm text-gray-400 mb-1">Probability Score</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {(risk_score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* AI Narrative */}
      {narrative && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
            <Activity className="w-5 h-5 text-indigo-400" /> AI Diagnostic Insight
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
            {narrative}
          </p>
        </div>
      )}

      {/* Grid Layout for Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* SHAP Risk Drivers */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-white">Top Risk Drivers (SHAP)</h3>
          </div>
          <ul className="space-y-3">
            {shap_data && shap_data.length > 0 ? (
              shap_data.slice(0, 5).map((feat, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{feat.feature}</span>
                  <span className={clsx(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    feat.direction === 'increases risk' ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
                  )}>
                    {feat.direction}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">Analyzing background features...</li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-white">Preventive Actions</h3>
          </div>
          <ul className="space-y-3">
            {preventive_actions && preventive_actions.length > 0 ? (
              preventive_actions.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="text-sm leading-relaxed">{rec}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">Consult a specialist for detailed actions.</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
