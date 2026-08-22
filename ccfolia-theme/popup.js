"use strict";

const presetsEl = document.getElementById("presets");
const fieldsWrapEl = document.getElementById("fieldsWrap");
const fieldsEl = document.getElementById("fields");
const statusEl = document.getElementById("status");
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
      saveTheme();
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

// 색상 드래그 중 매 이벤트마다 저장/토스트가 뜨지 않도록 묶어서(debounce)
// 손을 뗀 뒤 한 번만 저장하고 "저장됨"을 보여준다. 별도의 수동 저장 버튼은
// 두지 않는다 -- 있으면 "자동저장되는 건가, 눌러야 하는 건가" 혼란만 생긴다.
function scheduleAutoSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveTheme, 200);
}

function saveTheme() {
  chrome.storage.local.set({ [CCFOLIA_STORAGE_KEY]: currentTheme }, () => {
    showStatus("저장됨");
  });
}

function showStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => (statusEl.textContent = ""), 1200);
}

function loadTheme() {
  chrome.storage.local.get([CCFOLIA_STORAGE_KEY, CCFOLIA_CUSTOM_STORAGE_KEY], (result) => {
    currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, result[CCFOLIA_STORAGE_KEY]);
    customTheme = result[CCFOLIA_CUSTOM_STORAGE_KEY] || null;
    renderPresets();
    renderFields();
  });
}

saveCustomBtn.addEventListener("click", () => {
  customTheme = Object.assign({}, currentTheme);
  chrome.storage.local.set({ [CCFOLIA_CUSTOM_STORAGE_KEY]: customTheme }, () => {
    renderPresets();
    showStatus("내 테마로 저장되었습니다.");
  });
});

loadTheme();
