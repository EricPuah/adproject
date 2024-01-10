import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline, mapId } from '@react-google-maps/api';
import '../../component/pages/LocationTracker';
import { usePageVisibility } from 'react-page-visibility';
import AdminNavbar from '../pages/AdminNavbar';
import style from '../pages/AdminNavBar.module.css';
import CustomMarker from '../../../assets/bus-stop.png';
import busRoutes from '../pages/busRoutes';
import CustomBus from '../../../assets/bus.png';
import styles from './DriverBusSelect.module.css';
import staticMarkers from '../pages/BusStopsLocation';
import { getPdfUrl } from '../firebase'; // Update the path accordingly


const containerStyle = {
  width: '50%',
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

const busList = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'E3', 'F1', 'F2', 'G1', 'G2', 'G3', 'H'];

const routeKeys = Object.keys(busRoutes);

function DriverBusSelect() {
  const isPageVisible = usePageVisibility();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [visibleRoute, setVisibleRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

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

  const handleBusSelection = async (bus) => {
    try {
      // Make a GET request to the backend to check if the bus is already selected
      const response = await fetch(`https://ad-server-js.vercel.app/location/selected-buses`, {
        method: 'GET',
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error);
      } else {
        const { selectedBuses } = await response.json();

        // Check if the selected bus is already taken by another driver
        if (selectedBuses.includes(bus)) {
          alert('This bus is already taken by another driver. Please choose another bus.');
        } else {
          // If not taken, make a POST request to select the bus
          const postResponse = await fetch('https://ad-server-js.vercel.app/location/select-bus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bus }),
          });

          if (!postResponse.ok) {
            const { error } = await postResponse.json();
            alert(error);
          } else {
            // If successful, update the local state
            setSelectedBus(bus);
          }
        }
      }
    } catch (error) {
      console.error('Error selecting bus:', error);
    }
  };

  const updateDriverLocation = () => {
    if (navigator.geolocation && map && selectedBus && isPageVisible) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setDriverLocation(location);
          sendDriverLocationToServer(location);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser or map is not available.');
    }
  };

  const sendDriverLocationToServer = (location) => {
    // Use fetch or Axios to send a POST request to your server
    fetch(`https://ad-server-js.vercel.app/location/${selectedBus}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send user location to server');
        }
        return response.json();
      })
      .then(data => {
        console.log('User location sent successfully:', data);
      })
      .catch(error => {
        console.error('Error sending user location to server:', error);
      });
  };

  useEffect(() => {
    const requestDriverLocation = () => {
      if (navigator.geolocation && map && selectedBus && isPageVisible) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            setDriverLocation(location);
            sendDriverLocationToServer(location);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser or map is not available.');
      }
    };

    requestDriverLocation();
    updateDriverLocation();

    const updateLocationInterval = setInterval(updateDriverLocation, 400);

    if (isLoaded) {
      onLoad(map);
    }

    return () => {
      if (map) {
        onUnmount();
      }
      clearInterval(updateLocationInterval);
    };
  }, [map, isLoaded, onLoad, onUnmount, selectedBus, isPageVisible]);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getPdfUrl();
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    fetchPdfUrl();
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
      <div className={style.mainContentContainer}>
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
                  strokeColor: "#00FF00",
                  strokeOpacity: 1,
                  strokeWeight: 5,
                }}
              />
            )}

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
            {driverLocation && (
              <Marker
                position={driverLocation}
                onClick={() => handleMarkerClick(driverLocation)}
                options={{
                  icon: {
                    url: CustomBus,
                    scaledSize: new window.google.maps.Size(30, 30),
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>

        <div className={styles.selectBusButton}>
          {busList.map((bus) => (
            <button
              key={bus}
              onClick={() => handleBusSelection(bus)}
              style={{ margin: '5px', color: selectedBus === bus ? '#FF0000' : 'inherit' }}
            >
              {bus}
            </button>
          ))}
        </div>

        {/* Button Container */}
        <div className={styles.buttonContainerStyle}>
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

      <div className={styles.iframeContainer}>
        {pdfUrl && (
          <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="780px" />
        )}
      </div>
    </div>
  );
}

export default DriverBusSelect;