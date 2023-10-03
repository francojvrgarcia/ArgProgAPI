import React from 'react';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';


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

export default TemperatureChart;