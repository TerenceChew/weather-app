import format from "date-fns/format";

// Variables
const apiKey = "c6073913dce281c7eaafcff759acad1b";

// Utilities
const convertFahrenheitToCelsius = (fahrenheit) =>
  ((fahrenheit - 32) * 0.5556).toFixed(0);

const convertCelsiusToFahrenheit = (celsius) => (celsius * 1.8 + 32).toFixed(0);

const processDescription = (description) =>
  description
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const processFullDate = (timestamp, timezone) =>
  new Date(timestamp * 1000).toLocaleString("en-US", { timeZone: timezone });

const processDay = (fullDate) => format(new Date(fullDate), "EEEE"); // Sunday

const processDate = (fullDate) => format(new Date(fullDate), "do MMM yy"); // 3rd Dec 22

const processTimeHHMM = (fullDate) => format(new Date(fullDate), "h':'mm aaa"); // 2:55 pm

const processTimeHH = (fullDate) => format(new Date(fullDate), "h aaa"); // 8 pm

const createIconUrl = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

const processWindSpeed = (windSpeedMPH) =>
  `${(windSpeedMPH * 1.609344).toFixed(1)} km/h`;

const processFeelsLike = (feelsLike) => convertFahrenheitToCelsius(feelsLike);

const processHumidity = (humidity) => `${humidity} %`;

const processPop = (pop) => `${pop * 100} %`;

const createLocationName = (data) => {
  const { name, state, country } = data;

  if (state) return `${name}, ${state}, ${country}`;

  return `${name}, ${country}`;
};

// API calls
const getCityCoordinates = async (cityName, stateCode, countryCode) => {
  const processedStateCode = stateCode ? `,${stateCode}` : stateCode;
  const processedCountryCode = countryCode ? `,${countryCode}` : countryCode;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${processedStateCode}${processedCountryCode}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  return [data[0].lat, data[0].lon, createLocationName(data[0])];
};

const getWeatherData = async (cityName, stateCode = "", countryCode = "") => {
  try {
    const [lat, lon, locationName] = await getCityCoordinates(
      cityName,
      stateCode,
      countryCode
    );
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,alerts&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    return [data, locationName];
  } catch (err) {
    return err;
  }
};

// Current data
const processCurrData = (currData, timezone, pop) => {
  const temp = convertFahrenheitToCelsius(currData.temp);
  const description = processDescription(currData.weather[0].description);
  const iconUrl = createIconUrl(currData.weather[0].icon);
  const fullDate = processFullDate(currData.dt, timezone);
  const day = processDay(fullDate);
  const date = processDate(fullDate);
  const time = processTimeHHMM(fullDate);
  const windSpeed = processWindSpeed(currData.wind_speed);
  const feelsLike = processFeelsLike(currData.feels_like);
  const humidity = processHumidity(currData.humidity);
  const chanceOfRain = processPop(pop);

  return {
    temp,
    description,
    iconUrl,
    day,
    date,
    time,
    windSpeed,
    feelsLike,
    humidity,
    chanceOfRain,
  };
};

const getCurrData = (rawData) => {
  const { current, timezone, daily } = rawData;

  return processCurrData(current, timezone, daily[0].pop);
};

// Daily data
const processDailyData = (dailyData, timezone) => {
  const dailyDataFor7Days = dailyData.slice(0, -1);
  const processedDailyData = dailyDataFor7Days.map((day) => {
    const dayOfWeek = processDay(processFullDate(day.dt, timezone));
    const temp = convertFahrenheitToCelsius(day.temp.day);
    const minTemp = convertFahrenheitToCelsius(day.temp.min);
    const maxTemp = convertFahrenheitToCelsius(day.temp.max);
    const description = processDescription(day.weather[0].description);
    const iconUrl = createIconUrl(day.weather[0].icon);

    return {
      dayOfWeek,
      temp,
      minTemp,
      maxTemp,
      description,
      iconUrl,
    };
  });

  return processedDailyData;
};

const getDailyData = (rawData) => {
  const { daily, timezone } = rawData;

  return processDailyData(daily, timezone);
};

// Hourly data
const processHourlyData = (hourlyData, timezone) => {
  const hourlyDataFor24Hours = hourlyData.slice(0, 24);
  const processedHourlyData = hourlyDataFor24Hours.map((hour) => {
    const timeOfDay = processTimeHH(processFullDate(hour.dt, timezone));
    const temp = convertFahrenheitToCelsius(hour.temp);
    const description = processDescription(hour.weather[0].description);
    const iconUrl = createIconUrl(hour.weather[0].icon);

    return {
      timeOfDay,
      temp,
      description,
      iconUrl,
    };
  });

  return processedHourlyData;
};

const getHourlyData = (rawData) => {
  const { hourly, timezone } = rawData;

  return processHourlyData(hourly, timezone);
};

export {
  convertFahrenheitToCelsius,
  convertCelsiusToFahrenheit,
  getWeatherData,
  getCurrData,
  getDailyData,
  getHourlyData,
};