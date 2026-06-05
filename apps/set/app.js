const SHAPES = ["capsule", "diamond", "squiggle"];
const FILLS = ["outline", "striped", "filled"];
const COLORS = [
  { name: "red", albedo: "#ef4239" },
  { name: "green", albedo: "#35c34c" },
  { name: "violet", albedo: "#483de4" },
];
const COUNTS = [1, 2, 3];
const MODES = {
  classic: "classic",
  alt: "alt",
  strict: "strict",
};
const CARDS_PER_ROW = 3;
const STARTING_ROWS = 4;
const BASE_TABLE_SIZE = CARDS_PER_ROW * STARTING_ROWS;
const DEAL_MS = 200;
const MOVE_MS = 220;
const HINT_DELAY_MS = 15000;
const HINT_FLASH_MS = 3000;
const ALT_IMAGE_SCALES = {
  1: 0.7,
  2: 0.85,
  3: 1,
};
const THEME_COLORS = {
  light: "#eef2ed",
  dark: "#101418",
};

const els = {
  themeColor: document.querySelector('meta[name="theme-color"]'),
  board: document.querySelector("[data-board]"),
  deckStat: document.querySelector("[data-deck-stat]"),
  deckCount: document.querySelector("[data-deck-count]"),
  timer: document.querySelector("[data-timer]"),
  setCount: document.querySelector("[data-set-count]"),
  newGame: document.querySelector("[data-new-game]"),
  newGameEnd: document.querySelector("[data-new-game-end]"),
  hintButton: document.querySelector("[data-hint]"),
  modeButtons: document.querySelectorAll("[data-mode-button]"),
  strictControl: document.querySelector("[data-strict-control]"),
  strictToggle: document.querySelector("[data-strict-toggle]"),
  endPanel: document.querySelector("[data-end-panel]"),
  finalSets: document.querySelector("[data-final-sets]"),
  finalTime: document.querySelector("[data-final-time]"),
};

const altCards = buildAltCards();

let deck = [];
let table = [];
let selectedIds = new Set();
let invalidIds = new Set();
let dealingIds = new Set();
let hintIds = new Set();
let persistedHintId = null;
let score = 0;
let startTime = 0;
let lastSetFoundTime = 0;
let timerId = 0;
let hintTimeoutId = 0;
let locked = false;
let gameOver = false;
let currentMode = MODES.classic;
let selectedBaseMode = MODES.classic;
let strictNextGame = false;

function buildDeck() {
  return isAltMode(currentMode) ? buildAltDeck(currentMode) : buildClassicDeck();
}

function getNextGameMode() {
  if (selectedBaseMode === MODES.alt && strictNextGame) {
    return MODES.strict;
  }

  return selectedBaseMode;
}

function buildClassicDeck() {
  const cards = [];

  for (let shape = 0; shape < SHAPES.length; shape += 1) {
    for (let fill = 0; fill < FILLS.length; fill += 1) {
      for (let color = 0; color < COLORS.length; color += 1) {
        for (let count = 0; count < COUNTS.length; count += 1) {
          cards.push({
            mode: MODES.classic,
            id: `classic-${shape}-${fill}-${color}-${count}`,
            shape: SHAPES[shape],
            fill: FILLS[fill],
            color,
            count: COUNTS[count],
            attrs: [shape, fill, color, count],
          });
        }
      }
    }
  }

  return shuffle(cards);
}

function buildAltCards() {
  const cards = [];

  for (let first = 1; first <= 3; first += 1) {
    for (let second = 1; second <= 3; second += 1) {
      for (let third = 1; third <= 3; third += 1) {
        for (let fourth = 1; fourth <= 3; fourth += 1) {
          const code = `${first}${second}${third}${fourth}`;

          cards.push({
            id: `alt-${code}`,
            code,
            imageSrc: `set_pngs/alt/${code}.png`,
            imageScale: ALT_IMAGE_SCALES[fourth],
            attrs: [first - 1, second - 1, third - 1, fourth - 1],
          });
        }
      }
    }
  }

  return cards;
}

function buildAltDeck(mode) {
  return shuffle(altCards.map((card) => ({ ...card, mode, attrs: [...card.attrs] })));
}

function shuffle(cards) {
  const next = [...cards];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function drawCard(animate) {
  const card = deck.pop();

  if (card && animate) {
    dealingIds.add(card.id);
  }

  return card;
}

function startGame() {
  window.clearInterval(timerId);
  currentMode = getNextGameMode();
  deck = buildDeck();
  table = [];
  selectedIds = new Set();
  invalidIds = new Set();
  dealingIds = new Set();
  resetHint();
  score = 0;
  locked = false;
  gameOver = false;

  for (let index = 0; index < STARTING_ROWS * CARDS_PER_ROW && deck.length > 0; index += 1) {
    table.push(drawCard(false));
  }

  dealRowsUntilSet(false);
  startTime = Date.now();
  lastSetFoundTime = startTime;
  timerId = window.setInterval(updateTimer, 250);
  els.endPanel.hidden = true;
  updateModeControls();
  render();
  updateTimer();
}

function dealRowsUntilSet(animate) {
  while (!hasSet(table) && deck.length > 0) {
    for (let index = 0; index < CARDS_PER_ROW && deck.length > 0; index += 1) {
      table.push(drawCard(animate));
    }
  }

  if (!hasSet(table) && deck.length === 0) {
    endGame();
  }
}

function hasSet(cards) {
  return findSet(cards) !== null;
}

function findSet(cards) {
  for (let first = 0; first < cards.length - 2; first += 1) {
    for (let second = first + 1; second < cards.length - 1; second += 1) {
      for (let third = second + 1; third < cards.length; third += 1) {
        if (isSet([cards[first], cards[second], cards[third]])) {
          return [cards[first], cards[second], cards[third]];
        }
      }
    }
  }

  return null;
}

function isSet(cards) {
  if (cards.every((card) => card.mode === MODES.alt)) {
    return isAltSet(cards);
  }

  return areSetAttrs(cards, [0, 1, 2, 3]);
}

function isAltSet(cards) {
  const firstValues = new Set(cards.map((card) => card.attrs[0]));

  if (firstValues.size === 1) {
    return areSetAttrs(cards, [0, 1, 2, 3]);
  }

  if (firstValues.size === 3) {
    return areSetAttrs(cards, [2, 3]);
  }

  return false;
}

function areSetAttrs(cards, attrIndexes) {
  return attrIndexes.every((attrIndex) => {
    const values = new Set(cards.map((card) => card.attrs[attrIndex]));
    return values.size === 1 || values.size === 3;
  });
}

function selectCard(cardId) {
  if (locked || gameOver) {
    return;
  }

  if (selectedIds.has(cardId)) {
    selectedIds.delete(cardId);
  } else if (selectedIds.size < 3) {
    selectedIds.add(cardId);
  }

  updateCardStates();

  if (selectedIds.size === 3) {
    locked = true;
    window.setTimeout(resolveSelection, 80);
  }
}

function resolveSelection() {
  const chosen = table.filter((card) => selectedIds.has(card.id));

  if (chosen.length !== 3) {
    locked = false;
    return;
  }

  if (!isSet(chosen)) {
    invalidIds = new Set(selectedIds);
    updateCardStates();

    window.setTimeout(() => {
      selectedIds = new Set();
      invalidIds = new Set();
      locked = false;
      updateCardStates();
    }, 320);
    return;
  }

  collectSet(chosen);
}

function collectSet(chosen) {
  const previousRects = snapshotCardRects();
  const scoredIds = new Set(chosen.map((card) => card.id));
  const nextTable = [];
  const shouldShrinkTable = table.length > BASE_TABLE_SIZE;

  score += 1;
  selectedIds = new Set();
  invalidIds = new Set();
  resetHint();
  lastSetFoundTime = Date.now();

  for (const card of table) {
    if (!scoredIds.has(card.id)) {
      nextTable.push(card);
      continue;
    }

    if (!shouldShrinkTable && deck.length > 0) {
      nextTable.push(drawCard(true));
    }
  }

  table = nextTable;
  dealRowsUntilSet(true);
  render({ previousRects });

  window.setTimeout(() => {
    dealingIds = new Set();
    locked = gameOver;
    render();
  }, Math.max(DEAL_MS, MOVE_MS) + 40);
}

function endGame() {
  gameOver = true;
  locked = true;
  resetHint();
  window.clearInterval(timerId);
  updateTimer();
  els.finalSets.textContent = String(score);
  els.finalTime.textContent = formatElapsed(Date.now() - startTime);
  els.endPanel.hidden = false;
}

function render(options = {}) {
  document.body.dataset.mode = currentMode;
  updateThemeColor();
  els.board.replaceChildren(...table.map(createCardButton));
  els.deckCount.textContent = String(deck.length);
  els.setCount.textContent = String(score);
  updateHintButton();
  positionDealAnimations();

  if (options.previousRects) {
    animateCardMoves(options.previousRects);
  }
}

function updateThemeColor() {
  if (!els.themeColor) {
    return;
  }

  els.themeColor.content = isAltMode(currentMode) ? THEME_COLORS.dark : THEME_COLORS.light;
}

function createCardButton(card) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = `card ${isAltMode(card.mode) ? "alt-card" : "classic-card"}`;
  button.dataset.cardId = card.id;
  button.setAttribute("aria-label", getCardLabel(card));

  if (selectedIds.has(card.id)) {
    button.classList.add("is-selected");
  }

  if (invalidIds.has(card.id)) {
    button.classList.add("is-invalid");
  }

  if (dealingIds.has(card.id)) {
    button.dataset.deal = "pending";
  }

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    selectCard(card.id);
  });
  button.addEventListener("click", (event) => {
    if (event.detail === 0) {
      selectCard(card.id);
    }
  });
  button.setAttribute("aria-pressed", selectedIds.has(card.id) ? "true" : "false");

  button.append(isAltMode(card.mode) ? createAltImage(card) : createClassicSymbols(card));
  return button;
}

function getCardLabel(card) {
  if (isAltMode(card.mode)) {
    return `${card.mode === MODES.strict ? "Strict" : "Alt"} card ${card.code}`;
  }

  const color = COLORS[card.color];
  return `${card.count} ${color.name} ${card.fill} ${card.shape}`;
}

function createClassicSymbols(card) {
  const symbols = document.createElement("span");
  const color = COLORS[card.color];

  symbols.className = "symbols";
  symbols.dataset.count = String(card.count);
  symbols.setAttribute("aria-hidden", "true");

  for (let index = 0; index < card.count; index += 1) {
    const symbol = document.createElement("span");
    symbol.className = "symbol";
    symbol.style.setProperty("--albedo", color.albedo);
    symbol.style.setProperty("--shape-mask", `url("set_pngs/${card.shape}_${card.fill}.png")`);
    symbols.append(symbol);
  }

  return symbols;
}

function createAltImage(card) {
  const image = document.createElement("img");

  image.className = "alt-image";
  image.src = card.imageSrc;
  image.alt = "";
  image.decoding = "async";
  image.draggable = false;
  image.style.setProperty("--alt-image-scale", String(card.imageScale));
  image.setAttribute("aria-hidden", "true");

  return image;
}

function updateCardStates() {
  for (const card of els.board.querySelectorAll(".card")) {
    const cardId = card.dataset.cardId;
    const selected = selectedIds.has(cardId);

    card.classList.toggle("is-selected", selected);
    card.classList.toggle("is-invalid", invalidIds.has(cardId));
    card.classList.toggle("is-hint", hintIds.has(cardId));
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  }
}

function showHint() {
  if (!shouldShowHint()) {
    return;
  }

  const set = findSet(table);

  if (!set) {
    updateHintButton();
    return;
  }

  window.clearTimeout(hintTimeoutId);
  const currentHintCard = persistedHintId && table.find((card) => card.id === persistedHintId);
  const card = currentHintCard || set[Math.floor(Math.random() * set.length)];
  persistedHintId = card.id;
  hintIds = new Set([card.id]);
  updateCardStates();

  hintTimeoutId = window.setTimeout(() => {
    clearHintHighlight();
    updateCardStates();
  }, HINT_FLASH_MS);
}

function clearHintHighlight() {
  window.clearTimeout(hintTimeoutId);
  hintTimeoutId = 0;
  hintIds = new Set();
}

function resetHint() {
  clearHintHighlight();
  persistedHintId = null;
}

function shouldShowHint() {
  return isAltMode(currentMode)
    && !gameOver
    && lastSetFoundTime > 0
    && Date.now() - lastSetFoundTime >= HINT_DELAY_MS;
}

function isAltMode(mode) {
  return mode === MODES.alt || mode === MODES.strict;
}

function updateHintButton() {
  const visible = shouldShowHint();

  els.hintButton.classList.toggle("is-hidden", !visible);
  els.hintButton.disabled = !visible;
  els.hintButton.setAttribute("aria-hidden", visible ? "false" : "true");
}

function positionDealAnimations() {
  const pending = [...els.board.querySelectorAll('[data-deal="pending"]')];

  if (!pending.length) {
    return;
  }

  const originRect = els.deckStat.getBoundingClientRect();
  const originX = originRect.left + originRect.width / 2;
  const originY = originRect.top + originRect.height / 2;

  for (const card of pending) {
    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    card.style.setProperty("--deal-x", `${originX - cardX}px`);
    card.style.setProperty("--deal-y", `${originY - cardY}px`);
  }

  window.requestAnimationFrame(() => {
    for (const card of pending) {
      card.classList.add("is-dealing");
      card.removeAttribute("data-deal");
    }
  });
}

function snapshotCardRects() {
  const rects = new Map();

  for (const card of els.board.querySelectorAll(".card")) {
    rects.set(card.dataset.cardId, card.getBoundingClientRect());
  }

  return rects;
}

function animateCardMoves(previousRects) {
  for (const card of els.board.querySelectorAll(".card")) {
    if (dealingIds.has(card.dataset.cardId)) {
      continue;
    }

    const previous = previousRects.get(card.dataset.cardId);

    if (!previous) {
      continue;
    }

    const current = card.getBoundingClientRect();
    const dx = previous.left - current.left;
    const dy = previous.top - current.top;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      continue;
    }

    card.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: "translate(0, 0)" },
      ],
      {
        duration: MOVE_MS,
        easing: "cubic-bezier(0.16, 0.9, 0.28, 1)",
      }
    );
  }
}

function updateTimer() {
  els.timer.textContent = formatElapsed(Date.now() - startTime);
  updateHintButton();
}

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

els.newGame.addEventListener("click", startGame);
els.newGameEnd.addEventListener("click", startGame);
els.hintButton.addEventListener("click", showHint);
els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextBaseMode = button.dataset.modeButton;

    if (nextBaseMode === selectedBaseMode) {
      return;
    }

    selectedBaseMode = nextBaseMode;

    if (selectedBaseMode === MODES.alt) {
      strictNextGame = false;
    }

    updateModeControls();
    startGame();
  });
});

els.strictToggle.addEventListener("change", () => {
  strictNextGame = els.strictToggle.checked;
  updateModeControls();
});

function updateModeControls() {
  els.modeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.modeButton === selectedBaseMode ? "true" : "false");
  });

  const isAltSelected = selectedBaseMode === MODES.alt;
  els.strictControl.hidden = !isAltSelected;
  els.strictToggle.checked = isAltSelected && strictNextGame;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

updateModeControls();
startGame();
