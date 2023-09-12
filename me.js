const apiKey = '322bfb137ac287fff9b05520f419a1fc';

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            fetchFiveDayForecast(data.coord);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('City not found. Please try again.');
        });
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = `Weather in ${data.name}, ${data.sys.country}`;
    const temperature = (data.main.temp - 273.15).toFixed(2); // Convert to Celsius
    document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
    document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.innerHTML = getWeatherIcon(data.weather[0].icon);
    document.body.className = `weather-${data.weather[0].main.toLowerCase()}`;
}

function getWeatherIcon(iconCode) {
    return `<img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">`;
}

function fetchFiveDayForecast(coord) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayFiveDayForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast:', error);
        });
}

function displayFiveDayForecast(forecastData) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '<h3>5-Day Forecast</h3>';
    for (let i = 0; i < forecastData.length; i += 8) {
        const forecastItem = forecastData[i];
        const date = new Date(forecastItem.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = (forecastItem.main.temp - 273.15).toFixed(2); // Convert to Celsius
        const icon = getWeatherIcon(forecastItem.weather[0].icon);
        const forecastItemHTML = `
            <div class="forecast-item">
                <div>${day}</div>
                <div>${temperature}°C</div>
                <div>${icon}</div>
            </div>
        `;
        forecastElement.innerHTML += forecastItemHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('Hyderabad'); // Replace with your default city name
});
