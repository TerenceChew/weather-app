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

  // Updating
  const updateMainData = (newMainData) => {
    mainData = newMainData;
  };
  const updateLocationName = (newLocationName) => {
    locationName = newLocationName;
  };
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
    toggleTempMode,
    initializeSubData,
  };
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

    // const data = localStorage.weatherData
    //   ? JSON.parse(localStorage.weatherData)
    //   : "";
    // const locationName = localStorage.locationData
    //   ? JSON.parse(localStorage.locationData)
    //   : "";

    // console.log(data, locationName);

    // if (data && locationName) {
    //   appObj.updateMainData(data);
    //   appObj.updateLocationName(locationName);
    //   appObj.initializeSubData();

    //   console.log(appObj.getDailyData());
    //   console.log(appObj.getHourlyData());

    //   app.append(createTopContainerUI(appObj), createBottomContainerUI(appObj));

    //   return app;
    // }

    // const [d, l] = await utilityFunctions.getWeatherData("London", "KY", "US");

    // localStorage.weatherData = JSON.stringify(d);
    // localStorage.locationData = JSON.stringify(l);
  } catch (err) {
    console.log(err);

    const fallbackErrMsg = document.createElement("p");

    fallbackErrMsg.classList.add("fallback-err-msg");
    fallbackErrMsg.innerText = "Ops! App is down :(";

    app.append(fallbackErrMsg); // Or append a fallback UI

    return app;
  }
};

export default createAppUI;
