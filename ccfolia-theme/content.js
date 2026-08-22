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
/* .sc-eVedOh는 팬/줌으로 이동하는 보드 콘텐츠 박스라 화면 전체를 덮지
   않을 때가 있다(뷰포트보다 작거나 다른 위치로 이동한 경우). 뷰포트 자체를
   감싸는 바깥 컨테이너(.sc-jcsPWJ)도 같이 채워서 어느 경우에도 흰 여백이
   남지 않게 한다. */
.sc-jcsPWJ {
  background-color: ${t.boardBg} !important;
}

/* ---- 상단 고정 헤더(AppBar, positionFixed): 평소엔 완전히 투명, 호버 시에만 배경 ----
   .MuiAppBar-root는 이 헤더 말고도 채팅 드로어 내부 헤더(positionSticky)와
   채팅 하단 패널의 Main/Other/Info 탭바(positionStatic)에도 재사용된다.
   투명/호버 트릭은 상시 떠 있는 메인 헤더에만 맞는 효과라 positionFixed로
   스코프를 좁힌다. */
.MuiAppBar-positionFixed {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0) !important;
  transition: background-color 0.2s ease !important;
}
.MuiAppBar-positionFixed:hover {
  background-color: ${t.sidebarBg} !important;
}
/* 나머지 AppBar(드로어 헤더, 탭바)는 투명/호버 트릭 대신 다른 패널들과 같은
   반투명(0.82) 처리를 한다. 지난 수정에서 실수로 완전 불투명하게 줘서
   채팅창 전체가 반투명한 느낌이 안 났었다. */
.MuiAppBar-positionSticky,
.MuiAppBar-positionStatic {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.82) !important;
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

/* ---- 알림창(Snackbar, "Monitoring mode is enabled..." 같은 하단 토스트) ---- */
.MuiSnackbarContent-root {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.92) !important;
  color: ${t.textPrimary} !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18) !important;
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

/* ---- 채팅 메시지 발신자명 (캐릭터별 동적 색상) ----
   MuiListItemText-primary에 캐릭터마다 다른 색이 inline style로 들어가는데,
   원래 어두운 배경 기준으로 고른 밝은/파스텔 톤(연회색, 연두색 등)이라
   우리 밝은 배경에서는 대비가 너무 낮다. 색상 자체(캐릭터 구분)는 그대로
   두고 밝기만 균일하게 낮춰서 어디서든 읽히게 한다. */
.MuiListItemText-primary {
  filter: brightness(0.65);
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

/* ---- 입력 필드(캐릭터 이름 칸 + 메시지 입력창): 패널보다 살짝 어둡게 ----
   원본 다크 테마도 탭바/패널은 한 톤이고, 캐릭터 이름 칸과 메시지 입력창만
   그보다 살짝 진한("들어간") 톤을 쓴다. 검정 반투명 오버레이를 얹으면
   sidebarBg로 어떤 색을 고르든 항상 패널보다 살짝 어둡게 유지된다.
   MuiInputBase-root 전체에 걸면 밑줄 스타일 필드까지 박스로 바뀌므로
   MuiInputBase-multiline으로 스코프를 좁힌다.
   .sc-hfVCuV(캐릭터 이름 칸)는 안정적인 Mui 클래스가 없어 해시 클래스를
   쓴다 — ccfolia 버전업 시 깨질 수 있음. */
.MuiInputBase-multiline,
.sc-hfVCuV {
  background-color: rgba(0, 0, 0, 0.05) !important;
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

/* ---- Chip(보드 위 소품에 붙는 대각선 "캐릭터" 리본 라벨 등) ----
   MuiChip 라벨 글자색이 흰색으로 하드코딩되어 있다. (BGM01/02는 Chip이 아니라
   버튼이라 이 규칙과 무관함 — 아래 MuiButton-textWhite 참고.) */
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

/* ---- 채팅 드로어(사이드바) ----
   원본 다크 테마도 완전 불투명이 아니라 뒤쪽 보드가 살짝 비치는 반투명이었다.
   완전 불투명 sidebarBg를 줘서 밋밋하게 막혀 보였던 걸 다른 패널들과 같은
   반투명(0.82)으로 맞춘다. */
.MuiDrawer-paper {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.82) !important;
  color: ${t.textPrimary} !important;
}

/* ---- 흰 글자 강제 버튼(.MuiButton-textWhite) ----
   ccfolia 자체 테마가 만든 커스텀 색상 변형으로, 룸 제목 버튼/채팅창 여닫기
   버튼/SEND 버튼/BGM01·BGM02 버튼이 전부 이걸 쓴다. 글자색이 흰색으로
   고정되어 있어 라이트 배경에서 안 보인다.
   (예전엔 SEND 버튼을 [data-testid="SendIcon"]나 .MuiButton-containedPrimary로
   잡으려 했는데 실제 클래스가 달라서 둘 다 매치되지 않았다.) */
.MuiButton-textWhite {
  color: ${t.textPrimary} !important;
}
/* SEND 버튼만 강조색(tabActive)으로 구분한다. 이 버튼만 type="submit". */
.MuiButton-textWhite[type="submit"] {
  color: ${t.tabActive} !important;
  font-weight: 700 !important;
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
