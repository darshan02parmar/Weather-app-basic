import SearchBox from "./SearchBox";
import InfoBox from "./infoBox";
import ForecastBox from "./ForecastBox";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { fetchWeatherByCoords, fetchWeatherByCity } from "./services/weatherService";
import { Skeleton } from "@mui/material";
import "./App.css";

export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "New York",
    humidity: 35,
    pressure: 1012,
    temp: 17,
    tempMax: 17,
    tempMin: 17,
    feelsLike: 17,
    windSpeed: 0,
    visibility: 10000,
    sunrise: 0,
    sunset: 0,
    weatherType: "Clear",
    forecast: []
  });

  const [unit, setUnit] = useState("C");
  const [loading, setLoading] = useState(true);

  // Initial Load: Check for saved city or use Geolocation
  useEffect(() => {
    const initWeather = async () => {
      const savedCity = localStorage.getItem("lastCity");

      if (savedCity) {
        try {
          const data = await fetchWeatherByCity(savedCity);
          setWeatherInfo(data);
          setLoading(false);
          return;
        } catch (err) {
          console.error("Failed to fetch saved city:", err);
        }
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
              setWeatherInfo(data);
              localStorage.setItem("lastCity", data.city);
            } catch (err) {
              console.error("Error fetching weather by geolocation:", err);
            } finally {
              setLoading(false);
            }
          },
          () => {
            console.log("Geolocation denied. Using default.");
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
      }
    };

    initWeather();
  }, []);

  const updateInfo = (newInfo) => {
    setWeatherInfo(newInfo);
    localStorage.setItem("lastCity", newInfo.city);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const convertTemp = (temp) => {
    if (unit === "F") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const displayInfo = {
    ...weatherInfo,
    temp: convertTemp(weatherInfo.temp),
    tempMin: convertTemp(weatherInfo.tempMin),
    tempMax: convertTemp(weatherInfo.tempMax),
    feelsLike: convertTemp(weatherInfo.feelsLike),
    forecast: weatherInfo.forecast.map(day => ({
      ...day,
      main: { ...day.main, temp: convertTemp(day.main.temp) }
    }))
  };

  return (
    <div className="weather-app-container">
      <SearchBox updateInfo={updateInfo} />

      <AnimatePresence mode="wait">
        {loading ? (
          <div key="loader" className="InfoBox">
            <div className="card-main glass" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)', margin: '0 auto' }} />
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '20px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '15px' }} />
                <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '15px' }} />
              </div>
            </div>
          </div>
        ) : (
          <div key={weatherInfo.city} className="InfoBox fade-in">
            <InfoBox
              info={displayInfo}
              unit={unit}
              toggleUnit={toggleUnit}
            />
            {displayInfo.forecast.length > 0 && (
              <ForecastBox forecast={displayInfo.forecast} unit={unit} weatherType={weatherInfo.weatherType} />
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
