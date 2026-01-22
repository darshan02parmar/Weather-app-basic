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

  return (
    <motion.div
      className={`card-main glass fade-in ${info.weatherType.toLowerCase()}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <button className="unit-toggle" onClick={toggleUnit}>
        Switch to °{unit === "C" ? "F" : "C"}
      </button>

      <div className="city-info">
        <h2>{info.city}</h2>
        <p className="weather-type">{info.weatherType}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
        {getWeatherIcon(info.weatherType, info.temp)}
        <h1 className="temp-main">{Math.round(info.temp)}°{unit}</h1>
      </div>

      <div className="temp-range">
        <span>High: {Math.round(info.tempMax)}°</span>
        <span>Low: {Math.round(info.tempMin)}°</span>
      </div>

      <div className="card-details" style={{ marginTop: '2rem' }}>
        <div className="detail-item glass">
          <Droplets size={24} color="#60a5fa" />
          <span>{info.humidity}%</span>
          <label>Humidity</label>
        </div>
        <div className="detail-item glass">
          <Wind size={24} color="#94a3b8" />
          <span>{info.windSpeed} km/h</span>
          <label>Wind Speed</label>
        </div>
        <div className="detail-item glass">
          <Eye size={24} color="#a78bfa" />
          <span>{info.visibility / 1000} km</span>
          <label>Visibility</label>
        </div>
        <div className="detail-item glass">
          <Gauge size={24} color="#f472b6" />
          <span>{info.pressure} hPa</span>
          <label>Pressure</label>
        </div>
      </div>
    </motion.div>
  );
}
