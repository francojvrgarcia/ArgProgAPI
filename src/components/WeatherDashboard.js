import React, { useState, useEffect, useRef } from 'react';
import '../WeatherDashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import Clock from 'react-minimal-pie-chart';
import TemperatureMinMaxCard from './TemperatureMinMaxCard';
import TemperatureClock from './TemperatureClock';
import HighlightCard from './HighlightCard';
import TemperatureChart from './TemperatureChart';
import moment from 'moment';
import apiData from './api.json';
import L from 'leaflet';
import busIcon from './bus_icon.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const currentDateTime = moment().format('MMMM D, YYYY h:mm A');
  const [selectedOption, setSelectedOption] = useState('');
  const [route_id, setRouteId] = useState('');
  const [mapKey, setMapKey] = useState(Date.now());
  const mapRef = useRef(null);
  const [transporteData, setTransporteData] = useState([]);
  const customBusIcon = new L.Icon({
    iconUrl: busIcon,
    iconSize: [25, 25],
    iconAnchor: [5, 25],
    popupAnchor: [0, -25],
  });
  const [countdown, setCountdown] = useState(31);
  const [searchTerm, setSearchTerm] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);

  const options = [
    { label: 'SELECCIONA UNA RUTA', value: '' },
    { label: 'Ramal J - La Balandra', value: '1184' },
    { label: 'Pte. Saavedra - Maquinista Savio', value: '2920' },
    { label: 'Pte. Saavedra - Moreno x canal San Fernando', value: '2911' },
    { label: 'Pte. Saavedra - Moreno x Panamericana', value: '2915' },
    { label: 'Pte. Saavedra - Moreno x Virreyes', value: '2914' },
    { label: 'Pte. Saavedra - Pilar x Acc. Norte', value: '2921' },
    { label: 'Pte. Saavedra - Pilar x Del Viso', value: '2918' },
    { label: 'Pte. Saavedra - Pilar x Ford', value: '2917' },
    { label: 'Pte. Saavedra - Pilar x Ruta 9', value: '2919' },
    { label: 'Canal San Fernando - Escobar', value: '894' },
    { label: 'Canal San Fernando - Garín', value: '895' },
    { label: 'San Martin - Escobar', value: '2939' },
    { label: 'San Martin - Zarate', value: '2941' },
    { label: 'Ciudadela - Pontevedra', value: '546' },
    { label: 'Ramal B - 64 155 y 60 - Montevideo y 2', value: '1201' },
    { label: 'Ramal D - Frigorifico Armour x Diagonal 73', value: '1202' },
    { label: 'Ramal C', value: '1393' },
    { label: 'Ciudadela - Cañuelas', value: '2684' },
    { label: 'Ciudadela - Ruta 3', value: '2685' },
  ];

  const handleSearchClick = () => {
    setOptionsVisible(true);
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-31.4135&longitude=-64.181&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,visibility,weathercode&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,windgusts_10m_max&timezone=auto'
      );
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setCountdown(31);
      setWeatherData(data);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  const fetchTransportData = async () => {
    try {
      const response = await fetch(
        `https://datosabiertos-transporte-apis.buenosaires.gob.ar:443/colectivos/vehiclePositionsSimple?route_id=${route_id}&client_id=cb6b18c84b3b484d98018a791577af52&client_secret=3e3DB105Fbf642Bf88d5eeB8783EE1E6`
      );
      if (!response.ok) {
      }
      const data = await response.json();
      console.log('data transporte', data);
      setTransporteData(data);
    } catch (error) {
      console.error('Error al obtener datos de la API de transporte:', error);
    }
  };

  useEffect(() => {
    const weatherDataIntervalId = setInterval(fetchData, 31000);
    const transporteDataIntervalId = setInterval(fetchTransportData, 31000);

    fetchData();
    fetchTransportData();

    return () => {
      clearInterval(weatherDataIntervalId);
      clearInterval(transporteDataIntervalId);
    };
  }, [route_id, selectedOption]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  const filteredOptions = () => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <div className="route-info">
        <div className="combo-select">
          <input
            type="text"
            placeholder="Filtrar opciones..."
            value={searchTerm}
            onClick={handleSearchClick}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOptionsVisible(!!e.target.value);
            }}
          />
          {optionsVisible && (
            <div className="options-list">
              {filteredOptions().map((option) => (
                <div
                  key={option.value}
                  className="option"
                  onClick={() => {
                    setSelectedOption(option.value);
                    setRouteId(option.value);
                    setMapKey(Date.now());
                    setSearchTerm('');
                    setOptionsVisible(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
          <div className="countdown">Se actualiza en: {countdown} segundos</div>
        </div>
        <div className="mensaje">
          {route_id && (!transporteData || transporteData.length === 0) ? (
            <div className="alert alert-danger">
              <p>NO HAY DATOS DISPONIBLES</p>
            </div>
          ) : null}
        </div>
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
        {Array.isArray(transporteData) &&
          transporteData.map((markerData) => (
            <Marker
              key={markerData.id}
              position={[markerData.latitude, markerData.longitude]}
              icon={customBusIcon}
            >
              <Popup>
                <strong>Agency:</strong> {markerData.agency_name}
                <br />
                <strong>Route:</strong> {markerData.route_short_name}
                <br />
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
                <div className="bottom-right">
                  <div className="humidity-grid">
                    <TemperatureChart
                      timeLabels={weatherData.hourly.time}
                      temperatureData={weatherData.hourly.temperature_2m}
                    />
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
