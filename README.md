# NICE 자료허브

사업별 브로슈어, 매뉴얼, 동영상 등을 한곳에서 확인하고 내려받을 수 있는 정적 웹페이지입니다.

- 페이지명: **NICE 자료허브**
- 소개 문구: **사업별 홍보·운영자료를 한곳에서**
- 현재 사업 구분: **무인숙박 / 등하교**
- 현재 실제 등록 자료: **0건**

> 실제 등하교 브로슈어 PDF는 추후 전달받은 뒤 등록할 예정입니다. 현재 저장소에는 배포용 PDF가 없습니다.

## 로컬에서 실행하기

이 프로젝트는 별도의 설치나 빌드가 필요하지 않습니다. 다만 브라우저 보안 정책 때문에 `index.html` 파일을 직접 더블클릭하지 말고, 간단한 정적 서버로 실행해 주세요.

1. PowerShell 또는 터미널에서 프로젝트 폴더로 이동합니다.
2. 아래 명령 중 사용할 수 있는 하나를 실행합니다.

```powershell
# Node.js가 설치되어 있는 경우(프로젝트 기본 포트: 4173)
node scripts/dev-server.js
```

```powershell
# Python이 설치되어 있는 경우
python -m http.server 8000
```

```powershell
# Python 실행 명령이 py인 경우
py -m http.server 8000
```

3. Node.js 방식은 `http://127.0.0.1:4173/`, Python 방식은 `http://localhost:8000/`을 엽니다.
4. 서버를 종료할 때는 터미널에서 `Ctrl + C`를 누릅니다.

## 폴더별 역할

```text
NICE 자료허브/
├─ index.html                         # 화면 구조
├─ scripts/dev-server.js              # 설치 없는 로컬 정적 서버
├─ assets/
│  ├─ css/styles.css                  # 디자인과 반응형 스타일
│  ├─ js/
│  │  ├─ data.js                      # 사업 카테고리와 자료 목록
│  │  └─ app.js                       # 탭, 카드, PDF 미리보기 기능
│  ├─ materials/
│  │  ├─ lodging/                     # 무인숙박 자료
│  │  │  ├─ brochures/                # 브로슈어 PDF
│  │  │  ├─ manuals/                  # 매뉴얼 PDF
│  │  │  └─ videos/                   # 영상 파일(필요 시)
│  │  └─ school-safety/               # 등하교 자료
│  │     ├─ brochures/
│  │     ├─ manuals/
│  │     └─ videos/
│  └─ thumbnails/                     # 자료 표지 이미지
├─ .nojekyll                          # GitHub Pages의 Jekyll 처리 제외
└─ README.md                          # 운영 안내서
```

빈 자료 폴더에는 `.gitkeep` 파일이 들어 있어 Git에서도 폴더 구조가 유지됩니다.

## 새 PDF 자료 등록하기

파일을 폴더에 넣은 다음 `assets/js/data.js`의 `materials` 배열에 자료 정보를 추가하면 됩니다. 화면 HTML이나 JavaScript 기능 코드는 수정하지 않아도 됩니다.

### 1. PDF 파일 넣기

- 무인숙박 브로슈어: `assets/materials/lodging/brochures/`
- 무인숙박 매뉴얼: `assets/materials/lodging/manuals/`
- 등하교 브로슈어: `assets/materials/school-safety/brochures/`
- 등하교 매뉴얼: `assets/materials/school-safety/manuals/`

파일명에는 가능하면 영문 소문자, 숫자, 하이픈을 사용하세요. 예: `school-safety-brochure-2026.pdf`

### 2. 자료 목록에 정보 추가하기

`assets/js/data.js`에서 `materials: []`를 찾아 아래와 같이 객체를 추가합니다.

```javascript
materials: [
  {
    id: "school-safety-brochure-2026",        // 중복되지 않는 고유 ID
    category: "school-safety",                // lodging 또는 school-safety
    type: "brochure",                         // brochure, manual, video
    format: "pdf",                            // PDF는 pdf
    title: "2026 등하교 안전 브로슈어",       // 화면에 표시할 자료명
    description: "등하교 안전 서비스 소개 자료입니다.",
    file: "assets/materials/school-safety/brochures/school-safety-brochure-2026.pdf",
    thumbnail: "assets/thumbnails/school-safety-brochure-2026.webp",
    updatedAt: "2026-11-03",                  // YYYY-MM-DD
    order: 10,                                 // 숫자가 작을수록 먼저 표시
  },
],
```

썸네일이 없으면 `thumbnail` 값을 빈 문자열(`""`)로 적거나 항목 자체를 생략하세요. 자료 유형에 맞는 기본 표지가 자동으로 표시됩니다.

`file` 값이 없거나 잘못된 자료는 화면에 표시되지 않습니다. 미리보기와 다운로드 버튼은 실제 파일 경로가 등록된 PDF 자료에만 표시됩니다.

## 표지 이미지 등록하기

1. 표지 이미지를 `assets/thumbnails/`에 넣습니다.
2. `assets/js/data.js`의 해당 자료 `thumbnail`에 경로를 적습니다.
3. 권장 형식은 WebP 또는 JPG, 권장 비율은 16:9입니다.

예시:

```javascript
thumbnail: "assets/thumbnails/school-safety-brochure-2026.webp",
```

이미지 파일이 없거나 경로가 잘못되어도 카드가 깨지지 않고 기본 표지로 대체됩니다.

## 외부 동영상 URL 등록하기

향후 YouTube 등 외부 URL을 자료로 연결할 수 있습니다. 동영상은 PDF 모달 대신 새 탭에서 열립니다.

```javascript
{
  id: "lodging-intro-video",
  category: "lodging",
  type: "video",
  format: "video",
  title: "무인숙박 서비스 소개 영상",
  description: "서비스 구성과 이용 방법을 소개합니다.",
  file: "https://example.com/video",
  thumbnail: "assets/thumbnails/lodging-intro-video.webp",
  updatedAt: "2026-11-03",
  order: 20,
},
```

## 사업 카테고리 추가하기

예를 들어 `발권` 카테고리를 추가하려면 다음 순서로 진행합니다.

1. `assets/js/data.js`의 `categories` 배열에 설정을 추가합니다.

```javascript
{
  id: "ticketing",
  label: "발권",
  description: "발권 사업의 홍보·운영자료",
  order: 30,
},
```

2. 자료를 보관할 폴더를 만듭니다.

```text
assets/materials/ticketing/brochures/
assets/materials/ticketing/manuals/
assets/materials/ticketing/videos/
```

3. 새 자료의 `category` 값을 `"ticketing"`으로 지정합니다.

카테고리 설정만 추가하면 사업 탭이 자동으로 만들어집니다. `index.html`이나 `app.js`는 수정하지 않아도 됩니다.

## 기존 자료 교체하기

같은 자료의 새 버전이 나온 경우:

1. 기존 PDF 파일을 새 파일로 교체합니다.
2. 파일명이 달라졌다면 `data.js`의 `file` 경로도 변경합니다.
3. `updatedAt` 날짜를 최신 날짜로 바꿉니다.
4. 표지도 바뀌었다면 썸네일 파일과 `thumbnail` 경로를 함께 수정합니다.

브라우저 캐시가 남을 수 있으므로 파일명에 연도나 버전을 넣는 방법을 권장합니다.

## 기존 자료 삭제하기

1. `assets/js/data.js`의 `materials` 배열에서 해당 자료 객체 전체를 삭제합니다.
2. 더 이상 사용하지 않는 PDF와 썸네일 파일을 저장소에서 삭제합니다.
3. 로컬 서버에서 카드가 사라졌는지 확인합니다.

자료 객체만 삭제해도 화면에서는 즉시 사라지지만, 저장소 용량 관리를 위해 사용하지 않는 파일도 함께 정리하는 것이 좋습니다.

## GitHub Pages 배포하기

이 프로젝트는 저장소 루트에서 바로 GitHub Pages로 배포할 수 있습니다. CSS, JavaScript, PDF 경로는 모두 상대경로를 사용하므로 `https://사용자명.github.io/저장소명/`처럼 저장소 하위 주소에서도 동작합니다.

1. GitHub에 저장소를 만들거나 기존 저장소에 이 프로젝트를 연결합니다.
2. 변경 내용을 기본 브랜치(일반적으로 `main`)에 푸시합니다.
3. GitHub 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**의 Source를 **Deploy from a branch**로 선택합니다.
5. Branch에서 `main`과 `/(root)`를 선택한 뒤 **Save**를 누릅니다.
6. 배포가 완료되면 Pages 화면에 표시되는 주소로 접속합니다.

저장소의 공개/비공개 여부는 조직 정책과 GitHub 요금제에 따라 결정해야 하므로 임의로 변경하지 마세요.

### 아직 GitHub 원격 저장소가 연결되지 않은 경우

원격 저장소 주소를 확인한 뒤 아래 명령을 실행합니다. `<저장소-주소>`는 실제 주소로 바꿔야 합니다.

```powershell
git remote add origin <저장소-주소>
git branch -M main
git push -u origin main
```

강제 푸시(`--force`)는 사용하지 마세요. 원격 저장소에 기존 파일이나 커밋이 있다면 먼저 담당자와 병합 방식을 확인해야 합니다.

## 배포 전 확인 목록

- PC와 모바일에서 제목, 탭, 카드가 잘 보이는지
- 전체 / 무인숙박 / 등하교 탭이 정상 전환되는지
- 자료가 없는 탭에 빈 상태 안내가 표시되는지
- PDF 미리보기, 새 탭 열기, 다운로드가 동작하는지
- ESC 키와 닫기 버튼으로 미리보기 모달이 닫히는지
- PDF를 교체한 뒤 `updatedAt` 날짜도 수정했는지
- 테스트용 PDF나 테스트 자료 객체가 실제 배포 목록에 남아 있지 않은지
