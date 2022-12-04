import "./app.css";

const appObj = {
  rawData: "",
  locationName: "",
};

const createAppUI = () => {
  const app = document.createElement("div");

  app.classList.add("app");

  return app;
};

export default createAppUI;
