// --- VARIABLES ---
let favorites = []; 
const saveBtn = document.getElementById('saveBtn');
const favoritesList = document.getElementById('favoritesList');
const cityNameDisplay = document.getElementById('city-name');
const searchInput = document.getElementById('searchInput');


const fetchWeatherData = async (city = 'Stockton') => {
    // 1. Fetch the data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("✅ Current Weather:", data);

    // 2. Update the HTML
    cityNameDisplay.innerHTML = `${data.name} <button id="saveBtn" class="star-btn">★</button>`;
    
    document.getElementById('saveBtn').addEventListener('click', () => {
        const currentCity = data.name;
        if (!favorites.includes(currentCity)) {
            favorites.push(currentCity);
            renderFavorites();
            document.getElementById('saveBtn').classList.add('active'); 
        } else {
            alert("City is already in favorites!");
        }
    });

    // Update Temperatures
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

    console.log("--- Upcoming Days ---");
    console.log("Day 1 Temp:", Math.floor(data.list[0].main.temp) + "°");
    console.log("Day 2 Temp:", Math.floor(data.list[8].main.temp) + "°");
    console.log("Day 3 Temp:", Math.floor(data.list[16].main.temp) + "°");
    console.log("Day 4 Temp:", Math.floor(data.list[24].main.temp) + "°");
    console.log("Day 5 Temp:", Math.floor(data.list[32].main.temp) + "°");
    console.log("---------------------");

    return data;
};


// --- FAVORITES FEATURE ---

// Render the list
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

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(city); 
        });

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
    
    // Check if element exists 
    if(cityNameDisplay && cityNameDisplay.childNodes[0]) {
        const currentCity = cityNameDisplay.childNodes[0].textContent.trim();
        if (currentCity === city) {
            const btn = document.getElementById('saveBtn');
            if(btn) btn.classList.remove('active');
        }
    }
};

// --- SEARCH BAR ---
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityToSearch = searchInput.value;
        fetchWeatherData(cityToSearch);
        fetchWeeklyData(cityToSearch);
        searchInput.value = ''; // Clear bar
    }
});


fetchWeatherData();
fetchWeeklyData();