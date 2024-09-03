import React from 'react';
import tempIcon from '../assets/temp.png';
import humidIcon from '../assets/humid.png';
import windIcon from '../assets/wind.png';
import sunIcon from '../assets/sun.png';
import timeIcon from '../assets/time.png';
import moonIcon from '../assets/moon.png'; // Assuming this is the night icon

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind, pin, time, isDay, weatherCondition }) => {
  return (
    <div className={`weather-details p-4 rounded-lg flex items-center justify-between ${isDay ? 'bg-yellow-300' : 'bg-blue-700 text-white'}`}>
      <img src={icon} alt="Weather Icon" className="weather-icon w-24 h-24" /><br />
      <div className="weather-info flex justify-between w-full">
        <div className="left-align flex flex-col gap-2">
          <p className="weather-condition">Weather: {weatherCondition}</p> {/* Added weather condition text */}
          <h2 className="city-country text-2xl font-bold">{city}, {country}</h2>
          <p className="coordinates">Latitude: {lat}, Longitude: {log}</p>
          <p className="pin">Pin Code: {pin}</p>
        </div>
        <div className="right-align flex flex-col gap-2">
          <p className="temperature flex items-center">
            <img src={tempIcon} alt="Temperature Icon" className="icon w-6 h-6 mr-2"/> {temp}°C
          </p>
          <p className="humidity flex items-center">
            <img src={humidIcon} alt="Humidity Icon" className="icon w-6 h-6 mr-2"/> {humidity}%
          </p>
          <p className="wind flex items-center">
            <img src={windIcon} alt="Wind Icon" className="icon w-6 h-6 mr-2"/> {wind} m/s
          </p>
          <p className="time flex items-center">
            <img src={timeIcon} alt="Time Icon" className="icon w-6 h-6 mr-2"/>{time}
          </p>
          <p className="day-night flex items-center">
            <img src={isDay ? sunIcon : moonIcon} alt="Day/Night Icon" className="icon w-6 h-6 mr-2"/> {isDay ? 'Day' : 'Night'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
