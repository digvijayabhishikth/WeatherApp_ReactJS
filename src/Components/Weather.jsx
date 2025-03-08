import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import sunny from '../assets/sun.png';
import windy from '../assets/windy.png';
import humid from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  
  const [weatherData, setWeatherData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Function to fetch weather data from API
  const search = async (city) => {
    if (city === '') {
      alert('Enter city name');
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message);
        return;
      }
      console.log(data);
      const icon = data.weather[0].icon || sunny;
      setWeatherData({
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      });
    } catch (error) {
      setWeatherData(null);
      console.error(`${error} Error in fetching data`);
    }
  };

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    
    return () => clearTimeout(timer);
  }, [inputValue]);

  
  useEffect(() => {
    if (debouncedValue) {
      search(debouncedValue);
    }
  }, [debouncedValue]);

  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          className="searchInput"
          type="text"
          placeholder="Search for City"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          value={inputValue}
        />
        <div>
          <span
            className="material-icons-outlined search-icon"
            onClick={() => search(inputRef.current.value)}
          >
            search
          </span>
        </div>
      </div>

      {weatherData ? (
        <>
          <img className="weatherIcon" src={weatherData.icon} alt="Sunny Weather image" />
          <span className="desc">{weatherData.description}</span>
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="specs">
              <img src={humid} className="humidity" alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%<span>Humidity</span></p>
              </div>
            </div>
            <div className="specs">
              <img src={windy} alt="Windy" />
              <div>
                <p>{weatherData.windSpeed} km/h <span>Wind Speed</span></p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Weather;