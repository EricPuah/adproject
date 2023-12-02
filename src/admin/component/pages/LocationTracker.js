import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';
import CustomMarker from '../../../assets/bus-stop.png';

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
  { position: { lat: 1.5593613531032313, lng: 103.63280919934147 }, name: 'KRP 1' },
  { position: { lat: 1.5594488031178655, lng: 103.63181397038748 }, name: 'KRP 2' },
  { position: { lat: 1.5581984657886114, lng: 103.63013361402903 }, name: 'KRP 3' },
  { position: { lat: 1.557820767476252, lng: 103.62933025021609 }, name: 'KRP 4' },
  { position: { lat: 1.5583386592877633, lng: 103.62772119148106 }, name: 'PKU' },
  { position: { lat: 1.5666014101927015, lng: 103.62692956217548 }, name: 'KDSE 1' },
  { position: { lat: 1.5664661331768341, lng: 103.62710887123512 }, name: 'KDSE 2' },
  { position: { lat: 1.5680164884613657, lng: 103.62444943229734 }, name: 'KDSE 3' },
  { position: { lat: 1.5600993131033718, lng: 103.62924840747273 }, name: 'KTF 1' },
  { position: { lat: 1.5611031811814065, lng: 103.63092734040339 }, name: 'KTF 2' },
  { position: { lat: 1.559717628544402, lng: 103.63474936112164 }, name: 'Central Point' },
  { position: { lat: 1.5612972023347578, lng: 103.63259352721195 }, name: 'Arked Cengal 1' },
  { position: { lat: 1.5611806042328233, lng: 103.63249300698176 }, name: 'Arked Cengal 2' },
  { position: { lat: 1.5616945552654073, lng: 103.62929878111245 }, name: 'KTR 1' },
  { position: { lat: 1.5627521550241115, lng: 103.62758295044863 }, name: 'KTR 2' },
  { position: { lat: 1.5637730222723685, lng: 103.62742170059452 }, name: 'KTR 3' },
  { position: { lat: 1.5648820767159544, lng: 103.62786828500501 }, name: 'KTR 4' },
  { position: { lat: 1.5627194781848628, lng: 103.63643945417387 }, name: 'FKA' },
  { position: { lat: 1.5626948582674094, lng: 103.63913654898062}, name: 'N24' },
  { position: { lat: 1.5603335706721926, lng: 103.64158337666292 }, name: 'P19' },

];

function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
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
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          className="google-map"
        >
          {/* Render static markers */}
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
        </GoogleMap>
      </div>
    </div>
  );
}

export default LocationTracker;
