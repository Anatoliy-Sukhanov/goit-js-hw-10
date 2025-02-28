import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

// Customization Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datePicker, options);

// Converting ms to days, hours, minutes, seconds
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// update Timer Display
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

// start Countdown
function startCountdown() {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = userSelectedDate - now;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datePicker.disabled = false;
      iziToast.success({
        title: "Success",
        message: "Countdown completed!",
        position: "topRight",
      });
      return;
    }

    updateTimerDisplay(convertMs(timeLeft));
  }, 1000);
}

// Button EventListener
startButton.addEventListener("click", startCountdown);