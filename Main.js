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
    deleteTable();

    document.getElementById("main_image").src = `${imageDirectory}/${
      imageButtonToImagePath[event.target.id]
    }`;
  } else {
    document.getElementById("table_page").classList.remove("hidden");
    document.getElementById("image_page").classList.add("hidden");
  }

  currentSidebarButtonPressed = event.target;
};

const deleteTable = () => {
  document.getElementsByClassName("table_container")[0]?.remove();
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

  const tableScroll = document.createElement("div");
  tableScroll.classList.add("scroll");

  const tableDetailsDataBox = document.createElement("div");
  tableDetailsDataBox.id = "all_details_data_box";

  const table = document.createElement("table");
  table.id = "all_details_table";

  tableDetailsDataBox.appendChild(table);
  tableScroll.appendChild(tableDetailsDataBox);
  tableContainer.appendChild(tableScroll);
  base.appendChild(tableContainer);
};

const createTableHeader = (table, tableData) => {
  const tableHeader = table.createTHead();
  tableHeader.classList.add("details_table_header");
  const tableTitle = tableHeader.insertRow();

  tableData.forEach((key) => {
    const tableTitleColumn = tableTitle.insertCell();
    tableTitleColumn.classList.add("table_title_column");

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

      console.log(childInSpecificDetailsBox);
      console.log(specificDetailsText);
      specificDetailsText.removeChild(childInSpecificDetailsBox);
      specificDetailsText.insertBefore(
        childInSpecificDetailsBox,
        specificDetailsText.firstChild
      );
    }
  }

  specificDetailsText.scrollTop = 0;
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

  console.log(children);

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
