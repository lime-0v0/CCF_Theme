"use strict";

const presetsEl = document.getElementById("presets");
const fieldsWrapEl = document.getElementById("fieldsWrap");
const fieldsEl = document.getElementById("fields");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save");

let currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME);
let saveTimer = null;

function presetMatches(preset) {
  const merged = Object.assign({}, CCFOLIA_DEFAULT_THEME, preset.theme);
  return Object.keys(merged).every((key) => merged[key] === currentTheme[key]);
}

function renderPresets() {
  presetsEl.innerHTML = "";
  for (const preset of CCFOLIA_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = preset.label;
    if (presetMatches(preset)) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, preset.theme);
      renderPresets();
      renderFields();
      saveTheme(true);
    });
    presetsEl.appendChild(btn);
  }
}

function renderFields() {
  fieldsWrapEl.style.display = currentTheme.enabled === false ? "none" : "";
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
    input.value = currentTheme[key];
    input.addEventListener("input", () => {
      currentTheme[key] = input.value;
      currentTheme.enabled = true;
      renderPresets();
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
    renderPresets();
    renderFields();
  });
}

saveBtn.addEventListener("click", () => saveTheme(true));

loadTheme();
