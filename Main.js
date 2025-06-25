import { youngsters } from "./data.js";

document.addEventListener("DOMContentLoaded", (event) => {
  manageClock();
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
let currentSidebarButtonPressed = null;

const focusButton = (event) => {
  if (currentSidebarButtonPressed) {
    currentSidebarButtonPressed.classList.remove("button_focus");
    document
      .getElementById(`${currentSidebarButtonPressed.id}_page`)
      .classList.add("hidden");
  }
  currentSidebarButtonPressed = event.target;
  currentSidebarButtonPressed.classList.add("button_focus");
  document.getElementById(`${event.target.id}_page`).classList.remove("hidden");
};

//clock---------------------------------------------------------------------
let is_clock_running = false;
let clockInterval = null;

const manageClock = (event) => {
  is_clock_running = !is_clock_running;

  if (is_clock_running) {
    startClock();
    clockInterval = setInterval(startClock, 1000);
    document.getElementById("start_clock").textContent = "הפסק";
  } else {
    clearTimeout(clockInterval);
    document.getElementById("start_clock").textContent = "הפעל";
  }
};

const startClock = () => {
  document.getElementById("clock_value").textContent =
    new Date().toLocaleTimeString("he-IL", {
      hour12: false,
    });
};

//youngsters---------------------------------------------------------------
let tableShown = false;

const showYoungsters = (event) => {
  const tableData = ["מספר הצעיר", "שם הצעיר", "מיקום מגורים", "טלפון"];

  if (youngsters.length > 0 && !tableShown) {
    const mainBox = document.getElementById("all_details_data");
    const table = document.createElement("table");

    table.style.width = "100%";
    table.style.textAlign = "start";
    table.style.fontWeight = "200";
    table.style.textWrap = "nowrap";

    // table title
    createTableHeader(table, tableData);

    //table data
    addYoungstersToTable(table, tableData, youngsters);

    mainBox.appendChild(table);
    tableShown = true;
  } else {
    console.log("youngsters is empty or currently shown");
  }
};

const createTableHeader = (table, tableData) => {
  const tableHeader = table.createTHead();
  const tableTitle = tableHeader.insertRow();
  tableHeader.style.top = 0;
  tableHeader.style.position = "sticky";

  tableData.forEach((key) => {
    const tableTitleColumn = tableTitle.insertCell();
    tableTitleColumn.style.backgroundColor = "black";
    tableTitleColumn.style.color = "white";

    tableTitleColumn.appendChild(document.createTextNode(key));
  });
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
    //   const youngstersValues = Object.values(item);

    //   youngstersValues.forEach((value) => {
    //     if (tableData.includes(value)) {
    //       const tableColumn = tableRow.insertCell();
    //       tableColumn.style.paddingRight = "1vw";
    //       tableColumn.appendChild(document.createTextNode(value));
    //     } else {
    //       console.log(tableData);
    //       console.log(value);
    //     }
    //   });
  });
};

let currentlyClickedYoungsters = [];
const ONE_SET_OF_DETAILS = 1;
const DETAILS_ADDER = 2;
let currentMode = ONE_SET_OF_DETAILS;

//specific details---------------------------------------------------------------
const detailsAdderMode = (event) => {
  if (currentMode === DETAILS_ADDER) {
    currentMode = ONE_SET_OF_DETAILS;

    clearCurrentlyClickedYoungsters();
    const specificDetailsText = document.getElementById(
      "specific_details_boxes_container"
    );
    removeSpecificDetailsShown(specificDetailsText);
    event.target.classList.remove("youngsters_details_adder_mode_active");
    event.target.textContent = "+";
  } else {
    currentMode = DETAILS_ADDER;

    currentlyClickedYoungsters[0].classList.add(
      "multiple_youngsters_clicked_mode"
    );
    currentlyClickedYoungsters[0].classList.remove(
      "one_youngster_clicked_mode"
    );

    event.target.classList.add("youngsters_details_adder_mode_active");
    event.target.textContent = "-";
  }
};

const showSpecificDetailsOfYoungster = (event) => {
  if (!currentlyClickedYoungsters.includes(event.target.parentElement)) {
    currentlyClickedYoungsters.push(event.target.parentElement);

    matchSettingsToCurrentMode(event);

    const specifiedData = { "שם הצעיר": "שם", תחביב: "תחביב", ספר: "ספר" };

    const youngsterNumber = event.target.parentElement.children[0].textContent;
    const youngsterClicked = getYoungsterByNumber(youngsterNumber);

    //add specific details
    addDetails(specifiedData, youngsterClicked);
  }
};

const matchSettingsToCurrentMode = (event) => {
  if (currentMode !== DETAILS_ADDER) {
    clearCurrentlyClickedYoungsters();
  }

  //adds to array
  event.target.parentElement.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? "one_youngster_clicked_mode"
        : "multiple_youngsters_clicked_mode"
    }`
  );
};

const clearCurrentlyClickedYoungsters = () => {
  //clears currently clicked youngsters exept last clicked
  currentlyClickedYoungsters.forEach((youngster) => {
    youngster.classList.remove(
      "multiple_youngsters_clicked_mode",
      "one_youngster_clicked_mode"
    );
  });

  currentlyClickedYoungsters = currentlyClickedYoungsters.slice(-1);

  currentlyClickedYoungsters[0]?.classList.add("one_youngster_clicked_mode");
};

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index]["מספר הצעיר"] == youngsterNumber) {
      return youngsters[index];
    }
  }
};

const addDetails = (specifiedData, youngsterClicked) => {
  const specificDetailsText = document.getElementById(
    "specific_details_boxes_container"
  );

  //DETAILS_ADDER
  const detailsBox = document.createElement("div");
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

  specificDetailsText.appendChild(detailsBox);

  //ONE_SET_OF_DETAILS
  removeSpecificDetailsShown(specificDetailsText);
};

const removeSpecificDetailsShown = (specificDetailsText) => {
  //removes all children of details exept last one
  while (
    currentMode === ONE_SET_OF_DETAILS &&
    specificDetailsText.children.length > 1
  ) {
    specificDetailsText.removeChild(specificDetailsText.firstChild);
  }
};
