document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('search-input').value;
    getCityCoord(cityName);
});

const apiKey = '2a3b66519cce63a1a2cb339f50321024';

function getCityCoord(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon, cityName);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

function getWeatherData(lat, lon, cityName) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data, cityName);
            updateSearchHistory(cityName);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayForecast(data, cityName) {
    const contentSection = document.querySelector('.content');
    contentSection.innerHTML = `
        <h2>Current Weather in ${cityName}</h2>
        <p>Date: ${new Date(data.list[0].dt_txt).toLocaleDateString()}</p>
        <p>Temperature: ${data.list[0].main.temp} °F</p>
        <p>Humidity: ${data.list[0].main.humidity} %</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="Weather icon">
        
        <h2>5-Day Forecast</h2>
    `;

    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        const forecast = data.list[i * 8];
        cards[i].querySelector('.card-title').innerText = new Date(forecast.dt_txt).toLocaleDateString();
        cards[i].querySelector('.card-img-top').src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        cards[i].querySelector('.temperature').innerText = `Temp: ${forecast.main.temp} °F`;
        cards[i].querySelector('.wind').innerText = `Wind: ${forecast.wind.speed} m/s`;
        cards[i].querySelector('.humidity').innerText = `Humidity: ${forecast.main.humidity} %`;
    }
}

function citySearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName)
    }
