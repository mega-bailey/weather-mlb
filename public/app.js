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

//********** SET DOM ELEMENTS TO API DATA **********//
function setWeatherData(data, place) {
  //GET LOCAL CURRENT TIME
  let d = new Date();
  let localTime = d.getTime();
  // console.log(localTime); //local timestamp
  let localOffset = d.getTimezoneOffset() * 60000;
  let utcTime = localTime + localOffset;
  let offset = data.offset;
  let locationTimeStamp = utcTime + 3600000 * offset;
  let locationTime = new Date(locationTimeStamp);

  //MONTH/DAYS
  let month = locationTime.getUTCMonth();
  let day = locationTime.getUTCDay();
  let date = zero(locationTime.getUTCDate());

  //LOCAL SUNRISE TIME
  // let d = new Date();
  // let localTime = d.getTime();
  let sunriseTimestamp = data.daily.data[0].sunriseTime;
  // console.log(localTime); //local timestamp
  let sunriseLocalOffset = d.getTimezoneOffset() * 60000;
  let sunriseUtcTime = sunriseTimestamp + sunriseLocalOffset;
  // let offset = data.offset;
  let sunriseLocationTimeStamp = sunriseUtcTime + 3600000 * offset;
  let sunriseLocationTime = new Date(sunriseLocationTimeStamp);
  let sunriseHour = sunriseLocationTime.getUTCHours();
  let sunriseMin = sunriseLocationTime.getUTCMinutes();
  console.log(sunriseHour, sunriseMin);

  // let sunriseTimestamp = data.daily.data[0].sunriseTime;
  let sunriseObj = new Date(sunriseTimestamp * 1000);
  let sunriseHours = sunriseObj.getUTCHours();
  let sunriseMins = zero(sunriseObj.getUTCMinutes());
  let sunriseOffsetHours = sunriseHours + offset;
  //SUNSET UTC TIME
  let sunsetTimestamp = data.daily.data[0].sunsetTime;
  let sunsetObj = new Date(sunsetTimestamp * 1000);
  let sunsetHours = sunsetObj.getUTCHours(); //+12
  let sunsetMins = zero(sunsetObj.getUTCMinutes());
  let sunsetOffsetHours = sunsetHours - offset;

  // var weekday = '';
  // let weekdate;
  // // let forecastTimestamp = data.daily.data[i].time;
  // for (let i = 1; i <= 7; i++) {
  //   let forecastTimestamp = data.daily.data[i].time;
  //   //console.log(forecastTimestamp);
  //   let dayObj = new Date(forecastTimestamp * 1000);
  //   let weekdays = dayObj.getUTCDay(); //This works! compare to day array to get weekday
  //   let arrdays = days[weekdays];
  //   // console.log(typeof arrdays); //string

  //   weekdate = dayObj.getUTCDate();
  //   // console.log(weekday);
  // }

  function addZero(i) {
    if (weekdate < 10) {
      i = '0' + i;
    }
    return i;
  }

  //TODO - FIGURE OUT A LOOP FOR THIS
  // $('[data-daily-day-1]').html(`${weekday[0]}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-2]').html(`${weekday[1]}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-3]').html(`${weekday}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-4]').html(`${weekday}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-5]').html(`${weekday}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-6]').html(`${weekday}<br/> ${addZero(weekdate)}`);
  // $('[data-daily-day-7]').html(`${weekday}<br/> ${addZero(weekdate)}`);
  // day2.innerHTML = `${days[day + 2]}<br/> ${date + 2}`;
  // day3.innerHTML = `${days[day + 3]}<br/> ${date + 3}`;
  // day4.innerHTML = `${days[day + 4]}<br/> ${date + 4}`;
  // day5.innerHTML = `${days[day + 5]}<br/> ${date + 5}`;
  // day6.innerHTML = `${days[day + 6]}<br/> ${date + 6}`;
  // day7.innerHTML = `${days[day + 7]}<br/> ${date + 7}`;

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
  $('[data-sunrise]').text(`${sunriseOffsetHours}:${sunriseMins}am`);
  $('[data-sunset]').text(`${sunsetOffsetHours}:${sunsetMins}pm`);

  //*** FORECAST ELEMENTS ***//
  for (let i = 1; i <= 7; i++) {
    // $(`[data-daily-day-${i}]`).html(`${weekday}<br/> ${addZero(weekdate)}`);
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
