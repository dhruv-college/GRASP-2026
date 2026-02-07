import { TimeSeriesPoint, AssetStatus } from '../types';

export const generateDayData = (): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = i;
    
    // Simulating Solar Curve (Peak at 13:00)
    let solarMW = 0;
    if (hour > 6 && hour < 19) {
        // Simple parabolic approximation
        solarMW = 400 * Math.sin(((hour - 6) / 13) * Math.PI);
        // Add some noise/clouds
        solarMW = solarMW * (0.8 + Math.random() * 0.2); 
    }
    
    // Market Price (Morning and Evening peaks)
    let marketPriceINR = 3.5;
    if (hour >= 8 && hour <= 11) marketPriceINR = 6.5 + Math.random();
    if (hour >= 18 && hour <= 22) marketPriceINR = 10.0 + Math.random() * 2;
    if (hour >= 1 && hour <= 5) marketPriceINR = 2.5 + Math.random() * 0.5;

    // Dispatch Logic (Simplistic EMS)
    const firmTargetMW = 200;
    let gridExportMW = 0;
    let bessChargeMW = 0;
    let h2ProductionKg = 0;

    if (solarMW > firmTargetMW) {
        gridExportMW = firmTargetMW;
        const excess = solarMW - firmTargetMW;
        bessChargeMW = excess; // Charge battery
        
        // If BESS is full (simulated limit), dump to H2
        if (bessChargeMW > 250) { // Assuming 250MW charge rate limit
             const h2Power = bessChargeMW - 250;
             bessChargeMW = 250;
             h2ProductionKg = (h2Power * 1000) / 50; // Approx 50kWh per kg H2
        }
    } else {
        const deficit = firmTargetMW - solarMW;
        bessChargeMW = -deficit; // Discharge battery
        gridExportMW = firmTargetMW;
    }

    // Adjust for price arbitrage (override firm logic for demo)
    if (marketPriceINR > 9) {
        // Discharge max during high price
        bessChargeMW = Math.max(bessChargeMW - 50, -250); // Discharge more
        gridExportMW = solarMW - bessChargeMW;
    }

    data.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        solarMW: Math.max(0, parseFloat(solarMW.toFixed(1))),
        bessChargeMW: parseFloat(bessChargeMW.toFixed(1)),
        gridExportMW: parseFloat(gridExportMW.toFixed(1)),
        h2ProductionKg: parseFloat(h2ProductionKg.toFixed(1)),
        marketPriceINR: parseFloat(marketPriceINR.toFixed(2)),
    });
  }
  return data;
};

export const getAssetsStatus = (): AssetStatus[] => [
    { id: 'PV-01', name: 'Solar Arrays', type: 'SOLAR', status: 'ONLINE', output: 320, capacity: 400, efficiency: 98, temperature: 45 },
    { id: 'BESS-01', name: 'LFP Battery Storage', type: 'BESS', status: 'ONLINE', output: 120, capacity: 500, efficiency: 65, temperature: 28 }, // Efficiency used as SoC here
    { id: 'H2-01', name: 'PEM Electrolyzers', type: 'H2', status: 'ONLINE', output: 450, capacity: 50, efficiency: 72, temperature: 60 },
];
