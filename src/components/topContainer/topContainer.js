/* eslint-disable no-use-before-define */
import "./topContainer.css";
import createBottomContainerUI from "../bottomContainer/bottomContainer";
import * as utilityFunctions from "../../modules/utilityFunctions";
import * as domController from "../../modules/domController";
// Sub container 1 icons
import magnifier from "../../assets/pngs/searchIcon.png";
// Sub container 2 icons
import thermoIcon from "../../assets/svgs/thermo.svg";
import humidityIcon from "../../assets/svgs/humidity.svg";
import chanceOfRainIcon from "../../assets/svgs/chanceOfRain.svg";
import windSpeedIcon from "../../assets/svgs/windSpeed.svg";

// Handler functions
const handleTogglerClick = (unitToggler, appObj) => {
  appObj.toggleTempMode();
  const mode = appObj.getTempMode();
  const tempElements = document.querySelectorAll(".temperature");

  unitToggler.innerText = mode === "C" ? "Display °F" : "Display °C";

  if (mode === "C") {
    tempElements.forEach((elem) => {
      elem.innerText = utilityFunctions.convertFahrenheitToCelsius(
        utilityFunctions.getTempVal(elem.innerText)
      );
    });
  } else {
    tempElements.forEach((elem) => {
      elem.innerText = utilityFunctions.convertCelsiusToFahrenheit(
        utilityFunctions.getTempVal(elem.innerText)
      );
    });
  }
};

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
      appObj.resetTempMode();

      domController.updateAppUI(
        createTopContainerUI(appObj),
        createBottomContainerUI(appObj)
      );
    }
  } catch (err) {
    console.log(err);

    const errMsges = document.querySelectorAll(".error-msg");

    errMsges.forEach((msg) => {
      msg.classList.add("show");
    });
  }
};

// UI functions
const createSubContainer1UI = (appObj) => {
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
  const unitToggler = document.createElement("p");
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

  temp.classList.add("temperature", "temp");
  temp.innerText = currData.temp;

  unitToggler.classList.add("unit-toggler");
  unitToggler.innerText = "Display °F";
  unitToggler.addEventListener("pointerdown", () => {
    handleTogglerClick(unitToggler, appObj);
  });

  icon.classList.add("icon");
  icon.src = utilityFunctions.determineIcon(currData.icon);
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
  searchIcon.alt = "Magnifier Icon";
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
    unitToggler,
    icon,
    form,
    errorMsg1,
    errorMsg2
  );

  return container;
};

const createSubContainer2UI = (appObj) => {
  // Data
  const { feelsLike, humidity, chanceOfRain, windSpeed } = appObj.getCurrData();

  // Elements
  const container = document.createElement("div");

  container.classList.add("sub-container-2", "flex-column");

  [feelsLike, humidity, chanceOfRain, windSpeed].forEach((e, i) => {
    const box = document.createElement("div");
    const textsBox = document.createElement("div");
    const icon = document.createElement("img");
    const text1 = document.createElement("p");
    const text2 = document.createElement("p");

    box.classList.add("box", "flex");
    icon.classList.add("icon");
    textsBox.classList.add("texts-box", "flex-column");
    text1.classList.add("text-1");
    text2.classList.add("text-2");

    if (i === 0) {
      icon.src = thermoIcon;
      icon.alt = "Thermo Icon";
      text1.innerText = "Feels Like";
      text2.classList.add("temperature");
    }

    if (i === 1) {
      icon.src = humidityIcon;
      icon.alt = "Humidity Icon";
      text1.innerText = "Humidity";
    }

    if (i === 2) {
      icon.src = chanceOfRainIcon;
      icon.alt = "Raining Icon";
      text1.innerText = "Chance of Rain";
    }

    if (i === 3) {
      icon.src = windSpeedIcon;
      icon.alt = "Wind Speed Icon";
      text1.innerText = "Wind Speed";
    }

    text2.innerText = e;

    textsBox.append(text1, text2);
    box.append(icon, textsBox);
    container.append(box);
  });

  return container;
};

const createTopContainerUI = (appObj) => {
  const container = document.createElement("div");

  container.classList.add("top-container", "flex");

  container.append(
    createSubContainer1UI(appObj),
    createSubContainer2UI(appObj)
  );

  return container;
};

export default createTopContainerUI;
