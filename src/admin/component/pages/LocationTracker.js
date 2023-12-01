import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';

const containerStyle = {
  width: '60%',
  height: '600px',
  position: 'absolute',
  top: '40px',
  left: '250px',
  padding: '20px',
};

const center = {
  lat: 1.559803,
  lng: 103.637998,
};

// Initial static markers
const staticMarkers = [
  { position: { lat: 1.5593613531032313, lng: 103.63280919934147 }, name: 'KRP 1' },
  { position: { lat: 1.55, lng: 103.63 }, name: 'Marker 2' },
  // Add more static markers as needed
];

function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  if (loadError) {
    return <p>Error loading map: {loadError.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          className="google-map"
        >
          {/* Render static markers */}
          {staticMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.name}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default LocationTracker;
