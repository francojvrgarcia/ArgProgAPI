import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import busIcon from './bus_icon.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Transporte() {
  const customBusIcon = new L.Icon({
    iconUrl: busIcon,
    iconSize: [25, 25],
    iconAnchor: [5, 25],
    popupAnchor: [0, -25],
  });

  const [transporteData, setTransporteData] = useState([]);
  const [route_id, setRouteId] = useState('');
  const [mapKey, setMapKey] = useState(Date.now());
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countdown, setCountdown] = useState(31);

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
  };

  const fetchTransportData = async () => {
    try {
      const response = await fetch(
        `https://datosabiertos-transporte-apis.buenosaires.gob.ar:443/colectivos/vehiclePositionsSimple?route_id=${route_id}&client_id=cb6b18c84b3b484d98018a791577af52&client_secret=3e3DB105Fbf642Bf88d5eeB8783EE1E6`
      );
      if (!response.ok) {
        // Maneja errores aquí si es necesario
        console.error('Error al obtener datos de la API de transporte');
        return;
      }
      const data = await response.json();
      console.log('data transporte', data);
      setCountdown(31);
      setTransporteData(data);
    } catch (error) {
      console.error('Error al obtener datos de la API de transporte:', error);
    }
  };

  useEffect(() => {
    fetchTransportData();
    const transporteDataIntervalId = setInterval(fetchTransportData, 31000);

    return () => {
      clearInterval(transporteDataIntervalId);
    };
  }, [route_id]);

  const filteredOptions = () => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
    </>
  );
}

export default Transporte;
