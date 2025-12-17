import { apiKey } from './environment.js';

// --- VARIABLES ---
let favorites = []; // Start empty every time (No Local Storage)
let currentCityName = ""; 

const saveBtn = document.getElementById('saveBtn'); // The Star Button
const favoritesList = document.getElementById('favoritesList'); 
const cityNameDisplay = document.getElementById('city-name');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const output = document.getElementById('output'); 

// --- FUNCTION 1: Get Current Weather (By City Name) ---
const fetchWeatherData = async (city = 'Stockton') => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found. Please try again.");
            return;
        }

        console.log("✅ Current Weather (City):", data);

        // --- THE HUGE BLOCK (Paste #1) ---
        // 1. Update the Variable
        currentCityName = data.name;

        // 2. Update the HTML Text
        cityNameDisplay.innerText = data.name;
        document.getElementById('current-temp').innerText = Math.round(data.main.temp) + "°";
        document.getElementById('maxTemp').innerText = Math.round(data.main.temp_max) + "° H";
        document.getElementById('minTemp').innerText = Math.round(data.main.temp_min) + "° L";

        // 3. Update Date
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

        // 4. Update the Star (Check if this city is in favorites)
        updateStarButton(); 
        // ---------------------------------

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
};

// --- FUNCTION 2: Get Weekly Forecast (By City Name) ---
const fetchWeeklyData = async (city = 'Stockton') => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ Weekly Data (City):", data);
        
        if (typeof renderWeeklyForecast === "function") {
            renderWeeklyForecast(data); 
        }

    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
};

// --- FUNCTION 3: Get Weather By Geolocation (Lat/Lon) ---
const getWeatherByCoords = async (lat, lon) => {
    try {
        // 1. Fetch Current Weather
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ Current Weather (Location):", data);

        // --- THE HUGE BLOCK (Paste #2) ---
        // 1. Update the Variable
        currentCityName = data.name;

        // 2. Update the HTML Text
        cityNameDisplay.innerText = data.name;
        document.getElementById('current-temp').innerText = Math.round(data.main.temp) + "°";
        document.getElementById('maxTemp').innerText = Math.round(data.main.temp_max) + "° H";
        document.getElementById('minTemp').innerText = Math.round(data.main.temp_min) + "° L";

        // 3. Update Date
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

        // 4. Update the Star
        updateStarButton();
        // ---------------------------------

        // 2. Fetch Weekly Forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        const forecastResp = await fetch(forecastUrl);
        const forecastData = await forecastResp.json();
        
        if (typeof renderWeeklyForecast === "function") {
            renderWeeklyForecast(forecastData);
        }

    } catch (error) {
        console.error("Error fetching location weather:", error);
    }
};

// --- FAVORITES LOGIC (NO LOCAL STORAGE) ---

const updateStarButton = () => {
    if (favorites.includes(currentCityName)) {
        saveBtn.classList.add('active'); // Turn Star Gold
        saveBtn.innerText = "★";
    } else {
        saveBtn.classList.remove('active'); // Turn Star White
        saveBtn.innerText = "☆";
    }
};

const savedFavoritesList = () => {
    favoritesList.innerHTML = "";

    favorites.forEach(city => {
        let li = document.createElement('li');
        li.className = 'fav-item';

        let textSpan = document.createElement('span');
        textSpan.textContent = city;
        textSpan.style.cursor = "pointer";
        
        // Click name to load city
        textSpan.addEventListener('click', () => {
            fetchWeatherData(city);
            fetchWeeklyData(city);
        });
        
        let deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        
        // Delete button
        deleteBtn.addEventListener('click', () => {
            removeFavorite(city); 
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        favoritesList.appendChild(li); 
    });
};

const removeFavorite = (city) => {
    // Keep everything EXCEPT the city we are removing
    favorites = favorites.filter(item => item !== city);
    
    // Update the visual list and star
    savedFavoritesList();
    updateStarButton();
};

const addFavorite = () => {
    if (!currentCityName) return; 

    if (!favorites.includes(currentCityName)) {
        // Add to array
        favorites.push(currentCityName);
        
        // Update the visual list and star
        savedFavoritesList();
        updateStarButton();
    } else {
        alert("City is already in favorites!");
    }
};

// --- EVENT LISTENERS ---

searchBtn.addEventListener('click', () => {
    if(searchInput.value) {
        fetchWeatherData(searchInput.value);
        fetchWeeklyData(searchInput.value);
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value) {
        fetchWeatherData(searchInput.value);
        fetchWeeklyData(searchInput.value);
        searchInput.value = '';
    }
});

// Star Button Listener
saveBtn.addEventListener('click', addFavorite);

document.getElementById('homeBtn').addEventListener('click', () => {
    fetchWeatherData('');
    fetchWeeklyData('');
});

// --- START UP (GEOLOCATION) ---
window.addEventListener("DOMContentLoaded", () => {
    
    // Check for Geolocation
    if (!navigator.geolocation) {
        if(output) output.textContent = "Geolocation not supported";
        fetchWeatherData('');
        fetchWeeklyData('');
        return;
    }

    if(output) output.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            if(output) output.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
            
            getWeatherByCoords(lat, lon);
        },
        (error) => {
            if(output) output.textContent = "Location access denied.";
            fetchWeatherData('');
            fetchWeeklyData('');
        }
    );
});