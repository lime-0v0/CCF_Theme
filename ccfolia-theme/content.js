// ccfolia.com 다크 테마 → 커스텀(기본값: 라이트) 테마 CSS 주입
//
// 셀렉터 선정 기준:
//  - emotion이 만드는 해시 클래스(sc-xxxxx, css-xxxxx)는 빌드마다 바뀌므로 타겟하지 않는다.
//  - Mui- 접두사 클래스, data-testid 속성 위주로 잡는다.
//  - 예외: HP 게이지 바(.sc-kMGnbm, .sc-ksXhwP)는 안정적인 Mui 클래스가 없어 해시 클래스를 직접 사용한다.
//    ccfolia 버전(현재 1.36.3)이 올라가면 깨질 수 있다.
"use strict";

const CCFOLIA_STYLE_TAG_ID = "ccfolia-theme";

function ccfoliaBuildCSS(theme) {
  const t = Object.assign({}, CCFOLIA_DEFAULT_THEME, theme);

  return `
/* ---- 헤더 / AppBar: 평소엔 반투명, 호버 시 진해짐 ---- */
.MuiAppBar-root {
  background-color: rgba(${ccfoliaHexToRgb(t.headerBg)}, 0.6) !important;
  transition: background-color 0.2s ease !important;
}
.MuiAppBar-root:hover {
  background-color: ${t.headerBg} !important;
}
.MuiAppBar-root,
.MuiAppBar-root .MuiTypography-root {
  color: ${t.textPrimary} !important;
}

/* ---- 다이얼로그 / 팝오버 / 메뉴: 반투명 패널 ---- */
/* MuiPopover-paper / MuiMenu-paper는 방 목록 카드(MuiCard-root)와 클래스가 겹칠 수 있어 제외 */
.MuiDialog-paper,
.MuiPopover-paper:not(.MuiCard-root),
.MuiMenu-paper:not(.MuiCard-root) {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.82) !important;
  color: ${t.textPrimary} !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18) !important;
}
.MuiTooltip-tooltip {
  background-color: rgba(${ccfoliaHexToRgb(t.textPrimary)}, 0.92) !important;
  color: ${t.inputBg} !important;
}

/* ---- 폼 라벨: 포커스 중일 땐 원래 강조색(파란색) 유지 ---- */
.MuiFormLabel-root:not(.Mui-focused) {
  color: ${t.textSecondary} !important;
}

/* ---- 밑줄 입력창: 반투명 유지, 색만 어둡게 ---- */
.MuiInput-underline:before {
  border-bottom-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.42) !important;
}
.MuiInput-underline:hover:not(.Mui-disabled):before {
  border-bottom-color: rgba(${ccfoliaHexToRgb(t.textPrimary)}, 0.6) !important;
}

/* ---- placeholder 텍스트 ---- */
::placeholder {
  color: ${t.textSecondary} !important;
  opacity: 0.65 !important;
}

/* ---- 보드(맵) 위 오버레이 텍스트: 이름표 / HP / 말풍선 ---- */
/* 배경이 다양하므로(그리드, 토큰 이미지 등) 흰색 halo로 항상 보이게 처리 */
.MuiTypography-body2.MuiTypography-noWrap,
.MuiTypography-body1 {
  color: ${t.textPrimary} !important;
  text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff,
    0 0 4px #fff !important;
}

/* ---- 주사위 판정 결과 색상 코딩(BCDice) ----
   !important 없이, 단일 클래스 수준으로 우선순위를 낮춰서
   기본값만 채우고 BCDice가 지정한 크리티컬/펌블 색은 자연스럽게 이기도록 한다. */
.MuiTypography-body2 {
  color: ${t.textPrimary};
}

/* ---- 아이콘 전역 처리 ----
   [data-testid="ColorLensIcon"]: 캐릭터 색상 아이콘은 캐릭터마다 색이 바뀌는
   동적 인라인 스타일이라 전역 규칙에서 제외한다. */
.MuiSvgIcon-root:not([data-testid="ColorLensIcon"]) {
  color: ${t.textPrimary} !important;
}

/* ---- 채팅 하단 패널(캐릭터 선택줄 + 주사위줄) ----
   MuiPaper-elevation6는 방 목록 카드(MuiCard-root)도 재사용하므로 제외한다. */
.MuiPaper-elevation6:not(.MuiCard-root) {
  background-color: ${t.sidebarBg} !important;
}

/* ---- 채팅 멀티라인 입력창 ----
   MuiInputBase-root 전체에 걸면 밑줄 스타일 필드까지 박스로 바뀌므로
   MuiInputBase-multiline으로 스코프를 좁힌다. */
.MuiInputBase-multiline {
  background-color: ${t.inputBg} !important;
  border: 1px solid rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.3) !important;
  border-radius: 4px !important;
}

/* ---- 다이얼로그 내부 아이콘 버튼 ----
   button 태그 전체에 걸면 DELETE/DUPLICATION 같은 의미색 텍스트 버튼까지
   덮어쓰므로 아이콘/아이콘버튼만 타겟한다. */
.MuiDialog-paper .MuiSvgIcon-root,
.MuiDialog-paper .MuiIconButton-root {
  color: ${t.textPrimary} !important;
}

/* ---- 탭 ---- */
.Mui-selected {
  color: ${t.tabActive} !important;
}
.MuiTabs-indicator {
  background-color: ${t.tabActive} !important;
}

/* ---- 사이드바 / 배경 ---- */
.MuiDrawer-paper {
  background-color: ${t.sidebarBg} !important;
  color: ${t.textPrimary} !important;
}

/* ---- 전송 버튼 ---- */
[data-testid="SendIcon"] {
  color: ${t.sendBtn} !important;
}

/* ---- HP 게이지 바 (해시 클래스, ccfolia 1.36.3 기준 — 버전업 시 깨질 수 있음) ---- */
.sc-kMGnbm {
  background-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.2) !important;
}
.sc-ksXhwP {
  background-color: ${t.tabActive} !important;
}
`;
}

function ccfoliaInjectStyle(theme) {
  let styleEl = document.getElementById(CCFOLIA_STYLE_TAG_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = CCFOLIA_STYLE_TAG_ID;
    (document.head || document.documentElement).appendChild(styleEl);
  }
  styleEl.textContent = ccfoliaBuildCSS(theme);
}

function ccfoliaLoadAndApply() {
  chrome.storage.local.get(CCFOLIA_STORAGE_KEY, (result) => {
    const theme = result[CCFOLIA_STORAGE_KEY] || CCFOLIA_DEFAULT_THEME;
    ccfoliaInjectStyle(theme);
  });
}

ccfoliaLoadAndApply();

// 팝업에서 색을 바꾸면 storage.onChanged를 통해 페이지를 새로고침하지 않아도 즉시 반영된다.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[CCFOLIA_STORAGE_KEY]) {
    ccfoliaInjectStyle(changes[CCFOLIA_STORAGE_KEY].newValue || CCFOLIA_DEFAULT_THEME);
  }
});
