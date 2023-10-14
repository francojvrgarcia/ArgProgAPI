import React, { useState, useEffect } from 'react';
import '../WeatherDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import Clock from 'react-minimal-pie-chart';

// Importa los componentes que has separado en archivos individuales
import TemperatureMinMaxCard from './TemperatureMinMaxCard';
import TemperatureClock from './TemperatureClock';
import HighlightCard from './HighlightCard';
import TemperatureChart from './TemperatureChart';
import moment from 'moment';

import apiData from './api.json';

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  //const [weatherData, setWeatherData] = useState(apiData);
  const currentDateTime = moment().format('MMMM D, YYYY h:mm A');
  //const currentDateTime = moment(weatherData.current_weather.time).format('MMMM D, YYYY h:mm A');

 
   useEffect(() => {
    // Realiza la solicitud HTTP a la API utilizando fetch
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-31.4135&longitude=-64.181&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,windgusts_10m_max&timezone=auto')
      .then((response) => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then((data) => {
        // Al recibir los datos, actualiza el estado

        console.log('Datos recibidos:', data);
        setWeatherData(data);
        
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []); 


  return (
    <div className="weather-dashboard">
      <div className="left-panel">
        {/* Contenido del panel izquierdo */}
        <h2></h2>
        <div className="top-left">
        {weatherData && weatherData.current && (
          <TemperatureClock currentTemperature={weatherData.current.temperature_2m} /> 
          )}
          <div className="current-date-time">
            {currentDateTime}
          </div>

        </div>
        <div className="bottom-left">
          {/* Agregar el TemperatureMinMaxCard en la parte inferior izquierda */}
          {weatherData && weatherData.hourly && (
            <TemperatureMinMaxCard
              maxTemperature={Math.max(...weatherData.hourly.temperature_2m)}
              minTemperature={Math.min(...weatherData.hourly.temperature_2m)}
            />
          )}
        </div>
      </div>
      <div className="right-panel">
        {weatherData && weatherData.hourly && (
          <>
            <div className="top-right">
              {/* Contenido del panel superior del lado derecho */}
              <h2>Today</h2>
              <TemperatureChart
                timeLabels={weatherData.hourly.time}
                temperatureData={weatherData.hourly.temperature_2m}
              />
            </div>
            <div className="bottom-right">
              {/* Contenido del panel inferior del lado derecho */}
              <h2>Highlights</h2>
              <div className="humidity-grid">
                {/* UV INDEX */}
                <HighlightCard title="UV INDEX" value={weatherData.daily.uv_index_max} />
                {/* WIND STATUS */}
                <HighlightCard title="WIND STATUS" value={weatherData.current.windspeed_10m + ' km/h'}/>
                {/* SUNRISE & SUNSET */}
                <HighlightCard title="SUNRISE & SUNSET" sunrise={weatherData.daily.sunrise} sunset={weatherData.daily.sunset}  />
                {/* HUMIDITY */}
                <HighlightCard title="HUMIDITY" data={weatherData.hourly} />
                {/* VISIBILITY */}
                <HighlightCard title="VISIBILITY" data={weatherData.hourly}/>
                {/* AIR QUALITY */}
                <HighlightCard title="AIR QUALITY" value={105} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
