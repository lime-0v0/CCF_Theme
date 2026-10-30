// 공용 테마 상수/유틸 (popup.js, content.js에서 공유)
"use strict";

const CCFOLIA_STORAGE_KEY = "ccfoliaTheme";
// 사용자가 직접 만든 색 조합을 여러 개 저장해두는 목록. [{id, name, theme}, ...] 형태.
const CCFOLIA_CUSTOM_LIST_STORAGE_KEY = "ccfoliaCustomThemes";
// 예전 버전(단일 슬롯 하나만 저장하던 시절)의 키. 마이그레이션 때 한 번만 읽는다.
const CCFOLIA_CUSTOM_STORAGE_KEY = "ccfoliaCustomTheme";

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

// 팝업 상단의 프리셋 버튼들. 어두운 톤 -> 밝은 톤 순서로 나열한다(기본 ->
// 다크 -> 화이트 -> 세피아): "기본"이 이미 어두운 테마이니 바로 옆에 그걸
// 대체할 "다크"를 두고, 그 다음부터 밝아지는 순서로 훑어보게 해서 버튼만
// 봐도 명도가 점점 밝아지는 흐름이 느껴지게 한다.
//  - off: ccfolia 원본 다크 테마 그대로 (CSS 주입 안 함)
//  - dark: 원본 대신 대비를 다시 계산한 다크 팔레트
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
    id: "dark",
    label: "다크",
    // "기본"(off)은 ccfolia 원본 다크 테마를 손대지 않고 그대로 쓰는 옵션이고,
    // 이건 그 원본 대신 대비를 다시 계산한 별도의 다크 팔레트다. Material
    // Design의 다크 테마 가이드라인(표면색을 순검정(#000)이 아닌 #121212
    // 근처로 둬서 헤일레이션/눈부심을 줄임)을 참고해 살짝 보라 톤을 섞었다.
    // 배경(#1E1E24) 대비 textPrimary 14:1, textSecondary 6.6:1, tabActive
    // 6.2:1 — 전부 WCAG AA(4.5:1)를 넉넉히 통과하고 AAA(7:1)에 근접한다.
    theme: {
      enabled: true,
      sidebarBg: "#1E1E24",
      textPrimary: "#EDEBF2",
      textSecondary: "#A6A1B3",
      tabActive: "#B388FF",
    },
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
      // Solarized 원래 팔레트의 base1(#93A1A1, "주석"용 최저 대비 톤)을
      // 처음에 썼는데, 배경(#FDF6E3) 위에서 명도 대비가 2.5:1 정도로
      // WCAG 최소 기준(3:1)에도 못 미쳤다. 폼 라벨/placeholder처럼 실제로
      // 읽어야 하는 UI 텍스트에 쓰기엔 너무 흐렸음. 같은 팔레트의 base00
      // (#657B83, "본문용" 톤)으로 바꿔서 대비를 4.1:1까지 끌어올렸다.
      textSecondary: "#657B83",
      tabActive: "#268BD2",
    },
  },
];

// 가져오기(테마 JSON 붙여넣기)로 들어온 값은 신뢰할 수 없다. 이 값들이 그대로
// content.js에서 <style> textContent로 들어가므로, hex 색상 형식이 아닌 값과
// 알려지지 않은 키는 전부 버리고 검증된 것만 통과시킨다.
const CCFOLIA_HEX_RE = /^#[0-9a-f]{6}$/i;

function ccfoliaSanitizeTheme(raw) {
  if (!raw || typeof raw !== "object") return null;
  const result = {};
  if (typeof raw.enabled === "boolean") result.enabled = raw.enabled;
  for (const { key } of CCFOLIA_THEME_FIELDS) {
    if (typeof raw[key] === "string" && CCFOLIA_HEX_RE.test(raw[key])) {
      result[key] = raw[key];
    }
  }
  return result;
}

// 내보내기: 공유/백업용으로 필요한 필드만 뽑아 한 줄 JSON 문자열로 만든다.
function ccfoliaExportTheme(theme) {
  const t = Object.assign({}, CCFOLIA_DEFAULT_THEME, theme);
  const out = { enabled: t.enabled };
  for (const { key } of CCFOLIA_THEME_FIELDS) out[key] = t[key];
  return JSON.stringify(out);
}

// 보드 위 텍스트(이름표/HP/말풍선)는 캐릭터 토큰, HP 게이지, 방 표지 사진처럼
// 배경이 계속 바뀌는 곳 위에 떠 있어서, 글자색 하나만으로는 어떤 배경 위에서든
// 읽힌다는 보장이 없다 — 예를 들어 밝은 글자색이 HP 게이지의 밝은 부분과
// 겹치면 그대로 묻혀버린다. textPrimary의 명도를 보고 반대쪽 명도로 얇은
// 테두리(outline)를 자동으로 골라서, 배경이 뭐든 항상 대비가 생기게 한다.
function ccfoliaLuminanceFromChannels(r, g, b) {
  const toLinear = (channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function ccfoliaRelativeLuminance(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return 0;
  return ccfoliaLuminanceFromChannels(parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16));
}

function ccfoliaAutoOutlineColor(textHex) {
  return ccfoliaRelativeLuminance(textHex) > 0.5 ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.9)";
}

function ccfoliaContrastRatio(lumA, lumB) {
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

// RGB <-> HSL 변환. 캐릭터 발신자명 색을 "색상(hue)은 그대로 두고 명도(L)만"
// 조정하려면 HSL이 필요하다 — RGB 채널을 직접 어둡게/밝게 하면 색감 자체가
// 달라져 보일 수 있다.
function ccfoliaRgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}

function ccfoliaHslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p, q, tRaw) => {
    let t = tRaw;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 캐릭터 발신자명 색은 사람마다 다르게 보이면 안 되는 공유 데이터라 함부로
// 건드리면 안 되지만(위 "채팅 메시지 발신자명" 참고), ccfolia가 원래
// 어두운 배경 기준으로 고른 색이 우리 밝은 프리셋에서는 아예 안 보이는
// 경우까지 봐주진 않는다. 색상(hue)·채도(s)는 그대로 두고 명도(l)만 배경
// 반대쪽으로 밀어서 "그 캐릭터 색"이라는 정체성은 유지한 채 최소한 읽히게
// 만든다. 완전히 검/흰으로 밀어붙이면 색감이 없어지니 0.1~0.9 선에서 멈춘다.
const CCFOLIA_NICKNAME_MIN_CONTRAST = 3;
const CCFOLIA_NICKNAME_LIGHTNESS_STEP = 0.04;

function ccfoliaEnsureNicknameContrast(r, g, b, bgHex) {
  const bgLum = ccfoliaRelativeLuminance(bgHex);
  const lum = ccfoliaLuminanceFromChannels(r, g, b);
  if (ccfoliaContrastRatio(lum, bgLum) >= CCFOLIA_NICKNAME_MIN_CONTRAST) {
    return [r, g, b];
  }
  const [h, s, l] = ccfoliaRgbToHsl(r, g, b);
  const darken = bgLum > 0.5;
  let newL = l;
  for (let i = 0; i < 20; i++) {
    newL = darken ? Math.max(0.1, newL - CCFOLIA_NICKNAME_LIGHTNESS_STEP) : Math.min(0.9, newL + CCFOLIA_NICKNAME_LIGHTNESS_STEP);
    const [nr, ng, nb] = ccfoliaHslToRgb(h, s, newL);
    const newLum = ccfoliaLuminanceFromChannels(nr, ng, nb);
    if (ccfoliaContrastRatio(newLum, bgLum) >= CCFOLIA_NICKNAME_MIN_CONTRAST || newL <= 0.1 || newL >= 0.9) {
      return [nr, ng, nb];
    }
  }
  return ccfoliaHslToRgb(h, s, newL);
}

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
