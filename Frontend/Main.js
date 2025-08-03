import { youngstersFieldsToHebrew, youngstersFields } from "./enums.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  setClock();
  updateLastEnterTime();

  const YOUNGSTERS_ID = "youngsters";
  const FRONTEND_URL = "http://localhost:4567/youngsters";
  youngsters = await fetchData(FRONTEND_URL);

  document
    .getElementById(START_CLOCK_ID)
    .addEventListener("click", manageClock);
  document
    .getElementById(YOUNGSTERS_ID)
    .addEventListener("click", showYoungsters);
  [...document.getElementsByClassName(SIDE_BUTTON_CLASS)].forEach((button) => {
    button.addEventListener("click", focusButton);
  });
  document
    .getElementById(YOUNGSTERS_DETAILS_ADDER_MODE_ID)
    .addEventListener("click", changeMode);

  lastFocusedButton().click();
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

let youngsters = [];

const START_CLOCK_ID = "start_clock";
const SIDE_BUTTON_CLASS = "side_button";
const ALL_DETAILS_DIV_ID = "all_details";
const TABLE_CONTAINER_CLASS = "table_container";
const ALL_DETAILS_TABLE_ID = "all_details_table";
const ALL_DETAIL_DATA_BOX_ID = "all_details_data_box";
const ARROW_UP_CLASS = "arrow_up";
const ARROW_DOWN_CLASS = "arrow_down";
const TABLE_ROW_CLASS = "table_row";
const YOUNGSTERS_DETAILS_ADDER_MODE_ID = "youngsters_details_adder_mode";
const SPECIFIC_DETAILS_BOXES_CONTAINER_ID = "specific_details_boxes_container";
const MULTIPLE_YOUNGSTERS_CLICKED_MODE_CLASS =
  "multiple_youngsters_clicked_mode";
const ONE_YOUNGSTER_CLICKED_MODE_CLASS = "one_youngster_clicked_mode";
const TOOLTIP_ID = "tooltip";
const HIDDEN_CLASS = "hidden";
const BUTTON_FOCUS_CLASS = "button_focus";
const IMAGE_BUTTON_TYPE = "image";
const TABLE_BUTTON_TYPE = "table";
const LOCALSTORAGE_CURRENT_SIDEBAR_BUTTON_PRESSED =
  "currentSidebarButtonPressed";
const LOCALSTORAGE_IS_CLOCK_RUNNING = "isClockRunning";
const LOCALSTORAGE_SORT_ARROW = "sortArrow";
const LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS = "currentlyClickedYoungsters";
const LOCALSTORAGE_CURRENT_MODE = "currentMode";

const setValueInLocalStorage = (currentValue, newValue) => {
  localStorage.setItem(currentValue, newValue);
};

const getValueFromLocalStorage = (value) => {
  return localStorage.getItem(value);
};

const removeValueFromLocalStorage = (value) => {
  localStorage.removeItem(value);
};

const sideButtons = [...document.getElementsByClassName(SIDE_BUTTON_CLASS)];

const imageDirectory = "./images";

const buttonToPageType = {
  aliens: IMAGE_BUTTON_TYPE,
  youngsters: TABLE_BUTTON_TYPE,
  management: IMAGE_BUTTON_TYPE,
  war: IMAGE_BUTTON_TYPE,
  galactic_space: IMAGE_BUTTON_TYPE,
};

const imageButtonToImagePath = {
  aliens: "aliens.png",
  management: "management.png",
  war: "war.png",
  galactic_space: "galactic_space.png",
};

const lastFocusedButton = () => {
  return getValueFromLocalStorage(
    LOCALSTORAGE_CURRENT_SIDEBAR_BUTTON_PRESSED
  ) === null
    ? sideButtons[0]
    : document.getElementById(
        getValueFromLocalStorage(LOCALSTORAGE_CURRENT_SIDEBAR_BUTTON_PRESSED)
      );
};

const focusButton = (event) => {
  const IMAGE_PAGE_ID = "image_page";
  const TABLE_PAGE_ID = "table_page";
  const MAIN_PAGE_ID = "main_image";

  const currentSidebarButtonPressed = document.getElementById(
    getValueFromLocalStorage(LOCALSTORAGE_CURRENT_SIDEBAR_BUTTON_PRESSED)
  );

  currentSidebarButtonPressed?.classList.remove(BUTTON_FOCUS_CLASS);

  if (buttonToPageType[event.target.id] === IMAGE_BUTTON_TYPE) {
    document.getElementById(IMAGE_PAGE_ID).classList.remove(HIDDEN_CLASS);
    document.getElementById(TABLE_PAGE_ID).classList.add(HIDDEN_CLASS);

    document.getElementById(MAIN_PAGE_ID).src = `${imageDirectory}/${
      imageButtonToImagePath[event.target.id]
    }`;
  } else {
    document.getElementById(TABLE_PAGE_ID).classList.remove(HIDDEN_CLASS);
    document.getElementById(IMAGE_PAGE_ID).classList.add(HIDDEN_CLASS);
  }

  event.target.classList.add(BUTTON_FOCUS_CLASS);
  setValueInLocalStorage(
    LOCALSTORAGE_CURRENT_SIDEBAR_BUTTON_PRESSED,
    event.target.id
  );
};

let clockInterval = null;

const setClock = () => {
  const is_clock_running = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_IS_CLOCK_RUNNING)
  );

  if (is_clock_running === null) {
    setValueInLocalStorage(
      LOCALSTORAGE_IS_CLOCK_RUNNING,
      JSON.stringify(false)
    );
  }

  manageClock();
};

const manageClock = (event) => {
  const isClockRunning = getClockState(event);

  if (isClockRunning === true) {
    showClockCurrentTime();
    clockInterval = setInterval(showClockCurrentTime, 1000);
    document.getElementById(START_CLOCK_ID).textContent = "הפסק";
  } else {
    showClockCurrentTime();
    clearInterval(clockInterval);
    document.getElementById(START_CLOCK_ID).textContent = "הפעל";
  }
};

const getClockState = (event) => {
  const isClockRunning = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_IS_CLOCK_RUNNING)
  );

  if (event !== undefined) {
    setValueInLocalStorage(
      LOCALSTORAGE_IS_CLOCK_RUNNING,
      JSON.stringify(!isClockRunning)
    );
    return !isClockRunning;
  }

  return isClockRunning;
};

const showClockCurrentTime = () => {
  const CLOCK_ID = "clock_value";

  document.getElementById(CLOCK_ID).textContent = new Date().toLocaleTimeString(
    "he-IL",
    {
      hour12: false,
    }
  );
};

const updateLastEnterTime = () => {
  const LAST_ENTER_ID = "last_enter";

  document.getElementById(
    LAST_ENTER_ID
  ).textContent = `הכניסה האחרונה שלך ${new Date().toLocaleTimeString("he-IL", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })}`;
};

const showYoungsters = () => {
  const tableData = [
    "YOUNGSTER_ID",
    "YOUNGSTER_NAME",
    "LOCATION",
    "PHONE_NUMBER",
  ];

  const allDetailsDiv = document.getElementById(ALL_DETAILS_DIV_ID);

  if (
    youngsters.length > 0 &&
    document.getElementsByClassName(TABLE_CONTAINER_CLASS)[0] === undefined
  ) {
    createTableBase(allDetailsDiv);

    const table = document.getElementById(ALL_DETAILS_TABLE_ID);

    createTableHeader(table, tableData);

    addYoungstersToTable(table, tableData, youngsters);

    setLastMode();
    setCurrentlyClickedYoungstersArray();
    setSortArrow();
  } else {
    console.error("youngsters is empty or currently shown");
  }
};

const createTableBase = (base) => {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add(TABLE_CONTAINER_CLASS);

  const tableDetailsDataBox = document.createElement("div");
  tableDetailsDataBox.id = ALL_DETAIL_DATA_BOX_ID;

  const table = document.createElement("table");
  table.id = ALL_DETAILS_TABLE_ID;

  tableDetailsDataBox.appendChild(table);
  tableContainer.appendChild(tableDetailsDataBox);

  base.appendChild(tableContainer);
};

const createTableHeader = (table, tableData) => {
  const DETAILS_TABLE_HEADER_ID = "details_table_header";

  const tableHeader = table.createTHead();
  tableHeader.classList.add(DETAILS_TABLE_HEADER_ID);
  const tableTitle = tableHeader.insertRow();

  for (let index = 0; index < tableData.length; index++) {
    createTableTitleColumn(tableTitle, tableData, index);
  }
};

const createTableTitleColumn = (tableTitle, tableData, index) => {
  const TABLE_TITLE_COLUMN_ID = "table_title_column";
  const TABLE_TITLE_COLUMN_BOX_ID = "table_title_column_box";
  const SORT_BUTTON_BOX_ID = "sort_buttons_box";

  const tableTitleColumn = tableTitle.insertCell();
  tableTitleColumn.classList.add(TABLE_TITLE_COLUMN_ID);
  tableTitleColumn.id = getIdOfYoungsterByColumn(index);

  const titleColumnBox = document.createElement("div");
  titleColumnBox.classList.add(TABLE_TITLE_COLUMN_BOX_ID);

  const titleText = document.createTextNode(
    youngstersFieldsToHebrew[tableData[index]]
  );

  const sortButtonsBox = document.createElement("div");
  sortButtonsBox.classList.add(SORT_BUTTON_BOX_ID);

  addSortingButtons(sortButtonsBox);

  titleColumnBox.appendChild(titleText);
  titleColumnBox.appendChild(sortButtonsBox);

  tableTitleColumn.appendChild(titleColumnBox);
};

const addSortingButtons = (sortButtonsBox) => {
  const arrowUp = document.createElement("div");
  arrowUp.classList.add(ARROW_UP_CLASS);
  arrowUp.addEventListener("click", sortTableByButton);
  const arrowDown = document.createElement("div");
  arrowDown.classList.add(ARROW_DOWN_CLASS);
  arrowDown.addEventListener("click", sortTableByButton);

  sortButtonsBox.appendChild(arrowUp);
  sortButtonsBox.appendChild(arrowDown);
};

const addYoungstersToTable = (table, tableData, youngsters) => {
  const tableBody = table.createTBody();

  youngsters.forEach((item) => {
    const tableRow = tableBody.insertRow();
    tableRow.classList.add(TABLE_ROW_CLASS);
    tableRow.setAttribute("tabindex", "0");
    tableRow.addEventListener("click", youngsterClickedEvent);
    tableRow.addEventListener("dblclick", removeSpecificYoungster);
    tableRow.id = youngsterNumberToYoungsterId(
      item[youngstersFields.YOUNGSTER_ID]
    );

    tableData.forEach((element) => {
      const tableColumn = tableRow.insertCell();
      tableColumn.appendChild(
        document.createTextNode(
          item[youngstersFields[element]] != undefined
            ? item[youngstersFields[element]]
            : ""
        )
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

  const tableBody = document.getElementById(ALL_DETAILS_TABLE_ID).children[1];

  const tableRows = [...tableBody.children];

  const arrowTypeToDirection = { up: -1, down: 1 };

  const ARROW_TYPE_UP = "up";
  const ARROW_TYPE_DOWN = "down";

  const arrowType = arrow.classList.contains(ARROW_UP_CLASS)
    ? ARROW_TYPE_UP
    : ARROW_TYPE_DOWN;

  arrowClickIndication(arrow, columnToSortBy, arrowType);

  tableRows
    .sort(compareTableRows(columnToSortBy, arrowTypeToDirection[arrowType]))
    .forEach((row) => tableBody.appendChild(row));

  const lastClickedYoungster = getLastClickedYoungsterElementFromLocalStorage();

  if (lastClickedYoungster) {
    scrollToTableRow(lastClickedYoungster);
  }
};

const arrowClickIndication = (arrowClicked, arrowColumn, arrowType) => {
  const ARROW_CLICKED_CLASS = "arrow_clicked";

  const previousArrowElement = getArrowElement();

  previousArrowElement.classList.remove(ARROW_CLICKED_CLASS);
  arrowClicked.classList.add(ARROW_CLICKED_CLASS);

  setValueInLocalStorage(
    LOCALSTORAGE_SORT_ARROW,
    `${arrowColumn}_${arrowType}`
  );
};

const getArrowElement = () => {
  const arrowOrderInArrowBox = { up: 0, down: 1 };

  const previousArrow = localStorage
    .getItem(LOCALSTORAGE_SORT_ARROW)
    .split("_");

  const previousArrowColumn = previousArrow[0];
  const previousArrowType = previousArrow[1];

  const previousArrowHeader = document.getElementById(
    getIdOfYoungsterByColumn(previousArrowColumn)
  );

  const previousArrowElement =
    previousArrowHeader.firstChild.lastChild.children[
      arrowOrderInArrowBox[previousArrowType]
    ];

  return previousArrowElement;
};

const getIdOfYoungsterByColumn = (column) => {
  return `youngsters_column_${column}`;
};

const compareTableRows = (columnNumber, arrowType) => (current, next) => {
  const currentValue = current.children[columnNumber].textContent;
  const nextValue = next.children[columnNumber].textContent;

  const parsedCurrentValue = getParsedIntValue(currentValue);

  const parsedNextValue = getParsedIntValue(nextValue);

  if (parsedNextValue > parsedCurrentValue) {
    return arrowType;
  } else if (parsedCurrentValue > parsedNextValue) {
    return -arrowType;
  }

  return 0;
};

const getParsedIntValue = (value) => {
  return Number.isNaN(parseInt(value)) ? value : parseInt(value);
};

const setSortArrow = () => {
  const sortArrow = getValueFromLocalStorage(LOCALSTORAGE_SORT_ARROW);

  if (sortArrow === null) {
    setValueInLocalStorage(LOCALSTORAGE_SORT_ARROW, "0_up");
  }

  getArrowElement().click();
};

const setCurrentlyClickedYoungstersArray = () => {
  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();

  removeValueFromLocalStorage(LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS);

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
  const currentMode = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_CURRENT_MODE)
  );

  changeModeInLocalStorage(
    currentMode === null ? ONE_SET_OF_DETAILS : currentMode
  );

  document.getElementById(YOUNGSTERS_DETAILS_ADDER_MODE_ID).click();
};

const changeMode = (event) => {
  const lastMode = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_CURRENT_MODE)
  );

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

  setValueInLocalStorage(LOCALSTORAGE_CURRENT_MODE, currentMode);

  return currentMode;
};

const matchSettingsToMode = (
  currentMode,
  currentlyClickedYoungsters,
  changeModeButton,
  lastClickedYoungster
) => {
  const YOUNGSTERS_DETAILS_ADDER_MODE_ACTIVE_CLASS =
    "youngsters_details_adder_mode_active";

  matchYoungstersSettingsToMode(
    lastClickedYoungster,
    currentMode,
    currentlyClickedYoungsters
  );

  if (currentMode === ONE_SET_OF_DETAILS) {
    const specificDetailsText = document.getElementById(
      SPECIFIC_DETAILS_BOXES_CONTAINER_ID
    );
    removeSpecificDetailsShown(specificDetailsText);
    changeModeButton.classList.remove(
      YOUNGSTERS_DETAILS_ADDER_MODE_ACTIVE_CLASS
    );
    changeModeButton.textContent = "+";
  } else {
    changeModeButton.classList.add(YOUNGSTERS_DETAILS_ADDER_MODE_ACTIVE_CLASS);
    changeModeButton.textContent = "-";
  }
};

const changeRowHoverColor = (currentMode) => {
  const CLASS_MODE_NAME = "table_row_multiple_mode";
  const rowsInMode = [...document.getElementsByClassName(CLASS_MODE_NAME)];

  if (currentMode === ONE_SET_OF_DETAILS) {
    rowsInMode.forEach((row) => {
      row.classList.remove(CLASS_MODE_NAME);
    });
  } else {
    const tableRows = [...document.getElementsByClassName(TABLE_ROW_CLASS)];
    tableRows.forEach((row) => {
      row.classList.add(CLASS_MODE_NAME);
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

  const currentMode = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_CURRENT_MODE)
  );

  const specificDetailsText = document.getElementById(
    SPECIFIC_DETAILS_BOXES_CONTAINER_ID
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

  lastClickedYoungster?.classList.remove(
    MULTIPLE_YOUNGSTERS_CLICKED_MODE_CLASS
  );
  lastClickedYoungster?.classList.add(ONE_YOUNGSTER_CLICKED_MODE_CLASS);
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

  setValueInLocalStorage(
    LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS,
    currentlyClickedYoungsters?.toString()
  );

  return currentlyClickedYoungsters;
};

const scrollToTableRow = (currentlyClickedYoungsterElement) => {
  const dataBox = document.getElementById(ALL_DETAIL_DATA_BOX_ID);

  const rowRect = currentlyClickedYoungsterElement.getBoundingClientRect();
  const containerRect = dataBox.getBoundingClientRect();

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

  if (currentlyClickedYoungsterElement != undefined) {
    changeBackgroundColorOfYoungsterBasedOnMode(
      currentlyClickedYoungsterElement
    );
  }
};

const clearCurrentlyClickedYoungsters = (currentlyClickedYoungsters) => {
  currentlyClickedYoungsters?.forEach((youngsterNumber) => {
    const youngster = document.getElementById(
      youngsterNumberToYoungsterId(youngsterNumber)
    );

    youngster.classList.remove(
      MULTIPLE_YOUNGSTERS_CLICKED_MODE_CLASS,
      ONE_YOUNGSTER_CLICKED_MODE_CLASS
    );
  });

  if (currentlyClickedYoungsters.length > 0) {
    setValueInLocalStorage(
      LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS,
      currentlyClickedYoungsters?.slice(0, 1).toString()
    );

    document
      .getElementById(
        youngsterNumberToYoungsterId(currentlyClickedYoungsters[0])
      )
      .classList.add(ONE_YOUNGSTER_CLICKED_MODE_CLASS);
  }
};

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index][youngstersFields.YOUNGSTER_ID] == youngsterNumber) {
      return youngsters[index];
    }
  }
};

const addDetails = (youngsterClicked, specificDetailsText, currentMode) => {
  const specifiedData = {
    [youngstersFields.YOUNGSTER_NAME]: "שם",
    [youngstersFields.HOBBY]: "תחביב",
    [youngstersFields.BOOK]: "ספר",
  };

  const SPECIFIC_DETAILS_BOX_CLASS = "specific_details_box";

  const detailsBox = document.createElement("div");
  detailsBox.id = `specific_details_youngster_${
    youngsterClicked[youngstersFields.YOUNGSTER_ID]
  }`;
  detailsBox.classList.add(SPECIFIC_DETAILS_BOX_CLASS);

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
  const SPECIFIC_DETAILS_TEXT_BOX_CLASS = "specific_details_text_box";
  const SPECIFIC_DETAILS_TEXT_CLASS = "specific_details_text";

  const attributeBox = document.createElement("div");
  const attribute = document.createElement("div");
  attributeBox.classList.add(SPECIFIC_DETAILS_TEXT_BOX_CLASS);
  attribute.textContent = `${specifiedData[key]}: ${youngsterClicked[key]}`;
  attribute.classList.add(SPECIFIC_DETAILS_TEXT_CLASS);
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
  toolTip.id = TOOLTIP_ID;
  event.target.appendChild(toolTip);
};

const removeSpecificDetailsToolTip = () => {
  document.getElementById(TOOLTIP_ID).remove();
};

const removeSpecificYoungster = (event) => {
  const specificDetailsText = document.getElementById(
    SPECIFIC_DETAILS_BOXES_CONTAINER_ID
  );

  const currentlyClickedYoungsterElement = event.target.parentElement;

  const youngsterNumber =
    currentlyClickedYoungsterElement.children[0].textContent;

  removeYoungsterBackground(currentlyClickedYoungsterElement);

  removeYoungsterByNumberFromLocalStorage(youngsterNumber);

  const specificDetailsToRemove =
    getSpecificDetailsBoxByYoungsterNumber(youngsterNumber);

  specificDetailsText.removeChild(specificDetailsToRemove);

  const lastClickedYoungster = getLastClickedYoungsterElementFromLocalStorage();

  if (lastClickedYoungster != undefined) {
    changeBackgroundColorOfYoungsterBasedOnMode(lastClickedYoungster);
  }
};

const getLastClickedYoungsterElementFromLocalStorage = () => {
  const lastClickedYoungsterNumber = getCurrentlyClickedYoungstersAsArray()[0];

  return document.getElementById(
    youngsterNumberToYoungsterId(lastClickedYoungsterNumber)
  );
};

const changeBackgroundColorOfYoungsterBasedOnMode = (youngsterElement) => {
  removeYoungsterBackground(youngsterElement);

  const currentMode = JSON.parse(
    getValueFromLocalStorage(LOCALSTORAGE_CURRENT_MODE)
  );

  youngsterElement.classList.add(
    `${
      currentMode === ONE_SET_OF_DETAILS
        ? ONE_YOUNGSTER_CLICKED_MODE_CLASS
        : MULTIPLE_YOUNGSTERS_CLICKED_MODE_CLASS
    }`
  );
};

const getCurrentlyClickedYoungstersAsArray = () => {
  const currentlyClickedYoungsters = localStorage
    .getItem(LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS)
    ?.split(",");

  if (currentlyClickedYoungsters === undefined) {
    return [];
  }

  return currentlyClickedYoungsters;
};

const removeYoungsterBackground = (youngsterElement) => {
  youngsterElement.classList.remove(
    MULTIPLE_YOUNGSTERS_CLICKED_MODE_CLASS,
    ONE_YOUNGSTER_CLICKED_MODE_CLASS
  );
};

const removeYoungsterByNumberFromLocalStorage = (youngsterNumber) => {
  const currentlyClickedYoungsters = getCurrentlyClickedYoungstersAsArray();

  const index = currentlyClickedYoungsters.indexOf(youngsterNumber);

  currentlyClickedYoungsters.splice(index, 1);

  if (currentlyClickedYoungsters.length === 0) {
    removeValueFromLocalStorage(LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS);
  } else {
    setValueInLocalStorage(
      LOCALSTORAGE_CURRENTLY_CLICKED_YOUNGSTERS,
      currentlyClickedYoungsters?.toString()
    );
  }
};
