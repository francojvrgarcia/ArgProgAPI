// HumidityCard.js
import React, { useState, useEffect } from 'react';
import moment from 'moment';

function HumidityCard({ title, value, sunrise, sunset, data }) {
  const [currentHumidity, setCurrentHumidity] = useState(null);

  const getCurrentHumidity = () => {
    if (title === 'HUMIDITY' && data) {
      const currentTime = new Date().toISOString(); // Obtén la hora actual en formato ISO

      const index = data.time.findIndex((time) => {
        // Compara la hora actual con las horas en data.time
        return moment(currentTime).isSame(time, 'hour');
      });

      if (index !== -1) {
        setCurrentHumidity(data.relativehumidity_2m[index]);
      }
    }
  };

  // Llama a la función para obtener la humedad actual cuando se monta el componente
  useEffect(() => {
    getCurrentHumidity();
  }, [data, title]);

  // Verificar si la humedad es normal o no (ajusta los valores según tus criterios)
  const isNormal =
    (title === 'HUMIDITY' && currentHumidity !== null && currentHumidity >= 30 && currentHumidity <= 70) ||
    (title === 'UV INDEX' && value === 6) ||
    (title === 'WIND STATUS' && value === '11.12km') ||
    (title === 'SUNRISE & SUNSET' && sunrise === '6:35 AM' && sunset === '5:42 AM') ||
    (title === 'VISIBILITY' && value === '6.1km') ||
    (title === 'AIR QUALITY' && value === 105);

  return (
    <div className={`humidity-card ${isNormal ? 'normal' : 'not-normal'}`}>
      <h3>{title}</h3>
      {title === 'HUMIDITY' && (
        <div className="humidity-reading">
          <div className="humidity-value">{currentHumidity !== null ? `${currentHumidity}%` : 'N/A'}</div>
          <div className="humidity-icon">
            <span role="img" aria-label="Termómetro">
              🌡️
            </span>
          </div>
        </div>
      )}
      {title === 'UV INDEX' && <div className="humidity-value">{value}</div>}
      {title === 'WIND STATUS' && <div className="humidity-value">{value}</div>}
      {title === 'SUNRISE & SUNSET' && (
        <div className="humidity-value">
          Sunrise: {sunrise}
          <br />
          Sunset: {sunset}
        </div>
      )}
      {title === 'VISIBILITY' && <div className="humidity-value">{value}</div>}
      {title === 'AIR QUALITY' && <div className="humidity-value">{value}</div>}
      <div className="humidity-status">
        {currentHumidity !== null ? (isNormal ? 'Normal' : '') : ''}
      </div>
    </div>
  );
}

export default HumidityCard;
