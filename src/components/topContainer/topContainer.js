import "./topContainer.css";
import * as utilityFunctions from "../../modules/utilityFunctions";
import * as domController from "../../modules/domController";
// Weather icons
import lightning from "../../assets/svgs/lightning.svg";
import rainy from "../../assets/svgs/rainy.svg";
import snow from "../../assets/svgs/snow.svg";
import mist from "../../assets/svgs/mist.svg";
import sun from "../../assets/svgs/sun.svg";
import moon from "../../assets/svgs/moon.svg";
import cloudyDay from "../../assets/svgs/cloudyDay.svg";
import cloudyNight from "../../assets/svgs/cloudyNight.svg";
import cloud from "../../assets/svgs/cloud.svg";
import cloudy from "../../assets/svgs/cloudy.svg";
// Sub container 1 icons
import magnifier from "../../assets/searchIcon.png";
// Sub container 2 icons
import thermoIcon from "../../assets/svgs/thermo.svg";
import humidityIcon from "../../assets/svgs/humidity.svg";
import chanceOfRainIcon from "../../assets/svgs/chanceOfRain.svg";
import windSpeedIcon from "../../assets/svgs/windSpeed.svg";

const handleSearch = async (appObj) => {
  const searchField = document.querySelector(".search-field");
  const [city, state, country] = searchField.value.split(",");

  try {
    const [data, locationName] = await utilityFunctions.getWeatherData(
      city,
      state,
      country
    );

    if (data && locationName) {
      appObj.updateMainData(data);
      appObj.updateLocationName(locationName);
      appObj.initializeSubData();

      domController.updateAppUI(createTopContainerUI(appObj), "blank");
    }
  } catch (err) {
    const errMsges = document.querySelectorAll(".error-msg");

    errMsges.forEach((msg) => {
      msg.classList.add("show");
    });

    console.log(err);
  }
};

const determineIcon = (iconCode) => {
  // 11d -> lightning
  // 09d -> rainy
  // 10d -> rainy
  // 13d -> snow
  // 01d -> sun
  // 01n -> moon
  // 50d -> mist
  // 02d -> cloudyDay
  // 02n -> cloudyNght
  // 03d / 03n -> cloud
  // 04d / 04n -> cloudy

  if (iconCode === "11d") return lightning;

  if (iconCode === "09d" || iconCode === "10d") return rainy;

  if (iconCode === "13d") return snow;

  if (iconCode === "01d") return sun;

  if (iconCode === "01n") return moon;

  if (iconCode === "50d") return mist;

  if (iconCode === "02d") return cloudyDay;

  if (iconCode === "02n") return cloudyNight;

  if (iconCode === "03d" || iconCode === "03n") return cloud;

  return cloudy;
};

const createSubContainer1 = (appObj) => {
  // Data
  const currData = appObj.getCurrData();
  const locationName = appObj.getLocationName();
  const [city, state, country] = locationName;

  // Elements
  const container = document.createElement("div");
  const description = document.createElement("p");
  const cityName = document.createElement("p");
  const stateAndCountryName = document.createElement("p");
  const date = document.createElement("p");
  const time = document.createElement("p");
  const temp = document.createElement("p");
  const icon = document.createElement("img");
  const form = document.createElement("form");
  const searchField = document.createElement("input");
  const searchIcon = document.createElement("img");
  const errorMsg1 = document.createElement("span");
  const errorMsg2 = document.createElement("span");

  container.classList.add("sub-container-1", "flex-column");

  description.classList.add("description");
  // description.innerText = currData.description;
  description.innerText = "Overcast Clouds";

  cityName.classList.add("city-name");
  cityName.innerText = city;

  stateAndCountryName.classList.add("state-country-name");
  stateAndCountryName.innerText =
    state && country ? `${state}, ${country}` : state;

  date.classList.add("date");
  date.innerText = `${currData.day}, ${currData.date}`;

  time.classList.add("time");
  time.innerText = currData.time;

  temp.classList.add("temp");
  temp.innerText = currData.temp;

  icon.classList.add("icon");
  icon.src = determineIcon(currData.icon);
  icon.title = currData.description;

  form.classList.add("form", "flex");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch(appObj);
  });

  searchField.classList.add("search-field");
  utilityFunctions.setElemProps(searchField, {
    type: "text",
    name: "search-field",
    spellcheck: false,
    autocomplete: "off",
    placeholder: "Search Location",
  });
  searchField.addEventListener("focusin", () => {
    searchField.placeholder = "London, OH, US";
  });
  searchField.addEventListener("focusout", () => {
    searchField.placeholder = "Search Location";
  });

  searchIcon.classList.add("search-icon");
  searchIcon.src = magnifier;
  searchIcon.addEventListener("pointerdown", () => {
    handleSearch(appObj);
  });

  errorMsg1.classList.add("error-msg");
  errorMsg1.innerText = "Location not found.";

  errorMsg2.classList.add("error-msg");
  // eslint-disable-next-line quotes
  errorMsg2.innerText = `Search must be in the form of "City", "City, State" or "City, State, Country".`;

  form.append(searchField, searchIcon);
  container.append(
    description,
    cityName,
    stateAndCountryName,
    date,
    time,
    temp,
    icon,
    form,
    errorMsg1,
    errorMsg2
  );

  return container;
};

const createSubContainer2 = (appObj) => {
  // Data
  const { feelsLike, humidity, chanceOfRain, windSpeed } = appObj.getCurrData();

  // Elements
  const container = document.createElement("div");

  container.classList.add("sub-container-2", "flex-column");

  [feelsLike, humidity, chanceOfRain, windSpeed].forEach((e, i) => {
    const box = document.createElement("div");
    const textBox = document.createElement("div");
    const icon = document.createElement("img");
    const text1 = document.createElement("p");
    const text2 = document.createElement("p");

    box.classList.add("box", "flex");
    icon.classList.add("icon");
    textBox.classList.add("text-box", "flex-column");
    text1.classList.add("text-1");
    text2.classList.add("text-2");

    if (i === 0) {
      icon.src = thermoIcon;
      text1.innerText = "Feels Like";
    }

    if (i === 1) {
      icon.src = humidityIcon;
      text1.innerText = "Humidity";
    }

    if (i === 2) {
      icon.src = chanceOfRainIcon;
      text1.innerText = "Chance of Rain";
    }

    if (i === 3) {
      icon.src = windSpeedIcon;
      text1.innerText = "Wind Speed";
    }

    text2.innerText = e;

    textBox.append(text1, text2);
    box.append(icon, textBox);
    container.append(box);
  });

  return container;
};

const createTopContainerUI = (appObj) => {
  const container = document.createElement("div");

  container.classList.add("top-container", "flex");

  container.append(createSubContainer1(appObj), createSubContainer2(appObj));

  return container;
};

export default createTopContainerUI;

