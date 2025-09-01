import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function WeatherMarker({ setWeather }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
  click: async (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);

    const apiKey = "895284fb2d2c50a520ea537456963d9c";

    // 1️⃣ Fetch weather by coordinates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // 2️⃣ Fetch nearest city name using reverse geocoding
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    setWeather({
      name: geoData[0]?.name || "Unknown Location",
      temp: weatherData.main?.temp,
      condition: weatherData.weather?.[0]?.description,
      lat,
      lng,
    });
  },
});


  return position ? (
    <Marker position={position}>
      <Popup>📍 Location Selected</Popup>
    </Marker>
  ) : null;
}

export default function App() {
  const [weather, setWeather] = useState(null);

  return (
    <div className="h-screen w-full relative flex flex-col">
      {/* Header */}
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 shadow-md ">
  {/* Top Row: Logo + Heading + Socials */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 ">
    {/* Logo + Heading */}
   <div className="flex justify-center md:justify-start items-center gap-2 bg-white text-blue-900 rounded-3xl py-2 px-4 w-fit mx-auto md:mx-0">
  <img 
    src="/public/WOM.png" 
    alt="WeatherOnMap Logo" 
    className="h-10 md:h-10 lg:h-12"
  />
  <h2 className="text-xl md:text-2xl font-bold">
    Weather on Map
  </h2>
</div>

    {/* Social Container */}
    <div className="flex gap-4 md:gap-4 justify-center items-center md:items-center md:justify-center text-lg">
      <h4 className=" font-semibold">affan.dev :</h4>
      <a
        href="https://github.com/Affan-30"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-black transition"
      >
        <FaGithub size={25} />
      </a>
      <a
        href="https://linkedin.com/in/affan3006"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-400  transition"
      >
        <FaLinkedin size={25}/>
      </a>
      <a
        href="https://instagram.com/_affan30_"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-pink-400 transition"
      >
        <FaInstagram size={25}/>
      </a>
    </div>
  </div>

  {/* Subtitle (always below top row) */}
  <p className="text-xs sm:text-sm md:text-sm opacity-80 mt-2 ml-1 md:ml-0 text-center md:text-left">
    Click anywhere on the map to check weather
  </p>
</header>




      {/* Map */}
      <div className="flex-grow">
        <MapContainer
          center={[20, 77]} // Default India center
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <WeatherMarker setWeather={setWeather} />
        </MapContainer>
      </div>

      {/* Weather Card */}
      {weather && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm md:max-w-md p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40 text-center md:justify-center md:items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {weather.name}
          </h2>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            🌡 {weather.temp}°C
          </p>
          <p className="capitalize text-gray-800 mt-1">
            ☁ {weather.condition}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Lat: {weather.lat.toFixed(2)} | Lng: {weather.lng.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

// 