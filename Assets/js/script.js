document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let cityName = document.getElementById('search-input').value;
    cityName = capitalizeCityName(cityName);
    fetchCityCoords(cityName);
});

const apiKey = '2a3b66519cce63a1a2cb339f50321024';

// Event Listener to load search log from local storage upon page loading
document.addEventListener('DOMContentLoaded', renderSearchLog);

// Helper Function to Capitalize City Names - referenced from Stack Overflow/W3
function capitalizeCityName(cityName) {
    return cityName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function fetchCityCoords(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon, cityName);
            } else {
                alert('City not found, please try again...');
            }
        })
        .catch(error => console.error('Error fetching valid coordinates', error));
}

function getWeatherData(lat, lon, cityName) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data, cityName);
            forecastSearchLog(cityName);
        })
        .catch(error => console.error('Error fetching forecasted weather data for that city', error));
}

function displayForecast(data, cityName) {
    const contentSection = document.querySelector('.content');
    contentSection.innerHTML = `
        <h2>Current Weather in ${cityName}</h2>
        <p>Date: ${new Date(data.list[0].dt_txt).toLocaleDateString()}</p>
        <p>Temperature: ${data.list[0].main.temp} °F</p>
        <p>Humidity: ${data.list[0].main.humidity} %</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="weather icon">
        <h2>5-Day Forecast</h2>
    `;

    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        const forecast = data.list[i * 8];
        cards[i].querySelector('.card-title').innerText = new Date(forecast.dt_txt).toLocaleDateString();
        cards[i].querySelector('.card-img-top').src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        cards[i].querySelector('.temperature').innerText = `Temp: ${forecast.main.temp} °F`;
        cards[i].querySelector('.wind').innerText = `Wind: ${forecast.wind.speed} mph`;
        cards[i].querySelector('.humidity').innerText = `Humidity: ${forecast.main.humidity} %`;
    }
}

function forecastSearchLog(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        appendToSearchLog(cityName);
    }
}

function appendToSearchLog(cityName) {
    const searchHistory = document.getElementById('history');
    const cityButton = document.createElement('button');
    cityButton.innerText = cityName;
    cityButton.classList.add('list-group-item', 'list-group-item-action');
    cityButton.addEventListener('click', () => {
        fetchCityCoords(cityName);
    });
    searchHistory.appendChild(cityButton);
}

function renderSearchLog() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(cityName => {
        appendToSearchLog(cityName);
    });
}