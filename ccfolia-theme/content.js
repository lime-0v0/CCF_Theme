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
/* ---- 페이지 기본 배경 (룸 목록 화면, 룸 화면에서 보드 UI 바깥의 빈 공간) ----
   헤더/입력창/사이드바/패널과 같은 색(sidebarBg)을 쓴다. MUI CssBaseline이
   body에 다크 배경색을 깔아두는데, 이걸 안 바꾸면 다이얼로그/카드/패널처럼
   구체적인 컴포넌트 바깥의 빈 공간은 계속 어둡게 남는다.
   ccfolia.com/home처럼 보드가 없는 화면은 이 규칙만으로 전체가 통일된다. */
html,
body {
  background-color: ${t.sidebarBg} !important;
}

/* ---- 룸(보드) 배경 (해시 클래스, ccfolia 1.36.3 기준 — 버전업 시 깨질 수 있음) ----
   헤더/패널과는 분리된 별도 색(boardBg). 씬이 없을 때 보이는 격자는 반투명
   흰 선(rgba(255,255,255,0.1))만 inline style로 그려져 있고 그 자체는 배경이
   투명이라 부모 배경을 그대로 물려받는다. 그 부모 컨테이너(.sc-eVedOh — 씬
   이미지가 있을 때도 같은 위치를 차지하는 컨테이너)를 boardBg로 채운다.
   씬에 이미지가 있으면 이미지가 이 배경을 완전히 덮으므로 영향 없다. */
.sc-eVedOh {
  background-color: ${t.boardBg} !important;
}

/* ---- 헤더 / AppBar: 평소엔 완전히 투명, 호버 시에만 배경이 보임 ---- */
.MuiAppBar-root {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0) !important;
  transition: background-color 0.2s ease !important;
}
.MuiAppBar-root:hover {
  background-color: ${t.sidebarBg} !important;
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
  color: ${t.sidebarBg} !important;
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

/* ---- 떠 있는 패널들(채팅 하단 패널, Marker/Screen/Scene/Cut-in/캐릭터 목록 창 등) ----
   MuiPaper-elevation6는 방 목록 카드(MuiCard-root)도 재사용하므로 제외한다.
   다이얼로그/팝오버와 마찬가지로 반투명 + 옅은 그림자로 통일한다.
   (예전엔 완전 불투명 sidebarBg를 줘서, 원래 반투명했던 캐릭터 편집창 같은
   다른 떠 있는 창들과 톤이 어긋났다.) */
.MuiPaper-elevation6:not(.MuiCard-root) {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.82) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18) !important;
}

/* ---- 채팅 멀티라인 입력창 ----
   MuiInputBase-root 전체에 걸면 밑줄 스타일 필드까지 박스로 바뀌므로
   MuiInputBase-multiline으로 스코프를 좁힌다. 배경은 sidebarBg를 써서 위쪽
   캐릭터 이름 입력칸(패널 배경 그대로)과 같은 색으로 통일하고, 테두리만으로
   입력창임을 구분한다. */
.MuiInputBase-multiline {
  background-color: ${t.sidebarBg} !important;
  border: 1px solid rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.3) !important;
  border-radius: 4px !important;
}
/* 입력창 안에 실제로 타이핑되는 글자색. 기존엔 래퍼(MuiInputBase-multiline)만
   손대고 정작 안쪽 <textarea class="MuiInputBase-input">는 그대로 둬서
   원래 다크 테마의 흰 글자색이 남아 흰 배경에서 타이핑한 내용이 안 보였다. */
.MuiInputBase-input {
  color: ${t.textPrimary} !important;
}
/* outlined 스타일 입력창은 테두리가 MuiInputBase-root가 아니라
   내부의 fieldset(notchedOutline)에 그려지므로 별도로 색을 지정한다. */
.MuiOutlinedInput-notchedOutline {
  border-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.3) !important;
}
.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
  border-color: rgba(${ccfoliaHexToRgb(t.textPrimary)}, 0.5) !important;
}

/* ---- 다이얼로그 내부 아이콘 버튼 ----
   button 태그 전체에 걸면 DELETE/DUPLICATION 같은 의미색 텍스트 버튼까지
   덮어쓰므로 아이콘/아이콘버튼만 타겟한다. */
.MuiDialog-paper .MuiSvgIcon-root,
.MuiDialog-paper .MuiIconButton-root {
  color: ${t.textPrimary} !important;
}

/* ---- 탭 ----
   MuiTab-textColorPrimary는 비선택 탭 글자색이 흰색(#FFFFFFB3)으로 하드코딩되어 있어
   (파일 업로드 다이얼로그의 FOREGROUND/CHARACTER/... 탭, 홈 화면의 게임/라이브러리 탭 등)
   라이트 배경에서 안 보인다. 선택된 탭(.Mui-selected)은 제외하고 어둡게 바꾼다. */
.MuiTab-textColorPrimary:not(.Mui-selected) {
  color: ${t.textSecondary} !important;
}
.Mui-selected {
  color: ${t.tabActive} !important;
}
.MuiTabs-indicator {
  background-color: ${t.tabActive} !important;
}

/* ---- BGM 칩(BGM01 / BGM02 등) ----
   MuiChip 라벨 글자색이 흰색으로 하드코딩되어 평소엔 안 보이다가, ccfolia
   자체 호버 스타일이 덮어씌워질 때만(어두운 텍스트) 보였다. */
.MuiChip-root,
.MuiChip-label {
  color: ${t.textPrimary} !important;
}

/* ---- 구분선 ---- */
.MuiDivider-root {
  border-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.3) !important;
  background-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.3) !important;
}

/* ---- 홈 화면 방 목록 카드 ----
   카드 배경(원래 어두운색)을 다른 패널들과 같은 sidebarBg로, 방 이름/날짜
   텍스트를 어둡게 바꾼다. (예전에는 MuiPaper-elevation6 규칙에서
   MuiCard-root를 제외하기만 했지만, 텍스트 색까지 같이 바꾸면 대비가 깨지지
   않으므로 여기서 함께 처리한다.) */
.MuiCard-root {
  background-color: ${t.sidebarBg} !important;
}
.MuiCard-root .MuiTypography-root {
  color: ${t.textPrimary} !important;
}

/* ---- 사이드바 / 배경 ---- */
.MuiDrawer-paper {
  background-color: ${t.sidebarBg} !important;
  color: ${t.textPrimary} !important;
}

/* ---- 전송 버튼 ----
   전송 버튼은 아이콘이 아니라 "SEND" 텍스트가 있는 contained 버튼이라
   [data-testid="SendIcon"]는 애초에 매치되지 않았다. 별도 색을 두지 않고
   강조색(tabActive)을 그대로 쓴다. */
.MuiButton-containedPrimary {
  background-color: ${t.tabActive} !important;
  color: #fff !important;
}
.MuiButton-containedPrimary.Mui-disabled {
  background-color: rgba(${ccfoliaHexToRgb(t.tabActive)}, 0.4) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* ---- 보드 위 캐릭터 토큰 호버 그림자 (해시 클래스, ccfolia 1.36.3 기준 — 버전업 시 깨질 수 있음) ----
   토큰 이미지에 안정적인 Mui 클래스가 없어 HP 게이지 바와 같은 예외로 처리한다. */
.sc-eKaOtw {
  transition: filter 0.15s ease !important;
}
.sc-eKaOtw:hover {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45)) !important;
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
