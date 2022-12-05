import "./index.css";
import createAppUI from "./container/app";

const root = document.querySelector(".root");

createAppUI()
  .then((app) => root.append(app))
  .catch(console.log);
