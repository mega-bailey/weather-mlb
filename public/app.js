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

//******* DOM DAILY FORECAST ELEMENTS *******//
// const day1 = document.querySelector('[data-daily-day-1]');
// const day2 = document.querySelector('[data-daily-day-2]');
// const day3 = document.querySelector('[data-daily-day-3]');
// const day4 = document.querySelector('[data-daily-day-4]');
// const day5 = document.querySelector('[data-daily-day-5]');
// const day6 = document.querySelector('[data-daily-day-6]');
// const day7 = document.querySelector('[data-daily-day-7]');

const precip1 = document.querySelector('[data-daily-precipitation-1]');
const precip2 = document.querySelector('[data-daily-precipitation-2]');
const precip3 = document.querySelector('[data-daily-precipitation-3]');
const precip4 = document.querySelector('[data-daily-precipitation-4]');
const precip5 = document.querySelector('[data-daily-precipitation-5]');
const precip6 = document.querySelector('[data-daily-precipitation-6]');
const precip7 = document.querySelector('[data-daily-precipitation-7]');

const icon1 = document.querySelector('[data-daily-icon-1]');
const icon2 = document.querySelector('[data-daily-icon-2]');
const icon3 = document.querySelector('[data-daily-icon-3]');
const icon4 = document.querySelector('[data-daily-icon-4]');
const icon5 = document.querySelector('[data-daily-icon-5]');
const icon6 = document.querySelector('[data-daily-icon-6]');
const icon7 = document.querySelector('[data-daily-icon-7]');

const high1 = document.querySelector('[data-daily-hightemp-1]');
const high2 = document.querySelector('[data-daily-hightemp-2]');
const high3 = document.querySelector('[data-daily-hightemp-3]');
const high4 = document.querySelector('[data-daily-hightemp-4]');
const high5 = document.querySelector('[data-daily-hightemp-5]');
const high6 = document.querySelector('[data-daily-hightemp-6]');
const high7 = document.querySelector('[data-daily-hightemp-7]');

const low1 = document.querySelector('[data-daily-lowtemp-1]');
const low2 = document.querySelector('[data-daily-lowtemp-2]');
const low3 = document.querySelector('[data-daily-lowtemp-3]');
const low4 = document.querySelector('[data-daily-lowtemp-4]');
const low5 = document.querySelector('[data-daily-lowtemp-5]');
const low6 = document.querySelector('[data-daily-lowtemp-6]');
const low7 = document.querySelector('[data-daily-lowtemp-7]');

// const precipitationEl = document.querySelector('[data-precipitation]');

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
  console.log(localTime); //local timestamp
  let localOffset = d.getTimezoneOffset() * 60000;
  let utcTime = localTime + localOffset;
  let offset = data.offset;
  let locationTimeStamp = utcTime + 3600000 * offset;
  let locationTime = new Date(locationTimeStamp);

  //MONTH/DAYS
  let month = locationTime.getUTCMonth();
  let day = locationTime.getUTCDay();
  let date = zero(locationTime.getUTCDate());

  //UTC TIME
  // let timestamp = data.currently.time;
  // let offsetNeg = data.offset * -1;
  // let offsetPos = offsetNeg * 3600;
  // let offsetTime = new Date(timestamp * 1000);
  // let offsetTime = timestamp - offsetPos;
  // console.log(offsetTime);
  // let currentLocalTime = new Date(offsetTime);
  // console.log(currentLocalTime);
  // let time = Math.floor(new Date().getTime() / 1000.0);
  // console.log(time);
  // let dateObj = offsetTime - offsetHours; //current local time
  // let hours = dateObj.getHours();
  // console.log(dateObj);
  // let localHour = hours - offset;
  // console.log(localHour);
  // let mins = zero(dateObj.getUTCMinutes());
  // console.log(mins);

  //LOCAL SUNRISE TIME
  let d = new Date();
  let localTime = d.getTime();
  et sunriseTimestamp = data.daily.data[0].sunriseTime;
  console.log(localTime); //local timestamp
  let localOffset = d.getTimezoneOffset() * 60000;
  let utcTime = localTime + localOffset;
  let offset = data.offset;
  let locationTimeStamp = utcTime + 3600000 * offset;
  let locationTime = new Date(locationTimeStamp);



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

  //FORECAST DAYS (pulling the week day from sunset timestamp and assigning it to Days Array)
  // let forecastDaysObj = data.daily.data;
  // for (let [key, value] of Object.entries(forecastDaysObj)) {
  //   // console.log(key);
  //   $('.forecast--day').html(`${key}<br/> ${value.time}`);
  //   // console.log(value.time);
  //   let forecastDays = document.getElementsByClassName('forecast--day');
  //   for (let i = 0; i < forecastDays.length; i++) {
  //     date = value.time[i];
  //     day = key[i];
  //   }
  // }

  // forEach({ day: data.daily.data[0], time: data.daily.time }, function(
  //   day,
  //   time
  // ) {
  //   console.log(day);
  //   console.log(time);
  // });
  var weekday = '';
  let weekdate;
  // let forecastTimestamp = data.daily.data[i].time;
  for (let i = 1; i <= 7; i++) {
    let forecastTimestamp = data.daily.data[i].time;
    //console.log(forecastTimestamp);
    let dayObj = new Date(forecastTimestamp * 1000);
    let weekdays = dayObj.getUTCDay(); //This works! compare to day array to get weekday
    let arrdays = days[weekdays];
    // console.log(typeof arrdays); //string

    weekdate = dayObj.getUTCDate();
    // console.log(weekday);
  }

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

  //*** FORECAST ***//
  //TODO - FIGURE OUT A LOOP FOR THIS
  precip1.textContent = `${Math.floor(
    Math.round(data.daily.data[1].precipProbability * 100)
  )}%`;
  precip2.textContent = `${Math.floor(
    Math.round(data.daily.data[2].precipProbability * 100)
  )}%`;
  precip3.textContent = `${Math.floor(
    Math.round(data.daily.data[3].precipProbability * 100)
  )}%`;
  precip4.textContent = `${Math.floor(
    Math.round(data.daily.data[4].precipProbability * 100)
  )}%`;
  precip5.textContent = `${Math.floor(
    Math.round(data.daily.data[5].precipProbability * 100)
  )}%`;
  precip6.textContent = `${Math.floor(
    Math.round(data.daily.data[6].precipProbability * 100)
  )}%`;
  precip7.textContent = `${Math.floor(
    Math.round(data.daily.data[7].precipProbability * 100)
  )}%`;

  icon1.innerHTML = `<img src="img/${data.daily.data[1].icon}.svg"/>`;
  icon2.innerHTML = `<img src="img/${data.daily.data[2].icon}.svg"/>`;
  icon3.innerHTML = `<img src="img/${data.daily.data[3].icon}.svg"/>`;
  icon4.innerHTML = `<img src="img/${data.daily.data[4].icon}.svg"/>`;
  icon5.innerHTML = `<img src="img/${data.daily.data[5].icon}.svg"/>`;
  icon6.innerHTML = `<img src="img/${data.daily.data[6].icon}.svg"/>`;
  icon7.innerHTML = `<img src="img/${data.daily.data[7].icon}.svg"/>`;

  high1.textContent = `${Math.floor(
    Math.round(data.daily.data[1].temperatureHigh)
  )}˚`;
  high2.textContent = `${Math.floor(
    Math.round(data.daily.data[2].temperatureHigh)
  )}˚`;
  high3.textContent = `${Math.floor(
    Math.round(data.daily.data[3].temperatureHigh)
  )}˚`;
  high4.textContent = `${Math.floor(
    Math.round(data.daily.data[4].temperatureHigh)
  )}˚`;
  high5.textContent = `${Math.floor(
    Math.round(data.daily.data[5].temperatureHigh)
  )}˚`;
  high6.textContent = `${Math.floor(
    Math.round(data.daily.data[6].temperatureHigh)
  )}˚`;
  high7.textContent = `${Math.floor(
    Math.round(data.daily.data[7].temperatureHigh)
  )}˚`;
  low1.textContent = `${Math.floor(
    Math.round(data.daily.data[1].temperatureLow)
  )}˚`;
  low2.textContent = `${Math.floor(
    Math.round(data.daily.data[2].temperatureLow)
  )}˚`;
  low3.textContent = `${Math.floor(
    Math.round(data.daily.data[3].temperatureLow)
  )}˚`;
  low4.textContent = `${Math.floor(
    Math.round(data.daily.data[4].temperatureLow)
  )}˚`;
  low5.textContent = `${Math.floor(
    Math.round(data.daily.data[5].temperatureLow)
  )}˚`;
  low6.textContent = `${Math.floor(
    Math.round(data.daily.data[6].temperatureLow)
  )}˚`;
  low7.textContent = `${Math.floor(
    Math.round(data.daily.data[7].temperatureLow)
  )}˚`;

  //BACKGROUND ELEMENTS
  body.className = `${data.currently.icon}`;
  containerBg.className = `${data.currently.icon}`;
  // containerBgFront.className = `${data.currently.icon}`;
  // containerBgBack.className = `${data.currently.icon}`;
}

//SET BACKROUND ELEMENTS
const body = document.querySelector('body');
const containerBg = document.querySelector('.container--bg');
// const containerBgFront = document.querySelector('.container--bg-front');
// const containerBgBack = document.querySelector('.container--bg-back');

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
