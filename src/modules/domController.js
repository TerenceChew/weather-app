const updateAppUI = (topContainer, bottomContainer) => {
  const app = document.querySelector(".app");

  app.innerText = "";
  app.append(topContainer, bottomContainer);
};

const updateInfosContainerUI = (newInfosContainerUI) => {
  const bottomContainer = document.querySelector(".bottom-container");

  bottomContainer.lastElementChild.remove();
  bottomContainer.append(newInfosContainerUI);
};

export { updateAppUI, updateInfosContainerUI };
