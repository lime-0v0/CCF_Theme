// ===== 테스트 단계: 색상값 하드코딩 =====
// 나중에 popup + chrome.storage로 대체 예정
const TEST_THEME = {
  headerBg: "#F7F5FA",     // 상단 헤더바
  sidebarBg: "#FDFCFF",    // 채팅 사이드바 배경
  textPrimary: "#2B2B33",  // 채팅 메시지 이름 / 기본 텍스트
  textSecondary: "#6B6875",// 채팅 메시지 본문
  tabActive: "#8E4EC6",    // 선택된 탭 밑줄/텍스트
  inputBg: "#FFFFFF",      // 메시지 입력창
  sendBtn: "#8E4EC6",      // 전송 버튼
};

const css = `
  /* 페이지 전체 배경 (방 목록 페이지 등, 카드 뒤쪽 여백) */
  body {
    background-color: ${TEST_THEME.sidebarBg} !important;
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 아직 안 열어본 모달/다이얼로그 (설정, 캐릭터 편집 등) 사전 대응
     원래 다크 테마도 패널 배경이 반투명(뒤가 살짝 비침)이었어서 그 느낌 살림 */
  .MuiDialog-paper {
    background-color: rgba(253,252,255,0.82) !important;
    color: ${TEST_THEME.textPrimary} !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
  }

  /* 호버 시 뜨는 툴팁 (캐릭터 정보, 아이템 메모 등) */
  .MuiTooltip-tooltip {
    background-color: ${TEST_THEME.inputBg} !important;
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 우클릭 컨텍스트 메뉴 / 팝오버 - 반투명 적용 */
  .MuiPopover-paper,
  .MuiMenu-paper {
    background-color: rgba(255,255,255,0.82) !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25) !important;
  }
  .MuiMenuItem-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 주사위 판정 결과 기본색만 채우고, BCDice가 지정한 성공/실패 색은 보존
     (!important를 빼고 단일 클래스 수준으로 우선순위를 낮춰서
      색이 따로 지정된 경우엔 그 색이 이기도록 함) */
  .MuiTypography-body2 {
    color: ${TEST_THEME.textSecondary};
  }

  /* 보드 배경 바둑판 격자선 - 인라인 스타일로 흰색 10% 투명도라 흰 배경에서 안 보이던 것 */
  div[style*="background-size: 24px 24px"] {
    background-image:
      linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px) !important;
  }

  /* 보드 위 캐릭터 이름표 / HP 바 (하드코딩된 밝은 텍스트)
     보드 배경(그리드, 토큰 이미지 등)이 뭐든 간에 잘 보이도록
     흰색 halo(그림자)를 둘러줌 */
  .MuiTypography-body2.MuiTypography-noWrap {
    color: ${TEST_THEME.textPrimary} !important;
    font-weight: 600 !important;
    text-shadow:
      0 0 3px rgba(255,255,255,0.9),
      0 0 3px rgba(255,255,255,0.9),
      0 0 1px rgba(255,255,255,0.9) !important;
  }

  /* 보드 위 HP 게이지 바 - 개발자도구로 확인한 실제 클래스
     (ccfolia 해시 클래스라 버전 업데이트되면 깨질 수 있음, 1.36.3 기준) */
  .sc-kMGnbm {
    background-color: rgba(0,0,0,0.15) !important;
    border-radius: 3px;
  }
  .sc-ksXhwP {
    background-color: ${TEST_THEME.tabActive} !important;
    border-radius: 3px;
  }

  /* 보드 위 대사 말풍선 텍스트 (하드코딩된 밝은 텍스트) */
  .MuiTypography-body1 {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 헤더와 본문 사이 구분감 (화이트 테마는 밝기 차이가 적어 경계가 흐려짐) */
  .MuiAppBar-root {
    box-shadow: 0 1px 0 rgba(0,0,0,0.15) !important;
  }

  /* 채팅 사이드바와 본문 사이 구분선 */
  .MuiDrawer-paper {
    box-shadow: -1px 0 0 rgba(0,0,0,0.12) !important;
  }

  /* 채팅 입력창(멀티라인)에만 배경+테두리 - 배경까지 전역으로 걸면
     캐릭터 설정 창의 밑줄 스타일 필드들도 다 흰 박스로 바뀌어버림 */
  .MuiInputBase-multiline {
    background-color: ${TEST_THEME.inputBg} !important;
    border: 1px solid rgba(0,0,0,0.15) !important;
    border-radius: 6px !important;
  }

  /* 하단 패널(캐릭터 선택/주사위 줄) 배경/구분선은 아래에서 한 번에 처리 */

  /* 다이얼로그 안의 아이콘 (휴지통, 체크 등) - 헤더 밖이라 놓쳤던 것
     (버튼 전체가 아니라 아이콘/아이콘버튼만 대상으로 해서
      DELETE(빨강)/DUPLICATION(파랑) 같은 텍스트 버튼 색은 보존) */
  .MuiDialog-paper .MuiSvgIcon-root,
  .MuiDialog-paper .MuiIconButton-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* placeholder 텍스트 (입력 안 됐을 때 안내문구) - 브라우저 기본 옅은 색과
     원래 흰 배경 가정 색이 겹쳐 완전히 안 보이던 경우 대응 */
  input::placeholder,
  textarea::placeholder {
    color: ${TEST_THEME.textSecondary} !important;
    opacity: 1 !important;
  }

  /* 입력 필드 라벨 (캐릭터 편집 등) - 포커스 안 된 기본 상태만 수정,
     포커스 시 파란색 강조는 원래대로 유지 */
  .MuiFormLabel-root:not(.Mui-focused) {
    color: ${TEST_THEME.textSecondary} !important;
  }

  /* 각종 패널의 툴바 제목 텍스트 (캐릭터 패널 등, 하드코딩된 밝은색) */
  .MuiToolbar-root .MuiTypography-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 드롭다운/팝업 리스트 안의 텍스트 (캐릭터 선택 목록 등) */
  .MuiPopover-paper .MuiTypography-root,
  .MuiPopover-paper .MuiListItemButton-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 상단 헤더바 - 평소엔 거의 완전히 투명, 호버 시에만 진해짐 */
  .MuiAppBar-root {
    background-color: rgba(247,245,250,0.1) !important;
    transition: background-color 0.15s ease !important;
  }
  .MuiAppBar-root:hover {
    background-color: ${TEST_THEME.headerBg} !important;
  }

  /* 헤더 안의 아이콘 버튼 (원래 흰색 SVG라 흰 배경에서 안 보임) */
  .MuiAppBar-root .MuiSvgIcon-root,
  .MuiAppBar-root .MuiIconButton-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 헤더 방 제목 텍스트 (기본 흰색) */
  .MuiAppBar-root .MuiTypography-root {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 탭 텍스트 - 선택 안 된 상태 (기본 흰색 계열) */
  .MuiTab-textColorInherit {
    color: ${TEST_THEME.textSecondary} !important;
    opacity: 1 !important;
  }

  /* 상단/채팅 메뉴의 "textWhite" 계열 버튼 텍스트 (원래 흰 글자 고정) */
  .MuiButton-textWhite {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 채팅 사이드바 배경 (드로어 패널) - 반투명 */
  .MuiDrawer-paper {
    background-color: rgba(253,252,255,0.82) !important;
  }

  /* 채팅 메시지 - 이름: 캐릭터별 사용자 지정 색(인라인 style)이라 건드리지 않음 */

  /* 채팅 메시지 - 본문 */
  .MuiListItemText-secondary {
    color: ${TEST_THEME.textSecondary} !important;
  }

  /* 탭(Main/Info/Other) 선택 상태 */
  .MuiTab-root.Mui-selected {
    color: ${TEST_THEME.tabActive} !important;
  }
  .MuiTabs-indicator {
    background-color: ${TEST_THEME.tabActive} !important;
  }

  /* 채팅 입력 영역 전체를 감싸는 하단 패널
     (캐릭터 선택 줄 + 주사위 아이콘 줄 + 입력창 + 하단 caption 포함)
     sc-clGGjC 같은 emotion 해시 클래스 대신, 이 영역을 감싸는
     안정적인 Mui 클래스(MuiPaper-elevation6)를 기준으로 배경을 지정 */
  .MuiPaper-elevation6 {
    background-color: rgba(253,252,255,0.82) !important;
    box-shadow: 0 -1px 0 rgba(0,0,0,0.06) !important;
  }

  /* 구분선 (입력창 ↔ Dicebot engine 캡션 사이 등) */
  .MuiDivider-root {
    border-color: ${TEST_THEME.inputBg} !important;
  }

  /* 입력 필드 텍스트 색 (배경은 위 multiline 규칙에서 따로 처리 -
     여기서 배경까지 같이 걸면 밑줄 스타일 필드가 박스로 보임) */
  .MuiInputBase-root,
  .MuiInputBase-input {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 아이콘 색 전역 기본값 - 지금까지 헤더/다이얼로그/팝오버 등
     하나씩 놓쳐서 계속 나왔던 것들(볼륨 아이콘, 선택 아이콘 등)을
     한 번에 커버. 단, "Character color change"(ColorLensIcon)는
     캐릭터마다 색이 계속 바뀌는 동적 아이콘이라 제외 */
  .MuiSvgIcon-root:not([data-testid="ColorLensIcon"]) {
    color: ${TEST_THEME.textPrimary} !important;
  }

  /* 다이얼로그 안에서만 한 줄짜리 입력 필드 배경을 투명하게 (패널에 자연스럽게 묻히도록) */
  .MuiDialog-paper .MuiInputBase-root:not(.MuiInputBase-multiline) {
    background-color: transparent !important;
  }

  /* 채팅 상단 캐릭터 이름 선택창은 원래 흰 배경으로 튀어야 하는 요소라 예외 처리 */
  .MuiInputBase-root:has(> input[name="name"]) {
    background-color: ${TEST_THEME.inputBg} !important;
    border-radius: 4px;
  }

  /* 캐릭터 토큰 호버 시 은은한 그림자 - 원래 흰색 계열이라 흰 배경에서 안 보이던 것으로 추정 */
  figure:hover {
    filter: drop-shadow(0 0 6px rgba(0,0,0,0.4)) !important;
  }

  /* 밑줄 스타일(standard variant) 입력창의 밑줄 자체가
     반투명 흰색(rgba(255,255,255,.42))으로 하드코딩돼 있어 흰 배경에서
     안 보이던 것 - 반투명은 유지하되 색만 어둡게 */
  .MuiInput-underline:before {
    border-bottom-color: rgba(0,0,0,0.3) !important;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom-color: rgba(0,0,0,0.5) !important;
  }
  .MuiInput-underline:after {
    border-bottom-color: ${TEST_THEME.tabActive} !important;
  }

  /* outlined 버튼 (예: "SELECT A BACK IMAGE") - 흰 테두리/흰 글자 고정이라 안 보이던 것 */
  .MuiButton-outlined,
  .MuiButton-outlinedWhite {
    color: ${TEST_THEME.textPrimary} !important;
    border-color: rgba(0,0,0,0.3) !important;
  }

  /* 전송 버튼 */
  button[type="submit"].MuiButton-textWhite {
    background-color: ${TEST_THEME.sendBtn} !important;
  }
`;

const styleTag = document.createElement("style");
styleTag.id = "ccfolia-theme-test";
styleTag.textContent = css;

// document_start 시점엔 <head>가 아직 없을 수 있어 안전하게 처리
(document.head || document.documentElement).appendChild(styleTag);

console.log("[코코포리아 테마 테스트] 스타일 주입 완료:", TEST_THEME);