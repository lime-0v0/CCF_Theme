"use strict";

const fieldsEl = document.getElementById("fields");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save");
const resetBtn = document.getElementById("reset");

let currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME);
let saveTimer = null;

function renderFields(theme) {
  fieldsEl.innerHTML = "";
  for (const { key, label } of CCFOLIA_THEME_FIELDS) {
    const row = document.createElement("div");
    row.className = "field";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.htmlFor = `color-${key}`;

    const input = document.createElement("input");
    input.type = "color";
    input.id = `color-${key}`;
    input.value = theme[key];
    input.addEventListener("input", () => {
      currentTheme[key] = input.value;
      scheduleAutoSave();
    });

    row.appendChild(labelEl);
    row.appendChild(input);
    fieldsEl.appendChild(row);
  }
}

function scheduleAutoSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveTheme(false), 150);
}

function saveTheme(showStatus) {
  chrome.storage.local.set({ [CCFOLIA_STORAGE_KEY]: currentTheme }, () => {
    if (showStatus) {
      statusEl.textContent = "저장되었습니다.";
      setTimeout(() => (statusEl.textContent = ""), 1500);
    }
  });
}

function loadTheme() {
  chrome.storage.local.get(CCFOLIA_STORAGE_KEY, (result) => {
    currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, result[CCFOLIA_STORAGE_KEY]);
    renderFields(currentTheme);
  });
}

saveBtn.addEventListener("click", () => saveTheme(true));

resetBtn.addEventListener("click", () => {
  currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME);
  renderFields(currentTheme);
  saveTheme(true);
});

loadTheme();
