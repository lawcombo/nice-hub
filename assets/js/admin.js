(function () {
  "use strict";

  const config = {
    owner: "lawcombo",
    repo: "nice-hub",
    branch: "main",
    dataPath: "assets/data/library.json",
    maxMaterialBytes: 20 * 1024 * 1024,
    maxThumbnailBytes: 5 * 1024 * 1024,
  };

  const elements = {
    token: document.querySelector("#githubToken"),
    connectButton: document.querySelector("#connectButton"),
    connectionStatus: document.querySelector("#connectionStatus"),
    form: document.querySelector("#uploadForm"),
    fields: document.querySelector("#uploadFields"),
    category: document.querySelector("#category"),
    materialType: document.querySelector("#materialType"),
    materialFile: document.querySelector("#materialFile"),
    materialFileName: document.querySelector("#materialFileName"),
    thumbnailFile: document.querySelector("#thumbnailFile"),
    thumbnailFileName: document.querySelector("#thumbnailFileName"),
    title: document.querySelector("#title"),
    description: document.querySelector("#description"),
    descriptionCount: document.querySelector("#descriptionCount"),
    updatedAt: document.querySelector("#updatedAt"),
    order: document.querySelector("#order"),
    destinationPreview: document.querySelector("#destinationPreview"),
    progress: document.querySelector("#uploadProgress"),
    progressTitle: document.querySelector("#progressTitle"),
    progressMessage: document.querySelector("#progressMessage"),
    result: document.querySelector("#uploadResult"),
  };

  let library = null;
  let verifiedToken = "";
  let isUploading = false;

  class GitHubApiError extends Error {
    constructor(status, message) {
      super(message);
      this.name = "GitHubApiError";
      this.status = status;
    }
  }

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function timestampString(date = new Date()) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
      "-",
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
      String(date.getSeconds()).padStart(2, "0"),
    ].join("");
  }

  function sanitizeFileName(fileName) {
    const lastDot = fileName.lastIndexOf(".");
    const rawBase = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
    const extension = lastDot > 0 ? fileName.slice(lastDot).toLowerCase() : "";
    const safeBase = rawBase
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}._-]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "material";
    const safeExtension = extension.replace(/[^a-z0-9.]/g, "").slice(0, 10);
    return `${safeBase}${safeExtension}`;
  }

  function getSelectedCategory(sourceLibrary = library) {
    return sourceLibrary?.categories?.find((category) => category.id === elements.category.value);
  }

  function getSelectedType(sourceLibrary = library) {
    return sourceLibrary?.materialTypes?.find((type) => type.id === elements.materialType.value);
  }

  function populateSelect(select, items) {
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      fragment.appendChild(option);
    });
    select.replaceChildren(fragment);
  }

  function updateFileAccept() {
    const type = getSelectedType();
    elements.materialFile.accept = Array.isArray(type?.accept) ? type.accept.join(",") : "";
    updateDestinationPreview();
  }

  function updateDestinationPreview() {
    const category = getSelectedCategory();
    const type = getSelectedType();
    const file = elements.materialFile.files[0];

    if (!category || !type) {
      elements.destinationPreview.textContent = "사업과 자료 유형을 선택해 주세요.";
      return;
    }

    const fileName = file ? sanitizeFileName(file.name) : "선택한-파일명";
    elements.destinationPreview.textContent = `assets/materials/${category.folder || category.id}/${type.folder}/${timestampString()}-${fileName}`;
  }

  function updateFileLabels() {
    const file = elements.materialFile.files[0];
    const thumbnail = elements.thumbnailFile.files[0];
    elements.materialFileName.textContent = file?.name || "선택된 파일 없음";
    elements.thumbnailFileName.textContent = thumbnail?.name || "선택된 이미지 없음";

    if (file && !elements.title.value.trim()) {
      elements.title.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    }
    updateDestinationPreview();
  }

  function setConnectionStatus(message, type = "") {
    elements.connectionStatus.textContent = message;
    elements.connectionStatus.className = `inline-status${type ? ` status-${type}` : ""}`;
  }

  function setProgress(title, message) {
    elements.progressTitle.textContent = title;
    elements.progressMessage.textContent = message;
    elements.progress.hidden = false;
  }

  function clearResult() {
    elements.result.hidden = true;
    elements.result.replaceChildren();
  }

  function showResult(kind, title, message, commitSha = "") {
    const heading = document.createElement("strong");
    const description = document.createElement("p");
    heading.textContent = title;
    description.textContent = message;
    elements.result.replaceChildren(heading, description);
    elements.result.className = `upload-result upload-result-${kind}`;

    if (commitSha) {
      const links = document.createElement("div");
      const commitLink = document.createElement("a");
      const siteLink = document.createElement("a");
      links.className = "result-links";
      commitLink.href = `https://github.com/${config.owner}/${config.repo}/commit/${commitSha}`;
      commitLink.target = "_blank";
      commitLink.rel = "noopener";
      commitLink.textContent = "GitHub 커밋 확인";
      siteLink.href = "./index.html";
      siteLink.textContent = "자료허브 확인";
      links.append(commitLink, siteLink);
      elements.result.appendChild(links);
    }

    elements.result.hidden = false;
    elements.result.tabIndex = -1;
    elements.result.focus({ preventScroll: true });
  }

  async function githubApi(endpoint, token, options = {}) {
    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    };
    if (options.body) headers["Content-Type"] = "application/json";

    let response;
    try {
      response = await fetch(`https://api.github.com${endpoint}`, {
        ...options,
        headers,
      });
    } catch (error) {
      throw new GitHubApiError(0, "GitHub에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.");
    }

    const responseText = await response.text();
    let payload = null;
    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch (error) {
        payload = { message: responseText };
      }
    }

    if (!response.ok) {
      throw new GitHubApiError(response.status, payload?.message || `GitHub API 오류 (${response.status})`);
    }
    return payload;
  }

  function bytesToBase64(input) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  }

  function decodeBase64Utf8(value) {
    const binary = atob(value.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function textToBase64(value) {
    return bytesToBase64(new TextEncoder().encode(value));
  }

  function fileMatchesType(file, type) {
    const accepted = Array.isArray(type.accept) ? type.accept.map((value) => value.toLowerCase()) : [];
    const lowerName = file.name.toLowerCase();
    const lowerMime = file.type.toLowerCase();
    return accepted.some((value) => (value.startsWith(".") ? lowerName.endsWith(value) : lowerMime === value));
  }

  function validateFolderSegment(value, label) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(value || "")) {
      throw new Error(`${label} 폴더 설정이 올바르지 않습니다.`);
    }
    return value;
  }

  function validateInputs(sourceLibrary) {
    const category = getSelectedCategory(sourceLibrary);
    const type = getSelectedType(sourceLibrary);
    const file = elements.materialFile.files[0];
    const thumbnail = elements.thumbnailFile.files[0];

    if (!category || !type) throw new Error("사업 카테고리와 자료 유형을 선택해 주세요.");
    if (!file) throw new Error("업로드할 자료 파일을 선택해 주세요.");
    if (file.size > config.maxMaterialBytes) throw new Error("자료 파일은 20MB 이하만 업로드할 수 있습니다.");
    if (!fileMatchesType(file, type)) throw new Error(`${type.label}에 허용되지 않는 파일 형식입니다.`);
    if (!elements.title.value.trim()) throw new Error("자료명을 입력해 주세요.");
    if (!elements.description.value.trim()) throw new Error("자료 설명을 입력해 주세요.");
    if (!elements.updatedAt.value) throw new Error("등록·수정일을 선택해 주세요.");

    if (thumbnail) {
      const validThumbnailTypes = ["image/webp", "image/jpeg", "image/png"];
      if (!validThumbnailTypes.includes(thumbnail.type)) throw new Error("표지는 WebP, JPG 또는 PNG만 사용할 수 있습니다.");
      if (thumbnail.size > config.maxThumbnailBytes) throw new Error("표지 이미지는 5MB 이하만 업로드할 수 있습니다.");
    }

    return { category, type, file, thumbnail };
  }

  function userFriendlyError(error) {
    if (!(error instanceof GitHubApiError)) return error.message || "업로드 중 알 수 없는 오류가 발생했습니다.";
    if (error.status === 0) return error.message;
    if (error.status === 401) return "토큰이 올바르지 않거나 만료되었습니다. 새 토큰으로 다시 연결해 주세요.";
    if (error.status === 403) return "저장소 쓰기 권한이 없습니다. 토큰의 저장소 범위와 Contents 권한을 확인해 주세요.";
    if (error.status === 404) return "저장소 또는 브랜치를 찾지 못했습니다. 토큰이 nice-hub 저장소에 접근 가능한지 확인해 주세요.";
    if (error.status === 409) return "다른 변경사항이 먼저 반영되었습니다. 새로고침한 뒤 다시 시도해 주세요.";
    if (error.status === 422) return "브랜치 보호 규칙 또는 파일 정보 때문에 커밋하지 못했습니다. GitHub 설정을 확인해 주세요.";
    return `GitHub 오류: ${error.message}`;
  }

  async function verifyConnection() {
    const token = elements.token.value.trim();
    if (!token) {
      setConnectionStatus("GitHub 토큰을 입력해 주세요.", "error");
      return false;
    }

    elements.connectButton.disabled = true;
    elements.connectButton.textContent = "확인 중…";
    setConnectionStatus("GitHub 저장소 권한을 확인하고 있습니다.");

    try {
      const repository = await githubApi(`/repos/${config.owner}/${config.repo}`, token);
      if (repository.permissions && repository.permissions.push === false) {
        throw new GitHubApiError(403, "저장소 쓰기 권한이 없습니다.");
      }
      await githubApi(`/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`, token);
      verifiedToken = token;
      elements.fields.disabled = false;
      setConnectionStatus("연결되었습니다. 자료 정보를 입력해 주세요.", "success");
      return true;
    } catch (error) {
      verifiedToken = "";
      elements.fields.disabled = true;
      setConnectionStatus(userFriendlyError(error), "error");
      return false;
    } finally {
      elements.connectButton.disabled = false;
      elements.connectButton.textContent = "연결 확인";
    }
  }

  async function createBlob(token, content) {
    return githubApi(`/repos/${config.owner}/${config.repo}/git/blobs`, token, {
      method: "POST",
      body: JSON.stringify({ content, encoding: "base64" }),
    });
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (isUploading) return;
    clearResult();

    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      const connected = await verifyConnection();
      if (!connected) return;
    }

    isUploading = true;
    elements.fields.disabled = true;

    try {
      setProgress("최신 자료 목록을 확인하고 있습니다.", "GitHub의 main 브랜치를 읽는 중입니다.");
      const encodedDataPath = config.dataPath.split("/").map(encodeURIComponent).join("/");
      const [reference, dataFile] = await Promise.all([
        githubApi(`/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`, verifiedToken),
        githubApi(
          `/repos/${config.owner}/${config.repo}/contents/${encodedDataPath}?ref=${encodeURIComponent(config.branch)}`,
          verifiedToken,
        ),
      ]);
      const latestLibrary = JSON.parse(decodeBase64Utf8(dataFile.content));
      const { category, type, file, thumbnail } = validateInputs(latestLibrary);
      const now = new Date();
      const stamp = timestampString(now);
      const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
      const typeFolder = validateFolderSegment(type.folder, "자료 유형");
      const materialPath = `assets/materials/${categoryFolder}/${typeFolder}/${stamp}-${sanitizeFileName(file.name)}`;
      const thumbnailPath = thumbnail ? `assets/thumbnails/${stamp}-${sanitizeFileName(thumbnail.name)}` : "";

      setProgress("자료 파일을 변환하고 있습니다.", `${file.name}을(를) 업로드할 준비 중입니다.`);
      const fileContent = bytesToBase64(await file.arrayBuffer());
      const fileBlob = await createBlob(verifiedToken, fileContent);

      let thumbnailBlob = null;
      if (thumbnail) {
        setProgress("표지 이미지를 준비하고 있습니다.", `${thumbnail.name}을(를) 처리 중입니다.`);
        thumbnailBlob = await createBlob(verifiedToken, bytesToBase64(await thumbnail.arrayBuffer()));
      }

      const parsedOrder = Number.parseInt(elements.order.value, 10);
      const material = {
        id: `${category.id}-${type.id}-${Date.now().toString(36)}`,
        category: category.id,
        type: type.id,
        format: type.format,
        title: elements.title.value.trim(),
        description: elements.description.value.trim(),
        file: materialPath,
        thumbnail: thumbnailPath,
        updatedAt: elements.updatedAt.value,
        order: Number.isInteger(parsedOrder) ? parsedOrder : 100,
      };
      latestLibrary.materials = Array.isArray(latestLibrary.materials) ? latestLibrary.materials : [];
      latestLibrary.materials.push(material);

      setProgress("자료 목록을 업데이트하고 있습니다.", "파일과 자료 정보를 하나의 커밋으로 묶는 중입니다.");
      const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
      const parentCommit = await githubApi(
        `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
        verifiedToken,
      );
      const treeEntries = [
        { path: materialPath, mode: "100644", type: "blob", sha: fileBlob.sha },
        { path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha },
      ];
      if (thumbnailBlob) {
        treeEntries.push({ path: thumbnailPath, mode: "100644", type: "blob", sha: thumbnailBlob.sha });
      }

      const tree = await githubApi(`/repos/${config.owner}/${config.repo}/git/trees`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries }),
      });
      const commit = await githubApi(`/repos/${config.owner}/${config.repo}/git/commits`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({
          message: `Add ${category.label} ${type.label}: ${material.title}`,
          tree: tree.sha,
          parents: [reference.object.sha],
        }),
      });

      setProgress("GitHub에 커밋하고 있습니다.", "main 브랜치에 최종 반영 중입니다.");
      await githubApi(`/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`, verifiedToken, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      library = latestLibrary;
      elements.progress.hidden = true;
      showResult(
        "success",
        "업로드가 완료되었습니다.",
        "파일과 자료 목록이 GitHub에 저장됐습니다. Pages 반영에는 잠시 시간이 걸릴 수 있습니다.",
        commit.sha,
      );
      elements.form.reset();
      elements.updatedAt.value = localDateString();
      elements.order.value = "100";
      elements.descriptionCount.textContent = "0";
      elements.materialFileName.textContent = "선택된 파일 없음";
      elements.thumbnailFileName.textContent = "선택된 이미지 없음";
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      updateFileAccept();
    } catch (error) {
      elements.progress.hidden = true;
      showResult("error", "업로드하지 못했습니다.", userFriendlyError(error));
    } finally {
      isUploading = false;
      elements.fields.disabled = !verifiedToken;
    }
  }

  async function initialize() {
    try {
      const response = await fetch(new URL("assets/data/library.json", document.baseURI), { cache: "no-cache" });
      if (!response.ok) throw new Error(`자료 설정 응답 오류: ${response.status}`);
      library = await response.json();
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      elements.updatedAt.value = localDateString();
      updateFileAccept();
    } catch (error) {
      setConnectionStatus("자료 설정을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.", "error");
      elements.connectButton.disabled = true;
    }
  }

  elements.connectButton.addEventListener("click", verifyConnection);
  elements.form.addEventListener("submit", handleUpload);
  elements.category.addEventListener("change", updateDestinationPreview);
  elements.materialType.addEventListener("change", updateFileAccept);
  elements.materialFile.addEventListener("change", updateFileLabels);
  elements.thumbnailFile.addEventListener("change", updateFileLabels);
  elements.description.addEventListener("input", () => {
    elements.descriptionCount.textContent = String(elements.description.value.length);
  });
  elements.token.addEventListener("input", () => {
    if (!verifiedToken || elements.token.value.trim() === verifiedToken) return;
    verifiedToken = "";
    elements.fields.disabled = true;
    setConnectionStatus("토큰이 변경되었습니다. 연결을 다시 확인해 주세요.");
  });
  window.addEventListener("beforeunload", () => {
    verifiedToken = "";
    elements.token.value = "";
  });

  initialize();
})();
