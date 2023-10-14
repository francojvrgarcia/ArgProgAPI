import React from 'react';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

function TemperatureChart({ timeLabels, temperatureData }) {
  // Obtén la fecha actual en formato "YYYY-MM-DD" para comparar con los datos
  const currentDate = moment().format('YYYY-MM-DD');

  // Filtra los datos para obtener solo las horas del día actual
  const filteredTimeLabels = timeLabels.filter((time) => time.startsWith(currentDate ));

  // Filtra los datos de temperatura correspondientes a las horas del día actual
  const filteredTemperatureData = filteredTimeLabels.map((filteredTime) => {
    const index = timeLabels.indexOf(filteredTime);
    return temperatureData[index];
  });

  const gradient = document.createElement('canvas').getContext('2d');
  const gradientFill = gradient.createLinearGradient(0, 0, 0, 400);
  gradientFill.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Blanco con transparencia
  gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0.2)'); // Blanco con menos transparencia

  const chartData = {
    labels: filteredTimeLabels, // Usamos las etiquetas de tiempo filtradas
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: filteredTemperatureData, // Datos de temperatura filtrados
        backgroundColor: gradientFill, // Fondo de degradado
        borderColor: 'white', // Borde blanco
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
    <div className="temperature-chart-container">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default TemperatureChart;
