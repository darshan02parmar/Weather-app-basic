import { motion } from "framer-motion";
import {
    CloudRain, Sun, Snowflake, Zap, Cloud, CloudSun,
    CloudLightning, CloudDrizzle, SunMedium
} from "lucide-react";

export default function ForecastBox({ forecast, unit, weatherType }) {
    const getWeatherIcon = (weatherType) => {
        const type = weatherType.toLowerCase();
        if (type.includes("rain")) return <CloudRain size={24} className="text-blue-400" />;
        if (type.includes("drizzle")) return <CloudDrizzle size={24} className="text-blue-300" />;
        if (type.includes("snow")) return <Snowflake size={24} className="text-blue-100" />;
        if (type.includes("thunderstorm")) return <CloudLightning size={24} className="text-yellow-400" />;
        if (type.includes("clear")) return <Sun size={24} className="text-yellow-500" />;
        if (type.includes("clouds")) return <Cloud size={24} className="text-gray-400" />;
        return <SunMedium size={24} />;
    };

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <motion.div
            className={`forecast-container glass ${weatherType?.toLowerCase()}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
        >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>5-Day Forecast</h3>
            <div className="forecast-grid">
                {forecast.map((day, index) => (
                    <motion.div
                        key={index}
                        className="forecast-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                    >
                        <span className="day">{getDayName(day.dt_txt)}</span>
                        {getWeatherIcon(day.weather[0].main)}
                        <span className="temp">
                            {Math.round(day.main.temp)}°{unit}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                            {day.weather[0].main}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
