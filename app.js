const PUZZLES_BY_DIFFICULTY = {
  easy: [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0]
    ]
  ],
  medium: [
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    [
      [0, 0, 6, 0, 0, 0, 0, 0, 2],
      [0, 5, 0, 0, 0, 6, 0, 0, 0],
      [0, 1, 0, 0, 9, 0, 4, 0, 0],
      [4, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 8],
      [0, 0, 8, 0, 4, 0, 0, 2, 0],
      [0, 0, 0, 8, 0, 0, 0, 4, 0],
      [3, 0, 0, 0, 0, 0, 7, 0, 0]
    ]
  ],
  hard: [
    [
      [0, 0, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 1, 9, 0, 0, 0, 0, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 7, 0],
      [0, 0, 0, 0, 0, 9, 5, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [8, 2, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 5, 0, 0, 0],
      [0, 0, 1, 0, 2, 0, 8, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 5, 0, 3, 0, 0, 0],
      [0, 3, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 5, 0, 9, 0, 6, 0, 0],
      [0, 0, 0, 8, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  ]
};

const boardElement = document.getElementById("sudoku-board");
const statusText = document.getElementById("status-text");
const difficultySelect = document.getElementById("difficulty-select");
const timerText = document.getElementById("timer-text");
const errorsText = document.getElementById("errors-text");
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const musicVolumeInput = document.getElementById("music-volume-input");
const newGameBtn = document.getElementById("new-game-btn");
const checkBtn = document.getElementById("check-btn");
const resetBtn = document.getElementById("reset-btn");
const jumpscareOverlay = document.getElementById("jumpscare-overlay");
const mobileNumpad = document.getElementById("mobile-numpad");
const mobileNumpadValueButtons = document.querySelectorAll("[data-mobile-value]");
const mobileNumpadClearBtn = document.querySelector("[data-mobile-action='clear']");

let originalBoard = [];
let currentBoard = [];
let selectedCell = null;
let currentDifficulty = difficultySelect.value;
let errorsCount = 0;
let elapsedSeconds = 0;
let timerIntervalId = null;
let isGameCompleted = false;
let audioContext = null;
let ambientBusGain = null;
let soundEnabled = localStorage.getItem("sudokuSoundEnabled") !== "0";
let musicEnabled = localStorage.getItem("sudokuMusicEnabled") !== "0";
let musicVolume = Number(localStorage.getItem("sudokuMusicVolume") ?? "35");
if (!Number.isFinite(musicVolume)) {
  musicVolume = 35;
}
musicVolume = Math.min(100, Math.max(0, Math.round(musicVolume)));
let ambientIntervalId = null;
const activeAmbientOscillators = new Set();
let autoplayRetryId = null;
let jumpscareTimeoutId = null;
let jumpscareSafeTimeoutId = null;
let consecutiveErrors = 0;

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function shouldUseMobileInput() {
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 980px)").matches;
}

function isEditableCell(cell) {
  if (!cell) {
    return false;
  }
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  return originalBoard[row][col] === 0;
}

function isEmptyEditableCell(cell) {
  if (!isEditableCell(cell)) {
    return false;
  }
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  return currentBoard[row][col] === 0;
}

function hideMobileNumpad() {
  mobileNumpad.hidden = true;
}

function showMobileNumpadForSelectedCell() {
  if (
    !shouldUseMobileInput() ||
    !selectedCell ||
    !isEmptyEditableCell(selectedCell) ||
    isGameCompleted
  ) {
    hideMobileNumpad();
    return;
  }
  mobileNumpad.hidden = false;
}

function syncSoundToggleView() {
  soundToggleBtn.textContent = soundEnabled ? "Звук: вкл" : "Звук: выкл";
  soundToggleBtn.setAttribute("aria-pressed", String(soundEnabled));
  soundToggleBtn.classList.toggle("is-off", !soundEnabled);
}

function syncMusicToggleView() {
  musicToggleBtn.textContent = musicEnabled ? "Музыка: вкл" : "Музыка: выкл";
  musicToggleBtn.setAttribute("aria-pressed", String(musicEnabled));
  musicToggleBtn.classList.toggle("is-off", !musicEnabled);
  musicVolumeInput.value = String(musicVolume);
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (!ambientBusGain) {
    ambientBusGain = audioContext.createGain();
    ambientBusGain.gain.setValueAtTime(1, audioContext.currentTime);
    ambientBusGain.connect(audioContext.destination);
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function playClickSound(type = "ui") {
  if (!soundEnabled) {
    return;
  }

  ensureAudioContext();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type === "soft" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(type === "soft" ? 540 : 760, now);
  oscillator.frequency.exponentialRampToValueAtTime(type === "soft" ? 420 : 520, now + 0.06);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

function playAmbientChord(rootFrequency) {
  if (!musicEnabled) {
    return;
  }

  ensureAudioContext();
  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const duration = 2.7;
  const volume = 0.02 + (musicVolume / 100) * 0.05;

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, now);
  filter.Q.setValueAtTime(0.8, now);

  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(volume, now + 1.6);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  [1, 1.5, 2].forEach((multiplier, index) => {
    const osc = audioContext.createOscillator();
    osc.type = index === 1 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(rootFrequency * multiplier, now);
    osc.detune.setValueAtTime(index === 0 ? -3 : index === 1 ? 2 : 5, now);
    osc.connect(filter);
    activeAmbientOscillators.add(osc);
    osc.onended = () => {
      activeAmbientOscillators.delete(osc);
    };
    osc.start(now);
    osc.stop(now + duration + 0.05);
  });

  filter.connect(masterGain);
  masterGain.connect(ambientBusGain);
}

function scheduleAmbientStep() {
  const roots = [98.0, 110.0, 123.47, 130.81, 146.83];
  const root = roots[Math.floor(Math.random() * roots.length)];
  playAmbientChord(root);
}

function startBackgroundMusic() {
  if (!musicEnabled || ambientIntervalId !== null) {
    return;
  }
  ensureAudioContext();
  ambientBusGain.gain.cancelScheduledValues(audioContext.currentTime);
  ambientBusGain.gain.setValueAtTime(1, audioContext.currentTime);
  scheduleAmbientStep();
  ambientIntervalId = setInterval(scheduleAmbientStep, 3000);
}

function stopBackgroundMusic() {
  if (ambientIntervalId !== null) {
    clearInterval(ambientIntervalId);
    ambientIntervalId = null;
  }

  if (audioContext) {
    const now = audioContext.currentTime;
    if (ambientBusGain) {
      ambientBusGain.gain.cancelScheduledValues(now);
      ambientBusGain.gain.setValueAtTime(0, now);
    }
    activeAmbientOscillators.forEach((osc) => {
      try {
        osc.stop(now);
      } catch (_) {
        // Oscillator may already be stopped; safe to ignore.
      }
    });
  }
  activeAmbientOscillators.clear();
}

function syncBackgroundMusicState() {
  if (musicEnabled) {
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
}

function stopAutoplayRetries() {
  if (autoplayRetryId !== null) {
    clearInterval(autoplayRetryId);
    autoplayRetryId = null;
  }
}

function attemptAutoStartMusic() {
  if (!musicEnabled) {
    stopAutoplayRetries();
    return;
  }

  ensureAudioContext();
  syncBackgroundMusicState();

  if (audioContext && audioContext.state === "running") {
    stopAutoplayRetries();
    return;
  }

  if (autoplayRetryId === null) {
    autoplayRetryId = setInterval(() => {
      if (!musicEnabled) {
        stopAutoplayRetries();
        return;
      }
      ensureAudioContext();
      syncBackgroundMusicState();
      if (audioContext && audioContext.state === "running") {
        stopAutoplayRetries();
      }
    }, 900);
  }
}

function playTone(frequency, duration, oscillatorType = "sine", volume = 0.06) {
  if (!soundEnabled) {
    return;
  }

  ensureAudioContext();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = oscillatorType;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.01);
}

function playSuccessSound() {
  playTone(660, 0.08, "triangle", 0.05);
  setTimeout(() => playTone(880, 0.1, "triangle", 0.05), 75);
}

function playErrorSound() {
  playTone(220, 0.1, "sawtooth", 0.055);
  setTimeout(() => playTone(170, 0.11, "sawtooth", 0.05), 80);
}

function playWinSound() {
  playTone(523.25, 0.14, "triangle", 0.06); // C5
  setTimeout(() => playTone(659.25, 0.14, "triangle", 0.06), 120); // E5
  setTimeout(() => playTone(783.99, 0.2, "triangle", 0.065), 240); // G5
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("sudokuSoundEnabled", soundEnabled ? "1" : "0");
  syncSoundToggleView();
  if (soundEnabled) {
    playClickSound("ui");
  }
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  localStorage.setItem("sudokuMusicEnabled", musicEnabled ? "1" : "0");
  syncMusicToggleView();
  attemptAutoStartMusic();
  playClickSound("soft");
}

function onMusicVolumeInput(event) {
  const nextVolume = Number(event.target.value);
  if (!Number.isFinite(nextVolume)) {
    return;
  }
  musicVolume = Math.min(100, Math.max(0, Math.round(nextVolume)));
  localStorage.setItem("sudokuMusicVolume", String(musicVolume));
}

function setStatus(message, stateClass = "") {
  statusText.textContent = message;
  statusText.classList.remove("ok", "warn");
  if (stateClass) {
    statusText.classList.add(stateClass);
  }
}

function getRandomPuzzle(difficulty) {
  const pool = PUZZLES_BY_DIFFICULTY[difficulty] || PUZZLES_BY_DIFFICULTY.medium;
  const index = Math.floor(Math.random() * pool.length);
  return cloneBoard(pool[index]);
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateTimerText() {
  timerText.textContent = formatTime(elapsedSeconds);
}

function startTimer() {
  stopTimer();
  timerIntervalId = setInterval(() => {
    elapsedSeconds += 1;
    updateTimerText();
  }, 1000);
}

function stopTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function resetStats() {
  errorsCount = 0;
  elapsedSeconds = 0;
  errorsText.textContent = "0";
  updateTimerText();
  consecutiveErrors = 0;
  hideJumpscare();
}

function hideJumpscare() {
  if (jumpscareTimeoutId !== null) {
    clearTimeout(jumpscareTimeoutId);
    jumpscareTimeoutId = null;
  }
  if (jumpscareSafeTimeoutId !== null) {
    clearTimeout(jumpscareSafeTimeoutId);
    jumpscareSafeTimeoutId = null;
  }
  jumpscareOverlay.classList.remove("fade-out");
  jumpscareOverlay.hidden = true;
}

function showJumpscare() {
  hideJumpscare();
  jumpscareOverlay.hidden = false;
  // Force reflow so animation reliably restarts each time.
  void jumpscareOverlay.offsetWidth;
  jumpscareOverlay.classList.add("fade-out");

  jumpscareTimeoutId = setTimeout(() => {
    jumpscareOverlay.hidden = true;
    jumpscareOverlay.classList.remove("fade-out");
    jumpscareTimeoutId = null;
  }, 2000);

  // Failsafe in case animation/timer are throttled.
  jumpscareSafeTimeoutId = setTimeout(() => {
    hideJumpscare();
  }, 2600);
}

function registerError() {
  errorsCount += 1;
  errorsText.textContent = String(errorsCount);
  consecutiveErrors += 1;
  if (consecutiveErrors >= 2) {
    showJumpscare();
    consecutiveErrors = 0;
  }
}

function buildBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if ((col + 1) % 3 === 0 && col !== 8) {
        cell.classList.add("block-right");
      }
      if ((row + 1) % 3 === 0 && row !== 8) {
        cell.classList.add("block-bottom");
      }
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Строка ${row + 1}, столбец ${col + 1}`);
      cell.tabIndex = 0;
      cell.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        selectCell(cell);
        playClickSound("soft");
      });
      boardElement.appendChild(cell);
    }
  }
}

function selectCell(cell) {
  if (selectedCell) {
    selectedCell.classList.remove("selected");
  }
  selectedCell = cell;
  selectedCell.classList.add("selected");
  showMobileNumpadForSelectedCell();
}

function renderBoard() {
  const cells = boardElement.children;
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const idx = row * 9 + col;
      const cell = cells[idx];
      const value = currentBoard[row][col];
      cell.textContent = value === 0 ? "" : String(value);
      cell.classList.toggle("fixed", originalBoard[row][col] !== 0);
      cell.classList.remove("error");
      cell.classList.remove("correct");
    }
  }
}

function findConflicts(board) {
  const conflictSet = new Set();

  // Проверка строк и столбцов на повторяющиеся цифры.
  for (let i = 0; i < 9; i += 1) {
    const rowSeen = new Map();
    const colSeen = new Map();
    for (let j = 0; j < 9; j += 1) {
      const rowValue = board[i][j];
      const colValue = board[j][i];

      if (rowValue !== 0) {
        if (!rowSeen.has(rowValue)) {
          rowSeen.set(rowValue, []);
        }
        rowSeen.get(rowValue).push([i, j]);
      }

      if (colValue !== 0) {
        if (!colSeen.has(colValue)) {
          colSeen.set(colValue, []);
        }
        colSeen.get(colValue).push([j, i]);
      }
    }

    rowSeen.forEach((cells) => {
      if (cells.length > 1) {
        cells.forEach(([r, c]) => conflictSet.add(`${r}-${c}`));
      }
    });
    colSeen.forEach((cells) => {
      if (cells.length > 1) {
        cells.forEach(([r, c]) => conflictSet.add(`${r}-${c}`));
      }
    });
  }

  for (let startRow = 0; startRow < 9; startRow += 3) {
    for (let startCol = 0; startCol < 9; startCol += 3) {
      const boxSeen = new Map();
      for (let row = startRow; row < startRow + 3; row += 1) {
        for (let col = startCol; col < startCol + 3; col += 1) {
          const value = board[row][col];
          if (value === 0) {
            continue;
          }
          if (!boxSeen.has(value)) {
            boxSeen.set(value, []);
          }
          boxSeen.get(value).push([row, col]);
        }
      }
      boxSeen.forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(([r, c]) => conflictSet.add(`${r}-${c}`));
        }
      });
    }
  }

  return conflictSet;
}

function paintConflicts(conflicts) {
  const cells = boardElement.children;
  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const key = `${row}-${col}`;
    const value = currentBoard[row][col];
    const editableCell = originalBoard[row][col] === 0;
    cell.classList.toggle("error", conflicts.has(key));
    cell.classList.toggle(
      "correct",
      editableCell && value !== 0 && !conflicts.has(key)
    );
  }
}

function isBoardFilled(board) {
  return board.every((row) => row.every((cell) => cell !== 0));
}

function checkWin() {
  if (isGameCompleted) {
    return true;
  }
  const conflicts = findConflicts(currentBoard);
  paintConflicts(conflicts);
  if (conflicts.size > 0) {
    setStatus("Есть конфликты. Проверьте подсвеченные клетки.", "warn");
    return false;
  }
  if (!isBoardFilled(currentBoard)) {
    setStatus("Почти готово! Заполните все пустые клетки.", "warn");
    return false;
  }
  isGameCompleted = true;
  stopTimer();
  playWinSound();
  setStatus(`Победа! Время ${formatTime(elapsedSeconds)}, ошибок: ${errorsCount}.`, "ok");
  return true;
}

function applyInput(value) {
  if (isGameCompleted) {
    setStatus("Игра уже завершена. Начните новую партию.");
    return;
  }
  if (!selectedCell) {
    setStatus("Сначала выберите клетку на поле.");
    return;
  }
  const row = Number(selectedCell.dataset.row);
  const col = Number(selectedCell.dataset.col);

  if (originalBoard[row][col] !== 0) {
    setStatus("Эта клетка зафиксирована и не редактируется.", "warn");
    return;
  }

  currentBoard[row][col] = value;
  renderBoard();
  selectCell(boardElement.children[row * 9 + col]);
  const conflicts = findConflicts(currentBoard);
  paintConflicts(conflicts);

  if (value === 0) {
    consecutiveErrors = 0;
    setStatus("Клетка очищена.");
    return;
  }

  if (conflicts.has(`${row}-${col}`)) {
    registerError();
    playErrorSound();
    setStatus("Это число конфликтует с правилом судоку.", "warn");
    return;
  }

  playSuccessSound();
  consecutiveErrors = 0;
  setStatus(`Поставлено число ${value}.`);
  checkWin();
}

function resetToOriginal() {
  currentBoard = cloneBoard(originalBoard);
  selectedCell = null;
  hideMobileNumpad();
  isGameCompleted = false;
  resetStats();
  startTimer();
  renderBoard();
  setStatus("Поле сброшено к начальному состоянию.");
}

function startNewGame() {
  currentDifficulty = difficultySelect.value;
  originalBoard = getRandomPuzzle(currentDifficulty);
  currentBoard = cloneBoard(originalBoard);
  selectedCell = null;
  hideMobileNumpad();
  isGameCompleted = false;
  resetStats();
  startTimer();
  renderBoard();
  setStatus(`Новая игра (${difficultySelect.selectedOptions[0].textContent}) готова!`);
}

function onKeyDown(event) {
  if (event.key === "Escape" && !jumpscareOverlay.hidden) {
    hideJumpscare();
    return;
  }

  if (!selectedCell) {
    return;
  }

  if (/^[1-9]$/.test(event.key)) {
    applyInput(Number(event.key));
    return;
  }

  if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
    applyInput(0);
  }
}

function onMobileNumpadValueClick(event) {
  if (!selectedCell || !isEditableCell(selectedCell) || isGameCompleted) {
    return;
  }
  const rawValue = event.currentTarget.dataset.mobileValue;
  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < 1 || value > 9) {
    return;
  }
  playClickSound("soft");
  applyInput(value);
}

function onMobileNumpadClearClick() {
  if (!selectedCell || !isEditableCell(selectedCell) || isGameCompleted) {
    return;
  }
  playClickSound("soft");
  applyInput(0);
}

soundToggleBtn.addEventListener("click", toggleSound);
musicToggleBtn.addEventListener("click", toggleMusic);
musicVolumeInput.addEventListener("input", onMusicVolumeInput);
mobileNumpadValueButtons.forEach((button) => {
  button.addEventListener("click", onMobileNumpadValueClick);
});
mobileNumpadClearBtn.addEventListener("click", onMobileNumpadClearClick);
newGameBtn.addEventListener("click", () => {
  playClickSound("ui");
  startNewGame();
});
checkBtn.addEventListener("click", () => {
  playClickSound("ui");
  checkWin();
});
resetBtn.addEventListener("click", () => {
  playClickSound("ui");
  resetToOriginal();
});
difficultySelect.addEventListener("change", () => {
  playClickSound("soft");
  startNewGame();
});
jumpscareOverlay.addEventListener("click", () => {
  hideJumpscare();
});
document.addEventListener("keydown", onKeyDown);
document.addEventListener("pointerdown", attemptAutoStartMusic, { once: true });
document.addEventListener("keydown", attemptAutoStartMusic, { once: true });
document.addEventListener("touchstart", attemptAutoStartMusic, { once: true });
window.addEventListener("load", attemptAutoStartMusic);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    attemptAutoStartMusic();
  }
});

syncSoundToggleView();
syncMusicToggleView();
buildBoard();
startNewGame();
attemptAutoStartMusic();
