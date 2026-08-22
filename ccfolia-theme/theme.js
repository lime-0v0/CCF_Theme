// 공용 테마 상수/유틸 (popup.js, content.js에서 공유)
"use strict";

const CCFOLIA_STORAGE_KEY = "ccfoliaTheme";

const CCFOLIA_DEFAULT_THEME = {
  headerBg: "#F7F5FA",
  sidebarBg: "#FDFCFF",
  textPrimary: "#2B2B33",
  textSecondary: "#6B6875",
  tabActive: "#8E4EC6",
  inputBg: "#FFFFFF",
  sendBtn: "#8E4EC6",
};

// 팝업에서 색상 선택기 라벨/순서를 정의할 때도 이 배열을 공유해서 쓴다.
const CCFOLIA_THEME_FIELDS = [
  { key: "headerBg", label: "헤더 배경" },
  { key: "sidebarBg", label: "사이드바 / 패널 배경" },
  { key: "textPrimary", label: "기본 텍스트" },
  { key: "textSecondary", label: "보조 텍스트" },
  { key: "tabActive", label: "활성 탭 / 강조색" },
  { key: "inputBg", label: "입력창 배경" },
  { key: "sendBtn", label: "전송 버튼" },
];

function ccfoliaHexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return "0, 0, 0";
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `${r}, ${g}, ${b}`;
}
