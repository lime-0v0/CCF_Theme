// 공용 테마 상수/유틸 (popup.js, content.js에서 공유)
"use strict";

const CCFOLIA_STORAGE_KEY = "ccfoliaTheme";

// 전송 버튼은 별도 색을 두지 않고 tabActive(강조색)를 그대로 쓴다.
// 헤더/입력창/사이드바/패널/카드는 전부 sidebarBg 하나를 공유한다(원래 다크
// 테마도 그랬음). 룸(보드) 배경은 거기서 분리해서 boardBg로 따로 둔다 —
// ccfolia.com/home처럼 보드가 없는 화면에서는 body 배경이 곧 sidebarBg라
// 자연히 헤더/패널과 같은 색이 되고, 룸 화면의 보드 배경은 boardBg를 쓴다.
const CCFOLIA_DEFAULT_THEME = {
  sidebarBg: "#FDFCFF",
  textPrimary: "#2B2B33",
  textSecondary: "#6B6875",
  tabActive: "#8E4EC6",
  boardBg: "#111111",
};

// 팝업에서 색상 선택기 라벨/순서를 정의할 때도 이 배열을 공유해서 쓴다.
const CCFOLIA_THEME_FIELDS = [
  { key: "sidebarBg", label: "헤더 / 입력창 / 사이드바 / 패널 배경" },
  { key: "textPrimary", label: "기본 텍스트" },
  { key: "textSecondary", label: "보조 텍스트" },
  { key: "tabActive", label: "활성 탭 / 강조색 (전송 버튼도 이 색을 씀)" },
  { key: "boardBg", label: "룸(보드) 배경" },
];

function ccfoliaHexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return "0, 0, 0";
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `${r}, ${g}, ${b}`;
}
