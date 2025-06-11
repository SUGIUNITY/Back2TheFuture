// import { youngsters } from "./data.js";

const youngsters = [
  {
    "מספר הצעיר": 1,
    "שם הצעיר": "חבר פרבר",
    "מיקום המגורים": "פני חבר",
    טלפון: "058-5675444",
  },
  {
    "מספר הצעיר": 46,
    "שם הצעיר": "עדי שטיינר",
    "מיקום המגורים": "להבים",
    טלפון: "051-1234567",
  },
  {
    "מספר הצעיר": 99,
    "שם הצעיר": "סאני סימן-טוב",
    "מיקום המגורים": "חולון",
    טלפון: "012-1234567",
  },
];

//clock---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("start_clock").addEventListener("click", manageClock);
  document
    .getElementById("youngsters")
    .addEventListener("click", showYoungsters);
});

is_clock_running = false;
clockInterval = null;

manageClock = (event) => {
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

startClock = () => {
  document.getElementById("clock_value").textContent =
    new Date().toLocaleTimeString("he-IL", {
      hour12: false,
    });
};

//youngsters---------------------------------------------------------------

showYoungsters = (event) => {
  const tableData = ["מספר הצעיר", "שם הצעיר", "מיקום המגורים", "טלפון"];

  if (youngsters.length > 0) {
    const mainBox = document.getElementById("all_details");
    const table = document.createElement("table");

    table.style.width = "80%";
    table.style.textAlign = "start";
    table.style.fontWeight = "200";
    table.style.textWrap = "nowrap";

    // table title
    const tableTitle = table.insertRow();

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
  } else {
    console.log("youngsters is empty");
  }
};
