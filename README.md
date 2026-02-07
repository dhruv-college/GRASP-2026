# GRASP 2026

# Param EMS 
> **AI-Powered Energy Management System for Hybrid Renewable Energy Zones (REZ)**

![Status](https://img.shields.io/badge/Status-Prototype-emerald)
![Tech](https://img.shields.io/badge/AI-Google_Gemini-blue)
![Stack](https://img.shields.io/badge/Frontend-React_18-cyan)

## Inspiration
India aims for **500GW of non-fossil fuel capacity by 2030**. To achieve this, we are moving towards massive Hybrid Parks (Solar + Wind + Storage). 
However, managing a **500MW Solar + 1GWh Battery (BESS) + Green Hydrogen** plant is incredibly complex due to:
1. **Grid Instability:** Intermittent solar power destabilizes the grid.
2. **Revenue Loss:** Failing to discharge batteries during peak price hours on the exchange (IEX).
3. **Asset Safety:** Risk of thermal runaway in massive Lithium-ion battery banks.

## What is Param?
**Param** (Sanskrit for *Supreme/Absolute*) is an intelligent AI Controller acting as the brain of a hybrid renewable energy park in the Gujarat/Rajasthan REZ.

It uses **AI** to analyze real-time SCADA data, market prices, and weather forecasts to make split-second decisions on whether to:
- Store energy in batteries.
- Sell power to the grid (Arbitrage).
- Divert power to produce Green Hydrogen.

## Key Features

### 1. AI Co-Pilot (Gemini Powered)
- **Live Optimization:** Natural language insights on grid conditions.
- **Context Aware:** Understands Indian market dynamics (DAM, RTM, DSM regulations).
- **Glassmorphism UI:** An overlay assistant that explains *why* specific dispatch decisions were made.

### 2. Real-Time Operations Dashboard
- Visualizes power flow between Solar, Grid, BESS, and Electrolyzers.
- Monitors Grid Frequency and Compliance (SECI Mandates).
- Interactive Asset Tooltips showing granular telemetry.

### 3. Revenue Optimizer
- **Market Arbitrage:** Visualization of Day-Ahead (DAM) and Real-Time (RTM) market prices.
- **Strategy Control:** Toggle between "Firm Power" (Safe) and "Aggressive Arbitrage" (High Yield) modes.

### 4. Digital Twin & Predictive Maintenance
- **Heatmap Matrix:** Visual representation of 64+ Battery Cells.
- **Anomaly Detection:** AI diagnosis of thermal runaway risks and inverter faults before they happen.

### 5. System Configuration
- Comprehensive control panel for Grid Compliance (CEA 2019 standards).
- Safety threshold management (SoC limits, Temperature cutoffs).

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **AI/LLM:** Google Gemini 3.0 Flash (via `@google/genai` SDK)
- **Styling:** Tailwind CSS (Slate/Emerald/Orange Indian Energy Theme)
- **Visualization:** Recharts (Data visualization), Lucide React (Icons)

## Snapshots

## Dashboard
<img width="1918" height="909" alt="1" src="https://github.com/user-attachments/assets/1b7c22c7-e787-4aad-a054-cdc16107db4a" />

## Revenue and Bidding
<img width="1918" height="907" alt="2" src="https://github.com/user-attachments/assets/d9883dc9-2f05-4aaa-8b72-eb1fafaa8eec" />

## Maintenance
<img width="1916" height="906" alt="3" src="https://github.com/user-attachments/assets/80f5e784-cb6d-4705-bc63-5be7240b6315" />

## Digital Twin
<img width="1918" height="905" alt="4" src="https://github.com/user-attachments/assets/e0f6c138-742c-4ee1-ae34-21bdd8cd7b3d" />

## Configurations
<img width="1914" height="909" alt="5" src="https://github.com/user-attachments/assets/ac33091a-d43b-4632-be16-13518769604c" />

## AI Chatbot
<img width="424" height="746" alt="6" src="https://github.com/user-attachments/assets/4744de9f-6d52-4d66-80cf-a535acc764c1" />

## How to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GRASP-2026.git
   cd GRASP-2026
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file or export the variable directly. You need a Google Gemini API Key.
   ```bash
   export API_KEY="your_google_gemini_api_key"
   ```

4. **Run the App**
   ```bash
   npm start
   ```

## Future Roadmap
- [ ] Integration with Indian Energy Exchange (IEX) API for live bidding.
- [ ] Weather API integration for hyper-local solar forecasting.
- [ ] Blockchain integration for Peer-to-Peer (P2P) green energy trading.

---
