import { youngsters } from "./data.js";

document.addEventListener("DOMContentLoaded", (event) => {
  setClock();
  updateLastEnterTime();

  document.getElementById("start_clock").addEventListener("click", manageClock);
  document
    .getElementById("youngsters")
    .addEventListener("click", showYoungsters);
  [...document.getElementsByClassName("side_button")].forEach((button) => {
    button.addEventListener("click", focusButton);
  });
  document
    .getElementById("youngsters_details_adder_mode")
    .addEventListener("click", changeMode);

  lastFocusedButton().click();
});

const sideButtons = [...document.getElementsByClassName("side_button")];

const imageDirectory = "./images";

const buttonToPageType = {
  aliens: "image",
  youngsters: "table",
  management: "image",
  war: "image",
  galactic_space: "image",
};

const imageButtonToImagePath = {
  aliens: "aliens.png",
  management: "management.png",
  war: "war.png",
  galactic_space: "galactic_space.png",
};

const lastFocusedButton = () => {
  return localStorage.getItem("currentSidebarButtonPressed") === null
    ? sideButtons[0]
    : document.getElementById(
        localStorage.getItem("currentSidebarButtonPressed")
      );
};

const focusButton = (event) => {
  const currentSidebarButtonPressed = document.getElementById(
    localStorage.getItem("currentSidebarButtonPressed")
  );

  currentSidebarButtonPressed?.classList.remove("button_focus");

  if (buttonToPageType[event.target.id] === "image") {
    document.getElementById("image_page").classList.remove("hidden");
    document.getElementById("table_page").classList.add("hidden");

    document.getElementById("main_image").src = `${imageDirectory}/${
      imageButtonToImagePath[event.target.id]
    }`;
  } else {
    document.getElementById("table_page").classList.remove("hidden");
    document.getElementById("image_page").classList.add("hidden");
  }

  event.target.classList.add("button_focus");
  localStorage.setItem("currentSidebarButtonPressed", event.target.id);
};

let clockInterval = null;

const setClock = () => {
  const is_clock_running = JSON.parse(localStorage.getItem("isClockRunning"));

  if (is_clock_running === null) {
    localStorage.setItem("isClockRunning", JSON.stringify(false));
  }

  manageClock();
};

const manageClock = (event) => {
  const isClockRunning = getClockState(event);

  if (isClockRunning === true) {
    showClockCurrentTime();
    clockInterval = setInterval(showClockCurrentTime, 1000);
    document.getElementById("start_clock").textContent = "הפסק";
  } else {
    showClockCurrentTime();
    clearInterval(clockInterval);
    document.getElementById("start_clock").textContent = "הפעל";
  }
};

const getClockState = (event) => {
  const isClockRunning = JSON.parse(localStorage.getItem("isClockRunning"));

  if (event !== undefined) {
    localStorage.setItem("isClockRunning", JSON.stringify(!isClockRunning));
    return !isClockRunning;
  }

  return isClockRunning;
};

const showClockCurrentTime = () => {
  document.getElementById("clock_value").textContent =
    new Date().toLocaleTimeString("he-IL", {
      hour12: false,
    });
};

const updateLastEnterTime = () => {
  document.getElementById(
    "last_enter"
  ).textContent = `הכניסה האחרונה שלך ${new Date().toLocaleTimeString("he-IL", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })}`;
};

const showYoungsters = (event) => {
  const tableData = ["מספר הצעיר", "שם הצעיר", "מיקום מגורים", "טלפון"];

  const allDetailsDiv = document.getElementById("all_details");

  if (
    youngsters.length > 0 &&
    document.getElementsByClassName("table_container")[0] === undefined
  ) {
    createTableBase(allDetailsDiv);

    const table = document.getElementById("all_details_table");

    createTableHeader(table, tableData);

    addYoungstersToTable(table, tableData, youngsters);

    setLastMode();
    setCurrentlyClickedYoungstersArray();
    setSortArrow();
  } else {
    console.log("youngsters is empty or currently shown");
  }
};

const createTableBase = (base) => {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table_container");

  const tableDetailsDataBox = document.createElement("div");
  tableDetailsDataBox.id = "all_details_data_box";

  const table = document.createElement("table");
  table.id = "all_details_table";

  tableDetailsDataBox.appendChild(table);
  tableContainer.appendChild(tableDetailsDataBox);

  base.appendChild(tableContainer);
};

const createTableHeader = (table, tableData) => {
  const tableHeader = table.createTHead();
  tableHeader.classList.add("details_table_header");
  const tableTitle = tableHeader.insertRow();

  for (let index = 0; index < tableData.length; index++) {
    createTableTitleColumn(tableTitle, tableData, index);
  }
};

const createTableTitleColumn = (tableTitle, tableData, index) => {
  const tableTitleColumn = tableTitle.insertCell();
  tableTitleColumn.classList.add("table_title_column");
  tableTitleColumn.id = `youngsters_column_${index}`;

  const titleColumnBox = document.createElement("div");
  titleColumnBox.classList.add("table_title_column_box");

  const titleText = document.createTextNode(tableData[index]);

  const sortButtonsBox = document.createElement("div");
  sortButtonsBox.classList.add("sort_buttons_box");

  addSortingButtons(sortButtonsBox);

  titleColumnBox.appendChild(titleText);
  titleColumnBox.appendChild(sortButtonsBox);

  tableTitleColumn.appendChild(titleColumnBox);
};

const addSortingButtons = (sortButtonsBox) => {
  const arrowUp = document.createElement("div");
  arrowUp.classList.add("arrow_up");
  arrowUp.addEventListener("click", sortTableByButton);
  const arrowDown = document.createElement("div");
  arrowDown.classList.add("arrow_down");
  arrowDown.addEventListener("click", sortTableByButton);

  sortButtonsBox.appendChild(arrowUp);
  sortButtonsBox.appendChild(arrowDown);
};

const addYoungstersToTable = (table, tableData, youngsters) => {
  const tableBody = table.createTBody();

  youngsters.forEach((item) => {
    const tableRow = tableBody.insertRow();
    tableRow.classList.add("table_row");
    tableRow.setAttribute("tabindex", "0");
    tableRow.addEventListener("click", youngsterClickedEvent);
    tableRow.addEventListener("dblclick", removeSpecificYoungster);
    tableRow.id = youngsterNumberToYoungsterId(item["מספר הצעיר"]);

    tableData.forEach((element) => {
      const tableColumn = tableRow.insertCell();
      tableColumn.appendChild(
        document.createTextNode(item[element] != undefined ? item[element] : "")
      );
    });
  });
};

const youngsterNumberToYoungsterId = (youngsterNumber) => {
  return `youngster_${youngsterNumber}`;
};

const sortTableByButton = (event) => {
  const arrow = event.target;

  const tableColumnTitle = arrow.parentElement.parentElement.parentElement.id;
  const columnToSortBy = tableColumnTitle.charAt(tableColumnTitle.length - 1);

  const tableBody = document.getElementById("all_details_table").children[1];

  const tableRows = [...tableBody.children];

  const arrowTypeToDirection = { up: -1, down: 1 };

  const arrowType = arrow.classList.contains("arrow_up") ? "up" : "down";

  arrowClickIndication(arrow, columnToSortBy, arrowType);

  tableRows
    .sort(compareTableRows(columnToSortBy, arrowTypeToDirection[arrowType]))
    .forEach((row) => tableBody.appendChild(row));

  const lastClickedYoungster = getCurrentlyClickedYoungstersAsArray()[0];

  if (lastClickedYoungster) {
    scrollToTableRow(
      document.getElementById(
        youngsterNumberToYoungsterId(lastClickedYoungster)
      )
    );
  }
};

const arrowClickIndication = (arrowClicked, arrowColumn, arrowType) => {
  const previousArrowElement = getArrowElement();

  previousArrowElement.classList.remove("arrow_clicked");
  arrowClicked.classList.add("arrow_clicked");

  localStorage.setItem("sortArrow", `${arrowColumn}_${arrowType}`);
};

const getArrowElement = () => {
  const arrowOrderInArrowBox = { up: 0, down: 1 };

  const previousArrow = localStorage.getItem("sortArrow").split("_");

  const previousArrowColumn = previousArrow[0];
  const previousArrowType = previousArrow[1];

  const previousArrowHeader = document.getElementById(
    `youngsters_column_${previousArrowColumn}`
  );

  const previousArrowElement =
    previousArrowHeader.firstChild.lastChild.children[
      arrowOrderInArrowBox[previousArrowType]
    ];

  return previousArrowElement;
};

const compareTableRows = (columnNumber, arrowType) => (current, next) => {
  const currentValue = current.children[columnNumber].textContent;
  const nextValue = next.children[columnNumber].textContent;

  const parsedCurrentValue = Number.isNaN(parseInt(currentValue))
    ? currentValue
    : parseInt(currentValue);

  const parsedNextValue = Number.isNaN(parseInt(nextValue))
    ? nextValue
    : parseInt(nextValue);

  if (parsedNextValue > parsedCurrentValue) {
    return arrowType;
  } else if (parsedCurrentValue > parsedNextValue) {
    return -arrowType;
  }

  return 0;
};

const setSortArrow = () => {
  const sortArrow = localStorage.getItem("sortArrow");

  if (sortArrow === null) {
    localStorage.setItem("sortArrow", "0_up");
  }

  getArrowElement().click();
};

const setCurrentlyClickedYoungstersArray = () => {
  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();

  localStorage.removeItem("currentlyClickedYoungsters");

  if (currentlyClickedYoungsters !== undefined) {
    const reversedCurrentlyClickedYoungsters = [
      ...currentlyClickedYoungsters,
    ].reverse();
    reversedCurrentlyClickedYoungsters.forEach((youngsterNumber) => {
      document
        .getElementById(youngsterNumberToYoungsterId(youngsterNumber))
        .firstChild.click();
    });
  }
};

const ONE_SET_OF_DETAILS = 1;
const DETAILS_ADDER = 2;

const setLastMode = () => {
  const currentMode = JSON.parse(localStorage.getItem("currentMode"));

  changeModeInLocalStorage(
    currentMode === null ? ONE_SET_OF_DETAILS : currentMode
  );

  document.getElementById("youngsters_details_adder_mode").click();
};

const changeMode = (event) => {
  const lastMode = JSON.parse(localStorage.getItem("currentMode"));

  const currentMode = changeModeInLocalStorage(lastMode);

  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();
  const lastClickedYoungster =
    currentlyClickedYoungsters === undefined
      ? undefined
      : document.getElementById(
          youngsterNumberToYoungsterId(currentlyClickedYoungsters[0])
        );

  matchSettingsToMode(
    currentMode,
    currentlyClickedYoungsters,
    event.target,
    lastClickedYoungster
  );

  changeRowHoverColor(currentMode);
};

const changeModeInLocalStorage = (lastMode) => {
  const currentMode =
    lastMode === DETAILS_ADDER ? ONE_SET_OF_DETAILS : DETAILS_ADDER;

  localStorage.setItem("currentMode", currentMode);

  return currentMode;
};

const matchSettingsToMode = (
  currentMode,
  currentlyClickedYoungsters,
  changeModeButton,
  lastClickedYoungster
) => {
  matchYoungstersSettingsToMode(
    lastClickedYoungster,
    currentMode,
    currentlyClickedYoungsters
  );

  if (currentMode === ONE_SET_OF_DETAILS) {
    // if (currentlyClickedYoungsters.youngsters) {
    //   clearCurrentlyClickedYoungsters(currentlyClickedYoungsters.youngsters);
    // }

    const specificDetailsText = document.getElementById(
      "specific_details_boxes_container"
    );
    removeSpecificDetailsShown(specificDetailsText);
    changeModeButton.classList.remove("youngsters_details_adder_mode_active");
    changeModeButton.textContent = "+";
  } else {
    // lastClickedYoungster?.classList.add("multiple_youngsters_clicked_mode");
    // lastClickedYoungster?.classList.remove("one_youngster_clicked_mode");

    changeModeButton.classList.add("youngsters_details_adder_mode_active");
    changeModeButton.textContent = "-";
  }
};

const changeRowHoverColor = (currentMode) => {
  const classModeName = "table_row_multiple_mode";
  const rowsInMode = [...document.getElementsByClassName(classModeName)];

  if (currentMode === ONE_SET_OF_DETAILS) {
    rowsInMode.forEach((row) => {
      row.classList.remove(classModeName);
    });
  } else {
    const tableRows = [...document.getElementsByClassName("table_row")];
    tableRows.forEach((row) => {
      row.classList.add(classModeName);
    });
  }
};

const youngsterClickedEvent = (event) => {
  const currentlyClickedYoungsterElement = event.target.parentElement;

  scrollToTableRow(currentlyClickedYoungsterElement);

  const youngsterNumber =
    currentlyClickedYoungsterElement.children[0].textContent;
  const youngsterClicked = getYoungsterByNumber(youngsterNumber);

  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();

  resetLastClickedYoungsterBackground(currentlyClickedYoungsters);

  const currentMode = JSON.parse(localStorage.getItem("currentMode"));

  const specificDetailsText = document.getElementById(
    "specific_details_boxes_container"
  );

  manageClickedYoungster(
    currentlyClickedYoungsters,
    youngsterNumber,
    currentlyClickedYoungsterElement,
    youngsterClicked,
    currentMode,
    specificDetailsText
  );

  specificDetailsText.scrollTop = 0;
};

const manageClickedYoungster = (
  currentlyClickedYoungsters,
  youngsterNumber,
  currentlyClickedYoungsterElement,
  youngsterClicked,
  currentMode,
  specificDetailsText
) => {
  if (!currentlyClickedYoungsters.includes(youngsterNumber)) {
    updateClickedYoungstersAndApplyMode(
      youngsterNumber,
      currentlyClickedYoungsters,
      currentlyClickedYoungsterElement,
      currentMode
    );

    addDetails(youngsterClicked, specificDetailsText, currentMode);
  } else {
    clickedOnPreviouslyClickedYoungster(
      currentlyClickedYoungsters,
      youngsterNumber,
      currentlyClickedYoungsterElement,
      currentMode,
      specificDetailsText
    );
  }
};

const clickedOnPreviouslyClickedYoungster = (
  currentlyClickedYoungsters,
  youngsterNumber,
  currentlyClickedYoungsterElement,
  currentMode,
  specificDetailsText
) => {
  currentlyClickedYoungsters = removeYoungsterFromYoungstersArray(
    youngsterNumber,
    currentlyClickedYoungsters
  );
  updateClickedYoungstersAndApplyMode(
    youngsterNumber,
    currentlyClickedYoungsters,
    currentlyClickedYoungsterElement,
    currentMode
  );

  const clickedDetailsBox =
    getSpecificDetailsBoxByYoungsterNumber(youngsterNumber);
  relocateToFirstSpecificDetails(specificDetailsText, clickedDetailsBox);
};

const removeYoungsterFromYoungstersArray = (
  youngsterNumber,
  currentlyClickedYoungsters
) => {
  const index = currentlyClickedYoungsters.indexOf(youngsterNumber);
  currentlyClickedYoungsters.splice(index, 1);

  return currentlyClickedYoungsters;
};

const updateClickedYoungstersAndApplyMode = (
  youngsterNumber,
  currentlyClickedYoungsters,
  currentlyClickedYoungsterElement,
  currentMode
) => {
  currentlyClickedYoungsters = addCurrentlyClickedToYoungsters(
    youngsterNumber,
    currentlyClickedYoungsters
  );

  matchYoungstersSettingsToMode(
    currentlyClickedYoungsterElement,
    currentMode,
    currentlyClickedYoungsters
  );
};

const resetLastClickedYoungsterBackground = (currentlyClickedYoungsters) => {
  const lastClickedYoungster = document.getElementById(
    youngsterNumberToYoungsterId(currentlyClickedYoungsters[0])
  );

  lastClickedYoungster?.classList.remove("multiple_youngsters_clicked_mode");
  lastClickedYoungster?.classList.add("one_youngster_clicked_mode");
};

const getSpecificDetailsBoxByYoungsterNumber = (youngsterNumber) => {
  return document.getElementById(
    `specific_details_youngster_${youngsterNumber}`
  );
};

const addCurrentlyClickedToYoungsters = (
  youngsterNumber,
  currentlyClickedYoungsters
) => {
  currentlyClickedYoungsters = [youngsterNumber, ...currentlyClickedYoungsters];

  localStorage.setItem(
    "currentlyClickedYoungsters",
    currentlyClickedYoungsters?.toString()
  );

  return currentlyClickedYoungsters;
};

const scrollToTableRow = (currentlyClickedYoungsterElement) => {
  const dataBox = document.getElementById("all_details_data_box");

  const rowRect = currentlyClickedYoungsterElement.getBoundingClientRect();
  const containerRect = dataBox.getBoundingClientRect();

  //need to fix jumping on reload
  if (
    rowRect.bottom > 0.95 * containerRect.bottom ||
    rowRect.top < 1.3 * containerRect.top
  ) {
    dataBox.scrollTo({
      top: currentlyClickedYoungsterElement.offsetTop - dataBox.offsetTop * 2,
      behavior: "smooth",
    });
  }
};

const matchYoungstersSettingsToMode = (
  currentlyClickedYoungsterElement,
  currentMode,
  currentlyClickedYoungsters
) => {
  if (currentMode !== DETAILS_ADDER) {
    clearCurrentlyClickedYoungsters(currentlyClickedYoungsters);
  }

  currentlyClickedYoungsterElement?.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? "one_youngster_clicked_mode"
        : "multiple_youngsters_clicked_mode"
    }`
  );
};

const clearCurrentlyClickedYoungsters = (currentlyClickedYoungsters) => {
  currentlyClickedYoungsters?.forEach((youngsterNumber) => {
    const youngster = document.getElementById(
      youngsterNumberToYoungsterId(youngsterNumber)
    );

    youngster.classList.remove(
      "multiple_youngsters_clicked_mode",
      "one_youngster_clicked_mode"
    );
  });

  if (currentlyClickedYoungsters.length > 0) {
    localStorage.setItem(
      "currentlyClickedYoungsters",
      currentlyClickedYoungsters?.slice(0, 1).toString()
    );

    document
      .getElementById(
        youngsterNumberToYoungsterId(currentlyClickedYoungsters[0])
      )
      .classList.add("one_youngster_clicked_mode");
  }
};

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index]["מספר הצעיר"] == youngsterNumber) {
      return youngsters[index];
    }
  }
};

const addDetails = (youngsterClicked, specificDetailsText, currentMode) => {
  const specifiedData = { "שם הצעיר": "שם", תחביב: "תחביב", ספר: "ספר" };

  const detailsBox = document.createElement("div");
  detailsBox.id = `specific_details_youngster_${youngsterClicked["מספר הצעיר"]}`;
  detailsBox.classList.add("specific_details_box");

  relocateToFirstSpecificDetails(specificDetailsText, detailsBox);

  Object.keys(specifiedData).forEach((key) => {
    createSpecificDetail(youngsterClicked, key, detailsBox, specifiedData);
  });

  if (currentMode === ONE_SET_OF_DETAILS) {
    removeSpecificDetailsShown(specificDetailsText);
  }
};

const relocateToFirstSpecificDetails = (specificDetailsText, detailsBox) => {
  specificDetailsText.insertBefore(detailsBox, specificDetailsText.firstChild);
};

const removeSpecificDetailsShown = (specificDetailsText) => {
  const children = [...specificDetailsText.children];

  const childrenWithoutFirst = children.slice(1, children.length);

  childrenWithoutFirst.forEach((child) => {
    specificDetailsText.removeChild(child);
  });
};

const createSpecificDetail = (
  youngsterClicked,
  key,
  detailsBox,
  specifiedData
) => {
  const attributeBox = document.createElement("div");
  const attribute = document.createElement("div");
  attributeBox.classList.add("specific_details_text_box");
  attribute.textContent = `${specifiedData[key]}: ${youngsterClicked[key]}`;
  attribute.classList.add("specific_details_text");
  attributeBox.appendChild(attribute);

  detailsBox.appendChild(attributeBox);

  if (attribute.offsetWidth < attribute.scrollWidth) {
    attributeBox.addEventListener("mouseenter", createSpecificDetailsToolTip);
    attributeBox.addEventListener("mouseleave", removeSpecificDetailsToolTip);
  }
};

const createSpecificDetailsToolTip = (event) => {
  const toolTip = document.createElement("span");
  toolTip.textContent = event.target.textContent;
  toolTip.id = "tooltip";
  event.target.appendChild(toolTip);
};

const removeSpecificDetailsToolTip = (event) => {
  document.getElementById("tooltip").remove();
};

const removeSpecificYoungster = (event) => {
  const specificDetailsText = document.getElementById(
    "specific_details_boxes_container"
  );

  const currentlyClickedYoungsterElement = event.target.parentElement;

  const youngsterNumber =
    currentlyClickedYoungsterElement.children[0].textContent;

  removeYoungsterBackground(currentlyClickedYoungsterElement);

  removeYoungsterByNumberFromLocalStorage(youngsterNumber);

  const specificDetailsToRemove =
    getSpecificDetailsBoxByYoungsterNumber(youngsterNumber);

  specificDetailsText.removeChild(specificDetailsToRemove);
};

const getCurrentlyClickedYoungstersAsArray = () => {
  const currentlyClickedYoungsters = localStorage
    .getItem("currentlyClickedYoungsters")
    ?.split(",");

  if (currentlyClickedYoungsters === undefined) {
    return [];
  }

  return currentlyClickedYoungsters;
};

const removeYoungsterBackground = (youngsterElement) => {
  youngsterElement.classList.remove(
    "multiple_youngsters_clicked_mode",
    "one_youngster_clicked_mode"
  );
};

const removeYoungsterByNumberFromLocalStorage = (youngsterNumber) => {
  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();

  const index = currentlyClickedYoungsters.indexOf(youngsterNumber);

  currentlyClickedYoungsters.splice(index, 1);

  if (currentlyClickedYoungsters.length === 0) {
    localStorage.removeItem("currentlyClickedYoungsters");
  } else {
    localStorage.setItem(
      "currentlyClickedYoungsters",
      currentlyClickedYoungsters?.toString()
    );
  }
};
