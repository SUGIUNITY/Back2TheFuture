// import { youngsters } from "./data.js";

const youngsters = [
  {
    "מספר צעיר": 1,
    "שם הצעיר": "חבר פרבר",
    "מיקום מגורים": "פני חבר",
    טלפון: "058-5675444",
  },
  {
    "מספר צעיר": 46,
    "שם הצעיר": "עדי שטיינר",
    "מיקום מגורים": "להבים",
    טלפון: "051-1234567",
  },
  {
    "מספר צעיר": 99,
    "שם הצעיר": "סאני סימן-טוב",
    "מיקום מגורים": "חולון",
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
  if (youngsters.length > 0) {
    const mainBox = document.getElementById("all_details");
    const table = document.createElement("table");

    table.style.width = "80%";
    table.style.textAlign = "start";
    table.style.fontWeight = "200";
    table.style.textWrap = "nowrap";

    // table title
    const youngstersKeys = Object.keys(youngsters[0]);
    const tableTitle = table.insertRow();

    youngstersKeys.forEach((key) => {
      const tableTitleColumn = tableTitle.insertCell();
      tableTitleColumn.style.backgroundColor = "black";
      tableTitleColumn.style.color = "white";
      tableTitleColumn.style.paddingRight = "1vw";
      tableTitleColumn.appendChild(document.createTextNode(key));
    });

    let isEven = true;

    youngsters.forEach((item) => {
      const tableRow = table.insertRow();

      if (isEven) {
        tableRow.style.backgroundColor = "#8080806b";
      } else {
        tableRow.style.backgroundColor = "#95a7e3b8";
      }

      isEven = !isEven;

      const youngstersValues = Object.values(item);

      youngstersValues.forEach((value) => {
        const tableColumn = tableRow.insertCell();
        tableColumn.style.paddingRight = "1vw";
        tableColumn.appendChild(document.createTextNode(value));
      });
    });

    mainBox.appendChild(table);
  } else {
    console.log("youngsters is empty");
  }
};
