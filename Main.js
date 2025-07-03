import { youngsters } from "./data.js";

document.addEventListener("DOMContentLoaded", (event) => {
  manageClock();
  updateLastEnterTime();
  focusButton({ target: sideButtons[0] });
  document.getElementById("start_clock").addEventListener("click", manageClock);
  document
    .getElementById("youngsters")
    .addEventListener("click", showYoungsters);
  [...document.getElementsByClassName("side_button")].forEach((button) => {
    button.addEventListener("click", focusButton);
  });
  document
    .getElementById("youngsters_details_adder_mode")
    .addEventListener("click", detailsAdderMode);
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

//TODO: needs to make localstorage
let currentSidebarButtonPressed = null;

const focusButton = (event) => {
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

  currentSidebarButtonPressed = event.target;
  currentSidebarButtonPressed.classList.add("button_focus");
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

  let tableRows = [...tableBody.children];

  const arrowType = arrow.classList.contains("arrow_up") ? -1 : 1;

  tableRows
    .sort(compareTableRows(columnToSortBy, arrowType))
    .forEach((row) => tableBody.appendChild(row));
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

let currentlyClickedYoungsters = [];
const ONE_SET_OF_DETAILS = 1;
const DETAILS_ADDER = 2;

//TODO: add to local storage
let currentMode = ONE_SET_OF_DETAILS;

//specific details---------------------------------------------------------------
const detailsAdderMode = (event) => {
  if (currentMode === DETAILS_ADDER) {
    currentMode = ONE_SET_OF_DETAILS;

    clearCurrentlyClickedYoungsters();

    scrollToTableRow(currentlyClickedYoungsters[0]);

    const specificDetailsText = document.getElementById(
      "specific_details_boxes_container"
    );
    removeSpecificDetailsShown(specificDetailsText);
    event.target.classList.remove("youngsters_details_adder_mode_active");
    event.target.textContent = "+";
  } else {
    currentMode = DETAILS_ADDER;

    currentlyClickedYoungsters[0]?.classList.add(
      "multiple_youngsters_clicked_mode"
    );
    currentlyClickedYoungsters[0]?.classList.remove(
      "one_youngster_clicked_mode"
    );

    event.target.classList.add("youngsters_details_adder_mode_active");
    event.target.textContent = "-";
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

  if (!currentlyClickedYoungsters.includes(currentlyClickedYoungsterElement)) {
    currentlyClickedYoungsters = [
      currentlyClickedYoungsterElement,
      ...currentlyClickedYoungsters,
    ];

    matchSettingsToCurrentMode(currentlyClickedYoungsterElement);

    addDetails(specifiedData, youngsterClicked, specificDetailsText);
  } else {
    const index = currentlyClickedYoungsters.indexOf(
      currentlyClickedYoungsterElement
    );
    currentlyClickedYoungsters.splice(index, 1);
    currentlyClickedYoungsters = [
      currentlyClickedYoungsterElement,
      ...currentlyClickedYoungsters,
    ];

    if (specificDetailsText.children.length > 1) {
      const childInSpecificDetailsBox = document.getElementById(
        `specific_details_youngster_${youngsterNumber}`
      );

      specificDetailsText.insertBefore(
        childInSpecificDetailsBox,
        specificDetailsText.firstChild
      );
    }
  }

  specificDetailsText.scrollTop = 0;
};

const scrollToTableRow = (currentlyClickedYoungsterElement) => {
  const scrollDiv = document.getElementsByClassName("scroll")[0];

  scrollDiv.scrollTo({
    top: currentlyClickedYoungsterElement.offsetTop - scrollDiv.offsetTop,
    behavior: "smooth",
  });
};

const matchSettingsToCurrentMode = (currentlyClickedYoungsterElement) => {
  if (currentMode !== DETAILS_ADDER) {
    clearCurrentlyClickedYoungsters();
  }

  currentlyClickedYoungsterElement.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? "one_youngster_clicked_mode"
        : "multiple_youngsters_clicked_mode"
    }`
  );
};

const clearCurrentlyClickedYoungsters = () => {
  //clears currently clicked youngsters exept first clicked
  currentlyClickedYoungsters.forEach((youngster) => {
    youngster.classList.remove(
      "multiple_youngsters_clicked_mode",
      "one_youngster_clicked_mode"
    );
  });

  if (currentlyClickedYoungsters.length > 0) {
    currentlyClickedYoungsters = currentlyClickedYoungsters.slice(0, 1);

    currentlyClickedYoungsters[0].classList.add("one_youngster_clicked_mode");
  }
};

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index]["מספר הצעיר"] == youngsterNumber) {
      return youngsters[index];
    }
  }
};

const addDetails = (specifiedData, youngsterClicked, specificDetailsText) => {
  //DETAILS_ADDER
  const detailsBox = document.createElement("div");
  detailsBox.id = `specific_details_youngster_${youngsterClicked["מספר הצעיר"]}`;
  detailsBox.classList.add("specific_details_box");

  const youngsterNameText = document.createElement("span");
  youngsterNameText.textContent = `${specifiedData["שם הצעיר"]}: ${youngsterClicked["שם הצעיר"]}`;
  detailsBox.appendChild(youngsterNameText);

  const habbitText = document.createElement("span");
  habbitText.textContent = `${specifiedData["תחביב"]}: ${youngsterClicked["תחביב"]}`;
  detailsBox.appendChild(habbitText);

  const bookText = document.createElement("span");
  bookText.textContent = `${specifiedData["ספר"]}: ${youngsterClicked["ספר"]}`;
  detailsBox.appendChild(bookText);

  specificDetailsText.insertBefore(detailsBox, specificDetailsText.firstChild);

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
