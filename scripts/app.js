const fetchWeatherData = async () => {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=37.9575&lon=121.2925&units=imperial&appid=cf7f1c8560a924e6048763d33c150642"
  );
  const data = await response.json();
  console.log(Math.floor(data.main.temp_max));
  console.log(Math.floor(data.main.temp_min));
  return data;
};

fetchWeatherData();

// --- FUNCTION 2: Weekly Forecast ---
const fetchWeeklyData = async () => {
  console.log("Fetching weekly forecast...");
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=37.9575&lon=121.2925&units=imperial&appid=cf7f1c8560a924e6048763d33c150642"
  );
  const data = await response.json();

  console.log("✅ Weekly Data Received:", data);
  console.log("--- Logging Temps for Upcoming Days ---");

  console.log("Day 1 Temp:", Math.floor(data.list[0].main.temp) + "°");
  console.log("Day 1 Max:", Math.floor(data.list[0].main.temp_max) + "°");
  console.log("Day 1 Min:", Math.floor(data.list[0].main.temp_min) + "°");
  console.log("-");

  console.log("Day 2 Temp:", Math.floor(data.list[8].main.temp) + "°");
  console.log("Day 2 Max:", Math.floor(data.list[8].main.temp_max) + "°");
  console.log("Day 2 Min:", Math.floor(data.list[8].main.temp_min) + "°");
  console.log("-");

  console.log("Day 3 Temp:", Math.floor(data.list[16].main.temp) + "°");
  console.log("Day 3 Max:", Math.floor(data.list[16].main.temp_max) + "°");
  console.log("Day 3 Min:", Math.floor(data.list[16].main.temp_min) + "°");
  console.log("-");

  console.log("Day 4 Temp:", Math.floor(data.list[24].main.temp) + "°");
  console.log("Day 4 Max:", Math.floor(data.list[24].main.temp_max) + "°");
  console.log("Day 4 Min:", Math.floor(data.list[24].main.temp_min) + "°");
  console.log("-");

  console.log("Day 5 Temp:", Math.floor(data.list[32].main.temp) + "°");
  console.log("Day 5 Max:", Math.floor(data.list[32].main.temp_max) + "°");
  console.log("Day 5 Min:", Math.floor(data.list[32].main.temp_min) + "°");
  console.log("---------------------------------------");

  return data;
};
fetchWeeklyData();
// --- FAVORITES FEATURE ---
let favorites = [];
const saveBtn = document.getElementById("saveBtn");
const favoritesList = document.getElementById("favoritesList");
const cityNameDisplay = document.getElementById("city-name");

saveBtn.addEventListener("click", () => {
  const currentCity = cityNameDisplay.childNodes[0].textContent.trim();

  if (!favorites.includes(currentCity)) {
    favorites.push(currentCity);
    renderFavorites();
    saveBtn.classList.add("active");
  } else {
    alert("City is already in favorites!");
  }
});

const Favorites = () => {
  favoritesList.innerHTML = "";

  favorites.forEach((city) => {
    let li = document.createElement("li");
    li.className = "fav-item";

    let textSpan = document.createElement("span");
    textSpan.textContent = city;

    let deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFavorite(city);
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    favoritesList.appendChild(li);
  });
};

const removeFavorite = (city) => {
  favorites = favorites.filter((item) => item !== city);
  renderFavorites();

  const currentCity = cityNameDisplay.childNodes[0].textContent.trim();
  if (currentCity === city) {
    saveBtn.classList.remove("active");
  }
};
