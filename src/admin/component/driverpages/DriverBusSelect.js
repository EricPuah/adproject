import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import AdminNavbar from '../pages/AdminNavbar';
import CustomMarker from '../../../assets/bus-stop.png';
import busRoutes from '../pages/busRoutes';
import CustomBus from '../../../assets/bus.png';
import style from '../pages/AdminNavBar.module.css';
import styles from './DriverBusSelect.module.css';
import staticMarkers from '../pages/BusStopsLocation';
import { getPdfUrl } from '../firebase';

const containerStyle = {
  width: '53%',
  height: '600px',
  position: 'absolute',
  top: '100px',
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
    if (visibleRoute === routeKey) {
      setVisibleRoute(null);
      setSelectedRoute(null);
    } else {
      setVisibleRoute(routeKey);
      setSelectedRoute(busRoutes[routeKey].route);
    }
  };

  const handleBusSelection = async (bus) => {
    try {
      const response = await fetch(`https://ad-server-js.vercel.app/location/selected-buses`, {
        method: 'GET',
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error);
      } else {
        const { selectedBuses } = await response.json();

        if (selectedBuses.includes(bus)) {
          alert('This bus is already taken by another driver. Please choose another bus.');
        } else {
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
            setSelectedBus(bus);
          }
        }
      }
    } catch (error) {
      console.error('Error selecting bus:', error);
    }
  };

  const updateDriverLocation = () => {
    if (navigator.geolocation && map && selectedBus) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
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
      console.error('Geolocation is not supported by this browser, map is not available, or the page is not visible.');
    }
  };

  const sendDriverLocationToServer = (location) => {
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
      if (navigator.geolocation && map && selectedBus) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
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
        console.error('Geolocation is not supported by this browser, map is not available, or the page is not visible.');
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
  }, [map, isLoaded, onLoad, onUnmount, selectedBus]);

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
      <section className={styles.section}>
        <div className={style.mainContentContainer}>
            <div style={containerStyle}>
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
              <table className={styles.buttontable}>
                <thead>
                  <tr>
                    <th className={styles.button2th} colSpan={19}>Choose any Bus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {busList.map((bus) => (
                      <td key={bus} className={styles.buttontd}>
                        <button
                          onClick={() => handleBusSelection(bus)}
                          style={{ color: selectedBus === bus ? '#FF0000' : 'inherit' }}
                        >
                          {bus}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.buttonContainerStyle}>
              <table className={styles.button2table}>
                <thead>
                  <tr>
                    <th className={styles.button2th} colSpan="8">Bus Routes</th>
                  </tr>
                </thead>
                <tbody>
                  {routeKeys.slice(0, 8).map((routeKey) => {
                    const isRouteVisible = visibleRoute === routeKey;
                    return (
                      <tr key={routeKey}>
                        <td className={styles.button2td}>
                          <button
                            onClick={() => handleShowBusRoute(routeKey)}
                            style={{ color: isRouteVisible ? '#FF0000' : 'inherit' }}
                          >
                            {`${routeKey}`}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </section>

      {/* <div className={styles.iframeContainer}>
        {pdfUrl && (
          <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="780px" />
        )}
      </div> */}
    </div >
  );
}

export default DriverBusSelect;
