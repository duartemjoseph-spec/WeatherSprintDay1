import { apiKey } from './environment.js';

// --- VARIABLES ---
let favorites = []; 
const saveBtn = document.getElementById('saveBtn');
const favoritesList = document.getElementById('favoritesList'); 
const cityNameDisplay = document.getElementById('city-name');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');


// --- FUNCTION 1: Get Current Weather ---
const fetchWeatherData = async (city = 'Stockton') => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("✅ Current Weather:", data);

    // Update the HTML
    cityNameDisplay.innerHTML = `${data.name} <button id="saveBtn" class="star-btn">★</button>`;
    
    if (favorites.includes(data.name)) {
        document.getElementById('saveBtn').classList.add('active');
    }

    // Add Click Listener to the new Star Button
    document.getElementById('saveBtn').addEventListener('click', () => {
        const currentCity = data.name;
        
        if (!favorites.includes(currentCity)) {
            favorites.push(currentCity);
            Favorites(); 
            document.getElementById('saveBtn').classList.add('active'); 
        } else {
            alert("City is already in favorites!");
        }
    });

    // Update Temps
    document.getElementById('current-temp').innerText = Math.round(data.main.temp) + "°";
    document.getElementById('maxTemp').innerText = Math.round(data.main.temp_max) + "° H";
    document.getElementById('minTemp').innerText = Math.round(data.main.temp_min) + "° L";

    // Update Date
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

    return data;
};


// --- FUNCTION 2: Get Weekly Forecast ---
const fetchWeeklyData = async (city = 'Stockton') => {
    console.log(`Fetching weekly forecast for ${city}...`);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("✅ Weekly Data Received:", data);
    return data;
};


// --- FAVORITES FEATURE ---
const Favorites = () => {
    favoritesList.innerHTML = "";

    favorites.forEach(city => {
        let li = document.createElement('li');
        li.className = 'fav-item';

        let textSpan = document.createElement('span');
        textSpan.textContent = city;
        
        let deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';

        deleteBtn.addEventListener('click', () => {
            removeFavorite(city); 
        });

        // Click list item to load that city
        li.addEventListener('click', () => {
            fetchWeatherData(city);
            fetchWeeklyData(city);
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        favoritesList.appendChild(li); 
    });
};

// Remove a favorite
const removeFavorite = (city) => {
    favorites = favorites.filter(item => item !== city);
    Favorites(); 
        if(cityNameDisplay && cityNameDisplay.childNodes[0]) {
        const currentCity = cityNameDisplay.childNodes[0].textContent();
        if (currentCity === city) {
            const btn = document.getElementById('saveBtn');
            if(btn) btn.classList.remove('active');
        }
    }
};

const loadCity = (city) => {
    fetchWeatherData(city);
    fetchWeeklyData(city);
};

// --- EVENT LISTENERS ---
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityToSearch = searchInput.value;
        fetchWeatherData(cityToSearch);
        fetchWeeklyData(cityToSearch);
        searchInput.value = ''; 
    }
});

searchBtn.addEventListener('click', () => {
    const cityToSearch = searchInput.value;
    fetchWeatherData(cityToSearch);
    fetchWeeklyData(cityToSearch);
    searchInput.value = ''; 
});

// --- GEOLOCATION ---
const output = document.getElementById('output');
window.addEventListener("DOMContentLoaded", () => {
    if (!navigator.geolocation) {
        output.textContent = "Geolocation is not supported by your browser.";
        return;
    }
    output.textContent = "Getting your location...";
    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            output.textContent = `Lat: ${latitude}, Long: ${longitude}`;
        },
        // Error callback
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    output.textContent = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    output.textContent = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    output.textContent = "The request to get user location timed out.";
                    break;
                default:
                    output.textContent = "An unknown error occurred.";
            }
        }
    );
});


fetchWeatherData();
fetchWeeklyData();