// HumidityCard.js
import React, { useState, useEffect } from 'react';
import moment from 'moment';

function HighlightCard({ title, value, sunrise, sunset, data }) {
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [currentVisibility, setCurrentVisibility] = useState(null);

  const getCurrentHumidity = () => {
    if (title === 'HUMIDITY' && data) {
      const targetDate = moment();
      const currentTime = targetDate.toISOString();
      const index = data.time.findIndex((time) => {
        return moment(currentTime).isSame(time, 'hour');
      });

      if (index !== -1) {
        setCurrentHumidity(data.relativehumidity_2m[index]);
      }
    }
  };

  const formatTime = (timeString) => {
    return moment(timeString, 'HH:mm').format('h:mm A');
  };
  
  const getVisibilityForDate = () => {
 
    if (title === 'VISIBILITY' && data) {
      const targetDate =  moment();
      const currentTime = targetDate.toISOString();
      const index = data.time.findIndex((time) => {
        return moment(currentTime).isSame(time, 'hour');
      });

      if (index !== -1) {
        const visibilityInMeters = data.visibility[index];
        const visibilityInKilometers = visibilityInMeters / 1000;
        setCurrentVisibility(`${visibilityInKilometers.toFixed(1)} km`);
      }
    }
  };

  // Llama a la función para obtener la humedad actual cuando se monta el componente
  useEffect(() => {
    getCurrentHumidity();
    getVisibilityForDate();
  }, [data, title]);

  // Verificar si la humedad es normal o no (ajusta los valores según tus criterios)
  const isNormal =
    (title === 'HUMIDITY' && currentHumidity !== null && currentHumidity >= 30 && currentHumidity <= 70);

  return (
    <div className={`humidity-card ${isNormal ? 'normal' : 'not-normal'}`}>
      <h3>{title}</h3>
      {title === 'HUMIDITY' && (
        <div className="humidity-reading">
          <div className="humidity-value">
            {currentHumidity !== null ? `${currentHumidity}%` : 'N/A'}
          </div>
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
          ▲ {moment(sunrise[0]).format('h:mm A')}  
          <br />
          ▼ {moment(sunset[0]).format('h:mm A')} 
        </div>
      )}
      {title === 'VISIBILITY' && <div className="humidity-value">{value || currentVisibility}</div>}
      {title === 'AIR QUALITY' && <div className="humidity-value">{value}</div>}
      <div className="humidity-status">
        {currentHumidity !== null ? (isNormal ? 'Normal' : '') : ''}
      </div>
    </div>
  );
}

export default HighlightCard;
