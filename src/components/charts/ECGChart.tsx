import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ECGChartProps {
  data: number[];
  color?: string;
}

export function ECGChart({ data, color = "#ef4444" }: ECGChartProps) {
  // Convert flat array of floats to recharts object array
  const formattedData = data.map((val, index) => ({
    time: index,
    voltage: val
  }));

  return (
    <div className="h-[200px] w-full relative bg-gray-900 rounded-xl overflow-hidden p-2 border border-gray-800">
      {/* Background ECG Grid simulation */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative z-10 h-full w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Line 
                type="monotone" 
                dataKey="voltage" 
                stroke={color} 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={false} // Disable animation for true real-time pop
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
           <div className="h-full flex items-center justify-center text-gray-500 font-bold">
              Searching for signal...
           </div>
        )}
      </div>
    </div>
  );
}
