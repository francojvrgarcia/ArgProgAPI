import React, { useState, useEffect, useRef } from 'react';
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

import busIcon from './bus_icon.png';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const currentDateTime = moment().format('MMMM D, YYYY h:mm A');
  const [selectedOption, setSelectedOption] = useState("");
  const [route_id, setRouteId] = useState("");
  const [mapKey, setMapKey] = useState(Date.now());
  const mapRef = useRef(null);
  const [transporteData, setTransporteData] = useState([]);
  const customBusIcon = new L.Icon({
    iconUrl: busIcon,
    iconSize: [25, 25],
    iconAnchor: [5, 25],
    popupAnchor: [0, -25],
  });

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-31.4135&longitude=-64.181&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,windgusts_10m_max&timezone=auto')
      .then((response) => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Datos recibidos:', data);
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, [mapKey]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://datosabiertos-transporte-apis.buenosaires.gob.ar:443/colectivos/vehiclePositionsSimple?route_id=${route_id}&client_id=cb6b18c84b3b484d98018a791577af52&client_secret=3e3DB105Fbf642Bf88d5eeB8783EE1E6`);
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }

      const data = await response.json();
      console.log('data transporte', data);
      setTransporteData(data);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchData();
    }
  }, [route_id, selectedOption]);

  return (
    <>
      <div className="combo-select">
        <label htmlFor="selectRoute">Selecciona una ruta:</label>
        <select
          id="selectRoute"
          value={selectedOption}
          className="custom-select"
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedOption(selectedValue);
            setRouteId(selectedValue); // Actualiza el estado de route_id
            setMapKey(Date.now()); // Cambia la clave para forzar el montaje/desmontaje del MapContainer
          }}
        >
          <option value="">Selecciona una ruta</option>
          <option value="1184">Ramal J - La Balandra</option>
          <option value="2920">Pte. Saavedra - Maquinista Savio</option>
          <option value="2911">Pte. Saavedra - Moreno x canal San Fernando</option>
          <option value="2915">Pte. Saavedra - Moreno x Panamericana</option>
          <option value="2914">Pte. Saavedra - Moreno x Virreyes</option>
          <option value="2921">Pte. Saavedra - Pilar x Acc. Norte</option>
          <option value="2918">Pte. Saavedra - Pilar x Del Viso</option>
          <option value="2917">Pte. Saavedra - Pilar x Ford</option>
          <option value="2919">Pte. Saavedra - Pilar x Ruta 9</option>
          <option value="894">Canal San Fernando - Escobar</option>
          <option value="895">Canal San Fernando - Garín</option>
          <option value="2939">San Martin - Escobar</option>
          <option value="2941">San Martin - Zarate</option>
          <option value="546">Ciudadela - Pontevedra</option>
          <option value="1201">Ramal B - 64 155 y 60 - Montevideo y 2</option>
          <option value="1202">Ramal D - Frigorifico Armour x Diagonal 73</option>
          <option value="1393">Ramal C</option>
          <option value="2684">Ciudadela - Cañuelas</option>
          <option value="2685">Ciudadela - Ruta 3</option>
        </select>
        {!transporteData || transporteData.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : null}
      </div>
      
        <MapContainer
          key={mapKey}
          center={[-34.6118, -58.4173]}
          zoom={9}
          scrollWheelZoom={false}
          style={{ marginTop: '20px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {transporteData.map((markerData) => (
            <Marker
              key={markerData.id}
              position={[markerData.latitude, markerData.longitude]}
              icon={customBusIcon}
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
            <h2></h2>
            <div className="top-left">
              {weatherData && weatherData.current && (
                <TemperatureClock currentTemperature={weatherData.current.temperature_2m} />
              )}
            </div>
            <div className="bottom-left">
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
                  <TemperatureChart
                    timeLabels={weatherData.hourly.time}
                    temperatureData={weatherData.hourly.temperature_2m}
                  />
                </div>
                <div className="bottom-right">
                  <div className="humidity-grid">
                    <HighlightCard title="UV INDEX" value={weatherData.daily.uv_index_max} />
                    <HighlightCard title="WIND STATUS" value={weatherData.current.windspeed_10m + ' km/h'} />
                    <HighlightCard title="SUNRISE & SUNSET" sunrise={weatherData.daily.sunrise} sunset={weatherData.daily.sunset} />
                    <HighlightCard title="HUMIDITY" data={weatherData.hourly} />
                    <HighlightCard title="VISIBILITY" data={weatherData.hourly} />
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
