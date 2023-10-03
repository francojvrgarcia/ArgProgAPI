// HumidityCard.js
import React, { useState, useEffect } from 'react';
import moment from 'moment';

function HumidityCard({ title, data }) {
        console.log('datahum', data)
        const [currentHumidity, setCurrentHumidity] = useState(null);
      
        const getCurrentHumidity = () => {
          const currentTime = new Date().toISOString(); // Obtén la hora actual en formato ISO
          
          const index = data.time.findIndex((time) => {
            // Compara la hora actual con las horas en data.time
            console.log('currentTime', currentTime)
            console.log('time', time)
            return moment(currentTime).isSame(time, 'hour');
          });
        
          console.log('current', index);
        
          if (index !== -1) {
            setCurrentHumidity(data.relativehumidity_2m[index]);
          }
        };
        // Llama a la función para obtener la humedad actual cuando se monta el componente
        useEffect(() => {
          getCurrentHumidity();
        }, [data]);
      
        // Verificar si la humedad es normal o no (ajusta los valores según tus criterios)
        const isNormal = currentHumidity !== null && currentHumidity >= 30 && currentHumidity <= 70;
      
        return (
          <div className={`humidity-card ${isNormal ? 'normal' : 'not-normal'}`}>
            <h3>{title}</h3>
            <div className="humidity-reading">
              <div className="humidity-value">{currentHumidity !== null ? `${currentHumidity}%` : 'N/A'}</div>
              <div className="humidity-icon">
                <span role="img" aria-label="Termómetro">
                  🌡️
                </span>
              </div>
            </div>
            <div className="humidity-status">
              {currentHumidity !== null ? (isNormal ? 'Normal' : 'No Normal') : 'No disponible'}
            </div>
          </div>
        );
            
}

export default HumidityCard;
