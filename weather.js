const api = {
    key: "5b8313a4583e251d0d16711e6335d75c",
    base: "https://api.openweathermap.org/data/2.5/", //air quality api
    base1: "https://api.openaq.org/v1/measurements" //long -lat api

}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
        //console.log(searchbox.value);
    }
}
function getResults(query) {
    try {
        fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
            .then(weatherResponse => {
                if (!weatherResponse.ok) {
                    console.log(`error occurred with status ${weatherResponse.statusText}`)
                    throw new Error(`City Not Found`);
                }
                return weatherResponse.json();
            }).then((weather) => {
                displayResults(weather);
                getAirQuality(weather.coord.lat, weather.coord.lon);
            }, (err) => {
                alert(err)
            });
    } catch {
        alert('City Not Found')
    }
}

function getAirQuality(lat, lon) {
    try {
        fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&APPID=${api.key}`)
            .then(aqResponse => {
                return aqResponse.json();
            }).then(displayAirQuality);
    } catch {
        alert('City Not Found')
    }
}

function displayResults(weather) {
    try {
        fetch(`${api.base1}?coordinates=${weather.coord.lat},${weather.coord.lon}`)
            .then(ap => {
                return ap.json();
            })
    } catch {
        alert('Enter More Precise Location');
    }

    console.log('weather', weather);
    let lat = document.getElementById('lat-value');
    lat.innerText = `${weather.coord.lat}`;
    let lon = document.getElementById('lon-value');
    lon.innerText = `${weather.coord.lon}`;
    let temp = document.getElementById('temp');
    temp.innerText = `${weather.main.temp}°C`;
    let location = document.querySelector('.location .city')
    location.innerText = `${weather.name},${weather.sys.country}`
    let date = new Date();
    let datenow = document.querySelector('.location .date')
    datenow.innerText = dateBuilder(date);

    function dateBuilder(d) {
        let months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December",
        ];
        let days = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`;
    }
}
