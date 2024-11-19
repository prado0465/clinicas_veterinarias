import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
  } from "@react-google-maps/api";
  import { useState, useEffect, useContext } from "react";
  import { Header } from "../../components/Header/index.js";
  import { UserContext } from "../../context/UserContext/UserContext.js";

  
  export function Home() {
    const [map, setMap] = useState(null);
    const [distanceToClinic, setDistanceToClinic] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapCenter, setMapCenter] = useState({
      lat: -28.2624,
      lng: -52.396032,
    });
    const [markers, setMarkers] = useState([]);
    const { user } = useContext(UserContext);
  
    const containerStyle = {
      width: "100%",
      height: "100%",
      borderRadius: "20px",
    };
  
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: "AIzaSyCrCHttleOZy9bn48duEE2lxVbGQP-joBI",
    });
  
    const onLoad = (map) => {
      const bounds = new window.google.maps.LatLngBounds(mapCenter);
      map.fitBounds(bounds);
      setMap(map);
    };
  
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  
    useEffect(() => {
      fetch("https://apibase2-0bttgosp.b4a.run/ws/foco", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const clinics = data.map(({ latitude, longitude }) => ({
            lat: latitude,
            lng: longitude,
          }));
  
          
          const nearbyClinics = clinics.filter((clinic) => {
            const distance = haversineDistance(
              mapCenter.lat,
              mapCenter.lng,
              clinic.lat,
              clinic.lng
            );
            return distance <= 10;
          });
  
          setMarkers(nearbyClinics);
        })
        .catch((error) => {
          console.error("Erro ao buscar clínicas:", error);
          alert("Erro ao buscar clínicas cadastradas");
        });
    }, [mapCenter, user]);
  
    const handleMarkerClick = (marker) => {
      const distance = haversineDistance(
        mapCenter.lat,
        mapCenter.lng,
        marker.lat,
        marker.lng
      );
  
      setSelectedMarker(marker);
      setDistanceToClinic(distance.toFixed(2));
    };

    return (
      <>
        <Header />
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={10}
            onLoad={onLoad}
            onUnmount={() => setMap(null)}
          >
            {markers.map((marker, key) => (
              <Marker
                key={key}
                position={marker}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
  
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h4>Clínica Veterinária</h4>
                  <p>Distância: {distanceToClinic} km</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </>
    );
  }
  