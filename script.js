const notificationE = document.querySelector(".notification");
const tempE = document.querySelector(".temp");

if ('geolocation' in navigator) { //sprawdzanie czy przeglądarka wspiera geolokację
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationE.style.display = "block";
    notificationE.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


const coorE = document.querySelector("#coor");
// ustalenie geolokalizacji użytkownika
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let lat = Math.round(100 * latitude) / 100;
    let long = Math.round(100 * longitude) / 100;

    coorE.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    coorE.textContent = `Szerokość: ${lat} °, Długość: ${long} °`;
    getWeather(latitude, longitude);
}


// pokaż błąd w razie jego wystąpienia
function showError(error) {
    notificationE.style.display = "block";
    notificationE.innerHTML = `<p> ${error.message} </p>`;
}

const api = {
    key: "1ac6c7664e300fbeaef8102199867b6a",
    web: "https://api.openweathermap.org/data/2.5/weather?"
}

const weather = {};
const KELVIN = 273;

// łączenie się z API
function getWeather(latitude, longitude) {
    fetch(`${api.web}lat=${latitude}&lon=${longitude}&appid=${api.key}`)
        .then(response => {
            let data;
            data = response.json();
            return data;
        })
        .then(function(data) {
            weather.tempValue = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.pressure = data.main.pressure;
        })
        .then(displayWeather);

}

function displayWeather() { //wysyłanie info do interfejsu

    tempE.innerHTML = `${weather.tempValue}°<span>C</span>`;

    const descE = document.querySelector(".description");
    descE.innerHTML = weather.description[0].toUpperCase() + weather.description.slice(1); //zamiana małej litery na dużą

    const cityE = document.querySelector(".city");
    cityE.innerHTML = `${weather.city}, ${weather.country}`;

    const pressE = document.querySelector(".press");
    pressE.innerHTML = `${weather.pressure}<span> hPa</span>`;

}
//funkcja estetyczna - dodajemy zero przed częścią daty z zakresu 1-9
function zero(x) {
    if ((x >= 0) && (x < 10)) {
        return "0" + x;
    } else {
        return x;
    }
}

const dateE = document.querySelector(".date");
const hourE = document.querySelector(".hour");
let today = new Date();
let date = today.getFullYear() + '-' + zero((today.getMonth() + 1)) + '-' + zero(today.getDate());
let time = zero(today.getHours()) + ":" + zero(today.getMinutes());
dateE.innerHTML = date;
hourE.innerHTML = time;

function toFahrenheit(d) {
    let fahren = 32 + (9 / 5) * d;
    return Math.round(fahren);
}


const fahr = document.querySelector("#fahrenheit");

tempE.onclick = change;
fahr.onclick = change;

function change() {
    if (tempE.innerHTML === `${weather.tempValue}°<span>C</span>`) {
        tempE.innerHTML = `${toFahrenheit(weather.tempValue)}°<span>F</span>`;
        document.getElementById("fahrenheit").setAttribute('value', "Zmień na Celcius");
    } else {
        tempE.innerHTML = `${weather.tempValue}°<span>C</span>`;
        document.getElementById("fahrenheit").setAttribute('value', 'Zmień na Fahrenheit');
    }
}
