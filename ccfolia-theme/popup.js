"use strict";

const presetsEl = document.getElementById("presets");
const presetDividerEl = document.getElementById("presetDivider");
const customPresetsEl = document.getElementById("customPresets");
const fieldsWrapEl = document.getElementById("fieldsWrap");
const fieldsEl = document.getElementById("fields");
const statusEl = document.getElementById("status");
const shareWrapEl = document.getElementById("shareWrap");
const shareBoxEl = document.getElementById("shareBox");
const shareArea = document.getElementById("shareArea");
const saveCustomBtn = document.getElementById("saveCustom");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const shareCloseBtn = document.getElementById("shareClose");
const nameBoxEl = document.getElementById("nameBox");
const nameInput = document.getElementById("nameInput");
const nameConfirmBtn = document.getElementById("nameConfirm");
const nameCancelBtn = document.getElementById("nameCancel");

let currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME);
let customThemes = []; // [{id, name, theme}, ...] 사용자가 저장한 테마 여러 개
let saveTimer = null;

function ccfoliaGenId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function presetMatches(themePartial) {
  const merged = Object.assign({}, CCFOLIA_DEFAULT_THEME, themePartial);
  return Object.keys(merged).every((key) => merged[key] === currentTheme[key]);
}

function applyTheme(themePartial) {
  currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, themePartial);
  renderPresets();
  renderFields();
  saveTheme();
}

// 버튼 배경/글자색을 그 프리셋이 실제로 적용할 색으로 미리 보여준다.
// "기본"(off)은 색이 없는 옵션이라 기본 버튼 스타일 그대로 둔다.
function applyPresetPreview(btn, themePartial) {
  if (themePartial.enabled === false) return;
  const t = Object.assign({}, CCFOLIA_DEFAULT_THEME, themePartial);
  btn.style.background = t.sidebarBg;
  btn.style.color = t.textPrimary;
}

function renderPresets() {
  presetsEl.innerHTML = "";
  for (const preset of CCFOLIA_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = preset.label;
    applyPresetPreview(btn, preset.theme);
    const active = presetMatches(preset.theme);
    if (active) btn.classList.add("active");
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.addEventListener("click", () => applyTheme(preset.theme));
    presetsEl.appendChild(btn);
  }

  customPresetsEl.innerHTML = "";
  const hasCustom = customThemes.length > 0;
  presetDividerEl.classList.toggle("hidden", !hasCustom);
  customPresetsEl.classList.toggle("hidden", !hasCustom);
  for (const custom of customThemes) {
    customPresetsEl.appendChild(renderCustomChip(custom));
  }
}

function renderCustomChip(custom) {
  const chip = document.createElement("div");
  chip.className = "presetChip";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = custom.name;
  btn.title = custom.name;
  applyPresetPreview(btn, custom.theme);
  const active = presetMatches(custom.theme);
  if (active) btn.classList.add("active");
  btn.setAttribute("aria-pressed", active ? "true" : "false");
  btn.addEventListener("click", () => applyTheme(custom.theme));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "chipDelete";
  del.textContent = "×";
  del.title = `"${custom.name}" 삭제`;
  del.setAttribute("aria-label", `${custom.name} 삭제`);
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteCustomTheme(custom.id);
  });

  chip.appendChild(btn);
  chip.appendChild(del);
  return chip;
}

function deleteCustomTheme(id) {
  customThemes = customThemes.filter((c) => c.id !== id);
  chrome.storage.local.set({ [CCFOLIA_CUSTOM_LIST_STORAGE_KEY]: customThemes }, () => {
    renderPresets();
    showStatus("삭제되었습니다.");
  });
}

function renderFields() {
  shareBoxEl.classList.add("hidden");
  nameBoxEl.classList.add("hidden");

  const enabled = currentTheme.enabled !== false;
  fieldsWrapEl.style.display = enabled ? "" : "none";
  shareWrapEl.style.display = enabled ? "" : "none";
  fieldsEl.innerHTML = "";
  for (const { key, label } of CCFOLIA_THEME_FIELDS) {
    const row = document.createElement("div");
    row.className = "field";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.title = label;
    labelEl.htmlFor = `color-${key}`;

    const group = document.createElement("div");
    group.className = "swatchGroup";

    const input = document.createElement("input");
    input.type = "color";
    input.id = `color-${key}`;
    input.value = currentTheme[key];

    // ccfolia 자체 색상 지정 UI도 hex 코드 입력을 지원해서, 스와치 옆에
    // 직접 hex를 타이핑/붙여넣기할 수 있는 텍스트 필드를 같이 둔다.
    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.className = "hex";
    hexInput.maxLength = 7;
    hexInput.spellcheck = false;
    hexInput.value = currentTheme[key];
    hexInput.setAttribute("aria-label", `${label} HEX 코드`);

    input.addEventListener("input", () => {
      currentTheme[key] = input.value;
      hexInput.value = input.value;
      currentTheme.enabled = true;
      renderPresets();
      scheduleAutoSave();
    });

    hexInput.addEventListener("change", () => {
      const normalized = hexInput.value.trim().replace(/^#?/, "#");
      if (!CCFOLIA_HEX_RE.test(normalized)) {
        hexInput.value = currentTheme[key];
        showStatus("HEX 형식이 올바르지 않습니다. 예: #8E4EC6");
        return;
      }
      currentTheme[key] = normalized;
      input.value = normalized;
      hexInput.value = normalized;
      currentTheme.enabled = true;
      renderPresets();
      scheduleAutoSave();
    });

    group.appendChild(input);
    group.appendChild(hexInput);
    row.appendChild(labelEl);
    row.appendChild(group);
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
  chrome.storage.local.get(
    [CCFOLIA_STORAGE_KEY, CCFOLIA_CUSTOM_STORAGE_KEY, CCFOLIA_CUSTOM_LIST_STORAGE_KEY],
    (result) => {
      currentTheme = Object.assign({}, CCFOLIA_DEFAULT_THEME, result[CCFOLIA_STORAGE_KEY]);

      if (Array.isArray(result[CCFOLIA_CUSTOM_LIST_STORAGE_KEY])) {
        customThemes = result[CCFOLIA_CUSTOM_LIST_STORAGE_KEY];
      } else if (result[CCFOLIA_CUSTOM_STORAGE_KEY]) {
        // 예전(단일 슬롯) 버전에서 저장해둔 테마가 있으면 새 목록 형식으로
        // 한 번만 옮기고, 옛 키는 지운다.
        customThemes = [{ id: ccfoliaGenId(), name: "내 테마", theme: result[CCFOLIA_CUSTOM_STORAGE_KEY] }];
        chrome.storage.local.set({ [CCFOLIA_CUSTOM_LIST_STORAGE_KEY]: customThemes });
        chrome.storage.local.remove(CCFOLIA_CUSTOM_STORAGE_KEY);
      } else {
        customThemes = [];
      }

      renderPresets();
      renderFields();
    }
  );
}

// 이름 입력은 네이티브 prompt() 대신 팝업 안에 인라인 입력창으로 둔다 --
// 브라우저 기본 다이얼로그는 스타일도 안 맞고 팝업 포커스 흐름도 깨진다.
saveCustomBtn.addEventListener("click", () => {
  shareBoxEl.classList.add("hidden");
  nameBoxEl.classList.remove("hidden");
  nameInput.value = `내 테마 ${customThemes.length + 1}`;
  nameInput.focus();
  nameInput.select();
});

function confirmSaveCustom() {
  const defaultName = `내 테마 ${customThemes.length + 1}`;
  const entry = {
    id: ccfoliaGenId(),
    name: nameInput.value.trim() || defaultName,
    theme: Object.assign({}, currentTheme),
  };
  customThemes.push(entry);
  chrome.storage.local.set({ [CCFOLIA_CUSTOM_LIST_STORAGE_KEY]: customThemes }, () => {
    renderPresets();
    showStatus("테마로 저장되었습니다.");
  });
  nameBoxEl.classList.add("hidden");
}

nameConfirmBtn.addEventListener("click", confirmSaveCustom);
nameCancelBtn.addEventListener("click", () => nameBoxEl.classList.add("hidden"));
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    confirmSaveCustom();
  } else if (e.key === "Escape") {
    nameBoxEl.classList.add("hidden");
  }
});

exportBtn.addEventListener("click", () => {
  const json = ccfoliaExportTheme(currentTheme);
  nameBoxEl.classList.add("hidden");
  shareBoxEl.classList.remove("hidden");
  shareArea.readOnly = true;
  shareArea.value = json;
  shareArea.focus();
  shareArea.select();
  // 클립보드 API가 막혀 있어도(권한/포커스 문제) 텍스트가 선택된 채로 보이니
  // 사용자가 직접 Ctrl+C로 복사할 수 있다 -- 이게 진짜 폴백이고, 클립보드
  // 자동 복사는 성공하면 좋은 편의 기능일 뿐이다.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(json)
      .then(() => showStatus("클립보드에 복사되었습니다."))
      .catch(() => showStatus("아래 코드를 직접 복사해주세요."));
  } else {
    showStatus("아래 코드를 직접 복사해주세요.");
  }
});

importBtn.addEventListener("click", () => {
  nameBoxEl.classList.add("hidden");
  shareBoxEl.classList.remove("hidden");
  shareArea.readOnly = false;
  shareArea.value = "";
  shareArea.placeholder = "여기에 테마 코드를 붙여넣고 Enter";
  shareArea.focus();
});

shareCloseBtn.addEventListener("click", () => {
  shareBoxEl.classList.add("hidden");
});

shareArea.addEventListener("keydown", (e) => {
  if (shareArea.readOnly) return;
  if (e.key !== "Enter" || e.shiftKey) return;
  e.preventDefault();

  let parsed;
  try {
    parsed = JSON.parse(shareArea.value);
  } catch (err) {
    showStatus("형식을 확인해주세요. (JSON 아님)");
    return;
  }
  // 붙여넣은 값은 신뢰할 수 없으니 알려진 키 + hex 형식만 통과시킨다.
  const sanitized = ccfoliaSanitizeTheme(parsed);
  if (!sanitized || Object.keys(sanitized).length === 0) {
    showStatus("형식을 확인해주세요.");
    return;
  }
  applyTheme(sanitized);
});

loadTheme();
