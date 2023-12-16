import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import styles from './UserMap.module.css';
import CustomMarker from '../../../assets/currentLocation.png';
import UserSideBar from './UserSideBar';

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

function UserMap() {
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null); // Track the user's location

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
    
                        // Center the map to the user's location
                        map.panTo(location);
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
    
        // Set up an event listener to refresh the user's location when the map is loaded
        if (isLoaded) {
            onLoad(map);
        }
    
        // Clean up the event listener when the component is unmounted
        return () => {
            if (map) {
                onUnmount();
            }
        };
    }, [map, isLoaded, onLoad, onUnmount]);

    const handleMarkerClick = (marker) => {
        // Handle marker click if needed
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
        </div>
    );
}

export default UserMap;
