import React, { useState, useEffect } from 'react';
import '../WeatherDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';
import Clock from 'react-minimal-pie-chart';

// Importa los componentes que has separado en archivos individuales
import TemperatureMinMaxCard from './TemperatureMinMaxCard';
import TemperatureClock from './TemperatureClock';
import HumidityCard from './HumidityCard';
import TemperatureChart from './TemperatureChart';

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Realiza la solicitud HTTP a la API utilizando fetch
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-31.4135&longitude=-64.181&hourly=temperature_2m,relativehumidity_2m')
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

  // Obtener la fecha y hora actual en formato legible
  const currentDateTime = moment().format('MMMM D, YYYY h:mm A');

  return (
    <div className="weather-dashboard">
      <div className="left-panel">
        {/* Contenido del panel izquierdo */}
        <h2></h2>
        <div className="top-left">
          <TemperatureClock />
          {/* Agrega aquí la fecha y hora actual */}
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
                <HumidityCard title="UV INDEX" value={6} />
                {/* WIND STATUS */}
                <HumidityCard title="WIND STATUS" value="11.12km" />
                {/* SUNRISE & SUNSET */}
                <HumidityCard title="SUNRISE & SUNSET" sunrise="6:35 AM" sunset="5:42 AM" />
                {/* HUMIDITY */}
                <HumidityCard title="HUMIDITY" data={weatherData.hourly} />
                {/* VISIBILITY */}
                <HumidityCard title="VISIBILITY" value="6.1km" />
                {/* AIR QUALITY */}
                <HumidityCard title="AIR QUALITY" value={105} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
