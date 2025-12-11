const countdownTarget = new Date();
// Set launch date 20 days from now to mirror the reference.
countdownTarget.setDate(countdownTarget.getDate() + 20);

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const form = document.getElementById("notify-form");
const statusEl = document.getElementById("form-status");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownTarget.getTime() - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    clearInterval(timer);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
}

const timer = setInterval(updateCountdown, 1000 * 30);
updateCountdown();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = new FormData(form).get("email");
  statusEl.textContent = "";

  if (!email || !String(email).includes("@")) {
    statusEl.textContent = "Please enter a valid email.";
    statusEl.style.color = "#e85a5a";
    return;
  }

  form.reset();
  statusEl.textContent = "Thanks! You'll be the first to know.";
  statusEl.style.color = "#2c2c2c";
});

