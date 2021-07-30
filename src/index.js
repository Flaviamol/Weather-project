let now = new Date();

const apiKey = "49d65f3e3cd6a2a73473bcfc10a0a319";
const units = "metric";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let currentDay = document.querySelector(".current-subtitle");
currentDay.innerHTML = `${day} ${hours}:${minutes}`;

function changeCity(event) {
  event.preventDefault();
  let newCityName = document.querySelector(".input-search");
  let cityName = document.querySelector("h1");
  cityName.innerHTML = `<span class="city-name">${newCityName.value}</span>, Weather`;
  let cityForecast = document.querySelector(".forecast-title");
  cityForecast.innerHTML = `Next forecast for <span class="city-name">${newCityName.value}</span>`;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCityName.value}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(applyWeatherChanges);
}

let inputCity = document.querySelector("#search-city");
inputCity.addEventListener("submit", changeCity);

function currentCityTemperature(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPositionAndTemperature);
}

function currentPositionAndTemperature(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrlGeoLoc = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrlGeoLoc).then(applyWeatherChanges);
}

let currentCityBtn = document.querySelector("#current-city-btn");
currentCityBtn.addEventListener("click", currentCityTemperature);

function applyWeatherChanges(response) {
  let currentTempMin = document.querySelector(".temperature-Min");
  currentTempMin.innerHTML = Math.round(response.data.main.temp_min);
  let currentTempMax = document.querySelector(".temperature-Max");
  currentTempMax.innerHTML = Math.round(response.data.main.temp_max);
  let currentFeelLike = document.querySelector(".feel-like");
  currentFeelLike.innerHTML = ` ${Math.round(response.data.main.feels_like)}°`;
  let currentHumidity = document.querySelector(".humidity");
  currentHumidity.innerHTML = ` ${response.data.main.humidity}%`;
  let currentWind = document.querySelector(".wind-speed");
  currentWind.innerHTML = `WSW ${Math.round(response.data.wind.speed)} km/h`;
  let currentDescription = document.querySelector("h3");
  currentDescription.innerHTML = response.data.weather[0].description;
  let currentIcon = document.querySelector(".current-icon");
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

// Forecast
