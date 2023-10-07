import React, { useState, useEffect } from 'react';

function TemperatureClock({ currentTemperature }) {
  const minTemperature = 10;
  const maxTemperature = 40;
  const angleMin = -150; // Ajusta este valor para que la aguja apunte un poco más arriba
  const angleMax = 60;

  const normalizedTemperature = Math.min(Math.max(currentTemperature, minTemperature), maxTemperature);
  const temperaturePercentage = (normalizedTemperature - minTemperature) / (maxTemperature - minTemperature);
  const needleAngle = angleMin + temperaturePercentage * (angleMax - angleMin);

  return (
    <>
      <div className="temperature-clock">
        <div className="clock-container">
          <div className="clock">
            <div className="center-circle"></div>
            <div
              className="needle"
              style={{
                transform: `translateX(-50%) rotate(${needleAngle}deg)`,
              }}
            ></div>

            <div className="temperature-number-north">{minTemperature}°C</div>
            <div className="temperature-number-west">-10°C</div>
            <div className="temperature-number-south">-30°C</div>
            <div className="temperature-number-east">{maxTemperature}°C</div>
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
