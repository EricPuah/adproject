import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';

const serverEndpoint = 'http://localhost:5000'; // Replace with your backend server address

function LocationTracker() {
  const [markers, setMarkers] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(serverEndpoint);

    // Listen for real-time location updates
    socket.on('locationUpdate', (newMarker) => {
      setMarkers((prevMarkers) => {
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

  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div className="map-container">
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
          <Marker position={[1.559742, 103.634763]}>
            <Popup>FABU Bus Stop</Popup>
          </Marker>

          {/* Dynamic Markers */}
          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lon]}>
              <Popup>{marker.name}</Popup>
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
