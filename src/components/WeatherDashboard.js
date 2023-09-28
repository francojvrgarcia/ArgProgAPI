import React, { useState, useEffect } from 'react';
import '../WeatherDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Asegúrate de importar 'chart.js/auto'
import 'chartjs-adapter-moment'; // Si es necesario para tu versión de Chart.js
import moment from 'moment'; // Importa moment.js

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

  return (
    <div className="weather-dashboard">
      <div className="left-panel">
        {/* Contenido del panel izquierdo */}
        <h2></h2>
        {/* Agrega contenido según tus necesidades */}
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
              <HumidityCard data={weatherData.hourly}/>
              <HumidityCard data={weatherData.hourly}/>
              <HumidityCard data={weatherData.hourly}/>
              <HumidityCard data={weatherData.hourly}/>
              <HumidityCard data={weatherData.hourly}/>
              <HumidityCard data={weatherData.hourly}/>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TemperatureChart({ timeLabels, temperatureData }) {
  // Obtén la fecha actual en formato "YYYY-MM-DD" para comparar con los datos
  const currentDate = moment().format('YYYY-MM-DD');

  // Filtra los datos para obtener solo las horas del día actual
  const filteredTimeLabels = timeLabels.filter((time) => time.startsWith(currentDate));

  // Filtra los datos de temperatura correspondientes a las horas del día actual
  const filteredTemperatureData = filteredTimeLabels.map((filteredTime) => {
    const index = timeLabels.indexOf(filteredTime);
    return temperatureData[index];
  });

  const chartData = {
    labels: filteredTimeLabels, // Usamos las etiquetas de tiempo filtradas
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: filteredTemperatureData, // Datos de temperatura filtrados
        backgroundColor: 'blue', // Color de las barras
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour', // Personaliza la unidad de tiempo según tus necesidades
        },
        title: {
          display: true,
          text: 'Hora',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
      },
    },
  };

  return (
    <div className="temperature-chart temperature-chart-small">
      <h3>Gráfico de Temperatura para Hoy</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

function HumidityCard({ data }) {
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
      <h3>Humedad de Hoy</h3>
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


export default WeatherDashboard;
