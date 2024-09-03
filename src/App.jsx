import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import drizzleIcon from './assets/drizzle.png';
import humidIcon from './assets/humid.png';
import rainIcon from './assets/rain.png';
import snowIcon from './assets/snow.png';
import sunIcon from './assets/sun.png';
import weatherIcon from './assets/weather.png';
import indianCities from './assets/indianCities.json';
import pinCodes from './assets/pinCodes.json';
import Time from './components/Time';
import WeatherDetails from './components/WeatherDetails';

function App() {
  const [icon, setIcon] = useState(weatherIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('IN');
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [pin, setPin] = useState('');
  const [text, setText] = useState('');
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [pinSuggestions, setPinSuggestions] = useState([]);
  const [time, setTime] = useState('');
  const [isDay, setIsDay] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState('');

  const apiKey = 'd4bb545e86807a107010c5538560e391';

  const validateFields = () => {
    if (!text && !pin) {
      toast.error('Please enter either a city name or a pin code.');
      return false;
    }
    if (!text) {
      toast.error('Please enter a city name.');
      return false;
    }
    if (!pin) {
      toast.error('Please enter a pin code.');
      return false;
    }
    return true;
  };

  const search = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      let cityData, pinData;
      let validPin = true;
      let validCity = true;

      if (text) {
        const cityUrl = `http://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=metric`;
        let cityRes = await fetch(cityUrl);
        cityData = await cityRes.json();

        if (cityData.cod === '404' || cityData.cod === '400') {
          validCity = false;
          setCityNotFound(true);
          toast.error('City not found. Please check your input.');
          setLoading(false);
          return;
        } else {
          setCityNotFound(false);
          setIcon(getWeatherIcon(cityData.weather[0].main));
          setTemp(cityData.main.temp);
          setCity(cityData.name);
          setCountry(cityData.sys.country);
          setLat(cityData.coord.lat);
          setLog(cityData.coord.lon);
          setHumidity(cityData.main.humidity);
          setWind(cityData.wind.speed);
          setTime(new Date().toLocaleTimeString());
          setWeatherCondition(cityData.weather[0].description);  // Set weather condition description

          const currentTime = new Date().getTime() / 1000;
          if (currentTime > cityData.sys.sunrise && currentTime < cityData.sys.sunset) {
            setIsDay(true);
          } else {
            setIsDay(false);
          }
        }
      }

      if (pin) {
        const pinUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${pin},IN&appid=${apiKey}&units=metric`;
        let pinRes = await fetch(pinUrl);
        pinData = await pinRes.json();

        if (pinData.cod === '404' || pinData.cod === '400') {
          validPin = false;
          setCityNotFound(true);
          toast.error('Pin code does not match the city. Please check the pin code.');
          setLoading(false);
          return;
        } else {
          setPin(pin);
        }
      } else {
        setPin('');
      }

      if (validCity && validPin) {
        toast.success('Weather details fetched successfully!');
      } else {
        toast.error('Invalid city or pin code combination.');
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      toast.error('An error occurred while fetching weather details.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return sunIcon;
      case 'Rain':
        return rainIcon;
      case 'Snow':
        return snowIcon;
      case 'Clouds':
        return drizzleIcon;
      case 'Haze':
        return humidIcon;
      default:
        return weatherIcon;
    }
  };

  const handleWeather = (e, { newValue }) => {
    setText(newValue);
  };

  const handlePin = (e, { newValue }) => {
    setPin(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(e);
    }
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : indianCities.filter(
      city => city.district.toLowerCase().slice(0, inputLength) === inputValue
    ).slice(0, 3);
  };

  const getPinSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // Filter pin codes based on selected city
    if (city) {
      return pinCodes.filter(pin => pin.district.toLowerCase() === city.toLowerCase() && pin.code.startsWith(inputValue)).slice(0, 3);
    }

    return inputLength === 0 ? [] : pinCodes.filter(
      pin => pin.code.startsWith(inputValue)
    ).slice(0, 3);
  };

  const getSuggestionValue = (suggestion) => suggestion.district;
  const getPinSuggestionValue = (suggestion) => suggestion.code;

  const renderSuggestion = (suggestion) => (
    <div>{suggestion.district}</div>
  );

  const renderPinSuggestion = (suggestion) => (
    <div>{suggestion.code}</div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onPinSuggestionsFetchRequested = ({ value }) => {
    setPinSuggestions(getPinSuggestions(value));
  };

  const onPinSuggestionsClearRequested = () => {
    setPinSuggestions([]);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="container mx-auto p-4 bg-gray-100 text-gray-800 rounded-lg shadow-lg" style={{ maxWidth: '600px' }}>
          <Time />
          <form className="input-container flex items-center mb-4 p-2 gap-2" onSubmit={search}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: 'Enter city',
                value: text,
                className: 'input-city flex-1 p-2 border-2 border-orange-500 rounded-md',
                autoFocus: true,
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                onChange: handleWeather,
                onKeyDown: handleKeyDown,
              }}
              theme={{
                container: 'relative flex-1',
                suggestionsContainer: 'absolute bg-black text-white rounded-2xl mt-1 max-h-32 overflow-y-auto',
                suggestionsList: 'list-none p-0 m-0',
                suggestion: 'p-2 cursor-pointer',
                suggestionHighlighted: 'bg-gray-700'
              }}
            />
            <Autosuggest
              suggestions={pinSuggestions}
              onSuggestionsFetchRequested={onPinSuggestionsFetchRequested}
              onSuggestionsClearRequested={onPinSuggestionsClearRequested}
              getSuggestionValue={getPinSuggestionValue}
              renderSuggestion={renderPinSuggestion}
              inputProps={{
                placeholder: 'Pin-code',
                value: pin,
                className: 'input-city flex-1 p-2 border-2 border-orange-500 rounded-md',
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                onChange: handlePin,
                onKeyDown: handleKeyDown,
              }}
              theme={{
                container: 'relative flex-1',
                suggestionsContainer: 'absolute bg-black text-white rounded-2xl mt-1 max-h-32 overflow-y-auto',
                suggestionsList: 'list-none p-0 m-0',
                suggestion: 'p-2 cursor-pointer',
                suggestionHighlighted: 'bg-gray-700'
              }}
            />
            <button type="submit" className="search p-2 bg-blue-500 text-white font-semibold rounded-md">
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
          {cityNotFound ? (
            <div className="error text-red-500">City or pin code not found</div>
          ) : (
            <WeatherDetails
              icon={icon}
              temp={temp}
              city={city}
              country={country}
              lat={lat}
              log={log}
              humidity={humidity}
              wind={wind}
              pin={pin}
              time={time}
              isDay={isDay}
              weatherCondition={weatherCondition}  // Pass weather condition
            />
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default App;
