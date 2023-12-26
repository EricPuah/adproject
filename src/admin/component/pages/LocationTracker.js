import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline, mapId } from '@react-google-maps/api';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';
import CustomMarker from '../../../assets/bus-stop.png';
import busRoutes from './busRoutes';
import busStops from './BusStopLocation'

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

const staticMarkers = Object.keys(busStops);

const busData = [
  { id: 1, position: { lat: 1.5586928453191957, lng: 103.63528569782638 }, route: [{ lat: 1.5586928453191957, lng: 103.63528569782638 }, { lat: 1.5603304157190552, lng: 103.63485874559022 }] },
  // Add more buses with their routes as needed
];

const routeKeys = Object.keys(busRoutes);

function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [visibleRoute, setVisibleRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleShowBusRoute = (routeKey) => {
    // Check if the clicked route is already visible
    if (visibleRoute === routeKey) {
      // If yes, close the route
      setVisibleRoute(null);
      setSelectedRoute(null);
    } else {
      // If not, set the clicked route to be visible
      setVisibleRoute(routeKey);
      setSelectedRoute(busRoutes[routeKey].route);
    }
  };

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
        {/* Map Container */}
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ mapId: "556e9663519326d5" }}
          className="google-map"
        >
          {selectedRoute && (
            <Polyline
              path={selectedRoute}
              options={{
                strokeColor: "#00FF00", // Change the color as needed
                strokeOpacity: 1,
                strokeWeight: 5,
              }}
            />
          )}

          {/* Static markers */}
          {staticMarkers.map((marker) => (
            <div key={marker.name}>
              <Marker
                position={marker.position}
                onClick={() => handleMarkerClick(marker)}
                options={{
                  icon: {
                    url: CustomMarker,
                    scaledSize: new window.google.maps.Size(18, 18),
                  },
                }}
              />
              {selectedMarker === marker && (
                <InfoWindow
                  position={marker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h3>{marker.name}</h3>
                  </div>
                </InfoWindow>
              )}
            </div>
          ))}

          {/* Bus markers */}
          {busData.map((bus) => (
            <div key={bus.id}>
              <Marker
                position={bus.position}
                onClick={() => handleMarkerClick(bus)}
                options={{
                  icon: {
                    url: CustomMarker,
                    scaledSize: new window.google.maps.Size(18, 18),
                  },
                }}
              />
            </div>
          ))}
        </GoogleMap>
      </div>

      {/* Button Container */}
      <div className='buttonContainerStyle'>
        {routeKeys.slice(0, 8).map((routeKey) => {
          const isRouteVisible = visibleRoute === routeKey;

          return (
            <button
              key={routeKey}
              onClick={() => handleShowBusRoute(routeKey)}
              style={{ margin: '5px', color: isRouteVisible ? '#FF0000' : 'inherit' }}
            >
              {`${routeKey}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default LocationTracker;