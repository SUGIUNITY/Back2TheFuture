import { youngsters } from "./data.js";

document.addEventListener("DOMContentLoaded", (event) => {
  manageClock();
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

//button pressed---------------------------------------------------------------------
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

//clock---------------------------------------------------------------------
let is_clock_running = true;
let clockInterval = null;

const manageClock = (event) => {
  if (is_clock_running) {
    startClock();
    clockInterval = setInterval(startClock, 1000);
    document.getElementById("start_clock").textContent = "הפסק";
  } else {
    clearTimeout(clockInterval);
    document.getElementById("start_clock").textContent = "הפעל";
  }

  is_clock_running = !is_clock_running;
};

const startClock = () => {
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

//youngsters---------------------------------------------------------------
const showYoungsters = (event) => {
  const tableData = ["מספר הצעיר", "שם הצעיר", "מיקום מגורים", "טלפון"];

  const allDetailsDiv = document.getElementById("all_details");

  if (
    youngsters.length > 0 &&
    document.getElementsByClassName("table_container")[0] === undefined
  ) {
    createTableBase(allDetailsDiv);

    const table = document.getElementById("all_details_table");

    // table title
    createTableHeader(table, tableData);

    //table data
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
    tableRow.addEventListener("click", showSpecificDetailsOfYoungster);
    tableRow.id = `youngster_${item["מספר הצעיר"]}`;

    tableData.forEach((element) => {
      const tableColumn = tableRow.insertCell();
      tableColumn.appendChild(
        document.createTextNode(item[element] != undefined ? item[element] : "")
      );
    });
  });
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

  const lastClickedYoungster = JSON.parse(
    localStorage.getItem("currentlyClickedYoungsters")
  )[0];

  if (lastClickedYoungster) {
    scrollToTableRow(document.getElementById(lastClickedYoungster));
  }
};

const arrowClickIndication = (arrowClicked, arrowColumn, arrowType) => {
  arrowClicked.classList.add("arrow_clicked");

  const previousArrowElement = getArrowElement();

  previousArrowElement.classList.remove("arrow_clicked");

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
  let currentValue = current.children[columnNumber].textContent;
  let nextValue = next.children[columnNumber].textContent;

  currentValue = Number.isNaN(parseInt(currentValue))
    ? currentValue
    : parseInt(currentValue);

  nextValue = Number.isNaN(parseInt(nextValue))
    ? nextValue
    : parseInt(nextValue);

  if (nextValue > currentValue) {
    return arrowType;
  } else if (currentValue > nextValue) {
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

//to local
// let currentlyClickedYoungsters = [];
// localStorage.setItem("currentlyClickedYoungsters", JSON.stringify([]));

const setCurrentlyClickedYoungstersArray = () => {
  let currentlyClickedYoungsters = JSON.parse(
    localStorage.getItem("currentlyClickedYoungsters")
  );

  localStorage.setItem("currentlyClickedYoungsters", JSON.stringify([]));

  if (currentlyClickedYoungsters !== null) {
    currentlyClickedYoungsters.reverse();
    currentlyClickedYoungsters.forEach((youngsterId) => {
      document.getElementById(youngsterId).firstChild.click();
    });
  }
};

const ONE_SET_OF_DETAILS = 1;
const DETAILS_ADDER = 2;

//specific details---------------------------------------------------------------
const setLastMode = () => {
  let currentMode = JSON.parse(localStorage.getItem("currentMode"));

  if (currentMode === null) {
    currentMode = ONE_SET_OF_DETAILS;
  }

  currentMode =
    currentMode === DETAILS_ADDER ? ONE_SET_OF_DETAILS : DETAILS_ADDER;

  localStorage.setItem("currentMode", currentMode);

  document.getElementById("youngsters_details_adder_mode").click();
};

const changeMode = (event) => {
  let currentMode = JSON.parse(localStorage.getItem("currentMode"));

  currentMode =
    currentMode === DETAILS_ADDER ? ONE_SET_OF_DETAILS : DETAILS_ADDER;

  localStorage.setItem("currentMode", currentMode);

  let currentlyClickedYoungsters = JSON.parse(
    localStorage.getItem("currentlyClickedYoungsters")
  );

  if (currentlyClickedYoungsters !== null) {
    const lastClickedYoungster = document.getElementById(
      currentlyClickedYoungsters[0]
    );

    if (currentMode === ONE_SET_OF_DETAILS) {
      clearCurrentlyClickedYoungsters(currentlyClickedYoungsters);

      if (lastClickedYoungster) {
        scrollToTableRow(lastClickedYoungster);
      }

      const specificDetailsText = document.getElementById(
        "specific_details_boxes_container"
      );
      removeSpecificDetailsShown(specificDetailsText);
      event.target.classList.remove("youngsters_details_adder_mode_active");
      event.target.textContent = "+";
    } else {
      lastClickedYoungster?.classList.add("multiple_youngsters_clicked_mode");
      lastClickedYoungster?.classList.remove("one_youngster_clicked_mode");

      event.target.classList.add("youngsters_details_adder_mode_active");
      event.target.textContent = "-";
    }
  }
};

const showSpecificDetailsOfYoungster = (event) => {
  const specifiedData = { "שם הצעיר": "שם", תחביב: "תחביב", ספר: "ספר" };

  const specificDetailsText = document.getElementById(
    "specific_details_boxes_container"
  );

  const currentlyClickedYoungsterElement = event.target.parentElement;

  //scroll to child
  scrollToTableRow(currentlyClickedYoungsterElement);

  const youngsterNumber =
    currentlyClickedYoungsterElement.children[0].textContent;
  const youngsterClicked = getYoungsterByNumber(youngsterNumber);

  let currentlyClickedYoungsters = JSON.parse(
    localStorage.getItem("currentlyClickedYoungsters")
  );

  if (
    !currentlyClickedYoungsters.includes(currentlyClickedYoungsterElement.id)
  ) {
    currentlyClickedYoungsters = [
      currentlyClickedYoungsterElement.id,
      ...currentlyClickedYoungsters,
    ];

    localStorage.setItem(
      "currentlyClickedYoungsters",
      JSON.stringify(currentlyClickedYoungsters)
    );

    const currentMode = JSON.parse(localStorage.getItem("currentMode"));

    matchSettingsToCurrentMode(
      currentlyClickedYoungsterElement,
      currentMode,
      currentlyClickedYoungsters
    );

    addDetails(
      specifiedData,
      youngsterClicked,
      specificDetailsText,
      currentMode
    );

    specificDetailsText.scrollTop = 0;
  } else {
    const index = currentlyClickedYoungsters.indexOf(
      currentlyClickedYoungsterElement.id
    );

    currentlyClickedYoungsterElement.classList.remove(
      "multiple_youngsters_clicked_mode",
      "one_youngster_clicked_mode"
    );

    currentlyClickedYoungsters.splice(index, 1);

    localStorage.setItem(
      "currentlyClickedYoungsters",
      JSON.stringify(currentlyClickedYoungsters)
    );

    const specificDetailsToRemove = document.getElementById(
      `specific_details_youngster_${youngsterClicked["מספר הצעיר"]}`
    );

    specificDetailsText.removeChild(specificDetailsToRemove);
  }
};

const scrollToTableRow = (currentlyClickedYoungsterElement) => {
  const dataBox = document.getElementById("all_details_data_box");

  dataBox.scrollTo({
    top: currentlyClickedYoungsterElement.offsetTop - dataBox.offsetTop,
    behavior: "smooth",
  });
};

const matchSettingsToCurrentMode = (
  currentlyClickedYoungsterElement,
  currentMode,
  currentlyClickedYoungsters
) => {
  if (currentMode !== DETAILS_ADDER) {
    clearCurrentlyClickedYoungsters(currentlyClickedYoungsters);
  }

  currentlyClickedYoungsterElement.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? "one_youngster_clicked_mode"
        : "multiple_youngsters_clicked_mode"
    }`
  );
};

const clearCurrentlyClickedYoungsters = (currentlyClickedYoungsters) => {
  //clears currently clicked youngsters exept first clicked
  currentlyClickedYoungsters.forEach((youngsterId) => {
    const youngster = document.getElementById(youngsterId);
    youngster.classList.remove(
      "multiple_youngsters_clicked_mode",
      "one_youngster_clicked_mode"
    );
  });

  if (currentlyClickedYoungsters.length > 0) {
    localStorage.setItem(
      "currentlyClickedYoungsters",
      JSON.stringify(currentlyClickedYoungsters.slice(0, 1))
    );

    document
      .getElementById(currentlyClickedYoungsters[0])
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

const addDetails = (
  specifiedData,
  youngsterClicked,
  specificDetailsText,
  currentMode
) => {
  //DETAILS_ADDER
  const detailsBox = document.createElement("div");
  detailsBox.id = `specific_details_youngster_${youngsterClicked["מספר הצעיר"]}`;
  detailsBox.classList.add("specific_details_box");

  specificDetailsText.insertBefore(detailsBox, specificDetailsText.firstChild);

  Object.keys(specifiedData).forEach((key) => {
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
  });

  // console.log(
  //   document
  //     .getElementsByClassName("specific_details_text")[0]
  //     .getBoundingClientRect()
  // );

  //ONE_SET_OF_DETAILS
  if (currentMode === ONE_SET_OF_DETAILS) {
    removeSpecificDetailsShown(specificDetailsText);
  }
};

const removeSpecificDetailsShown = (specificDetailsText) => {
  //removes all children of details exept first one
  let children = [...specificDetailsText.children];

  children = children.slice(1, children.length);

  children.forEach((child) => {
    specificDetailsText.removeChild(child);
  });

  // while (
  //   currentMode === ONE_SET_OF_DETAILS &&
  //   specificDetailsText.children.length > 1
  // ) {
  //   specificDetailsText.removeChild(specificDetailsText.firstChild);
  // }
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
