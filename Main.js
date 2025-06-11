import { youngsters } from "./data.js";

//clock---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("start_clock").addEventListener("click", manageClock);
  document
    .getElementById("youngsters")
    .addEventListener("click", showYoungsters);
});

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
    const tableHeader = table.createTHead();
    const tableTitle = tableHeader.insertRow();

    tableData.forEach((key) => {
      const tableTitleColumn = tableTitle.insertCell();
      tableTitleColumn.style.backgroundColor = "black";
      tableTitleColumn.style.color = "white";
      tableTitleColumn.style.paddingRight = "1vw";
      tableTitleColumn.appendChild(document.createTextNode(key));
    });

    //table data
    youngsters.forEach((item) => {
      const tableRow = table.insertRow();
      tableRow.classList.add("table_row");
      tableRow.addEventListener("click", showSpecificDetailsOfYoungster);

      tableData.forEach((element) => {
        const tableColumn = tableRow.insertCell();
        tableColumn.style.paddingRight = "1vw";
        tableColumn.appendChild(
          document.createTextNode(
            item[element] != undefined ? item[element] : ""
          )
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

    mainBox.appendChild(table);
    tableShown = true;
  } else {
    console.log("youngsters is empty or currently shown");
  }
};

//specific details
const showSpecificDetailsOfYoungster = (event) => {
  const specifiedData = { "שם הצעיר": "שם", תחביב: "תחביב", ספר: "ספר" };

  const youngsterNumber = event.target.parentElement.children[0].textContent;
  const youngsterClicked = getYoungsterByNumber(youngsterNumber);

  //add specific details
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

const getYoungsterByNumber = (youngsterNumber) => {
  for (let index = 0; index < youngsters.length; index++) {
    if (youngsters[index]["מספר הצעיר"] == youngsterNumber) {
      return youngsters[index];
    }
  }
};
