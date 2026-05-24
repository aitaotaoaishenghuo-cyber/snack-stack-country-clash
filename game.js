const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const tilesLeftEl = document.querySelector("#tilesLeft");
const comboCountEl = document.querySelector("#comboCount");
const timerEl = document.querySelector("#timer");
const countrySelect = document.querySelector("#countrySelect");
const leaderboardEl = document.querySelector("#leaderboard");
const themeSwitcher = document.querySelector("#themeSwitcher");
const sidePanel = document.querySelector("#sidePanel");
const panelButton = document.querySelector("#panelButton");
const panelCloseButton = document.querySelector("#panelCloseButton");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const boardMood = document.querySelector("#boardMood");
const trayLabel = document.querySelector("#trayLabel");
const matchToast = document.querySelector("#matchToast");
const resultModal = document.querySelector("#resultModal");
const resultKicker = document.querySelector("#resultKicker");
const resultTitle = document.querySelector("#resultTitle");
const resultCopy = document.querySelector("#resultCopy");
const resultStats = document.querySelector("#resultStats");
const shareTextEl = document.querySelector("#shareText");
const reviveButton = document.querySelector("#reviveButton");
const metricRuns = document.querySelector("#metricRuns");
const metricWins = document.querySelector("#metricWins");
const metricRevives = document.querySelector("#metricRevives");
const metricShares = document.querySelector("#metricShares");
const sounds = {
  tap: document.querySelector("#sndTap"),
  match: document.querySelector("#sndMatch"),
  fail: document.querySelector("#sndFail")
};

const maxTray = 7;
const themePacks = {
  sweet: {
    mood: "Sweet stack. Clean matches.",
    tray: "Match 3 treats before the tray fills",
    snacks: [
      { key: "donut", icon: "🍩", color: "#f6a9c8" },
      { key: "cookie", icon: "🍪", color: "#d49a58" },
      { key: "cake", icon: "🍰", color: "#ffb3a6" },
      { key: "icecream", icon: "🍦", color: "#9ed8ff" },
      { key: "candy", icon: "🍬", color: "#d6a6ff" },
      { key: "chocolate", icon: "🍫", color: "#a9785d" },
      { key: "cupcake", icon: "🧁", color: "#ffcb77" },
      { key: "honey", icon: "🍯", color: "#f6c558" }
    ]
  },
  fast: {
    mood: "Fast food pile. No mercy.",
    tray: "Clear the combo before the tray fills",
    snacks: [
      { key: "pizza", icon: "🍕", color: "#f6c558" },
      { key: "burger", icon: "🍔", color: "#f09654" },
      { key: "fries", icon: "🍟", color: "#f5d05f" },
      { key: "taco", icon: "🌮", color: "#86c97d" },
      { key: "hotdog", icon: "🌭", color: "#f0856b" },
      { key: "pretzel", icon: "🥨", color: "#ca8b51" },
      { key: "cola", icon: "🥤", color: "#e87575" },
      { key: "popcorn", icon: "🍿", color: "#f2d06f" }
    ]
  },
  coffee: {
    mood: "Coffee run. Stay sharp.",
    tray: "Keep the cafe rush under control",
    snacks: [
      { key: "coffee", icon: "☕", color: "#c99466" },
      { key: "latte", icon: "🥛", color: "#e6d4b8" },
      { key: "croissant", icon: "🥐", color: "#e3a85b" },
      { key: "bagel", icon: "🥯", color: "#c9915f" },
      { key: "sandwich", icon: "🥪", color: "#92c77b" },
      { key: "waffle", icon: "🧇", color: "#dca35d" },
      { key: "tea", icon: "🍵", color: "#8fcf93" },
      { key: "cookie", icon: "🍪", color: "#d49a58" }
    ]
  }
};

const baseLeaders = [
  ["USA", "🇺🇸", 12840],
  ["Brazil", "🇧🇷", 11920],
  ["Japan", "🇯🇵", 11140],
  ["UK", "🇬🇧", 10260],
  ["Germany", "🇩🇪", 9850],
  ["Canada", "🇨🇦", 9340],
  ["Australia", "🇦🇺", 8760]
];

let tiles = [];
let tray = [];
let matches = 0;
let startedAt = Date.now();
let timerId = null;
let lastShareText = "";
let activeTheme = "sweet";
let toastId = null;
let gamePaused = false;
let revivedThisRun = false;
let runCounted = false;
const analyticsKey = "snack-stack-local-analytics-v1";
let analytics = loadAnalytics();

function dailySeed() {
  const now = new Date();
  return Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  return function next() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function shuffle(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function makeLayout(random) {
  const layout = [];
  const boardTopOffset = 78;
  const rows = [
    [70, 18, 0],
    [140, 18, 0],
    [210, 18, 0],
    [280, 18, 0],
    [95, 82, 1],
    [165, 82, 1],
    [235, 82, 1],
    [305, 82, 1],
    [70, 146, 0],
    [140, 146, 0],
    [210, 146, 0],
    [280, 146, 0],
    [110, 210, 2],
    [180, 210, 2],
    [250, 210, 2],
    [135, 274, 3],
    [205, 274, 3],
    [275, 274, 3],
    [80, 300, 1],
    [320, 300, 1],
    [105, 356, 0],
    [175, 356, 0],
    [245, 356, 0],
    [315, 356, 0],
    [150, 120, 4],
    [220, 120, 4],
    [150, 236, 4],
    [220, 236, 4],
    [185, 180, 5],
    [185, 302, 5]
  ];

  rows.forEach(([x, y, layer], index) => {
    layout.push({
      x: x + Math.round((random() - 0.5) * 10),
      y: y + boardTopOffset + Math.round((random() - 0.5) * 8),
      layer,
      id: `tile-${index}`
    });
  });
  return layout;
}

function isBlockedInSet(tile, candidates) {
  return candidates.some((other) => {
    if (other.id === tile.id || other.layer <= tile.layer) {
      return false;
    }
    return Math.abs(other.x - tile.x) < 54 && Math.abs(other.y - tile.y) < 54;
  });
}

function buildSolvableSnackMap(layout, random) {
  const snackPack = shuffle(themePacks[activeTheme].snacks, random);
  const remaining = layout.map((tile) => ({ ...tile }));
  const snackById = {};
  let turn = 0;

  while (remaining.length > 0) {
    const openTiles = remaining.filter((tile) => !isBlockedInSet(tile, remaining));
    const source = openTiles.length >= 3 ? openTiles : remaining;
    const triple = shuffle(source, random).slice(0, 3);
    const snack = snackPack[turn % snackPack.length];

    triple.forEach((tile) => {
      snackById[tile.id] = snack;
      const index = remaining.findIndex((candidate) => candidate.id === tile.id);
      if (index >= 0) {
        remaining.splice(index, 1);
      }
    });
    turn += 1;
  }

  return snackById;
}

function initGame() {
  const random = seededRandom(dailySeed() + activeTheme.length * 97);
  const layout = makeLayout(random);
  const snackById = buildSolvableSnackMap(layout, random);
  tiles = layout.map((tile, index) => ({
    ...tile,
    snack: snackById[tile.id] || themePacks[activeTheme].snacks[index % themePacks[activeTheme].snacks.length],
    alive: true
  }));
  tray = [];
  matches = 0;
  gamePaused = false;
  revivedThisRun = false;
  runCounted = false;
  startedAt = Date.now();
  resultModal.classList.add("hidden");
  reviveButton.hidden = true;
  boardMood.textContent = themePacks[activeTheme].mood;
  trayLabel.textContent = themePacks[activeTheme].tray;
  startTimer();
  track("runs");
  runCounted = true;
  renderAll();
  renderMetrics();
}

function renderAll() {
  renderBoard();
  renderTray();
  renderStats();
  renderLeaderboard();
  renderMetrics();
}

function loadAnalytics() {
  try {
    return {
      runs: 0,
      wins: 0,
      losses: 0,
      revives: 0,
      shares: 0,
      themeSweet: 0,
      themeFast: 0,
      themeCoffee: 0,
      ...JSON.parse(localStorage.getItem(analyticsKey) || "{}")
    };
  } catch {
    return {
      runs: 0,
      wins: 0,
      losses: 0,
      revives: 0,
      shares: 0,
      themeSweet: 0,
      themeFast: 0,
      themeCoffee: 0
    };
  }
}

function saveAnalytics() {
  localStorage.setItem(analyticsKey, JSON.stringify(analytics));
}

function track(key) {
  analytics[key] = (analytics[key] || 0) + 1;
  saveAnalytics();
  renderMetrics();
}

function trackTheme(theme) {
  const key = theme === "fast" ? "themeFast" : theme === "coffee" ? "themeCoffee" : "themeSweet";
  track(key);
}

function renderMetrics() {
  metricRuns.textContent = String(analytics.runs || 0);
  metricWins.textContent = String(analytics.wins || 0);
  metricRevives.textContent = String(analytics.revives || 0);
  metricShares.textContent = String(analytics.shares || 0);
}

function renderBoard() {
  boardEl.innerHTML = "";
  const boardWidth = boardEl.clientWidth || 390;
  const scale = Math.min(1, boardWidth / 390);

  tiles
    .filter((tile) => tile.alive)
    .sort((a, b) => a.layer - b.layer)
    .forEach((tile) => {
      const tileButton = document.createElement("button");
      const blocked = isBlocked(tile);
      tileButton.className = `tile${blocked ? " blocked" : ""}`;
      tileButton.type = "button";
      tileButton.textContent = tile.snack.icon;
      tileButton.style.left = `${tile.x * scale}px`;
      tileButton.style.top = `${tile.y}px`;
      tileButton.style.zIndex = String(tile.layer + 1);
      tileButton.style.setProperty("--tile-color", tile.snack.color);
      tileButton.disabled = blocked;
      tileButton.setAttribute("aria-label", `${tile.snack.key} tile`);
      tileButton.addEventListener("click", () => pickTile(tile.id));
      boardEl.appendChild(tileButton);
    });
}

function renderTray() {
  trayEl.innerHTML = "";
  for (let index = 0; index < maxTray; index += 1) {
    const slot = document.createElement("div");
    slot.className = "tray-slot";
    const tile = tray[index];
    if (tile) {
      const trayTile = document.createElement("div");
      trayTile.className = "tray-tile";
      trayTile.textContent = tile.snack.icon;
      trayTile.style.setProperty("--tile-color", tile.snack.color);
      slot.appendChild(trayTile);
    }
    trayEl.appendChild(slot);
  }
}

function renderStats() {
  tilesLeftEl.textContent = String(tiles.filter((tile) => tile.alive).length);
  comboCountEl.textContent = String(matches);
}

function renderLeaderboard() {
  const chosen = countrySelect.value;
  const scoreBoost = matches * 120 + (tiles.length - tiles.filter((tile) => tile.alive).length) * 14;
  const leaders = baseLeaders
    .map(([country, flag, score]) => [country, flag, score + (country === chosen ? scoreBoost : 0)])
    .sort((a, b) => b[2] - a[2]);

  leaderboardEl.innerHTML = "";
  leaders.forEach(([country, flag, score], index) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${index + 1}. ${flag} ${country}</strong><span>${score.toLocaleString()}</span>`;
    leaderboardEl.appendChild(item);
  });
}

function isBlocked(tile) {
  return isBlockedInSet(tile, tiles.filter((candidate) => candidate.alive));
}

function pickTile(tileId) {
  if (gamePaused) {
    return;
  }
  const tile = tiles.find((candidate) => candidate.id === tileId);
  if (!tile || !tile.alive || isBlocked(tile) || tray.length >= maxTray) {
    return;
  }

  playSound("tap");
  tile.alive = false;
  animatePicked(tileId);
  tray.push(tile);
  resolveMatches();

  if (tiles.every((candidate) => !candidate.alive)) {
    finishGame(true);
    return;
  }

  if (tray.length >= maxTray) {
    finishGame(false);
    return;
  }

  renderAll();
}

function resolveMatches() {
  const grouped = tray.reduce((memo, tile) => {
    memo[tile.snack.key] = memo[tile.snack.key] || [];
    memo[tile.snack.key].push(tile);
    return memo;
  }, {});

  Object.values(grouped).forEach((group) => {
    if (group.length >= 3) {
      const removeIds = new Set(group.slice(0, 3).map((tile) => tile.id));
      tray = tray.filter((tile) => !removeIds.has(tile.id));
      matches += 1;
      showMatchToast(group[0].snack.icon);
    }
  });
}

function animatePicked(tileId) {
  const liveTiles = tiles.filter((tile) => tile.alive).sort((a, b) => a.layer - b.layer);
  const targetIndex = liveTiles.findIndex((tile) => tile.id === tileId);
  const button = [...boardEl.querySelectorAll(".tile")][targetIndex];
  if (button) {
    button.classList.add("picked");
  }
}

function showMatchToast(icon) {
  playSound("match");
  if (toastId) {
    clearTimeout(toastId);
  }
  matchToast.textContent = `${icon} Match +1`;
  matchToast.classList.remove("hidden");
  boardEl.parentElement.classList.add("matching");
  popBurst(icon);
  setTimeout(() => boardEl.parentElement.classList.remove("matching"), 260);
  toastId = setTimeout(() => matchToast.classList.add("hidden"), 900);
}

function popBurst(icon) {
  for (let index = 0; index < 6; index += 1) {
    const burst = document.createElement("span");
    burst.className = "burst";
    burst.textContent = index % 2 === 0 ? icon : "✨";
    burst.style.setProperty("--burst-x", `${(index - 2.5) * 22}px`);
    burst.style.left = `${44 + index * 2}%`;
    boardEl.parentElement.appendChild(burst);
    setTimeout(() => burst.remove(), 760);
  }
}

function hint() {
  const openTiles = tiles.filter((tile) => tile.alive && !isBlocked(tile));
  const grouped = openTiles.reduce((memo, tile) => {
    memo[tile.snack.key] = memo[tile.snack.key] || [];
    memo[tile.snack.key].push(tile);
    return memo;
  }, {});
  const trayNeeds = tray.map((tile) => tile.snack.key);
  const target =
    openTiles.find((tile) => trayNeeds.includes(tile.snack.key)) ||
    Object.values(grouped).find((group) => group.length > 1)?.[0] ||
    openTiles[0];

  if (!target) {
    return;
  }
  const buttons = [...boardEl.querySelectorAll(".tile")];
  const liveTiles = tiles.filter((tile) => tile.alive).sort((a, b) => a.layer - b.layer);
  const targetIndex = liveTiles.findIndex((tile) => tile.id === target.id);
  const button = buttons[targetIndex];
  if (button) {
    button.classList.add("hint");
    setTimeout(() => button.classList.remove("hint"), 1500);
  }
}

function finishGame(won) {
  if (!gamePaused) {
    track(won ? "wins" : "losses");
  }
  if (!won) {
    playSound("fail");
  }
  gamePaused = true;
  stopTimer();
  const elapsed = formatTime(Date.now() - startedAt);
  const country = countrySelect.value;
  const rank = [...leaderboardEl.querySelectorAll("li")].findIndex((item) =>
    item.textContent.includes(country)
  ) + 1;
  const left = tiles.filter((tile) => tile.alive).length;
  const grid = makeShareGrid(won, left);
  lastShareText = `Snack Stack #${dailySeed()}\n${won ? "Cleared" : "Stacked out"} in ${elapsed}\n${matches} matches for ${country}\n${grid}\nCan your country beat us?`;

  resultKicker.textContent = won ? "Country Points Added" : "Tray Filled";
  resultTitle.textContent = won ? "You cleared today's stack" : "So close. Run it back?";
  resultCopy.textContent = won
    ? `${country} gets a score bump. Share the grid and make someone prove they can do better.`
    : `You made ${matches} matches before the tray filled. The daily board is still waiting.`;
  resultStats.innerHTML = `
    <div><strong>${elapsed}</strong><span>time</span></div>
    <div><strong>${matches}</strong><span>matches</span></div>
    <div><strong>#${rank || "-"}</strong><span>country</span></div>
  `;
  shareTextEl.textContent = lastShareText;
  reviveButton.hidden = won || revivedThisRun || tray.length < maxTray;
  resultModal.classList.remove("hidden");
  renderLeaderboard();
}

function makeShareGrid(won, left) {
  if (won) {
    return "🟩🟩🟩\n🟩🟩🟩\n🟩🟩🟩";
  }
  const cleared = Math.max(0, tiles.length - left);
  const green = Math.min(8, Math.floor((cleared / tiles.length) * 9));
  return Array.from({ length: 9 }, (_, index) => (index < green ? "🟩" : index < green + 2 ? "🟨" : "⬛"))
    .reduce((rows, cell, index) => {
      const rowIndex = Math.floor(index / 3);
      rows[rowIndex] = `${rows[rowIndex] || ""}${cell}`;
      return rows;
    }, [])
    .join("\n");
}

function reviveRun() {
  if (revivedThisRun || tray.length === 0) {
    return;
  }
  revivedThisRun = true;
  track("revives");
  tray = tray.slice(0, Math.max(0, tray.length - 3));
  gamePaused = false;
  resultModal.classList.add("hidden");
  showMatchToast("🎬");
  startTimer();
  renderAll();
}

function startTimer() {
  stopTimer();
  timerEl.textContent = "00:00";
  timerId = setInterval(() => {
    timerEl.textContent = formatTime(Date.now() - startedAt);
  }, 500);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

async function copyShare() {
  try {
    await navigator.clipboard.writeText(lastShareText || shareTextEl.textContent);
  } catch {
    shareTextEl.select?.();
  }
}

function playSound(name) {
  const sound = sounds[name];
  if (!sound) {
    return;
  }
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function openPanel() {
  sidePanel.classList.add("open");
  drawerBackdrop.classList.remove("hidden");
}

function closePanel() {
  sidePanel.classList.remove("open");
  drawerBackdrop.classList.add("hidden");
}

document.querySelector("#resetButton").addEventListener("click", initGame);
document.querySelector("#playAgainButton").addEventListener("click", initGame);
document.querySelector("#hintButton").addEventListener("click", hint);
document.querySelector("#copyButton").addEventListener("click", copyShare);
reviveButton.addEventListener("click", reviveRun);
panelButton.addEventListener("click", openPanel);
panelCloseButton.addEventListener("click", closePanel);
drawerBackdrop.addEventListener("click", closePanel);
document.querySelector("#shareButton").addEventListener("click", () => {
  track("shares");
  const elapsed = formatTime(Date.now() - startedAt);
  lastShareText = `Snack Stack #${dailySeed()}\n${matches} matches in ${elapsed}\nPlaying for ${countrySelect.value}\nTry today's board.`;
  resultKicker.textContent = "Share Challenge";
  resultTitle.textContent = "Send the daily board";
  resultCopy.textContent = "Invite friends to beat your run and lift your country on the board.";
  resultStats.innerHTML = `
    <div><strong>${elapsed}</strong><span>time</span></div>
    <div><strong>${matches}</strong><span>matches</span></div>
    <div><strong>${tiles.filter((tile) => tile.alive).length}</strong><span>left</span></div>
  `;
  shareTextEl.textContent = lastShareText;
  resultModal.classList.remove("hidden");
});
countrySelect.addEventListener("change", renderLeaderboard);
window.addEventListener("resize", renderBoard);
themeSwitcher.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme]");
  if (!button || button.dataset.theme === activeTheme) {
    return;
  }
  activeTheme = button.dataset.theme;
  trackTheme(activeTheme);
  themeSwitcher.querySelectorAll(".theme-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.theme === activeTheme);
  });
  initGame();
});

for (let index = 0; index < maxTray; index += 1) {
  const slot = document.createElement("div");
  slot.className = "tray-slot";
  trayEl.appendChild(slot);
}

initGame();
