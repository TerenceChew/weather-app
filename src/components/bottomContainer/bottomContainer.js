import "./bottomContainer.css";
import * as utilityFunctions from "../../modules/utilityFunctions";
import * as domController from "../../modules/domController";

// Variables
let pos = {};

// Drag to scroll functions
const handlePointerDown = (e) => {
  console.log("DOWN");
  const container = document.querySelector(".infos-container");

  pos = {
    currTop: container.scrollTop,
    currLeft: container.scrollLeft,
    initialX: e.clientX,
    initialY: e.clientY,
  };

  container.style.cursor = "grabbing";
  container.style.userSelect = "none";

  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
};

const handlePointerMove = (e) => {
  console.log("MOVE");
  const container = document.querySelector(".infos-container");
  const { currTop, currLeft, initialX, initialY } = pos;
  const currX = e.clientX;
  const currY = e.clientY;
  const distanceX = currX - initialX;
  const distanceY = currY - initialY;

  if (container.matches(":hover")) {
    container.scrollLeft = currLeft - distanceX;
    container.scrollTop = currTop - distanceY;
  }
};

const handlePointerUp = () => {
  console.log("UP");
  const container = document.querySelector(".infos-container");

  container.style.cursor = "grab";
  container.style.userSelect = "auto";

  document.removeEventListener("pointermove", handlePointerMove);
  document.removeEventListener("pointerup", handlePointerUp);
};

// UI functions
const updateBtnUI = (clickedBtn) => {
  const controlBtns = document.querySelectorAll(".control-btn");

  controlBtns.forEach((btn) => {
    btn.classList.remove("selected");
  });

  clickedBtn.classList.add("selected");
};

const createDailyInfoUI = (dailyData, appObj) => {
  // Data
  const { dayOfWeek, minTemp, maxTemp, icon, description } = dailyData;
  // Elements
  const container = document.createElement("div");
  const day = document.createElement("p");
  const tempsBox = document.createElement("div");
  const maxTemperature = document.createElement("span");
  const minTemperature = document.createElement("span");
  const weatherIcon = document.createElement("img");

  container.classList.add("daily-info-box");

  day.classList.add("day");
  day.innerText = dayOfWeek;

  tempsBox.classList.add("temps-box");

  maxTemperature.classList.add("temperature", "max-temp");

  minTemperature.classList.add("temperature", "min-temp");

  if (appObj.getTempMode() === "C") {
    maxTemperature.innerText = maxTemp;
    minTemperature.innerText = minTemp;
  } else {
    maxTemperature.innerText = utilityFunctions.convertCelsiusToFahrenheit(
      utilityFunctions.getTempVal(maxTemp)
    );
    minTemperature.innerText = utilityFunctions.convertCelsiusToFahrenheit(
      utilityFunctions.getTempVal(minTemp)
    );
  }

  weatherIcon.classList.add("icon");
  weatherIcon.src = utilityFunctions.determineIcon(icon);
  weatherIcon.title = description;

  tempsBox.append(maxTemperature, " / ", minTemperature);
  container.append(day, tempsBox, weatherIcon);

  return container;
};

const createHourlyInfoUI = (hourlyData, appObj) => {
  // Data
  const { timeOfDay, temp, icon, description } = hourlyData;
  // Elements
  const container = document.createElement("div");
  const time = document.createElement("p");
  const temperature = document.createElement("p");
  const weatherIcon = document.createElement("img");

  container.classList.add("hourly-info-box");

  time.classList.add("time");
  time.innerText = timeOfDay;

  temperature.classList.add("temperature", "temp");

  if (appObj.getTempMode() === "C") {
    temperature.innerText = temp;
  } else {
    temperature.innerText = utilityFunctions.convertCelsiusToFahrenheit(
      utilityFunctions.getTempVal(temp)
    );
  }

  weatherIcon.classList.add("icon");
  weatherIcon.src = utilityFunctions.determineIcon(icon);
  weatherIcon.title = description;

  container.append(time, temperature, weatherIcon);

  return container;
};

const createInfosContainerUI = (appObj, mode) => {
  const container = document.createElement("div");

  container.classList.add("infos-container", "flex-column");
  container.addEventListener("pointerdown", handlePointerDown);

  if (mode === "daily") {
    appObj.getDailyData().forEach((data) => {
      container.append(createDailyInfoUI(data, appObj));
    });
  } else {
    appObj.getHourlyData().forEach((data) => {
      container.append(createHourlyInfoUI(data, appObj));
    });
  }

  return container;
};

const handleBtnClick = (clickedBtn, appObj, mode) => {
  updateBtnUI(clickedBtn);

  domController.updateInfosContainerUI(createInfosContainerUI(appObj, mode));
};

const createBottomContainerUI = (appObj) => {
  const container = document.createElement("div");
  const controlsContainer = document.createElement("div");
  const dailyBtn = document.createElement("button");
  const hourlyBtn = document.createElement("button");

  container.classList.add("bottom-container");

  controlsContainer.classList.add("controls-container", "flex", "center");

  dailyBtn.classList.add(
    "control-btn",
    "daily-btn",
    "flex",
    "center",
    "selected"
  );
  dailyBtn.innerText = "Daily";
  dailyBtn.addEventListener("pointerdown", () => {
    handleBtnClick(dailyBtn, appObj, "daily");
  });

  hourlyBtn.classList.add("control-btn", "hourly-btn", "flex", "center");
  hourlyBtn.innerText = "Hourly";
  hourlyBtn.addEventListener("pointerdown", () => {
    handleBtnClick(hourlyBtn, appObj, "hourly");
  });

  controlsContainer.append(dailyBtn, hourlyBtn);
  container.append(controlsContainer, createInfosContainerUI(appObj, "daily"));

  return container;
};

export default createBottomContainerUI;
