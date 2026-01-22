import { motion } from "framer-motion";
import {
  Thermometer, Droplets, Gauge, Wind, Eye,
  CloudRain, Sun, Snowflake, Zap, Cloud,
  CloudSun, CloudLightning, SunMedium
} from "lucide-react";

export default function InfoBox({ info, unit, toggleUnit }) {
  const getWeatherIcon = (weatherType, temp) => {
    const type = weatherType.toLowerCase();
    if (type.includes("rain")) return <CloudRain size={48} className="text-blue-400" />;
    if (type.includes("snow")) return <Snowflake size={48} className="text-blue-100" />;
    if (type.includes("thunderstorm")) return <CloudLightning size={48} className="text-yellow-400" />;
    if (type.includes("cloud")) return <Cloud size={48} className="text-gray-300" />;
    if (type.includes("clear")) return <Sun size={48} className="text-yellow-500" />;
    return <SunMedium size={48} />;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      className={`card-main glass fade-in ${info.weatherType.toLowerCase()}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <button className="unit-toggle" onClick={toggleUnit}>
        °{unit === "C" ? "F" : "C"}
      </button>

      <div className="city-info">
        <h2>{info.city}</h2>
        <p className="weather-type">{info.weatherType}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', margin: '0.5rem 0' }}>
        {getWeatherIcon(info.weatherType, info.temp)}
        <h1 className="temp-main">{Math.round(info.temp)}°{unit}</h1>
      </div>

      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>
        Feels like {Math.round(info.feelsLike)}°
      </p>

      <div className="temp-range">
        <span>H: {Math.round(info.tempMax)}°</span>
        <span>L: {Math.round(info.tempMin)}°</span>
      </div>

      <div className="card-details" style={{ marginTop: '1.5rem' }}>
        <div className="detail-item glass">
          <Droplets size={22} color="#60a5fa" />
          <span>{info.humidity}%</span>
          <label>Humidity</label>
        </div>
        <div className="detail-item glass">
          <Wind size={22} color="#94a3b8" />
          <span>{info.windSpeed} <small style={{ fontSize: '0.6rem' }}>km/h</small></span>
          <label>Wind</label>
        </div>
        <div className="detail-item glass">
          <Sun size={22} color="#fbbf24" />
          <span>{formatTime(info.sunrise)}</span>
          <label>Sunrise</label>
        </div>
        <div className="detail-item glass">
          <CloudSun size={22} color="#f87171" />
          <span>{formatTime(info.sunset)}</span>
          <label>Sunset</label>
        </div>
      </div>
    </motion.div>
  );
}
