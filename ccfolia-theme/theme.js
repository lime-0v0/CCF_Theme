// 공용 테마 상수/유틸 (popup.js, content.js에서 공유)
"use strict";

const CCFOLIA_STORAGE_KEY = "ccfoliaTheme";

// 전송 버튼은 별도 색을 두지 않고 tabActive(강조색)를 그대로 쓴다.
// 헤더/입력창/사이드바/패널/카드는 전부 sidebarBg 하나를 공유한다(원래 다크
// 테마도 그랬음). ccfolia.com/home처럼 보드가 없는 화면에서는 body 배경이
// 곧 sidebarBg라 자연히 헤더/패널과 같은 색이 된다.
// 룸(보드) 배경은 일부러 색을 안 준다 — 룸에는 항상 방 표지 사진을 블러
// 처리한 배경 레이어가 깔려 있어서, 우리가 단색을 덮으면 그 사진을 가려버린다.
// enabled: false면 content.js가 CSS를 아예 주입하지 않는다("기본" 프리셋 =
// ccfolia 원본 다크 테마 그대로, 확장을 끈 것과 동일한 효과).
const CCFOLIA_DEFAULT_THEME = {
  enabled: true,
  sidebarBg: "#FDFCFF",
  textPrimary: "#2B2B33",
  textSecondary: "#6B6875",
  tabActive: "#8E4EC6",
};

// 팝업에서 색상 선택기 라벨/순서를 정의할 때도 이 배열을 공유해서 쓴다.
const CCFOLIA_THEME_FIELDS = [
  { key: "sidebarBg", label: "헤더 / 입력창 / 사이드바 / 패널 배경" },
  { key: "textPrimary", label: "기본 텍스트" },
  { key: "textSecondary", label: "보조 텍스트" },
  { key: "tabActive", label: "활성 탭 / 강조색 (전송 버튼도 이 색을 씀)" },
];

// 팝업 상단의 프리셋 버튼 3개.
//  - off: ccfolia 원본 다크 테마 그대로 (CSS 주입 안 함)
//  - white: 지금까지 만든 밝은 톤 (기본값과 동일)
//  - solarized: Solarized Light 기반 — Ethan Schoonover가 눈의 피로도와
//    명도 대비를 정밀하게 계산해서 만든, 코드 에디터/터미널 등에서 가독성
//    때문에 널리 쓰이는 검증된 배색. 크림색 배경 + 채도를 낮춘 슬레이트
//    톤 텍스트로 순백/순검정보다 대비가 부드럽다.
const CCFOLIA_PRESETS = [
  {
    id: "off",
    label: "기본",
    theme: { enabled: false },
  },
  {
    id: "white",
    label: "화이트",
    theme: {
      enabled: true,
      sidebarBg: "#FDFCFF",
      textPrimary: "#2B2B33",
      textSecondary: "#6B6875",
      tabActive: "#8E4EC6",
    },
  },
  {
    id: "solarized",
    label: "세피아",
    theme: {
      enabled: true,
      sidebarBg: "#FDF6E3",
      textPrimary: "#586E75",
      textSecondary: "#93A1A1",
      tabActive: "#268BD2",
    },
  },
];

function ccfoliaHexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return "0, 0, 0";
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `${r}, ${g}, ${b}`;
}

// rgba로 살짝 어둡게 하면 뒤에 무엇이 비치느냐에 따라 최종 색이 미묘하게
// 달라진다(부모마다 배경이 조금씩 다르면 같은 rgba(0,0,0,0.05)도 다르게
// 보임). 대신 sidebarBg 자체를 고정된 비율로 어둡게 한 "불투명" 색을
// 계산해서 어디에 놓이든 항상 같은 색이 나오게 한다.
function ccfoliaDarken(hex, factor) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return hex;
  const r = Math.round(parseInt(m[1], 16) * factor);
  const g = Math.round(parseInt(m[2], 16) * factor);
  const b = Math.round(parseInt(m[3], 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}
