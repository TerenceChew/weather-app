import "./app.css";
import createTopContainerUI from "../components/topContainer/topContainer";
import createBottomContainerUI from "../components/bottomContainer/bottomContainer";
import * as utilityFunctions from "../modules/utilityFunctions";

const appFactory = () => {
  let mainData;
  let locationName;
  let currData;
  let dailyData;
  let hourlyData;
  let tempMode = "C";

  // Getting
  const getLocationName = () => locationName;
  const getCurrData = () => currData;
  const getDailyData = () => dailyData;
  const getHourlyData = () => hourlyData;
  const getTempMode = () => tempMode;

  // Reseting
  const resetTempMode = () => {
    tempMode = "C";
  };

  // Updating
  const updateMainData = (newMainData) => {
    mainData = newMainData;
  };
  const updateLocationName = (newLocationName) => {
    locationName = newLocationName;
  };

  // Toggling
  const toggleTempMode = () => {
    tempMode = tempMode === "C" ? "F" : "C";
  };

  // Initializing
  const initializeSubData = () => {
    currData = utilityFunctions.getCurrData(mainData);
    dailyData = utilityFunctions.getDailyData(mainData);
    hourlyData = utilityFunctions.getHourlyData(mainData);
  };

  return {
    getLocationName,
    getCurrData,
    getDailyData,
    getHourlyData,
    getTempMode,
    updateMainData,
    updateLocationName,
    resetTempMode,
    toggleTempMode,
    initializeSubData,
  };
};

// UI functions
const createFallbackErrMsgUI = () => {
  const fallbackErrMsg = document.createElement("p");

  fallbackErrMsg.classList.add("fallback-err-msg");
  fallbackErrMsg.innerText = "Ops! App is down :(";

  return fallbackErrMsg;
};

const createAppUI = async () => {
  const app = document.createElement("div");
  const appObj = appFactory();

  app.classList.add("app");

  try {
    const [data, locationName] = await utilityFunctions.getWeatherData(
      "London",
      "OH",
      "US"
    );

    appObj.updateMainData(data);
    appObj.updateLocationName(locationName);
    appObj.initializeSubData();

    app.append(createTopContainerUI(appObj), createBottomContainerUI(appObj));

    return app;
  } catch (err) {
    console.log(err);

    app.append(createFallbackErrMsgUI());

    return app;
  }
};

export default createAppUI;
