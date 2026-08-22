# CCF_Theme

코코포리아(ccfolia.com) 테마 커스터마이저 — Chrome 확장 프로그램 (Manifest V3)

다크 테마 고정인 ccfolia.com의 색상을 사용자가 원하는 대로 바꿀 수 있게 해줍니다.

## 폴더 구조

```
ccfolia-theme/
├── manifest.json   ← 확장 프로그램 설정 (MV3)
├── theme.js        ← 기본 테마 값 / 공용 유틸 (popup.js, content.js 공유)
├── content.js       ← 테마 CSS를 페이지에 주입
├── popup.html/.css/.js ← 툴바 아이콘 클릭 시 뜨는 색상 선택기 UI
└── README.md
```

## 진행 상황

1. ✅ CSS 주입 (헤더/다이얼로그/아이콘/입력창/보드 오버레이 텍스트 등)
2. ✅ 팝업 UI (색상 선택기)
3. ✅ `chrome.storage.local`에 사용자가 고른 색 저장/로드
4. ✅ content.js가 storage 값을 읽어 동적으로 CSS 적용 (`storage.onChanged`로 실시간 반영)

커스터마이징 가능한 색상 5가지: 헤더/입력창/사이드바/패널 배경(하나로 통일), 기본 텍스트,
보조 텍스트, 활성 탭/강조색(전송 버튼도 같이 씀), 룸(보드) 배경.
룸(보드) 배경은 나머지와 분리되어 있어 어두운 톤을 유지하면서 나머지 UI만 밝게 바꾸는 것도 가능합니다.

## 설치 및 테스트 방법

1. `chrome://extensions` → 우측 상단 "개발자 모드" 켜기 → "압축해제된 확장 프로그램을 로드합니다" →
   `ccfolia-theme` 폴더 선택
2. https://ccfolia.com 방에 입장
3. 툴바의 확장 프로그램 아이콘을 클릭해 색상을 선택하면 즉시 반영됩니다.
4. `content.js`나 `manifest.json`을 수정한 경우엔 `chrome://extensions`에서 새로고침 버튼을 누르고,
   ccfolia 탭도 새로고침해야 반영됩니다. (색상 값 변경은 새로고침 없이 즉시 반영됩니다.)

## 기술적 배경

- ccfolia는 React + MUI(Material UI) + emotion 기반이며, 다크 테마가 하드코딩되어 있습니다.
- emotion이 생성하는 해시 클래스(`sc-xxxxx`, `css-xxxxx`)는 빌드마다 바뀔 수 있어 셀렉터로 사용하지
  않습니다. 대신 `Mui-` 접두사 클래스와 `data-testid` 속성 위주로 셀렉터를 잡습니다.
- 예외적으로 HP 게이지 바는 안정적인 Mui 클래스가 없어 해시 클래스(`.sc-kMGnbm`, `.sc-ksXhwP`)를
  직접 사용합니다. ccfolia 버전(현재 1.36.3) 업데이트 시 깨질 수 있습니다.
- 주사위 판정 결과(BCDice)처럼 사이트가 자체적으로 색을 입히는 요소는 `!important` 없이 낮은
  우선순위로만 기본값을 채워서, 사이트가 지정한 색(크리티컬/펌블 등)이 자연스럽게 이기도록 합니다.

## 다음에 볼만한 영역 (미확인)

- 장면/마커/씬 텍스트/컷인 목록 패널
- 설정(⚙️) 다이얼로그 상세 내용
- 카드 뭉치(deck of cards) UI
- 컨텍스트 메뉴 반투명 효과가 실제로 잘 보이는지 (색 있는 토큰 이미지 위에서 재확인 필요)
