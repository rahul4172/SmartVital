import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import HeartDisease from './pages/HeartDisease';
import Stroke from './pages/Stroke';
import Diabetes from './pages/Diabetes';
import LungCancer from './pages/LungCancer';
import Timeline from './pages/Timeline';
import Comorbidity from './pages/Comorbidity';
import Simulator from './pages/Simulator';
import IoTManager from './pages/IoTManager';

import { Menu, X } from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Nav Toggle */}
        <button 
          className="mobile-nav-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Sidebar isOpen={mobileMenuOpen} closeMenu={() => setMobileMenuOpen(false)} />
        
        <main className="main-content" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>
          <div className="glass-panel animate-fade-in" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/iot" element={<IoTManager />} />
              <Route path="/heart" element={<HeartDisease />} />
              <Route path="/stroke" element={<Stroke />} />
              <Route path="/diabetes" element={<Diabetes />} />
              <Route path="/lung" element={<LungCancer />} />
              <Route path="/comorbidity" element={<Comorbidity />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/timeline" element={<Timeline />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
