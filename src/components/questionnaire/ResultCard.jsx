import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield, Activity, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

const ResultCard = ({ result, onUpgrade }) => {
  const { 
    disease, 
    risk_level, 
    probability, 
    confidence, 
    risk_factors, 
    recommendations, 
    upgrade_prompt, 
    disclaimer 
  } = result;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Very High': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const RiskIcon = () => {
    switch (risk_level) {
      case 'Low': return <ShieldCheck className="w-12 h-12 text-green-500" />;
      case 'Moderate': return <Shield className="w-12 h-12 text-yellow-500" />;
      case 'High': return <ShieldAlert className="w-12 h-12 text-orange-500" />;
      case 'Very High': return <AlertTriangle className="w-12 h-12 text-red-500" />;
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
            <h2 className="text-3xl font-bold text-white capitalize">{disease} Risk Profile</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(risk_level)}`}>
                {risk_level} Risk
              </span>
              <span className="text-sm text-gray-400">
                Confidence: {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Probability Gauge */}
        <div className="text-center bg-black/40 p-4 rounded-xl border border-white/5 min-w-[150px]">
          <div className="text-sm text-gray-400 mb-1">Probability Score</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {(probability * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Grid Layout for Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-white">Identified Risk Factors</h3>
          </div>
          <ul className="space-y-3">
            {risk_factors.length > 0 ? (
              risk_factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span className="text-sm leading-relaxed">{factor}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">No major risk factors identified based on answers.</li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-white">Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="text-sm leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {upgrade_prompt && (
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
          onClick={onUpgrade}
        >
          <div>
            <h4 className="text-indigo-400 font-semibold mb-1">Increase Prediction Accuracy</h4>
            <p className="text-sm text-indigo-300/80">{upgrade_prompt}</p>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            Unlock Next Tier
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500">{disclaimer}</p>
      </div>
    </motion.div>
  );
};

export default ResultCard;
