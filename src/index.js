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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
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

function getForecast(coordinates) {
  apiGeoUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiGeoUrl).then(displayForecast);
}

function applyWeatherChanges(response) {
  let cityName = document.querySelector("h1");
  cityName.innerHTML = `<span class="city-name">${response.data.name}</span>, Weather`;
  let cityForecast = document.querySelector(".forecast-title");
  cityForecast.innerHTML = `Next forecast for <span class="city-name">${response.data.name}</span>`;

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

  getForecast(response.data.coord);
}

// Forecast

function displayForecast(response) {
  let forecast = response.data.daily;
  // removes the first element (today)
  response.data.daily.shift();
  let forecastElement = document.querySelector("#forecast-day-information");

  let forecastHtml = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHtml += `<div class="col-2 text-center">
              <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
              <br />
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt="clear"
                class="forecast-icon"
              />
              <br />
              <span class="forecast-temp-min">${Math.round(
                forecastDay.temp.min
              )}</span
              ><span class="temp-type">°C</span> /
              <strong
                ><span class="forecast-temp-max">${Math.round(
                  forecastDay.temp.max
                )}</span
                ><span class="temp-type">°C</span></strong
              >
            </div>`;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

currentCityBtn.click();

//celsius and fahrenheit
function dislplayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".current-temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitTemperature;
}

function dislplaycelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".current-temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", dislplayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", dislplaycelsiusTemperature);
