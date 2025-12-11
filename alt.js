const altCountdownTarget = new Date();
altCountdownTarget.setDate(altCountdownTarget.getDate() + 18);

const aDays = document.getElementById("a-days");
const aHours = document.getElementById("a-hours");
const aMinutes = document.getElementById("a-minutes");
const altForm = document.getElementById("notify-alt");
const altStatus = document.getElementById("status-alt");
const altReactions = document.getElementById("alt-reactions");

const reactionKeysAlt = ["fire", "spark", "heart", "rocket"];
const reactionEmojisAlt = {
  fire: "🔥",
  spark: "✨",
  heart: "💜",
  rocket: "🚀",
};
const reactionStoreAlt = "pulseone_reactions_alt";

function updateAltCountdown() {
  const now = Date.now();
  const distance = altCountdownTarget.getTime() - now;
  if (distance <= 0) {
    aDays.textContent = "00";
    aHours.textContent = "00";
    aMinutes.textContent = "00";
    clearInterval(altTimer);
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  aDays.textContent = String(days).padStart(2, "0");
  aHours.textContent = String(hours).padStart(2, "0");
  aMinutes.textContent = String(minutes).padStart(2, "0");
}

const altTimer = setInterval(updateAltCountdown, 1000 * 30);
updateAltCountdown();

altForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = new FormData(altForm).get("email");
  altStatus.textContent = "";
  if (!email || !String(email).includes("@")) {
    altStatus.textContent = "Enter a valid email.";
    altStatus.style.color = "#ff9ca8";
    return;
  }
  altForm.reset();
  altStatus.textContent = "You're in. We'll ping you soon.";
  altStatus.style.color = "#4de0ff";
});

function loadAltReactions() {
  try {
    const stored = localStorage.getItem(reactionStoreAlt);
    if (stored) return JSON.parse(stored);
  } catch (err) {}
  return {
    fire: 120,
    spark: 90,
    heart: 110,
    rocket: 150,
  };
}

function saveAltReactions(state) {
  try {
    localStorage.setItem(reactionStoreAlt, JSON.stringify(state));
  } catch (err) {}
}

let altState = loadAltReactions();

function renderAlt() {
  reactionKeysAlt.forEach((key) => {
    const el = document.getElementById(`a-${key}`);
    if (el) el.textContent = altState[key] ?? 0;
  });
}

function spawnAltBurst(key, target) {
  const emoji = reactionEmojisAlt[key];
  if (!emoji || !target) return;
  const wrap = document.createElement("span");
  wrap.className = "burst";
  const bubble = document.createElement("span");
  bubble.className = "burst-emoji";
  bubble.textContent = emoji;
  const dx = Math.random() * 32 - 16;
  const dy = Math.random() * 16 - 8;
  bubble.style.setProperty("--dx", `${dx}px`);
  bubble.style.setProperty("--dy", `${dy}px`);
  wrap.appendChild(bubble);
  target.appendChild(wrap);
  setTimeout(() => wrap.remove(), 950);
}

function bumpAlt(key, target) {
  altState[key] = (altState[key] ?? 0) + 1;
  saveAltReactions(altState);
  renderAlt();
  spawnAltBurst(key, target);
}

altReactions?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-reaction]");
  if (!btn) return;
  const key = btn.dataset.reaction;
  if (reactionKeysAlt.includes(key)) bumpAlt(key, btn);
});

window.addEventListener("storage", (event) => {
  if (event.key === reactionStoreAlt && event.newValue) {
    altState = JSON.parse(event.newValue);
    renderAlt();
  }
});

renderAlt();

