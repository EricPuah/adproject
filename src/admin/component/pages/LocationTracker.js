import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';

const serverEndpoint = 'http://localhost:5000'; // Replace with your backend server address

function LocationTracker() {
  const [markers, setMarkers] = useState([
    { id: 1, lat: 1.5597079477240423, lon: 103.63475718659937, name: 'Central Point', imageUrl: 'C:/Users/ericp/Downloads/bus-stop-symbol-logo-2DD67FCDE5-seeklogo.com.png' },
    { id: 2, lat: 1.5628199411691888, lon: 103.63647962572057, name: 'FKA', imageUrl: 'C:/Users/ericp/Downloads/bus-stop-symbol-logo-2DD67FCDE5-seeklogo.com.png' },
    { id: 3, lat: 1.5593522903631798, lon: 103.63282641074402, name: 'KRP', imageUrl: 'C:/Users/ericp/Downloads/bus-stop-symbol-logo-2DD67FCDE5-seeklogo.com.png' }
  ]);
  const [DynamicMarker, setDynamicMarkers] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(serverEndpoint);

    // Listen for real-time location updates
    socket.on('locationUpdate', (newMarker) => {
      setDynamicMarkers((prevMarkers) => {
        // Update existing marker or add a new one
        const updatedMarkers = prevMarkers.filter((marker) => marker.id !== newMarker.id);
        return [...updatedMarkers, newMarker];
      });
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle map click
  const handleMapClick = (event) => {
    setClickedLocation([event.latlng.lat, event.latlng.lng]);
  };

  const customIcon = (imageUrl) => new L.Icon({
    iconUrl: imageUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div>
      <AdminNavbar />
      <div className='map-container'>
        <MapContainer
          center={[1.559803, 103.637998]}
          zoom={16}
          style={{ height: '600px', width: '60%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Static Marker */}
          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lon]} icon={customIcon(marker.imageUrl)}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}

          {/* Dynamic Markers */}
          {DynamicMarker.map((DynamicMarker) => (
            <Marker key={DynamicMarker.id} position={[DynamicMarker.lat, DynamicMarker.lon]}>
              <Popup>{DynamicMarker.name}</Popup>
            </Marker>
          ))}

          {/* Display clicked location, if available */}
          {clickedLocation && (
            <Marker position={clickedLocation}>
              <Popup>Clicked Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationTracker;


