"use strict";

const presetsEl = document.getElementById("presets");
const fieldsWrapEl = document.getElementById("fieldsWrap");
const fieldsEl = document.getElementById("fields");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save");
const saveCustomBtn = document.getElementById("saveCustom");

let currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME);
let customTheme = null; // 사용자가 저장한 "내 테마" (없으면 null)
let saveTimer = null;

function allPresets() {
  const list = CCFOLIA_PRESETS.slice();
  if (customTheme) {
    list.push({ id: "custom", label: "내 테마", theme: customTheme });
  }
  return list;
}

function presetMatches(preset) {
  const merged = Object.assign({}, CCFOLIA_DEFAULT_THEME, preset.theme);
  return Object.keys(merged).every((key) => merged[key] === currentTheme[key]);
}

function renderPresets() {
  presetsEl.innerHTML = "";
  for (const preset of allPresets()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = preset.label;
    const active = presetMatches(preset);
    if (active) btn.classList.add("active");
    btn.setAttribute("aria-pressed", active ? "true" : "false");
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
  const enabled = currentTheme.enabled !== false;
  fieldsWrapEl.style.display = enabled ? "" : "none";
  saveCustomBtn.parentElement.style.display = enabled ? "" : "none";
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
    if (showStatus) showStatus("저장되었습니다.");
  });
}

function showStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => (statusEl.textContent = ""), 1500);
}

function loadTheme() {
  chrome.storage.local.get([CCFOLIA_STORAGE_KEY, CCFOLIA_CUSTOM_STORAGE_KEY], (result) => {
    currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, result[CCFOLIA_STORAGE_KEY]);
    customTheme = result[CCFOLIA_CUSTOM_STORAGE_KEY] || null;
    renderPresets();
    renderFields();
  });
}

saveBtn.addEventListener("click", () => saveTheme(showStatus));

saveCustomBtn.addEventListener("click", () => {
  customTheme = Object.assign({}, currentTheme);
  chrome.storage.local.set({ [CCFOLIA_CUSTOM_STORAGE_KEY]: customTheme }, () => {
    renderPresets();
    showStatus("내 테마로 저장되었습니다.");
  });
});

loadTheme();
