import React from 'react';
import moment from 'moment'; // Importa la librería moment

function TemperatureMinMaxCard({ maxTemperature, minTemperature }) {
  

  // Calcula un color de fondo degradado en función de la temperatura máxima y mínima
  const gradientColor = `linear-gradient(90deg, #FF5733 ${maxTemperature}%, #e5a733 ${minTemperature}%)`;

  const cardStyle = {
    background: gradientColor,
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
  };

  return (
    <div className="temperature-min-max-card" style={cardStyle}>
      <div className="temperature-values">
        <div className="max-temperature-card card">
          <div className="max-temperature-value">{maxTemperature}°C</div>
          <div className="max-temperature-label">Máxima</div>
        </div>
        <div className="min-temperature-card card">
          <div className="min-temperature-value">{minTemperature}°C</div>
          <div className="min-temperature-label">Mínima</div>
        </div>
      </div>
    </div>
  );
}

export default TemperatureMinMaxCard;
