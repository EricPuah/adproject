// LocationTracker.js

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';

const containerStyle = {
  width: '60%',
  height: '600px',
  marginLeft: 300,
  marginTop: 50
};

const center = {
  lat: 1.559803,
  lng: 103.637998,
};

function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return <p>Error loading map: {loadError.message}</p>;
  }

  return isLoaded ? (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      </div>
    </div>
  ) : (
    <p>Loading map...</p>
  );
}

export default LocationTracker;
