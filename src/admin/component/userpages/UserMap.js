import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import styles from './UserMap.module.css';
import CustomMarker from '../../../assets/currentLocation.png';
import busStops from '../../../assets/bus-stop.png';
import UserSideBar from './UserSideBar';
import busRoutes from '../pages/busRoutes';
import '../pages/LocationTracker.css'
import busStopsLocation from '../../component/pages/BusStopLocation'

const containerStyle = {
    width: '60%',
    height: '600px',
    position: 'absolute',
    top: '40px',
    left: '250px',
    padding: '20px',
};

const defaultCenter = {
    lat: 1.559803,
    lng: 103.637998,
};

const routeKeys = Object.keys(busRoutes);

const staticMarkers = Object.keys(busStopsLocation);

function UserMap() {
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null); // Track the user's location
    const [visibleRoute, setVisibleRoute] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);

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

    const updateUserLocation = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    setUserLocation(location);
                    //sendUserLocationToServer(location);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser or map is not available.');
        }
    };

    const sendUserLocationToServer = (location) => {
        // Use fetch or Axios to send a POST request to your server
        fetch('https://ad-server-js.vercel.app/location', {
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
        // Function to request user's current location
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

        // Request user's location when the component mounts
        requestUserLocation();
        updateUserLocation();

        const updateLocationInterval = setInterval(updateUserLocation, 400);

        // Set up an event listener to refresh the user's location when the map is loaded
        if (isLoaded) {
            onLoad(map);
        } 

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

    if (loadError) {
        return <p>Error loading map: {loadError.message}</p>;
    }

    if (!isLoaded) {
        return <p>Loading map...</p>;
    }

    return (
        <div>
            <div>
                <div className={styles.sidebar}>
                    <UserSideBar />
                </div>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button className={styles.adminLoginButton}>
                        <Link to='/login' className={styles.hover}>Admin Login</Link>
                    </button>
                </div>
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
                                strokeColor: "#FF0000", // Change the color as needed
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
                    {/* Display the user's current location marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            onClick={() => handleMarkerClick(userLocation)}
                            options={{
                                icon: {
                                    url: CustomMarker,
                                    scaledSize: new window.google.maps.Size(60, 60),
                                },
                            }}
                        />
                    )}
                    {/* Your other markers and polylines go here */}
                </GoogleMap>
            </div>

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

export default UserMap;
