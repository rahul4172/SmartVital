import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RefreshCw, Zap, Cpu, AlertCircle, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function IoTConnectionPanel({ disease, onConnectionComplete }) {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [scanning, setScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'connecting', 'connected', 'error'
  const [modeInfo, setModeInfo] = useState(null);
  const [liveReadings, setLiveReadings] = useState({});

  const scanPorts = async () => {
    setScanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/iot/scan`);
      const data = await res.json();
      setPorts(data.ports || []);
      if (data.ports && data.ports.length > 0) {
        setSelectedPort(data.ports[0].id);
      }
    } catch (e) {
      console.error('Failed to scan ports:', e);
    }
    setScanning(false);
  };

  useEffect(() => {
    scanPorts();
  }, []);

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/iot/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port_id: selectedPort })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setConnectionStatus('connected');
        const modeRes = await fetch(`${API_BASE_URL}/api/iot/mode/${disease.replace(' ', '%20')}`);
        const modeData = await modeRes.json();
        setModeInfo(modeData);
        
        // Start WebSocket for live reading preview
        const wsUrl = API_BASE_URL.replace('http', 'ws');
        const ws = new WebSocket(`${wsUrl}/stream`);
        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'live_data' && payload.state) {
              setLiveReadings(payload.state);
            }
          } catch (err) {}
        };
      } else {
        setConnectionStatus('error');
      }
    } catch (e) {
      console.error(e);
      setConnectionStatus('error');
    }
  };

  const handleStartMonitoring = () => {
    if (modeInfo && onConnectionComplete) {
      onConnectionComplete(modeInfo);
    }
  };

  return (
    <Card className="border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-md">
      <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-medical-blue" /> SmartVital Direct Connect
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Target Model: <span className="font-semibold">{disease}</span>
          </p>
        </div>
      </div>

      <CardContent className="p-6">
        {!modeInfo ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-900 dark:text-white">Available Local Ports</h4>
              <Button variant="outline" size="sm" onClick={scanPorts} disabled={scanning}>
                <RefreshCw className={clsx("w-4 h-4 mr-2", scanning && "animate-spin")} />
                Scan
              </Button>
            </div>
            
            <div className="space-y-3">
              {ports.length === 0 && (
                <div className="p-4 text-center border border-dashed rounded-lg text-slate-500 text-sm">
                  No compatible hardware found. Ensure your Arduino/ESP32 is plugged in via USB or paired over BLE.
                </div>
              )}
              {ports.map((port) => (
                <div 
                  key={port.id} 
                  onClick={() => setSelectedPort(port.id)}
                  className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedPort === port.id 
                      ? "border-medical-blue bg-medical-blue/5" 
                      : "border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{port.id}</div>
                  <div className="text-sm text-slate-500">{port.name}</div>
                </div>
              ))}
            </div>

            <Button 
              variant="primary" 
              className="w-full" 
              onClick={handleConnect}
              disabled={!selectedPort || connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? 'Establishing Handshake...' : 'Connect Hardware Stream'}
            </Button>
            
            {connectionStatus === 'error' && (
              <p className="text-danger text-sm flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" /> Connection refused. Check port permissions.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border bg-success/5 border-success/20">
              <div className="flex items-center gap-2 text-success font-semibold mb-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                Stream Established on {selectedPort}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Sensors detected: <span className="font-medium">{modeInfo.connected_devices.join(', ')}</span>
              </div>
            </div>

            {modeInfo.missing_sensors.length > 0 && (
              <div className="p-4 rounded-xl border bg-warning/5 border-warning/20">
                <div className="flex items-center gap-2 text-warning font-semibold mb-1">
                  <AlertCircle className="w-4 h-4" /> Missing Sensors
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {modeInfo.missing_sensors.join(', ')}. <br/>Will use manual clinical fallback for these inputs.
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-dark-bg p-5 rounded-xl border border-slate-100 dark:border-dark-border">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-dark-border">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning" /> Live Sensor Preview
                </h4>
                <Badge variant={modeInfo.mode === 'full_realtime' ? 'success' : 'warning'}>
                  {modeInfo.mode === 'full_realtime' ? 'Full Auto' : 'Hybrid Mode'}
                </Badge>
              </div>

              {Object.keys(liveReadings).length === 0 ? (
                <div className="text-sm text-slate-500 italic text-center py-4">Awaiting data packets...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(liveReadings).map(([key, val]) => (
                    <div key={key} className="bg-white dark:bg-dark-card p-3 rounded-lg border border-slate-100 dark:border-dark-border shadow-sm">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{key.replace('_', ' ')}</div>
                      <div className="text-xl font-bold font-mono text-medical-blue">
                        {typeof val === 'number' ? val.toFixed(1) : val}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button variant="primary" className="w-full gap-2 text-lg h-12" onClick={handleStartMonitoring}>
              <PlayCircle className="w-5 h-5" /> Start Live Monitoring
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
