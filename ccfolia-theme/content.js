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

  // "기본" 프리셋: ccfolia 원본 다크 테마를 그대로 두고 아무 CSS도 주입하지 않는다.
  if (t.enabled === false) return "";

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

/* ---- 룸 배경(보드/씬) — 의도적으로 배경색을 칠하지 않는다 ----
   룸에는 항상 방 표지 사진을 blur(8px) 처리한 장식용 배경 레이어
   (.sc-jCPQUC > .sc-bKoKAZ, ccfolia 자체 CSS)가 깔려 있다. 씬이 없을 때
   보이는 "빈 보드"는 원래 이 블러 처리된 사진이 그대로 비쳐 보이는
   화면이지, 플랫한 단색이 아니었다.
   예전에 .sc-eVedOh → .sc-jCPQUC → .sc-jcsPWJ 순서로 이것저것 배경색을
   시도했는데, 실제 문제는 .sc-jcsPWJ(보드 뷰포트 바깥 컨테이너)에 준
   boardBg 단색 채우기가 이 블러 배경 사진을 그냥 덮어버리고 있었던 거였다.
   그래서 이 요소들엔 배경색을 아예 주지 않는다 — 씬 이미지가 있으면
   이미지가, 없으면 ccfolia 자체 블러 배경이 자연스럽게 비치게 둔다. */

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
/* 나머지 AppBar(드로어 헤더, 탭바)는 반투명이 아니라 완전 불투명한
   sidebarBg로 채운다. 반투명(rgba)으로 두면 뒤에 비치는 보드 배경 때문에
   흰색이 아니라 회색으로 보인다. */
.MuiAppBar-positionSticky,
.MuiAppBar-positionStatic {
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
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.9) !important;
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
/* 예전엔 흰색 halo(text-shadow)를 줬다가, 이 셀렉터가 board 위 라벨만이
   아니라 body1/body2.noWrap을 쓰는 다른 일반 텍스트에도 걸려서 원치 않는
   그림자 효과가 생겨 완전히 뺐었다. 근데 그러면 HP 게이지처럼 텍스트
   바로 밑 배경이 계속 바뀌는 곳에서 글자색과 배경색이 우연히 비슷해지면
   (예: 다크 프리셋의 밝은 글자가 HP 게이지의 밝은 부분과 겹칠 때) 글자가
   그대로 안 보인다. 다시 넣되, 예전보다 훨씬 얇고(0.6px) 옅은
   -webkit-text-stroke로 바꾼다 — 흐릿하게 번지는 shadow와 달리 딱 붙는
   얇은 선이라 다른 일반 텍스트에 걸려도 티가 잘 안 난다. 테두리 색은
   textPrimary의 명도를 보고 자동으로 반대쪽(밝으면 어둡게, 어두우면
   밝게)을 골라서, 프리셋이 뭐든 항상 배경과 대비가 생기게 한다.
   paint-order로 테두리를 글자 채우기보다 먼저 그려서 안쪽을 안 먹는다.
   HP/MP 라벨과 수치(예: .cyGeBV 같은 해시 클래스)는 ccfolia 자체가 이미
   흰색 text-shadow halo를 하드코딩해뒀다 — text-shadow와
   -webkit-text-stroke는 서로 다른 속성이라 우리가 stroke만 줘서는 저
   흰색 halo를 안 지우고 그 위에 겹치기만 한다. 다크 프리셋처럼 우리
   글자색도 밝은 경우, "흰 글자 + 흰 halo"가 겹쳐 그대로 안 보이는 문제가
   생겼다. text-shadow를 꺼서 halo를 우리 stroke로 완전히 대체한다. */
.MuiTypography-body2.MuiTypography-noWrap,
.MuiTypography-body1 {
  color: ${t.textPrimary} !important;
  text-shadow: none !important;
  -webkit-text-stroke: 0.6px ${ccfoliaAutoOutlineColor(t.textPrimary)} !important;
  paint-order: stroke fill !important;
}

/* ---- 채팅 메시지 발신자명, 주사위 판정 결과 색상(BCDice) — 손대지 않음 ----
   여러 명이 같은 화면을 보는 사이트라, 이 확장을 켠 사람에게만 색이 달리
   보이면 안 된다("빨간 캐릭터"라고 말했는데 나한테만 다르게 보이는 식의
   혼란). 캐릭터별 발신자명 색(MuiListItemText-primary)과 주사위 성공/실패
   색(BCDice가 지정) 둘 다 ccfolia가 주는 색을 그대로 쓰게 둔다.
   예전엔 .MuiTypography-body2에 색을 깔아서 "기본값만 채우고 BCDice가
   이기게" 하려 했는데, BCDice의 색도 클래스 선택자 하나짜리라 우선순위가
   같았다 — 이러면 나중에 삽입된 우리 스타일이 로드 순서상 이겨버려서
   실제로는 BCDice 색을 덮고 있었다. */
/* 채팅 메시지 본문 자체(주사위 식+결과를 감싸는 바깥 <p>)는 여전히 어둡게
   채워야 한다 — 안 그러면 원래 다크 테마 색 그대로 남아 밝은 배경에서
   안 보인다. 다행히 성공/실패 색은 그 안의 별도 <span>에 따로 붙어서
   MuiListItemText-secondary 클래스가 없다. 그래서 이 클래스만 잡으면
   바깥 텍스트는 채워지고, 안쪽 BCDice 색상 span은 자기 색이 있으니
   상속보다 우선해서 자연스럽게 이긴다(안전하게 !important 사용 가능). */
.MuiListItemText-secondary {
  color: ${t.textPrimary} !important;
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
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.9) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18) !important;
}
/* ---- 이 패널들 안의 항목 이름(캐릭터 목록의 "캐릭터", 마커 목록의 이름 등) ----
   MuiListItemText-primary는 채팅 메시지 발신자명에도 쓰는 클래스라 전역으로는
   손대지 않지만(위 "채팅 메시지 발신자명" 참고 — 공유 데이터라 사용자마다
   다르게 보이면 안 됨), 채팅 드로어는 MuiPaper-elevation6가 아니라서 이렇게
   스코프를 좁히면 채팅 색상은 그대로 두고 이 목록 패널들만 고칠 수 있다.
   손대지 않았을 땐 사이트가 흰 글자색을 하드코딩해둬서, 우리 밝은 패널
   배경 위에서 대비가 거의 사라졌다(개발자 도구 접근성 검사 기준 1.17:1). */
.MuiPaper-elevation6:not(.MuiCard-root) .MuiListItemText-primary {
  color: ${t.textPrimary} !important;
}
/* ---- 채팅 하단 컴포즈 패널(.sc-bA-DSAS)만은 완전 불투명한 흰색으로 ----
   헤더/탭바/주사위 아이콘 줄/Dicebot engine 표기가 전부 이 패널 위에
   얹혀 있는데, 패널이 반투명이면 뒤에 비치는(어두울 수 있는) 보드 배경과
   섞여서 흰색이 아니라 회색으로 보인다. 이 패널만은 순백을 원해서
   반투명을 끄고 완전 불투명하게 한다. (다른 떠있는 패널들은 위 규칙대로
   계속 반투명 유지.) */
.sc-bA-DSAS {
  background-color: ${t.sidebarBg} !important;
}
/* 위 규칙이 부모(.sc-bA-DSAS)를 채워도 자식들이 자기만의 배경을 따로 갖고
   있으면(ccfolia 자체 CSS) 그게 그대로 이긴다. 실제로 어둡게 남아있던
   자식 요소 두 곳을 직접 지정한다: 주사위 아이콘 줄(.drwLOi)과
   "Dicebot engine :" 표기 박스(.MuiBox-root, 컴포즈 폼 .sc-jYKCcT 안으로
   스코프를 좁혀서 사이트 전체의 다른 MuiBox-root까지 건드리지 않는다). */
.sc-clGGjC.drwLOi {
  background-color: ${t.sidebarBg} !important;
}
.sc-jYKCcT .MuiBox-root {
  background-color: ${t.sidebarBg} !important;
}

/* ---- 입력 필드(캐릭터 이름 칸 + 메시지 입력창): 패널보다 살짝 어둡게 ----
   원본 다크 테마도 탭바/패널은 한 톤이고, 캐릭터 이름 칸과 메시지 입력창만
   그보다 살짝 진한("들어간") 톤을 쓴다.
   rgba(0,0,0,0.05) 같은 반투명 오버레이는 뒤에 있는 요소의 배경에 따라
   최종 색이 달라진다 — 이름 칸과 메시지 입력창이 서로 다른 조상 안에
   있어서 같은 반투명값을 줘도 다르게 보였다. 대신 sidebarBg 자체를 고정
   비율로 어둡게 계산한 불투명 색(ccfoliaDarken)을 써서 어디에 있든 항상
   똑같은 색이 나오게 한다. 그 전에 메시지 입력창을 감싸는 조상
   (.sc-kJNpLD)도 먼저 sidebarBg로 고정해서 배경이 일정하게 유지되게 한다.
   MuiInputBase-root 전체에 걸면 밑줄 스타일 필드까지 박스로 바뀌므로
   MuiInputBase-multiline으로 스코프를 좁힌다.
   .sc-hfVCuV(캐릭터 이름 칸)/.sc-kJNpLD(메시지 입력창 조상)는 안정적인
   Mui 클래스가 없어 해시 클래스를 쓴다 — ccfolia 버전업 시 깨질 수 있음. */
.sc-kJNpLD {
  background-color: ${t.sidebarBg} !important;
}
.MuiInputBase-multiline,
.sc-hfVCuV {
  background-color: ${ccfoliaDarken(t.sidebarBg, 0.95)} !important;
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

/* ---- 알림 배지(새 메시지 도트, 캐릭터 HP 비공개 "??" 배지 등) ----
   MUI 기본 secondary 색(핑크, rgb(220,0,78))이 하드코딩되어 있는데, 이건
   캐릭터별로 다른 공유 데이터가 아니라 사이트 공통 UI 색이라 강조색으로
   바꿔도 다른 사람과 혼란이 없다. */
.MuiBadge-colorSecondary {
  background-color: ${t.tabActive} !important;
}

/* ---- Chip(보드 위 소품에 붙는 대각선 "캐릭터" 리본 라벨 등) ----
   MuiChip 라벨 글자색이 흰색으로 하드코딩되어 있다. (BGM01/02는 Chip이 아니라
   버튼이라 이 규칙과 무관함 — 아래 MuiButton-textWhite 참고.) */
.MuiChip-root,
.MuiChip-label {
  color: ${t.textPrimary} !important;
}

/* ---- 구분선 ----
   메시지 입력창 바로 위 구분선 등, 패널이 더 밝아지고 나니(0.9) 상대적으로
   너무 진하게 도드라져서 옅게 낮췄다. */
.MuiDivider-root {
  border-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.15) !important;
  background-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.15) !important;
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
   반투명(0.9)으로 맞춘다. */
.MuiDrawer-paper {
  background-color: rgba(${ccfoliaHexToRgb(t.sidebarBg)}, 0.9) !important;
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
/* ---- 테두리 버튼의 흰 글자 변형(.MuiButton-outlinedWhite) ----
   업로드 다이얼로그의 ROOM/ALL/Unsplash 같은 outlined 버튼도 글자색이
   흰색으로 고정되어 있었다. 위 textWhite와 같은 패턴이라 함께 처리한다. */
.MuiButton-outlinedWhite {
  color: ${t.textPrimary} !important;
  border-color: rgba(${ccfoliaHexToRgb(t.textSecondary)}, 0.5) !important;
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
