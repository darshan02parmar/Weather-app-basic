const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const fetchWeatherByCity = async (city) => {
    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`),
            fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        ]);

        return await processResponses(weatherRes, forecastRes);
    } catch (err) {
        throw err;
    }
};

export const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        ]);

        return await processResponses(weatherRes, forecastRes);
    } catch (err) {
        throw err;
    }
};

async function processResponses(weatherRes, forecastRes) {
    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    const dailyForecast = forecastData.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5);

    return {
        city: weatherData.name,
        temp: weatherData.main.temp,
        tempMin: weatherData.main.temp_min,
        tempMax: weatherData.main.temp_max,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
        visibility: weatherData.visibility,
        weatherType: weatherData.weather[0].main,
        forecast: dailyForecast
    };
}
