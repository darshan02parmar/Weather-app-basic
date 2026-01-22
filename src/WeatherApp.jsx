import SearchBox from "./SearchBox";
import InfoBox from "./infoBox";
import ForecastBox from "./ForecastBox";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { fetchWeatherByCoords } from "./services/weatherService";
import "./App.css";

export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "New York",
    humidity: 35,
    pressure: 1012,
    temp: 17,
    tempMax: 17,
    tempMin: 17,
    windSpeed: 0,
    visibility: 10000,
    weatherType: "Clear",
    forecast: []
  });

  const [unit, setUnit] = useState("C");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            setWeatherInfo(data);
          } catch (err) {
            console.error("Error fetching weather by geolocation:", err);
          } finally {
            setLoading(false);
          }
        },
        () => {
          console.log("Geolocation denied or failed. Using default.");
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const updateInfo = (newInfo) => {
    setWeatherInfo(newInfo);
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
    forecast: weatherInfo.forecast.map(day => ({
      ...day,
      main: { ...day.main, temp: convertTemp(day.main.temp) }
    }))
  };

  return (
    <div className="weather-app-container">
      <SearchBox updateInfo={updateInfo} />

      {loading ? (
        <div className="loading-container glass">Searching for your location...</div>
      ) : (
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      )}
    </div>
  );
}
