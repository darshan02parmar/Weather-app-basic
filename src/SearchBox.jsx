import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { fetchWeatherByCity } from "./services/weatherService";

export default function SearchBox({ updateInfo }) {
  let [city, setcity] = useState("");
  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleChange = (evt) => {
    setcity(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError(false);
      let newInfo = await fetchWeatherByCity(city);
      updateInfo(newInfo);
      setcity("");
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="SearchBox"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <TextField
            fullWidth
            placeholder="Search city..."
            value={city}
            onChange={handleChange}
            disabled={loading}
            className="glass-input"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                color: 'white',
              },
              '& input': { color: 'white', padding: '12px 20px' }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="glass glass-button"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              minWidth: '120px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <Search size={20} />}
          </Button>
        </div>
      </form>
      {error && (
        <motion.p
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          City not found. Please try again.
        </motion.p>
      )}
    </motion.div>
  );
}
