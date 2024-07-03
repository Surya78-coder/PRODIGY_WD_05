// API endpoint and API key
const API_KEY = '58cffa90a84d0ea49d07315f5b2a2922';
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityNameElement = document.querySelector('.city-name');
const weatherDescriptionElement = document.querySelector('.weather-description');
const temperatureElement = document.querySelector('.temp-value');
const humidityElement = document.querySelector('.humidity');
const windSpeedElement = document.querySelector('.wind-speed');
const cloudCoverElement = document.querySelector('.cloud-cover');
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-btn');

// Function to get the user's location
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (error) => {
        reject(error);
      });
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

// Function to fetch weather data
async function fetchWeatherData(latitude, longitude) {
  try {
    const response = await fetch(`${API_ENDPOINT}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Function to update the weather display
function updateWeatherDisplay(weatherData) {
  cityNameElement.textContent = weatherData.name;
  weatherDescriptionElement.textContent = weatherData.weather[0].description;
  temperatureElement.textContent = weatherData.main.temp.toFixed(1);
  humidityElement.textContent = weatherData.main.humidity;
  windSpeedElement.textContent = weatherData.wind.speed.toFixed(1);
  cloudCoverElement.textContent = weatherData.clouds.all;
}

// Function to handle the search button click
async function handleSearch() {
  const location = locationInput.value.trim();
  try {
    let weatherData;
    if (location) {
      weatherData = await fetchWeatherData(location);
    } else {
      const { latitude, longitude } = await getUserLocation();
      weatherData = await fetchWeatherData(latitude, longitude);
    }
    updateWeatherDisplay(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Error fetching weather data. Please try again later.');
  }
}

// Event listener for the search button
searchButton.addEventListener('click', handleSearch);

// Initial weather data fetch
(async () => {
  try {
    const { latitude, longitude } = await getUserLocation();
    const weatherData = await fetchWeatherData(latitude, longitude);
    updateWeatherDisplay(weatherData);
  } catch (error) {
    console.error('Error getting initial weather data:', error);
    alert('Error getting initial weather data. Please try again later.');
  }
})();