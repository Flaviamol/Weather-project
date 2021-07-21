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

  axios.get(apiUrl).then(function (response) {
    console.log(response.data);
    let temperature = Math.round(response.data.main.temp);
    console.log(temperature);
    let currentTemperature = document.querySelector(".current-temperature");
    currentTemperature.innerHTML = `${temperature}°C`;
  });
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

  axios.get(apiUrlGeoLoc).then(function (response) {
    let temperature = Math.round(response.data.main.temp);
    let currentTemperatureElem = document.querySelector(".current-temperature");
    currentTemperatureElem.innerHTML = `${temperature}°C`;

    let currentCity = response.data.name;
    let cityNameElem = document.querySelectorAll(".city-name");
    cityNameElem.forEach(function (element) {
      element.innerHTML = currentCity;
    });
  });
}

let currentCityBtn = document.querySelector("#current-city-btn");
currentCityBtn.addEventListener("click", currentCityTemperature);
