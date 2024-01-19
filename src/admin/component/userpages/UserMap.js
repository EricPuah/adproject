import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import style from './UserSideBar.module.css';
import styles from './UserMap.module.css';
import CustomMarker from '../../../assets/currentLocation.png';
import busStops from '../../../assets/bus-stop.png';
import UserSideBar from './UserSideBar';
import busRoutes from '../pages/busRoutes';
import busD from '../../../assets/bus.png';
import staticMarkers from '../pages/BusStopsLocation';
import { getPdfUrl } from '../firebase'; // Update the path accordingly

const containerStyle = {
    position: 'absolute',
    width: '80%',
    height: '60%',
    top: '25%',
    left: '15%',
    zIndex: '-1',
    border: '5px solid #82022b',
    borderRadius: '5px',
    '@media (max-width: 768px)': {
        zIndex: '-1',
    },
};

const defaultCenter = {
    lat: 1.559803,
    lng: 103.637998,
};

const routeKeys = Object.keys(busRoutes);

function UserMap() {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null); // Track the user's location
    const [visibleRoute, setVisibleRoute] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [driverLocations, setDriverLocations] = useState({});
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedDriverLocation, setSelectedDriverLocation] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
    });

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

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

    const handleBusButtonClick = (busId) => {
        // Check if the bus is active
        if (driverLocations[busId]) {
            // Center the map to the selected bus
            const busLocation = driverLocations[busId];
            if (map) {
                map.panTo(busLocation);
            }
        } else {
            // Bus is inactive, handle accordingly (e.g., display a message)
            console.log(`Bus ${busId} is inactive. Cannot center the map.`);
        }
    };


    const updateUserLocation = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    setUserLocation(location);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser or map is not available.');
        }
    };

    const fetchDriverLocations = async () => {
        try {
            const response = await fetch('https://ad-server-js.vercel.app/active-buses');
            if (!response.ok) {
                throw new Error('Failed to fetch active buses from the server');
            }
            const data = await response.json();


            if (data.success) {
                const activeBusesLocations = {};
                data.activeBuses.forEach(({ bus, location }) => {
                    activeBusesLocations[bus] = location;
                });
                setDriverLocations(activeBusesLocations);
                console.log('Active buses locations fetched successfully:', activeBusesLocations);
            } else {
                console.error('Error fetching active buses from the server:', data.message);
            }
        } catch (error) {
            console.error('Error fetching active buses from the server:', error);
        }
    };

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

    useEffect(() => {
        const requestUserLocation = () => {
            if (navigator.geolocation && map) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        setUserLocation(location);
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser or map is not available.');
            }
        };
        // Function to request user's current location
        requestUserLocation();
        updateUserLocation();
        fetchDriverLocations();

        if (isLoaded) {
            onLoad(map);
        }

        const updateLocationInterval = setInterval(() => {
            updateUserLocation();
            fetchDriverLocations();
        }, 500);

        // Clean up the event listener when the component is unmounted
        return () => {
            if (map) {
                onUnmount();
            }
            clearInterval(updateLocationInterval);
        };
    }, [map, isLoaded, onLoad, onUnmount]);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerClick1 = (marker, isDriverLocation) => {
        if (isDriverLocation) {
          setSelectedDriverLocation(marker);
        } else {
          setSelectedMarker(marker);
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
            <UserSideBar />
            <div className={style.mainContentContainer}>
                <div className={styles.rightBottomButton}>
                    <table className={styles.buttontable}>
                        <thead>
                            <tr>
                                <th className={styles.buttonth} colSpan="8">Bus Routes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {routeKeys.slice(0, 8).map((routeKey) => (
                                    <td key={routeKey} className={styles.buttontd}>
                                        <button
                                            onClick={() => handleShowBusRoute(routeKey)}
                                            className={styles.routeButton}
                                            style={{ color: visibleRoute === routeKey ? '#FF0000' : 'inherit' }}
                                        >
                                            {routeKey}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.rightBottomButton2}>
                    <label htmlFor="busActivityDropdown">Bus Activity:</label>
                    <select
                        id="busActivityDropdown"
                        onChange={(e) => handleBusButtonClick(e.target.value)}
                    >
                        {['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'E3', 'F1', 'F2', 'G1', 'G2', 'G3', 'H'].map((busId) => (
                            <option
                                key={busId}
                                value={busId}
                                disabled={!driverLocations[busId]}
                            >
                                {`${busId} - ${driverLocations[busId] ? 'Active' : 'Inactive'}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={containerStyle}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={defaultCenter}
                        zoom={16}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{ mapId: '556e9663519326d5' }}
                        className="google-map"
                    >
                        {selectedRoute && (
                            <Polyline
                                path={selectedRoute}
                                options={{
                                    strokeColor: "#FF0000",
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
                                            url: busStops,
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
                        {userLocation && (
                            <Marker
                                position={userLocation}
                                onClick={() => handleMarkerClick(userLocation)}
                                options={{
                                    icon: {
                                        url: CustomMarker,
                                        scaledSize: new window.google.maps.Size(50, 50),
                                    },
                                }}
                            />
                        )}
                        {Object.keys(driverLocations).map((busId) => (
            <div key={busId}>
              <Marker
                position={driverLocations[busId]}
                icon={{
                  url: busD,
                  scaledSize: new window.google.maps.Size(45, 45),
                }}
                onClick={() => handleMarkerClick1(driverLocations[busId], true)}
              />
              {selectedDriverLocation === driverLocations[busId] && (
                <InfoWindow onCloseClick={() => setSelectedDriverLocation(null)}>
                  <div>
                    <h3>Bus {busId}</h3>
                  </div>
                </InfoWindow>
              )}
            </div>
          ))}
                    </GoogleMap>
                </div>
            </div>
        </div >
    );
}

export default UserMap;
