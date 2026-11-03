# NICE 자료허브

사업별 브로슈어, 매뉴얼, 동영상 등을 한곳에서 확인하고 내려받을 수 있는 정적 웹페이지입니다.

- 페이지명: **NICE 자료허브**
- 소개 문구: **사업별 홍보·운영자료를 한곳에서**
- 현재 사업 구분: **무인숙박 / 등하교**
- 실제 등록 자료는 `assets/data/library.json`의 `materials` 목록에서 관리합니다.

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
├─ admin.html                         # GitHub 자료 업로드 화면
├─ scripts/dev-server.js              # 설치 없는 로컬 정적 서버
├─ assets/
│  ├─ css/                            # 공개·관리 화면 스타일
│  ├─ data/library.json               # 사업 카테고리, 자료 유형, 자료 목록
│  ├─ js/
│  │  ├─ library-app.js               # 탭, 카드, PDF·동영상 미리보기 기능
│  │  └─ admin.js                     # GitHub 업로드 및 커밋 기능
│  ├─ vendor/pdfjs/                    # 모바일 PDF 미리보기용 PDF.js
│  ├─ materials/
│  │  ├─ lodging/                     # 무인숙박 자료
│  │  │  ├─ brochures/                # 브로슈어 PDF
│  │  │  ├─ manuals/                  # 매뉴얼 PDF
│  │  │  ├─ proposals/                # 제안서 PDF
│  │  │  └─ videos/                   # 영상 파일(필요 시)
│  │  └─ school-safety/               # 등하교 자료
│  │     ├─ brochures/
│  │     ├─ manuals/
│  │     ├─ proposals/
│  │     └─ videos/
│  └─ thumbnails/                     # 자료 표지 이미지
├─ .nojekyll                          # GitHub Pages의 Jekyll 처리 제외
└─ README.md                          # 운영 안내서
```

빈 자료 폴더에는 `.gitkeep` 파일이 들어 있어 Git에서도 폴더 구조가 유지됩니다.

PC에서는 브라우저의 기본 PDF 표시 기능을 사용하고, 모바일에서는 PDF.js가 페이지를 화면에 직접 표시합니다. 모바일 미리보기의 **이전 / 다음** 버튼으로 페이지를 이동할 수 있으며, 원본 파일은 별도의 **다운로드** 버튼으로 받을 수 있습니다.

## 관리 화면에서 자료 업로드하기

배포된 사이트의 `admin.html`에서 사업과 자료 유형을 선택해 파일을 등록할 수 있습니다.

- 관리 화면: `https://lawcombo.github.io/nice-hub/admin.html`
- 공개 자료실: `https://lawcombo.github.io/nice-hub/`

공개 자료실 하단의 **자료 관리**를 누르면 비밀번호 확인 창이 표시됩니다. 현재 비밀번호는 `5959`입니다. 이 비밀번호는 정적 웹페이지 코드에 포함된 간단한 진입 확인용이며, 서버 로그인처럼 강한 보안 기능을 제공하지는 않습니다.

### 1. GitHub Fine-grained 토큰 만들기

관리 화면은 별도 서버 없이 GitHub API를 사용하므로 업로드 권한을 확인할 토큰이 필요합니다.

1. [GitHub Fine-grained token 만들기](https://github.com/settings/personal-access-tokens/new)를 엽니다.
2. 만료일은 가능한 한 짧게 설정합니다.
3. **Repository access → Only select repositories**를 선택합니다.
4. `lawcombo/nice-hub` 저장소만 지정합니다.
5. **Repository permissions → Contents → Read and write**로 설정합니다.
6. 토큰을 만든 뒤 관리 화면의 토큰 입력란에 붙여넣고 **연결 확인**을 누릅니다.

토큰은 사이트 코드, GitHub 저장소, `localStorage`나 `sessionStorage`에 저장되지 않습니다. 현재 화면 메모리에서만 사용되며 새로고침하거나 닫으면 사라집니다. 공용 PC에서는 사용하지 마세요.

### 2. 자료 정보 입력 및 업로드

1. 사업 카테고리와 자료 유형을 선택합니다.
2. PDF 자료는 파일을 선택합니다. 동영상은 **직접 파일 업로드** 또는 **YouTube 링크 등록** 중 하나를 선택합니다.
3. 자료명, 설명, 등록·수정일, 정렬 순서를 입력합니다.
4. 표지가 있으면 WebP, JPG 또는 PNG 이미지를 선택합니다.
5. **GitHub에 업로드**를 누릅니다.

업로드가 완료되면 자료 파일, 표지, `assets/data/library.json` 변경이 `main` 브랜치의 한 커밋으로 저장됩니다. GitHub Pages에 반영되기까지 잠시 시간이 걸릴 수 있습니다.

### 등록 자료 확인 및 삭제

1. GitHub 토큰을 입력하고 **연결 확인**을 누릅니다.
2. 화면 아래 **현재 업로드된 자료**에서 무인숙박·등하교별 등록 목록을 확인합니다.
3. 삭제할 자료의 **삭제** 버튼을 누르고 확인 창에서 다시 **삭제**를 누릅니다.
4. 해당 자료의 목록 정보, GitHub 원본 파일, 등록된 표지 이미지가 한 커밋으로 함께 삭제됩니다.

같은 파일이나 표지를 여러 자료가 함께 사용 중인 경우에는 다른 자료가 깨지지 않도록 공유 파일을 저장소에 남깁니다. 삭제 후 GitHub Pages 반영에는 잠시 시간이 걸릴 수 있습니다.

### 업로드 제한

- 브로슈어·매뉴얼·제안서: PDF
- 동영상 직접 업로드: MP4 또는 WebM, 최대 90MB
- 브로슈어·매뉴얼·제안서 파일: 최대 20MB
- 표지 이미지: 최대 5MB

GitHub는 단일 파일 100MB를 차단하며 큰 바이너리 파일이 많으면 저장소가 빠르게 커집니다. 90MB를 넘는 동영상이나 장시간 영상은 **YouTube 링크 등록**을 사용하세요.

## GitHub에서 직접 자료 등록하기

관리 화면을 사용하지 않을 경우, 파일을 폴더에 넣은 다음 `assets/data/library.json`의 `materials` 배열에 자료 정보를 추가해도 됩니다. 화면 HTML이나 JavaScript 기능 코드는 수정하지 않아도 됩니다.

### 1. PDF 파일 넣기

- 무인숙박 브로슈어: `assets/materials/lodging/brochures/`
- 무인숙박 매뉴얼: `assets/materials/lodging/manuals/`
- 무인숙박 제안서: `assets/materials/lodging/proposals/`
- 등하교 브로슈어: `assets/materials/school-safety/brochures/`
- 등하교 매뉴얼: `assets/materials/school-safety/manuals/`
- 등하교 제안서: `assets/materials/school-safety/proposals/`

파일명에는 가능하면 영문 소문자, 숫자, 하이픈을 사용하세요. 예: `school-safety-brochure-2026.pdf`

### 자료 목록에 정보 추가하기

`assets/data/library.json`에서 `"materials": []`를 찾아 아래와 같이 객체를 추가합니다. JSON은 주석이나 마지막 쉼표를 허용하지 않습니다.

```json
"materials": [
  {
    "id": "school-safety-brochure-2026",
    "category": "school-safety",
    "type": "brochure",
    "format": "pdf",
    "title": "2026 등하교 안전 브로슈어",
    "description": "등하교 안전 서비스 소개 자료입니다.",
    "file": "assets/materials/school-safety/brochures/school-safety-brochure-2026.pdf",
    "thumbnail": "assets/thumbnails/school-safety-brochure-2026.webp",
    "updatedAt": "2026-11-03",
    "order": 10
  }
]
```

썸네일이 없으면 `thumbnail` 값을 빈 문자열(`""`)로 적거나 항목 자체를 생략하세요. 자료 유형에 맞는 기본 표지가 자동으로 표시됩니다.

`file` 값이 없거나 잘못된 자료는 화면에 표시되지 않습니다. 미리보기와 다운로드 버튼은 실제 파일 경로가 등록된 PDF 자료에만 표시됩니다.

## 표지 이미지 등록하기

1. 표지 이미지를 `assets/thumbnails/`에 넣습니다.
2. `assets/data/library.json`의 해당 자료 `thumbnail`에 경로를 적습니다.
3. 권장 형식은 WebP 또는 JPG, 권장 비율은 16:9입니다.

예시:

```json
"thumbnail": "assets/thumbnails/school-safety-brochure-2026.webp"
```

이미지 파일이 없거나 경로가 잘못되어도 카드가 깨지지 않고 기본 표지로 대체됩니다.

## 동영상 등록하기

관리 화면에서 자료 유형을 **동영상**으로 선택하면 아래 두 방식 중 하나를 고를 수 있습니다.

- **직접 파일 업로드**: MP4 또는 WebM 파일을 `assets/materials/사업/videos/`에 저장합니다. 공개 자료실의 **바로 재생** 버튼을 누르면 페이지 안의 큰 재생 창에서 영상이 재생되며, 원본 다운로드도 제공됩니다.
- **YouTube 링크 등록**: YouTube 또는 `youtu.be` 주소만 자료 목록에 저장합니다. 영상 파일은 GitHub에 저장하지 않으며, 공개 자료실의 **YouTube에서 보기** 버튼을 누르면 새 탭으로 이동합니다.

두 방식 모두 공개 카드에는 동일하게 자료명, 설명, 표지 이미지가 표시됩니다. 표지를 등록하지 않으면 동영상 기본 표지가 표시됩니다.

GitHub에서 직접 YouTube 영상을 등록할 때는 다음처럼 `sourceType`을 `youtube`로 지정합니다.

```json
{
  "id": "lodging-intro-video",
  "category": "lodging",
  "type": "video",
  "format": "video",
  "title": "무인숙박 서비스 소개 영상",
  "description": "서비스 구성과 이용 방법을 소개합니다.",
  "file": "https://www.youtube.com/watch?v=영상ID",
  "sourceType": "youtube",
  "thumbnail": "assets/thumbnails/lodging-intro-video.webp",
  "updatedAt": "2026-11-03",
  "order": 20
}
```

직접 업로드한 영상은 `file`에 저장소 안의 MP4/WebM 경로를 적고 `sourceType`을 `file`로 지정합니다.

```json
{
  "id": "lodging-intro-video-file",
  "category": "lodging",
  "type": "video",
  "format": "video",
  "title": "무인숙박 사용 안내 영상",
  "description": "키오스크 사용 순서를 안내합니다.",
  "file": "assets/materials/lodging/videos/lodging-guide.mp4",
  "sourceType": "file",
  "thumbnail": "assets/thumbnails/lodging-guide.webp",
  "updatedAt": "2026-11-03",
  "order": 30
}
```

## 사업 카테고리 추가하기

예를 들어 `발권` 카테고리를 추가하려면 다음 순서로 진행합니다.

1. `assets/data/library.json`의 `categories` 배열에 설정을 추가합니다.

```json
{
  "id": "ticketing",
  "label": "발권",
  "folder": "ticketing",
  "description": "발권 사업의 홍보·운영자료",
  "order": 30
}
```

2. 자료를 보관할 폴더를 만듭니다.

```text
assets/materials/ticketing/brochures/
assets/materials/ticketing/manuals/
assets/materials/ticketing/proposals/
assets/materials/ticketing/videos/
```

3. 새 자료의 `category` 값을 `"ticketing"`으로 지정합니다.

카테고리 설정만 추가하면 공개 자료실 탭과 관리 화면 선택 항목이 자동으로 만들어집니다. HTML이나 JavaScript는 수정하지 않아도 됩니다.

## 기존 자료 교체하기

같은 자료의 새 버전이 나온 경우:

1. 기존 PDF 파일을 새 파일로 교체합니다.
2. 파일명이 달라졌다면 `library.json`의 `file` 경로도 변경합니다.
3. `updatedAt` 날짜를 최신 날짜로 바꿉니다.
4. 표지도 바뀌었다면 썸네일 파일과 `thumbnail` 경로를 함께 수정합니다.

브라우저 캐시가 남을 수 있으므로 파일명에 연도나 버전을 넣는 방법을 권장합니다.

## 기존 자료 삭제하기

1. `assets/data/library.json`의 `materials` 배열에서 해당 자료 객체 전체를 삭제합니다.
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
- 관리 화면 토큰이 코드나 브라우저 저장소에 남지 않는지
- 업로드 완료 후 GitHub 커밋과 Pages 반영을 확인했는지
