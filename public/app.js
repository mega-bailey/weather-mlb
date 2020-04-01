//GET API INFO
const searchElement = document.querySelector('[data-city-search]');
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0];
  if (place == null) return;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
  document.querySelector('.searchbar__search-input').value = '';
  fetch(`/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude
    })
  }).then(res =>
    res.json().then(data => {
      console.log(data);
      setWeatherData(data, place.formatted_address);
    })
  );
});

function zero(x) {
  if (x < 10) {
    x = '0' + x;
  }
  return x;
}

//********** APP FUNCTIONALITY **********//
function setWeatherData(data, place) {
  //GET LOCAL CURRENT TIME
  let d = new Date();
  let localTime = d.getTime();
  let localOffset = d.getTimezoneOffset() * 60000;
  let utcTime = localTime + localOffset;
  let offset = data.offset;
  let locationTimeStamp = utcTime + 3600000 * offset;
  let locationTime = new Date(locationTimeStamp);
  let month = locationTime.getUTCMonth();
  let day = locationTime.getUTCDay();
  let date = zero(locationTime.getUTCDate());

  //LOCAL SUNRISE TIME
  let sunriseTime = data.daily.data[0].sunriseTime * 1000;
  let sunriseD = new Date(sunriseTime);
  let sunriseOffset = sunriseD.getTimezoneOffset() * 60000;
  let sunriseUTC = sunriseTime + sunriseOffset;
  let sunriseTimeStamp = sunriseUTC + 3600000 * offset;
  let sunrise = new Date(sunriseTimeStamp);
  let sunriseHour = sunrise.getHours();
  let sunriseMins = sunrise.getMinutes();

  //LOCAL SUNSET TIME
  let sunsetTime = data.daily.data[0].sunsetTime * 1000;
  let sunsetD = new Date(sunsetTime);
  let sunsetOffset = sunsetD.getTimezoneOffset() * 60000;
  let sunsetUTC = sunsetTime + sunsetOffset;
  let sunsetTimeStamp = sunsetUTC + 3600000 * offset;
  let sunset = new Date(sunsetTimeStamp);
  let sunsetHour = sunset.getHours() - 12;
  let sunsetMins = sunset.getMinutes();

  //*** FRONT SIDE ELEMENTS ***//
  $('[data-location]').text(place);
  $('[data-month]').text(months[month]);
  $('[data-date]').text(`${days[day]} ${date}`);
  $('[data-status]').text(data.currently.summary);
  $('[data-xl-icon').html(
    `<img style="color: black;" src="img/${data.currently.icon}.svg"/>`
  );
  $('[data-main-icon]').html(`<img src="img/${data.currently.icon}.svg"/>`);
  $('[data-feelslike]').text(
    Math.floor(Math.round(data.currently.apparentTemperature))
  );
  $('[data-main-temp]').text(
    `${Math.floor(Math.round(data.currently.temperature))}˚`
  );
  $('[data-hightemp]').text(
    `${Math.floor(Math.round(data.daily.data[0].temperatureHigh))}˚`
  );
  $('[data-lowtemp]').text(
    `${Math.floor(Math.round(data.daily.data[0].temperatureLow))}˚`
  );
  $('[data-wind]').text(
    `${Math.floor(Math.round(data.currently.windSpeed))}mph`
  );
  $('[data-precipitation]').text(
    `${Math.floor(Math.round(data.currently.precipProbability * 100))}%`
  );

  //*** BACK SIDE ELEMENTS ***//
  $('[data-humidity]').text(
    `${Math.floor(Math.round(data.currently.humidity * 100))}%`
  );
  $('[data-dewpoint]').text(
    `${Math.floor(Math.round(data.currently.dewPoint))}˚`
  );
  $('[data-pressure]').text(
    `${(data.currently.pressure / 33.864).toFixed(2)}in`
  );
  $('[data-uv]').text(data.currently.uvIndex);
  $('[data-sunrise]').text(`${sunriseHour}:${zero(sunriseMins)}am`);
  $('[data-sunset]').text(`${sunsetHour}:${zero(sunsetMins)}pm`);

  //*** FORECAST ELEMENTS ***//
  for (let i = 1; i <= 7; i++) {
    //LOOP THROUGH FORECAST LOCAL DAYS
    for (let i = 1; i <= 7; i++) {
      let time = data.daily.data[i].time * 1000;
      let timeD = new Date(time);
      let timeOffset = timeD.getTimezoneOffset() * 60000;
      let timeUTC = time + timeOffset;
      let timeStamp = timeUTC + 3600000 * offset;
      let forecastTime = new Date(timeStamp);
      let forecastDay = forecastTime.getUTCDay();
      let forecastDate = zero(forecastTime.getUTCDate());
      $(`[data-daily-day-${i}]`).html(
        `${days[forecastDay]}<br/> ${forecastDate}`
      );
    }
    //LOOP THROUGH REMAINING FORECAST ELEMENTS
    $(`[data-daily-precipitation-${i}]`).text(
      `${Math.floor(Math.round(data.daily.data[i].precipProbability * 100))}%`
    );
    $(`[data-daily-icon-${i}]`).html(
      `<img src="img/${data.daily.data[i].icon}.svg"/>`
    );
    $(`[data-daily-hightemp-${i}]`).text(
      `${Math.floor(Math.round(data.daily.data[i].temperatureHigh))}˚`
    );
    $(`[data-daily-lowtemp-${i}]`).text(
      `${Math.floor(Math.round(data.daily.data[i].temperatureLow))}˚`
    );
  }

  //BACKGROUND ELEMENTS
  body.className = `${data.currently.icon}`;
  containerBg.className = `${data.currently.icon}`;
}

//SET BACKROUND ELEMENTS
const body = document.querySelector('body');
const containerBg = document.querySelector('.container--bg');

function flip() {
  const containerFront = document.querySelector('.container__side--front');
  containerFront.classList.toggle('flipFront');
  const containerBack = document.querySelector('.container__side--back');
  containerBack.classList.toggle('flipBack');
}

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
