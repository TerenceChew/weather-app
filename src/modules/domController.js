const updateAppUI = (topContainer, bottomContainer) => {
  const app = document.querySelector(".app");

  app.innerText = "";
  app.append(topContainer, bottomContainer);
};

export { updateAppUI };
