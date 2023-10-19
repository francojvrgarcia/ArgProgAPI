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
import L from 'leaflet'; // Importa 'leaflet' para crear un ícono personalizado

// Importa tu ícono de colectivo (ajusta la ruta según la ubicación de tu imagen)
import busIcon from './bus_icon.png';



import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
 // const [transporteData, setTransporteData] = useState([]);
  //const [weatherData, setWeatherData] = useState(apiData);
  const currentDateTime = moment().format('MMMM D, YYYY h:mm A');
  //const currentDateTime = moment(weatherData.current_weather.time).format('MMMM D, YYYY h:mm A');

  const [transporteData, setTransporteData] = useState([
    {
      "route_id": "1468",
      "latitude": -34.64657,
      "longitude": -58.59802,
      "speed": 4.444444,
      "timestamp": 1697581132,
      "id": "1822",
      "direction": 0,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "153A",
      "tip_id": "95449-1",
      "trip_headsign": "a B° Nuevo"
    },
    {
      "route_id": "1464",
      "latitude": -34.69533,
      "longitude": -58.6943741,
      "speed": 2.5,
      "timestamp": 1697581132,
      "id": "1827",
      "direction": 0,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "253A",
      "tip_id": "95220-1",
      "trip_headsign": "a Liniers"
    },
    {
      "route_id": "1468",
      "latitude": -34.65996,
      "longitude": -58.66686,
      "speed": 3.611111,
      "timestamp": 1697581132,
      "id": "1833",
      "direction": 0,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "153A",
      "tip_id": "95446-1",
      "trip_headsign": "a B° Nuevo"
    },
    {
      "route_id": "1468",
      "latitude": -34.64098,
      "longitude": -58.56669,
      "speed": 9.444444,
      "timestamp": 1697581132,
      "id": "1836",
      "direction": 0,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "153A",
      "tip_id": "95448-1",
      "trip_headsign": "a B° Nuevo"
    },
    {
      "route_id": "1467",
      "latitude": -34.67931,
      "longitude": -58.66576,
      "speed": 7.5,
      "timestamp": 1697581132,
      "id": "1838",
      "direction": 1,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "321A",
      "tip_id": "95364-1",
      "trip_headsign": "a Est. CASTELAR"
    },
    {
      "route_id": "1466",
      "latitude": -34.67753,
      "longitude": -58.6653,
      "speed": 8.333333,
      "timestamp": 1697581132,
      "id": "1849",
      "direction": 0,
      "agency_name": "MICROOMNIBUS SAAVEDRA S.A.T.A.C.I.",
      "agency_id": 82,
      "route_short_name": "321A",
      "tip_id": "95316-1",
      "trip_headsign": "a LIBERTAD"
    }
  ]);

  const customBusIcon = new L.Icon({
    iconUrl: busIcon, // Ruta a tu imagen de colectivo
    iconSize: [25, 25], // Tamaño del ícono (ajusta según tus necesidades)
    iconAnchor: [5, 25], // Punto de anclaje del ícono (ajusta según tus necesidades)
    popupAnchor: [0, -25], // Punto de anclaje del popup (ajusta según tus necesidades)
  });


 
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


   /*    const fetchData = async () => {
        try {
          const response = await fetch('https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=cb6b18c84b3b484d98018a791577af52&client_secret=3e3DB105Fbf642Bf88d5eeB8783EE1E6');
          if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
          }
   
          const data = await response.json();
          console.log('data transporte', data)
          setTransporteData(data);
        } catch (error) {
          console.error('Error al obtener datos de la API:', error);
        }
      };
  
      // Llama a fetchData inicialmente
      fetchData();
  
      // Establece una recurrencia para llamar a fetchData cada 31 segundos
      const intervalId = setInterval(fetchData, 31000); // 31000 ms = 31 segundos
  
      // Limpia el intervalo cuando el componente se desmonta
      return () => {
        clearInterval(intervalId);
      }; */
  }, []); 
  const firstFiveData = transporteData.slice(0, 5);

  return (
      <>
             <MapContainer center={[-34.6118, -58.4173]} zoom={14} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {transporteData.map((markerData) => (
        <Marker
          key={markerData.id}
          position={[markerData.latitude, markerData.longitude]}
          icon={customBusIcon} // Utiliza el ícono personalizado
        >
          <Popup>
            <strong>Agency:</strong> {markerData.agency_name}<br />
            <strong>Route:</strong> {markerData.route_short_name}<br />
            <strong>Speed:</strong> {markerData.speed} km/h
          </Popup>
        </Marker>
      ))}
    </MapContainer>
          <div className="weather-dashboard">
            <div className="top-panel">
              <div className="left-panel">
                      {/* Contenido del panel izquierdo */}
                      <h2></h2>
                      <div className="top-left">
                      {weatherData && weatherData.current && (
                        <TemperatureClock currentTemperature={weatherData.current.temperature_2m} /> 
                        )}
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
                      <TemperatureChart
                        timeLabels={weatherData.hourly.time}
                        temperatureData={weatherData.hourly.temperature_2m}
                      />
                    </div>
                    <div className="bottom-right">
                      {/* Contenido del panel inferior del lado derecho */}
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
       
        </div>
      </>
  );
}

export default WeatherDashboard;
