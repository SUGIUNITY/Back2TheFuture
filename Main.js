document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("start_clock").addEventListener("click", manageClock);
});

is_clock_running = false;
clockInterval = null;

manageClock = (event) => {
  is_clock_running = !is_clock_running;

  if (is_clock_running) {
    startClock();
    document.getElementById("start_clock").textContent = "עצור";
  } else {
    clearTimeout(clockInterval);
    document.getElementById("start_clock").textContent = "הפעל";
  }
};

startClock = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);
  document.getElementById("clock_value").textContent =
    hours + ":" + minutes + ":" + seconds;
  clockInterval = setTimeout(startClock, 1000);
};

checkTime = (time) => {
  if (time < 10) {
    time = "0" + time;
  }

  return time;
};
