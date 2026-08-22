// 단축키(Ctrl+Shift+U, chrome://extensions/shortcuts에서 바꿀 수 있음)로
// 테마를 켜고 끈다. content.js가 이미 storage.onChanged를 구독하고
// 있어서, 여기선 storage의 enabled 값만 뒤집으면 열려 있는 ccfolia 탭에
// 새로고침 없이 바로 반영된다 -- "기본"(off) 프리셋과 완전히 같은 스위치를
// 재사용하는 것뿐이라 별도 로직이 필요 없다.
"use strict";

importScripts("theme.js");

chrome.commands.onCommand.addListener((command) => {
  if (command !== "toggle-theme") return;
  chrome.storage.local.get(CCFOLIA_STORAGE_KEY, (result) => {
    const current = Object.assign({}, CCFOLIA_DEFAULT_THEME, result[CCFOLIA_STORAGE_KEY]);
    current.enabled = current.enabled === false;
    chrome.storage.local.set({ [CCFOLIA_STORAGE_KEY]: current });
  });
});
