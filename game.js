const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const tilesLeftEl = document.querySelector("#tilesLeft");
const comboCountEl = document.querySelector("#comboCount");
const timerEl = document.querySelector("#timer");
const countrySelect = document.querySelector("#countrySelect");
const leaderboardEl = document.querySelector("#leaderboard");
const leaderboardTabs = document.querySelector("#leaderboardTabs");
const playerRankEl = document.querySelector("#playerRank");
const themeSwitcher = document.querySelector("#themeSwitcher");
const sidePanel = document.querySelector("#sidePanel");
const panelButton = document.querySelector("#panelButton");
const panelCloseButton = document.querySelector("#panelCloseButton");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const boardMood = document.querySelector("#boardMood");
const levelBadge = document.querySelector("#levelBadge");
const streakBadge = document.querySelector("#streakBadge");
const trayLabel = document.querySelector("#trayLabel");
const matchToast = document.querySelector("#matchToast");
const socialHeat = document.querySelector("#socialHeat");
const rescueBenchEl = document.querySelector("#rescueBench");
const resultModal = document.querySelector("#resultModal");
const resultKicker = document.querySelector("#resultKicker");
const resultTitle = document.querySelector("#resultTitle");
const resultCopy = document.querySelector("#resultCopy");
const resultStats = document.querySelector("#resultStats");
const shareTextEl = document.querySelector("#shareText");
const reviveButton = document.querySelector("#reviveButton");
const toolModal = document.querySelector("#toolModal");
const toolKicker = document.querySelector("#toolKicker");
const toolTitle = document.querySelector("#toolTitle");
const toolCopy = document.querySelector("#toolCopy");
const toolPreview = document.querySelector("#toolPreview");
const toolRewardButton = document.querySelector("#toolRewardButton");
const toolShareButton = document.querySelector("#toolShareButton");
const toolCloseButton = document.querySelector("#toolCloseButton");
const moveOutButton = document.querySelector("#moveOutButton");
const undoButton = document.querySelector("#undoButton");
const shuffleButton = document.querySelector("#shuffleButton");
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
    mood: "Pet rescue. Save every friend.",
    tray: "Match 3 pets before the stretcher fills",
    snacks: [
      { key: "dog", icon: "🐶", color: "#f6c558" },
      { key: "cat", icon: "🐱", color: "#ffb3a6" },
      { key: "rabbit", icon: "🐰", color: "#f6a9c8" },
      { key: "hamster", icon: "🐹", color: "#d49a58" },
      { key: "penguin", icon: "🐧", color: "#9ed8ff" },
      { key: "bear", icon: "🐻", color: "#a9785d" },
      { key: "fox", icon: "🦊", color: "#f09654" },
      { key: "panda", icon: "🐼", color: "#d6e5d1" }
    ]
  },
  fast: {
    mood: "Wildlife rescue. No mercy.",
    tray: "Clear rescue teams before the stretcher fills",
    snacks: [
      { key: "lion", icon: "🦁", color: "#f6c558" },
      { key: "tiger", icon: "🐯", color: "#f09654" },
      { key: "koala", icon: "🐨", color: "#c7ccd6" },
      { key: "monkey", icon: "🐵", color: "#d49a58" },
      { key: "frog", icon: "🐸", color: "#86c97d" },
      { key: "duck", icon: "🦆", color: "#f5d05f" },
      { key: "fire", icon: "🔥", color: "#f0856b" },
      { key: "medkit", icon: "🚑", color: "#e87575" }
    ]
  },
  coffee: {
    mood: "Ocean rescue. Stay sharp.",
    tray: "Save sea life before the stretcher fills",
    snacks: [
      { key: "dolphin", icon: "🐬", color: "#9ed8ff" },
      { key: "whale", icon: "🐳", color: "#76b7ff" },
      { key: "seal", icon: "🦭", color: "#c7ccd6" },
      { key: "turtle", icon: "🐢", color: "#86c97d" },
      { key: "fish", icon: "🐠", color: "#f6c558" },
      { key: "octopus", icon: "🐙", color: "#d6a6ff" },
      { key: "wave", icon: "🌊", color: "#62d0ff" },
      { key: "lifebuoy", icon: "🛟", color: "#f0856b" }
    ]
  }
};

const baseLeaders = [
  ["USA", "🇺🇸", 128400],
  ["Brazil", "🇧🇷", 119200],
  ["Japan", "🇯🇵", 111400],
  ["UK", "🇬🇧", 102600],
  ["Germany", "🇩🇪", 98500],
  ["Canada", "🇨🇦", 93400],
  ["Australia", "🇦🇺", 87600]
];

const boardData = {
  world: [
    ["MiaPaws", "🐶", "USA", "🇺🇸", 194200],
    ["SoraSave", "🐱", "Japan", "🇯🇵", 193560],
    ["RioHero", "🦜", "Brazil", "🇧🇷", 192900],
    ["KoalaKai", "🐨", "Australia", "🇦🇺", 191760],
    ["MapleVet", "🐾", "Canada", "🇨🇦", 190420],
    ["BerlinFox", "🦊", "Germany", "🇩🇪", 188900],
    ["LondonShelter", "🐰", "UK", "🇬🇧", 187540]
  ],
  country: [
    ["You", "⭐", "", "", 0],
    ["North Rescue", "🚑", "", "", 14320],
    ["CityPaws", "🐕", "", "", 13980],
    ["Happy Shelter", "🐾", "", "", 12880],
    ["Night Vet", "🩺", "", "", 12160],
    ["Tiny Hero", "🐹", "", "", 11440]
  ],
  friends: [
    ["Luna", "🐱", "Friends", "👥", 8820],
    ["Max", "🐶", "Friends", "👥", 8240],
    ["Ava", "🐰", "Friends", "👥", 7910],
    ["Noah", "🐧", "Friends", "👥", 7380],
    ["You", "⭐", "Friends", "👥", 0]
  ]
};

const heatMessages = [
  "{name} just saved {count} pets for {country}",
  "{name} is stuck on Daily Global Rescue",
  "{country} is climbing the rescue board",
  "{name} used Shuffle and kept the run alive",
  "{count} rescuers are playing right now"
];
const heatNames = ["Luna", "Max", "Mia", "Kai", "Sora", "Ava", "Rio", "Noah"];

let tiles = [];
let tray = [];
let movedOut = [];
let moveHistory = [];
let matches = 0;
let startedAt = Date.now();
let timerId = null;
let lastShareText = "";
let activeTheme = "sweet";
let toastId = null;
let gamePaused = false;
let revivedThisRun = false;
let runCounted = false;
let streak = 0;
let bestMoveId = null;
let currentLevel = 1;
let pendingNextLevel = null;
let perfectRouteIds = [];
let perfectRouteStep = 0;
let perfectRouteBroken = false;
let activeLeaderboard = "world";
let pendingTool = null;
let heatId = null;
let toolCounts = { moveOut: 1, undo: 1, shuffle: 1 };
const analyticsKey = "rescue-rush-local-analytics-v1";
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
  if (currentLevel === 1) {
    return makeWarmupLayout(random);
  }

  return makeHardRescueLayout(random);
}

function makeHardRescueLayout(random) {
  const layout = [];
  const pushGrid = ({ columns, rows, startX, startY, gapX, gapY, layerBase, jitterX, jitterY }) => {
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        layout.push({
          x: startX + column * gapX + Math.round((random() - 0.5) * jitterX),
          y: startY + row * gapY + Math.round((random() - 0.5) * jitterY),
          layer: layerBase + ((row + column) % 2),
          id: `tile-${layout.length}`
        });
      }
    }
  };

  pushGrid({ columns: 7, rows: 8, startX: 20, startY: 74, gapX: 52, gapY: 36, layerBase: 0, jitterX: 5, jitterY: 5 });
  pushGrid({ columns: 6, rows: 5, startX: 42, startY: 98, gapX: 54, gapY: 42, layerBase: 3, jitterX: 8, jitterY: 7 });
  pushGrid({ columns: 5, rows: 4, startX: 70, startY: 126, gapX: 56, gapY: 44, layerBase: 6, jitterX: 8, jitterY: 8 });
  pushGrid({ columns: 4, rows: 3, startX: 98, startY: 154, gapX: 58, gapY: 48, layerBase: 9, jitterX: 7, jitterY: 7 });
  pushGrid({ columns: 2, rows: 1, startX: 154, startY: 218, gapX: 62, gapY: 48, layerBase: 12, jitterX: 6, jitterY: 6 });

  return layout
    .map((tile) => ({
      ...tile,
      x: Math.min(Math.max(10, tile.x), 332),
      y: Math.min(Math.max(64, tile.y), 356)
    }))
    .map((tile, index) => ({
      ...tile,
      id: `tile-${index}`
    }));
}

function makeWarmupLayout(random) {
  const layout = [];
  const rows = [
    [78, 92],
    [148, 92],
    [218, 92],
    [288, 92],
    [78, 172],
    [148, 172],
    [218, 172],
    [288, 172],
    [112, 252],
    [182, 252],
    [252, 252],
    [322, 252]
  ];

  rows.forEach(([x, y], index) => {
    layout.push({
      x: x + Math.round((random() - 0.5) * 6),
      y: y + Math.round((random() - 0.5) * 6),
      layer: 0,
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
  perfectRouteIds = [];
  const snackPack = shuffle(themePacks[activeTheme].snacks, random);
  if (currentLevel === 1) {
    const easySnacks = snackPack.slice(0, 4).flatMap((snack) => [snack, snack, snack]);
    return layout.reduce((memo, tile, index) => {
      memo[tile.id] = easySnacks[index];
      return memo;
    }, {});
  }

  const remaining = layout.map((tile) => ({ ...tile }));
  const snackById = {};
  let turn = 0;

  while (remaining.length > 0) {
    const openTiles = remaining.filter((tile) => !isBlockedInSet(tile, remaining));
    const topChoice = shuffle(openTiles, random)[0] || shuffle(remaining, random)[0];
    const hiddenPool = remaining.filter((tile) => tile.id !== topChoice.id && isBlockedInSet(tile, remaining));
    const layerPool = remaining
      .filter((tile) => tile.id !== topChoice.id)
      .sort((a, b) => a.layer - b.layer || Math.abs(b.x - topChoice.x) + Math.abs(b.y - topChoice.y) - Math.abs(a.x - topChoice.x) - Math.abs(a.y - topChoice.y));
    const second = (shuffle(hiddenPool, random)[0] || layerPool[0] || remaining.find((tile) => tile.id !== topChoice.id));
    const thirdPool = remaining.filter((tile) => tile.id !== topChoice.id && tile.id !== second?.id);
    const thirdHidden = thirdPool.filter((tile) => isBlockedInSet(tile, remaining));
    const third = shuffle(thirdHidden.length ? thirdHidden : thirdPool, random)[0];
    const triple = [topChoice, second, third].filter(Boolean);
    const snack = snackPack[turn % snackPack.length];

    triple.forEach((tile) => {
      snackById[tile.id] = snack;
      perfectRouteIds.push(tile.id);
      const index = remaining.findIndex((candidate) => candidate.id === tile.id);
      if (index >= 0) {
        remaining.splice(index, 1);
      }
    });
    turn += 1;
  }

  return snackById;
}

function initGame(level = currentLevel) {
  currentLevel = level;
  const random = seededRandom(dailySeed() + activeTheme.length * 97 + currentLevel * 1009);
  const layout = makeLayout(random);
  const snackById = buildSolvableSnackMap(layout, random);
  tiles = layout.map((tile, index) => ({
    ...tile,
    snack: snackById[tile.id] || themePacks[activeTheme].snacks[index % themePacks[activeTheme].snacks.length],
    alive: true
  }));
  tray = [];
  movedOut = [];
  moveHistory = [];
  matches = 0;
  streak = 0;
  toolCounts = { moveOut: 1, undo: 1, shuffle: 1 };
  gamePaused = false;
  revivedThisRun = false;
  runCounted = false;
  perfectRouteStep = 0;
  perfectRouteBroken = false;
  pendingNextLevel = null;
  startedAt = Date.now();
  resultModal.classList.add("hidden");
  reviveButton.hidden = true;
  reviveButton.disabled = false;
  reviveButton.textContent = "🎬 Free Revive · Clear 3 Slots";
  document.querySelector("#playAgainButton").textContent = "Challenge Again";
  levelBadge.textContent = currentLevel === 1 ? "Training Rescue" : "Daily Global Rescue";
  boardMood.textContent =
    currentLevel === 1 ? "Warmup. Save them fast." : "120 rescues. Matches are buried deep.";
  updateTrayMessage();
  startTimer();
  track("runs");
  runCounted = true;
  renderAll();
  renderMetrics();
  updateToolButtons();
}

function renderAll() {
  bestMoveId = currentLevel === 1 ? getBestMoveId() : null;
  renderBoard();
  renderTray();
  renderBench();
  renderStats();
  renderLeaderboard();
  renderMetrics();
  updateToolButtons();
  updateTrayMessage();
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
  boardEl.classList.toggle("hard-board", currentLevel === 2);
  const boardWidth = boardEl.clientWidth || 390;
  const boardHeight = boardEl.clientHeight || 430;
  const scale = Math.min(1, boardWidth / 390);
  const liveTiles = tiles.filter((tile) => tile.alive).sort((a, b) => a.layer - b.layer);
  const revealEndgame = liveTiles.length > 0 && liveTiles.length <= 3;

  liveTiles
    .forEach((tile, index) => {
      const tileButton = document.createElement("button");
      const blocked = !revealEndgame && isBlocked(tile);
      const compact = revealEndgame ? getEndgamePosition(index, liveTiles.length, boardWidth) : null;
      tileButton.className = `tile${blocked ? " blocked" : ""}${tile.id === bestMoveId ? " hot" : ""}${
        revealEndgame ? " endgame" : ""
      }`;
      tileButton.type = "button";
      tileButton.textContent = tile.snack.icon;
      const position = keepTileInBoard(compact ? compact.x : tile.x * scale, compact ? compact.y : tile.y, boardWidth, boardHeight);
      tileButton.style.left = `${position.x}px`;
      tileButton.style.top = `${position.y}px`;
      tileButton.style.zIndex = String(revealEndgame ? 30 + index : tile.layer + 1);
      tileButton.style.setProperty("--tile-color", tile.snack.color);
      tileButton.disabled = blocked;
      tileButton.dataset.tileId = tile.id;
      tileButton.setAttribute("aria-label", `${tile.snack.key} rescue tile`);
      tileButton.addEventListener("click", () => pickTile(tile.id));
      boardEl.appendChild(tileButton);
    });
}

function keepTileInBoard(x, y, boardWidth, boardHeight) {
  const tileSize = currentLevel === 2 ? 48 : 60;
  const safeTop = 64;
  const padding = 12;
  return {
    x: Math.min(Math.max(padding, x), Math.max(padding, boardWidth - tileSize - padding)),
    y: Math.min(Math.max(safeTop, y), Math.max(safeTop, boardHeight - tileSize - padding))
  };
}

function getEndgamePosition(index, count, boardWidth) {
  const columns = Math.min(3, count);
  const rows = Math.ceil(count / columns);
  const tileGap = 74;
  const row = Math.floor(index / columns);
  const column = index % columns;
  const gridWidth = (columns - 1) * tileGap + 60;
  const gridHeight = (rows - 1) * tileGap + 60;
  return {
    x: Math.max(16, (boardWidth - gridWidth) / 2 + column * tileGap),
    y: Math.max(128, 252 - gridHeight / 2 + row * tileGap)
  };
}

function renderTray() {
  trayEl.innerHTML = "";
  trayEl.classList.toggle("warm", tray.length >= 5 && tray.length < maxTray);
  trayEl.classList.toggle("danger", tray.length >= 6);
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

function renderBench() {
  rescueBenchEl.innerHTML = "";
  rescueBenchEl.classList.toggle("active", movedOut.length > 0);
  for (let index = 0; index < 3; index += 1) {
    const slot = document.createElement("div");
    slot.className = "bench-slot";
    const tile = movedOut[index];
    if (tile) {
      slot.textContent = tile.snack.icon;
      slot.style.setProperty("--tile-color", tile.snack.color);
    }
    rescueBenchEl.appendChild(slot);
  }
}

function renderStats() {
  tilesLeftEl.textContent = String(tiles.filter((tile) => tile.alive).length);
  comboCountEl.textContent = String(matches);
  streakBadge.textContent = `${streak} streak`;
  streakBadge.classList.toggle("hot", streak >= 2);
}

function renderLeaderboard() {
  const chosen = countrySelect.value;
  const scoreBoost =
    currentLevel === 2 ? matches * 1200 + (tiles.length - tiles.filter((tile) => tile.alive).length) * 140 : 0;
  const chosenFlag = baseLeaders.find(([country]) => country === chosen)?.[1] || "🌍";
  let leaders;

  if (activeLeaderboard === "world") {
    leaders = baseLeaders.map(([country, flag, score]) => ({
      name: country,
      avatar: flag,
      area: "Global rescue team",
      score: score + (country === chosen ? scoreBoost : 0),
      you: country === chosen
    }));
  } else if (activeLeaderboard === "country") {
    leaders = boardData.country.map(([name, avatar, area, flag, score], index) => ({
      name: name === "You" ? "You" : name,
      avatar,
      area: name === "You" ? `${chosenFlag} ${chosen}` : `${chosenFlag} ${chosen} Zone ${index + 1}`,
      score: name === "You" ? 9200 + scoreBoost : score + Math.floor(scoreBoost * 0.28),
      you: name === "You"
    }));
  } else {
    leaders = boardData.friends.map(([name, avatar, area, flag, score]) => ({
      name,
      avatar,
      area: `${flag} ${area}`,
      score: name === "You" ? 6400 + scoreBoost : score,
      you: name === "You"
    }));
  }

  leaders = leaders.sort((a, b) => b.score - a.score);
  const playerIndex = leaders.findIndex((leader) => leader.you);

  leaderboardEl.innerHTML = "";
  leaders.forEach((leader, index) => {
    const item = document.createElement("li");
    item.className = leader.you ? "you" : "";
    item.innerHTML = `
      <strong><b>${index + 1}</b><i>${leader.avatar}</i><span>${leader.name}<small>${leader.area}</small></span></strong>
      <em>${leader.score.toLocaleString()}</em>
    `;
    leaderboardEl.appendChild(item);
  });
  playerRankEl.textContent =
    playerIndex >= 0
      ? `Your rank: #${playerIndex + 1} · ${leaders[playerIndex].score.toLocaleString()} rescues`
      : `${chosenFlag} ${chosen} is fighting for today's rescue board`;
}

function isBlocked(tile) {
  if (tiles.filter((candidate) => candidate.alive).length <= 6) {
    return false;
  }
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

  saveMoveSnapshot();

  if (currentLevel === 2 && !perfectRouteBroken && tileId !== perfectRouteIds[perfectRouteStep]) {
    perfectRouteBroken = true;
  }

  playSound("tap");
  tile.alive = false;
  if (currentLevel === 2 && !perfectRouteBroken) {
    perfectRouteStep += 1;
  }
  animatePicked(tileId);
  tray.push(tile);
  const resolved = resolveMatches();
  if (resolved.count > 0) {
    streak += resolved.count;
  } else {
    streak = 0;
  }

  if (tiles.every((candidate) => !candidate.alive)) {
    finishGame(!perfectRouteBroken);
    return;
  }

  if (tray.length >= maxTray) {
    finishGame(false);
    return;
  }

  renderAll();
  updateTrayMessage();
}

function saveMoveSnapshot() {
  moveHistory.push({
    aliveIds: tiles.filter((tile) => tile.alive).map((tile) => tile.id),
    trayIds: tray.map((tile) => tile.id),
    movedIds: movedOut.map((tile) => tile.id),
    matches,
    streak,
    perfectRouteStep,
    perfectRouteBroken
  });
  moveHistory = moveHistory.slice(-12);
}

function restoreSnapshot(snapshot) {
  const aliveSet = new Set(snapshot.aliveIds);
  tiles.forEach((tile) => {
    tile.alive = aliveSet.has(tile.id);
  });
  tray = snapshot.trayIds.map((id) => tiles.find((tile) => tile.id === id)).filter(Boolean);
  movedOut = snapshot.movedIds.map((id) => tiles.find((tile) => tile.id === id)).filter(Boolean);
  matches = snapshot.matches;
  streak = snapshot.streak;
  perfectRouteStep = snapshot.perfectRouteStep;
  perfectRouteBroken = snapshot.perfectRouteBroken;
}

function resolveMatches() {
  let resolved = { count: 0, icon: "" };
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
      resolved = { count: resolved.count + 1, icon: group[0].snack.icon };
      showMatchToast(group[0].snack.icon);
    }
  });
  return resolved;
}

function getBestMoveId() {
  const openTiles = tiles.filter((tile) => tile.alive && !isBlocked(tile));
  if (!openTiles.length) {
    return null;
  }
  const trayCounts = tray.reduce((memo, tile) => {
    memo[tile.snack.key] = (memo[tile.snack.key] || 0) + 1;
    return memo;
  }, {});
  const completingTile = openTiles.find((tile) => trayCounts[tile.snack.key] === 2);
  if (completingTile) {
    return completingTile.id;
  }
  const helperTile = openTiles.find((tile) => trayCounts[tile.snack.key] === 1);
  if (helperTile) {
    return helperTile.id;
  }
  const openGroups = openTiles.reduce((memo, tile) => {
    memo[tile.snack.key] = memo[tile.snack.key] || [];
    memo[tile.snack.key].push(tile);
    return memo;
  }, {});
  const pair = Object.values(openGroups).find((group) => group.length >= 2);
  return (pair?.[0] || openTiles[0]).id;
}

function updateTrayMessage() {
  const counts = tray.reduce((memo, tile) => {
    memo[tile.snack.key] = memo[tile.snack.key] || { count: 0, icon: tile.snack.icon };
    memo[tile.snack.key].count += 1;
    return memo;
  }, {});
  const nearMatch = Object.values(counts).find((item) => item.count === 2);
  const openNearMatch = Object.values(counts).find((item) => item.count === 1);

  if (tray.length >= 6) {
    trayLabel.textContent = "One stretcher slot left. Make the save.";
  } else if (nearMatch) {
    trayLabel.textContent = `${nearMatch.icon} is one away from a rescue`;
  } else if (openNearMatch && tray.length >= 3) {
    trayLabel.textContent = `${maxTray - tray.length} stretcher slots left. Keep the team moving.`;
  } else {
      trayLabel.textContent =
      currentLevel === 1
        ? "Warmup: match 3 and unlock the rescue challenge"
        : "120 rescues. Matching groups are buried under the stack.";
  }
}

function animatePicked(tileId) {
  const button = boardEl.querySelector(`[data-tile-id="${tileId}"]`);
  if (button) {
    button.classList.add("picked");
  }
}

function showMatchToast(icon) {
  playSound("match");
  if (toastId) {
    clearTimeout(toastId);
  }
  matchToast.textContent = `${icon} Rescue +1`;
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
  if (currentLevel === 2) {
    const target = tiles.find((tile) => tile.id === perfectRouteIds[perfectRouteStep] && tile.alive);
    flashHintTile(target);
    return;
  }
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

  flashHintTile(target);
}

function flashHintTile(target) {
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
  lastShareText = `Rescue Rush L${currentLevel} #${dailySeed()}\n${
    won
      ? "Rescue cleared"
      : perfectRouteBroken
        ? `Rescue route broken with ${left} tiles left`
        : `Rescue failed with ${left} tiles left`
  } in ${elapsed}\n${matches} rescues for ${country}\n${grid}\nCan your country save more?`;

  pendingNextLevel = won && currentLevel === 1 ? 2 : null;
  resultKicker.textContent = won && currentLevel === 1 ? "Training Saved" : won ? "Country Rescues Added" : "Mission Failed";
  resultTitle.textContent =
    won && currentLevel === 1
      ? "Daily Global Rescue is waiting"
      : won
        ? "You saved today's rescue team"
        : perfectRouteBroken
          ? "Route broken. No rescue today."
          : `${left} tiles left. That hurts.`;
  resultCopy.textContent =
    won && currentLevel === 1
      ? "That was the easy rescue. Now try today's country challenge."
      : won
        ? `${country} rescued more pets. Share the grid and make someone prove they can save more.`
        : perfectRouteBroken
          ? "One earlier mistake broke the clean route. You can keep playing, but this run cannot clear Daily Global Rescue."
        : revivedThisRun
          ? `You made ${matches} rescues before the stretcher filled. One cleaner choice could have saved the run.`
          : `You made ${matches} rescues before the stretcher filled. Clear 3 slots for free and keep the run alive.`;
  resultStats.innerHTML = `
    <div><strong>${elapsed}</strong><span>time</span></div>
    <div><strong>${matches}</strong><span>rescues</span></div>
    <div><strong>${won ? `#${rank || "-"}` : left}</strong><span>${won ? "country" : "left"}</span></div>
  `;
  shareTextEl.textContent = lastShareText;
  reviveButton.hidden = won || currentLevel === 1 || revivedThisRun || tray.length < maxTray || perfectRouteBroken;
  document.querySelector("#playAgainButton").textContent = pendingNextLevel ? "Start Daily Rescue" : "Challenge Again";
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
  reviveButton.disabled = true;
  reviveButton.textContent = "Loading reward...";
  setTimeout(() => {
    completeRevive();
  }, 900);
}

function completeRevive() {
  revivedThisRun = true;
  track("revives");
  tray = tray.slice(0, Math.max(0, tray.length - 3));
  streak = 0;
  gamePaused = false;
  resultModal.classList.add("hidden");
  reviveButton.disabled = false;
  reviveButton.textContent = "🎬 Free Revive · Clear 3 Slots";
  showMatchToast("🎬");
  startTimer();
  renderAll();
  updateTrayMessage();
}

function useMoveOut() {
  if (gamePaused || tray.length === 0) {
    showToolOffer("moveOut");
    return;
  }
  if (toolCounts.moveOut <= 0) {
    showToolOffer("moveOut");
    return;
  }
  const count = Math.min(3 - movedOut.length, 3, tray.length);
  if (count <= 0) {
    showMatchToast("↗");
    return;
  }
  movedOut.push(...tray.splice(-count, count));
  toolCounts.moveOut -= 1;
  track("revives");
  showMatchToast("↗");
  renderAll();
}

function useUndo() {
  if (gamePaused || moveHistory.length === 0) {
    showToolOffer("undo");
    return;
  }
  if (toolCounts.undo <= 0) {
    showToolOffer("undo");
    return;
  }
  restoreSnapshot(moveHistory.pop());
  toolCounts.undo -= 1;
  showMatchToast("↩");
  renderAll();
}

function useShuffle() {
  if (gamePaused) {
    return;
  }
  if (toolCounts.shuffle <= 0) {
    showToolOffer("shuffle");
    return;
  }
  const liveTiles = tiles.filter((tile) => tile.alive);
  if (liveTiles.length < 4) {
    showMatchToast("⇄");
    return;
  }
  const random = seededRandom(Date.now() + liveTiles.length * 31);
  const shuffledSnacks = shuffle(liveTiles.map((tile) => tile.snack), random);
  liveTiles.forEach((tile, index) => {
    tile.snack = shuffledSnacks[index];
  });
  if (currentLevel === 2) {
    perfectRouteBroken = true;
  }
  toolCounts.shuffle -= 1;
  showMatchToast("⇄");
  renderAll();
}

function updateToolButtons() {
  [
    [moveOutButton, "moveOut"],
    [undoButton, "undo"],
    [shuffleButton, "shuffle"]
  ].forEach(([button, key]) => {
    const count = toolCounts[key] || 0;
    button.querySelector("em").textContent = String(count);
    button.classList.toggle("empty", count <= 0);
  });
}

function showToolOffer(tool) {
  pendingTool = tool;
  const copy = {
    moveOut: ["Move Out Tool", "Move up to 3 icons out of the stretcher and keep this rescue alive.", "↗ 🐶 🐱 🐰"],
    undo: ["Undo Tool", "Take back your latest tap before the rescue route collapses.", "↩ last move"],
    shuffle: ["Shuffle Tool", "Reorder the remaining rescue stack when the board feels impossible.", "⇄ rescue stack"]
  }[tool];
  toolKicker.textContent = "Rescue Tool";
  toolTitle.textContent = copy[0];
  toolCopy.textContent = copy[1];
  toolPreview.textContent = copy[2];
  toolModal.classList.remove("hidden");
}

function closeToolOffer() {
  toolModal.classList.add("hidden");
  pendingTool = null;
}

function grantPendingTool() {
  if (!pendingTool) {
    return;
  }
  toolRewardButton.disabled = true;
  toolRewardButton.textContent = "Loading reward...";
  setTimeout(() => {
    toolCounts[pendingTool] = (toolCounts[pendingTool] || 0) + 1;
    toolRewardButton.disabled = false;
    toolRewardButton.textContent = "🎬 Watch Ad · Get Tool";
    closeToolOffer();
    updateToolButtons();
    showMatchToast("🎁");
  }, 700);
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
  if (!lastShareText) {
    lastShareText = `Rescue Rush #${dailySeed()}\nI am saving pets for ${countrySelect.value}.\nCan your country save more?`;
  }
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

function rotateSocialHeat() {
  const random = seededRandom(Date.now());
  const name = heatNames[Math.floor(random() * heatNames.length)];
  const country = countrySelect.value;
  const count = 1200 + Math.floor(random() * 9800);
  const template = heatMessages[Math.floor(random() * heatMessages.length)];
  socialHeat.querySelector("span").textContent = `🔥 ${template
    .replace("{name}", name)
    .replace("{country}", country)
    .replace("{count}", count.toLocaleString())}`;
  socialHeat.classList.add("pop");
  setTimeout(() => socialHeat.classList.remove("pop"), 700);
}

document.querySelector("#resetButton").addEventListener("click", () => initGame(currentLevel));
document.querySelector("#playAgainButton").addEventListener("click", () => {
  initGame(pendingNextLevel || currentLevel);
});
moveOutButton.addEventListener("click", useMoveOut);
undoButton.addEventListener("click", useUndo);
shuffleButton.addEventListener("click", useShuffle);
document.querySelector("#copyButton").addEventListener("click", copyShare);
reviveButton.addEventListener("click", reviveRun);
toolRewardButton.addEventListener("click", grantPendingTool);
toolShareButton.addEventListener("click", () => {
  track("shares");
  copyShare();
  grantPendingTool();
});
toolCloseButton.addEventListener("click", closeToolOffer);
panelButton.addEventListener("click", openPanel);
panelCloseButton.addEventListener("click", closePanel);
drawerBackdrop.addEventListener("click", closePanel);
leaderboardTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-board]");
  if (!button) {
    return;
  }
  activeLeaderboard = button.dataset.board;
  leaderboardTabs.querySelectorAll(".leader-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.board === activeLeaderboard);
  });
  renderLeaderboard();
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
  initGame(currentLevel);
});

for (let index = 0; index < maxTray; index += 1) {
  const slot = document.createElement("div");
  slot.className = "tray-slot";
  trayEl.appendChild(slot);
}

initGame();
rotateSocialHeat();
heatId = setInterval(rotateSocialHeat, 4200);
