import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline, mapId } from '@react-google-maps/api';
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
  { position: { lat: 1.5626948582674094, lng: 103.63913654898062 }, name: 'N24' },
  { position: { lat: 1.5603335706721926, lng: 103.64158337666292 }, name: 'P19' },
  { position: { lat: 1.5579997226065976, lng: 103.64022169009499 }, name: 'FKE' },
  { position: { lat: 1.561264743364688, lng: 103.63656142789215 }, name: 'D01' },
  { position: { lat: 1.5615944858197506, lng: 103.63788622412557 }, name: 'D05' },
  { position: { lat: 1.5610828431095982, lng: 103.63938375441512 }, name: 'D06' },
  { position: { lat: 1.5597934647349028, lng: 103.64023198090993 }, name: 'FKM' },
  { position: { lat: 1.562936701100379, lng: 103.63445242438802 }, name: 'Galeri Siswa' },
  { position: { lat: 1.5627086675590907, lng: 103.63371663411134 }, name: 'M47 FKA' },
  { position: { lat: 1.5643049534446607, lng: 103.63610083280307 }, name: 'KTDI 1' },
  { position: { lat: 1.565417619661972, lng: 103.63474853988065 }, name: 'KTDI 2' },
  { position: { lat: 1.5650261632665665, lng: 103.63408603425545 }, name: 'KTDI 3' },
  { position: { lat: 1.5643903339996748, lng: 103.63199008436337 }, name: 'KTHO 1' },
  { position: { lat: 1.5641559871406108, lng: 103.63001114274475 }, name: 'KTHO 2' },
  { position: { lat: 1.5630614695886158, lng: 103.63030683669072 }, name: 'KTHO 3' },
  { position: { lat: 1.5566240984619724, lng: 103.64265398120011 }, name: 'KTC 1' },
  { position: { lat: 1.557163780980274, lng: 103.64460804863758 }, name: 'KTC 2' },
  { position: { lat: 1.5550735791790977, lng: 103.64436190624637 }, name: 'KTC 3' },
  { position: { lat: 1.555303544104901, lng: 103.64635970136622 }, name: 'KTC 4' },
  { position: { lat: 1.5548746884774363, lng: 103.6481206383835 }, name: 'KTC 5' },
  { position: { lat: 1.56065612985083, lng: 103.6489486679352 }, name: 'K10' },
  { position: { lat: 1.5587169453312855, lng: 103.64928607410961 }, name: 'K9' },
  { position: { lat: 1.5644510049424385, lng: 103.65342512137904 }, name: 'T02' },
  { position: { lat: 1.56294159971074, lng: 103.65491863373651 }, name: 'Senai' },
  { position: { lat: 1.5600262825573668, lng: 103.65579333466705 }, name: 'FM' },
  { position: { lat: 1.5567385130069766, lng: 103.64755398760182 }, name: 'KP' },
  { position: { lat: 1.5644306398717538, lng: 103.63842002374014 }, name: 'FKT' },
  { position: { lat: 1.5665533254432862, lng: 103.64036316383651 }, name: 'N29' },
  { position: { lat: 1.5757059386867645, lng: 103.61964077715756 }, name: 'KDOJ 1' },
  { position: { lat: 1.5751600074453354, lng: 103.6181358780248 }, name: 'KDOJ 2' },
];

const busData = [
  {
    id: 1,
    position: { lat: 1.5586928453191957, lng: 103.63528569782638 },
    route: [
      [1.55969, 103.63487], //Fabu Bus Stop
      [1.55999, 103.63485],
      [1.56047, 103.63487],
      [1.56077, 103.63497],
      [1.56076, 103.63458],
      [1.56074, 103.63448],
      [1.56041, 103.63403],
      [1.56067, 103.63376],
      [1.56096, 103.63318],
      [1.56115, 103.63278],
      [1.56123, 103.63257], //Cengal Bus Stop
      [1.56161, 103.63163],
      [1.56176, 103.63122],
      [1.56183, 103.63100],
      [1.56184, 103.63072],
      [1.56178, 103.62952], //Another Bus Stop (dont know name)
      [1.56172, 103.62835],
      [1.56177, 103.62814],
      [1.56185, 103.62798],
      [1.56198, 103.62785],
      [1.56217, 103.62774],
      [1.56342, 103.62755],
      [1.56400, 103.62751],
      [1.56428, 103.62753],
      [1.56465, 103.62772],
      [1.56486, 103.62792],
      [1.56500, 103.62815],
      [1.56510, 103.62843],
      [1.56512, 103.62875],
      [1.56509, 103.62888],
      [1.56501, 103.62900],
      [1.56486, 103.62913],
      [1.56463, 103.62922],
      [1.56428, 103.62933],
      [1.56344, 103.62951],
      [1.56321, 103.62955],
      [1.56206, 103.62970],
      [1.56220, 103.63000],
      [1.56231, 103.63015],
      [1.56253, 103.63033],
      [1.56272, 103.63038],
      [1.56293, 103.63040],
      [1.56319, 103.63039],
      [1.56397, 103.63018],
      [1.56411, 103.63012],
      [1.56435, 103.62993],
      [1.56452, 103.62977],
      [1.56462, 103.62969],
      [1.56476, 103.62961],
      [1.56505, 103.62959],
      [1.56515, 103.62962],
      [1.56537, 103.62974],
      [1.56558, 103.62994],
      [1.56567, 103.63009],
      [1.56578, 103.63036],
      [1.56581, 103.63072],
      [1.56578, 103.63098],
      [1.56574, 103.63115],
      [1.56566, 103.63132],
      [1.56549, 103.63151],
      [1.56535, 103.63161],
      [1.56518, 103.63168],
      [1.56443, 103.63192],
      [1.56417, 103.63203],
      [1.56395, 103.63223],
      [1.56375, 103.63245],
      [1.56360, 103.63278],
      [1.56348, 103.63297],
      [1.56312, 103.63332],
      [1.56335, 103.63348],
      [1.56375, 103.63373],
      [1.56441, 103.63376],
      [1.56452, 103.63378],
      [1.56466, 103.63384],
      [1.56481, 103.63395],
      [1.56501, 103.63418],
      [1.56511, 103.63434],
      [1.56527, 103.63464],
      [1.56536, 103.63492],
      [1.56539, 103.63525],
      [1.56540, 103.63580],
      [1.56533, 103.63599],
      [1.56526, 103.63606],
      [1.56515, 103.63613],
      [1.56502, 103.63615],
      [1.56489, 103.63616],
      [1.56459, 103.63613],
      [1.56436, 103.63606],
      [1.56416, 103.63594],
      [1.56373, 103.63555],
      [1.56361, 103.63548],
      [1.56319, 103.63538],
      [1.56307, 103.63559],
      [1.56292, 103.63575],
      [1.56246, 103.63616],
      [1.56200, 103.63572],
      [1.56140, 103.63531],
      [1.56128, 103.63524],
      [1.56101, 103.63512],
      [1.56093, 103.63515],
      [1.56085, 103.63521],
      [1.56077, 103.63535],
      [1.56077, 103.63543],
      [1.56079, 103.63555],
      [1.56084, 103.63573],
      [1.56092, 103.63596],
      [1.56124, 103.63675],
      [1.56156, 103.63755],
      [1.56158, 103.63767],
      [1.56158, 103.63780],
      [1.56156, 103.63792],
      [1.56124, 103.63865],
      [1.56115, 103.63905],
      [1.56089, 103.63964],
      [1.56067, 103.63981],
      [1.55972, 103.64019],
      [1.55894, 103.64051],
      [1.55882, 103.64058],
      [1.55815, 103.64027], //FKE Bus Stop
      [1.55766, 103.63990],
      [1.55733, 103.63954],
      [1.55709, 103.63907],
      [1.55696, 103.63864],
      [1.55697, 103.63820],
      [1.55698, 103.63808],
      [1.55703, 103.63768],
      [1.55711, 103.63740],
      [1.55717, 103.63726],
      [1.55738, 103.63687],
      [1.55783, 103.63621],
      [1.55816, 103.63584],
      [1.55849, 103.63552],
      [1.55887, 103.63519],
      [1.55921, 103.63498],
      [1.55940, 103.63492],
      [1.55969, 103.63487],
    ]
  },
  // Add more buses with their routes as needed
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
          options={{ mapId: "556e9663519326d5" }}
          className="google-map"
        >
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
              {selectedMarker === bus && (
                <Polyline
                  path={bus.route.map(([lat, lng]) => ({ lat, lng }))}
                  options={{
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                  }}
                />
              )}
            </div>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}


export default LocationTracker;
