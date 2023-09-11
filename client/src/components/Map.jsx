import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Map() {
  const restaurants = [
    { id: 1, name: "Restaurant 1", latitude: 42.6977, longitude: 23.3219 },
    { id: 2, name: "Restaurant 2", latitude: 42.6842, longitude: 23.3196 },
  ];

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.latitude, restaurant.longitude]}
        >
          <Popup>{restaurant.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
