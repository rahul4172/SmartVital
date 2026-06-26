# SmartVital Frontend

SmartVital is a cutting-edge clinical intelligence and multi-disease risk prediction platform powered by AI and IoT. This repository contains the React frontend application.

## 🚀 Tech Stack
- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS, Clay/Glassmorphism design
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Networking:** Axios, WebSockets (for Live IoT data)

## 🌟 Key Features
- **Role-Based Dashboards:** Distinct interfaces tailored for Patients, Doctors, and Researchers.
- **Live IoT Monitoring:** Real-time data streaming (Heart Rate, SpO2, Temperature) using WebSockets.
- **AI Explainability:** Visual representations (SHAP/LIME charts) of machine learning predictions.
- **Dynamic Theming:** Seamless Dark/Light mode toggle.
- **Responsive UI:** Fully mobile-responsive interface.

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file:
   ```env
   VITE_API_URL=https://smartvital-backend.onrender.com
   VITE_WS_URL=wss://smartvital-backend.onrender.com/api/iot/ws
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
This frontend is optimized and deployed on **Vercel**.
The build command is `npm run build` with the output directory set to `dist`.
