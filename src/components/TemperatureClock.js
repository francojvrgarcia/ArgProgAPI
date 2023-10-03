import React, { useState } from 'react';

function TemperatureClock() {
    const [currentTemperature, setCurrentTemperature] = useState(10); // Temperatura inicial (apunta al norte)
  
    // Calcula el ángulo de la aguja del reloj basado en la temperatura actual
    const minTemperature = -30; // Temperatura mínima (apunta al sur)
    const maxTemperature = 40; // Temperatura máxima (apunta al oeste)
    const angleMin = -150; // Ángulo mínimo correspondiente a -30°C
    const angleMax = 150; // Ángulo máximo correspondiente a 40°C
  
    // Temperatura inicial para la aguja (-20°C)
    const initialTemperature = -20;
  
    // Calcula el ángulo inicial de la aguja del reloj
    const initialNormalizedTemperature = Math.min(Math.max(initialTemperature, minTemperature), maxTemperature);
    const initialTemperaturePercentage = (initialNormalizedTemperature - minTemperature) / (maxTemperature - minTemperature);
    const initialNeedleAngle = angleMin + initialTemperaturePercentage * (angleMax - angleMin);
  
    return (
      <div className="temperature-clock">
        <h3>Reloj de Temperatura para Hoy</h3>
        <div className="clock-container">
          <div className="clock">
            {/* Agregar el círculo central */}
            <div className="center-circle"></div>
            {/* Agregar la aguja del reloj de temperatura */}
            <div
              className="temperature-needle"
              style={{
                transform: `translateX(-50%) rotate(${initialNeedleAngle}deg)`,
              }}
            ></div>
            {/* Etiqueta para mostrar la temperatura actual */}
            <div className="temperature-label">
              {initialTemperature}°C
            </div>
            {/* Números para indicar las temperaturas en el reloj */}
            <div className="temperature-number-north">10°C</div>
            <div className="temperature-number-west">-10°C</div>
            <div className="temperature-number-south">-30°C</div>
            <div className="temperature-number-east">40°C</div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TemperatureClock;