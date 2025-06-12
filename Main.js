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
});

//button pressed---------------------------------------------------------------------
let currentSidebarButtonPressed = null;

const focusButton = (event) => {
  currentSidebarButtonPressed?.classList.remove("button_focus");
  currentSidebarButtonPressed = event.target;
  currentSidebarButtonPressed.classList.add("button_focus");
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
    const mainBox = document.getElementById("all_details");
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

  tableData.forEach((key) => {
    const tableTitleColumn = tableTitle.insertCell();
    tableTitleColumn.style.backgroundColor = "black";
    tableTitleColumn.style.color = "white";

    tableTitleColumn.appendChild(document.createTextNode(key));
  });
};

const addYoungstersToTable = (table, tableData, youngsters) => {
  youngsters.forEach((item) => {
    const tableRow = table.insertRow();
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
const showSpecificDetailsOfYoungster = (event) => {
  matchSettingsToCurrentMode(event);

  const specifiedData = { "שם הצעיר": "שם", תחביב: "תחביב", ספר: "ספר" };

  const youngsterNumber = event.target.parentElement.children[0].textContent;
  const youngsterClicked = getYoungsterByNumber(youngsterNumber);

  //add specific details
  addDetails(specifiedData, youngsterClicked);
};

const matchSettingsToCurrentMode = (event) => {
  if (currentMode !== DETAILS_ADDER) {
    //clears currently clicked youngsters
    currentlyClickedYoungsters.forEach((youngster) => {
      youngster.classList.remove(
        "multiple_youngsters_clicked_mode",
        "one_youngster_clicked_mode"
      );
    });

    currentlyClickedYoungsters = [];
  }

  //adds to array
  event.target.parentElement.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? "one_youngster_clicked_mode"
        : "multiple_youngsters_clicked_mode"
    }`
  );

  currentlyClickedYoungsters.push(event.target.parentElement);
};

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index]["מספר הצעיר"] == youngsterNumber) {
      return youngsters[index];
    }
  }
};

const addDetails = (specifiedData, youngsterClicked) => {
  document.getElementById(
    "specific_details_text_name"
  ).textContent = `${specifiedData["שם הצעיר"]}: ${youngsterClicked["שם הצעיר"]}`;

  document.getElementById(
    "specific_details_text_hobby"
  ).textContent = `${specifiedData["תחביב"]}: ${youngsterClicked["תחביב"]}`;

  document.getElementById(
    "specific_details_text_book"
  ).textContent = `${specifiedData["ספר"]}: ${youngsterClicked["ספר"]}`;
};
