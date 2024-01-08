// geolocationWorker.js

let watchId = null;

// Listen for messages from the main thread
onmessage = function (event) {
  const command = event.data;

  switch (command) {
    case 'start':
      startLocationUpdates();
      break;
    case 'stop':
      stopLocationUpdates();
      break;
    default:
      console.error('Unknown command:', command);
  }
};

// Function to start geolocation updates
function startLocationUpdates() {
  if ('geolocation' in navigator) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Watch for position updates
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Send the location to the main thread
        postMessage(location);
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      },
      options
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

// Function to stop geolocation updates
function stopLocationUpdates() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}
