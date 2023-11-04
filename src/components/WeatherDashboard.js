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
import Transporte from './Transporte';

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



  useEffect(() => {
    const weatherDataIntervalId = setInterval(fetchData, 31000);


    fetchData();
 

    return () => {
      clearInterval(weatherDataIntervalId);

    };
  }, [route_id, selectedOption]);





  return (
    <>


      <Transporte  />



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
