import React, { useState, useEffect } from 'react';

function TemperatureClock() {
  const [currentTemperature, setCurrentTemperature] = useState(20);

  // Calcula el ángulo de la aguja del reloj basado en la temperatura actual
  const minTemperature = -30;
  const maxTemperature = 40;
  const angleMin = -150;
  const angleMax = 150;

  // Calcula el ángulo inicial de la aguja del reloj
  const initialTemperature = -20;
  const initialNormalizedTemperature = Math.min(Math.max(initialTemperature, minTemperature), maxTemperature);
  const initialTemperaturePercentage = (initialNormalizedTemperature - minTemperature) / (maxTemperature - minTemperature);
  const initialNeedleAngle = angleMin + initialTemperaturePercentage * (angleMax - angleMin);

  return (
    <>
    <div className="temperature-clock">
    <div className="clock-container">
      <div className="clock">
        <div className="center-circle"></div>
        <div
          className="needle"
          style={{
            transform: `translateX(-50%) rotate(${initialNeedleAngle}deg)`,
          }}
        ></div>
      
        <div className="temperature-number-north">10°C</div>
        <div className="temperature-number-west">-10°C</div>
        <div className="temperature-number-south">-30°C</div>
        <div className="temperature-number-east">40°C</div>
      </div>
    </div>
    <div
         
          style={{
            fontSize: '24px',
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {currentTemperature}°C
        </div>
  </div>
  </>
  );
}

export default TemperatureClock;
