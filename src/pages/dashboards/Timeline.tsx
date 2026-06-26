import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { api } from '../../api/axios';
import { Watch, Heart, User, Droplets, PartyPopper } from 'lucide-react';

// Mock data to represent the chronological timeline if backend timeline endpoint isn't ready
const MOCK_TIMELINE = [
  {
    id: 1,
    date: 'Today, 09:41 AM',
    type: 'iot_alert',
    title: 'Elevated Heart Rate Detected',
    description: 'SmartVital Pro detected a resting heart rate of 115 bpm for over 10 minutes.',
    severity: 'high',
    icon: <Watch size={20} />
  },
  {
    id: 2,
    date: 'Yesterday, 14:30 PM',
    type: 'prediction',
    title: 'Cardiovascular Risk Assessment',
    description: 'Ran a heart disease prediction model based on updated cholesterol levels.',
    risk_level: 'medium',
    probability: 42.1,
    icon: <Heart size={20} />
  },
  {
    id: 3,
    date: 'Oct 12, 2023',
    type: 'profile_update',
    title: 'Clinical Baseline Updated',
    description: 'Dr. Smith updated hypertension status and added a new medication to the chart.',
    icon: <User size={20} />
  },
  {
    id: 4,
    date: 'Sep 01, 2023',
    type: 'prediction',
    title: 'Diabetes Risk Assessment',
    description: 'Quarterly checkup assessment.',
    risk_level: 'low',
    probability: 12.4,
    icon: <Droplets size={20} />
  },
  {
    id: 5,
    date: 'Aug 15, 2023',
    type: 'system',
    title: 'SmartVital Account Created',
    description: 'Initial onboarding completed and baseline metrics established.',
    icon: <PartyPopper size={20} />
  }
];

export function Timeline() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get('/patient/timeline');
        setEvents(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Health Timeline</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          A chronological log of your assessments, alerts, and clinical updates.
        </p>
      </div>

      <ClayCard className="p-8">
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-12 py-4">
            {events.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline dot/icon */}
                <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border-4 border-white ${
                  event.type === 'iot_alert' ? 'bg-[var(--danger-soft)] text-[var(--danger)]' :
                  event.type === 'prediction' ? 'bg-[var(--primary-soft)] text-[var(--primary)]' :
                  event.type === 'profile_update' ? 'bg-[var(--info-soft)] text-[var(--info)]' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {event.icon}
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-[var(--primary)] transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{event.title}</h3>
                    <span className="text-sm font-bold text-[var(--text-muted)] bg-white px-3 py-1 rounded-full shadow-sm">{event.date}</span>
                  </div>
                  
                  <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  {event.type === 'prediction' && event.risk_level && (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 w-fit">
                      <RiskBadge risk={event.risk_level} size="sm" />
                      <div className="text-sm">
                        <span className="font-bold text-[var(--text-primary)]">{event.probability}%</span>
                        <span className="text-[var(--text-muted)] ml-1">Probability</span>
                      </div>
                    </div>
                  )}

                  {event.type === 'iot_alert' && (
                    <button className="text-sm font-bold text-[var(--primary)] group-hover:underline">
                      View Telemetry Log →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
      </ClayCard>
    </div>
  );
}
