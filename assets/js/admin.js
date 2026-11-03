(function () {
  "use strict";

  const config = {
    owner: "lawcombo",
    repo: "nice-hub",
    branch: "main",
    dataPath: "assets/data/library.json",
    maxDocumentBytes: 20 * 1024 * 1024,
    maxVideoBytes: 90 * 1024 * 1024,
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
    videoSourceFields: document.querySelector("#videoSourceFields"),
    videoSourceInputs: [...document.querySelectorAll('input[name="videoSource"]')],
    materialFileGroup: document.querySelector("#materialFileGroup"),
    materialFile: document.querySelector("#materialFile"),
    materialFileName: document.querySelector("#materialFileName"),
    fileHelp: document.querySelector("#fileHelp"),
    youtubeUrlGroup: document.querySelector("#youtubeUrlGroup"),
    youtubeUrl: document.querySelector("#youtubeUrl"),
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
    inventorySection: document.querySelector("#inventorySection"),
    inventorySummary: document.querySelector("#inventorySummary"),
    inventoryStatus: document.querySelector("#inventoryStatus"),
    materialInventory: document.querySelector("#materialInventory"),
    refreshMaterialsButton: document.querySelector("#refreshMaterialsButton"),
    deleteDialog: document.querySelector("#deleteDialog"),
    deleteDialogMessage: document.querySelector("#deleteDialogMessage"),
    cancelDeleteButton: document.querySelector("#cancelDeleteButton"),
    confirmDeleteButton: document.querySelector("#confirmDeleteButton"),
  };

  let library = null;
  let verifiedToken = "";
  let isUploading = false;
  let isDeleting = false;
  let pendingDeleteId = "";
  let lastDeleteTrigger = null;

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

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function getCategoryLabel(categoryId, sourceLibrary = library) {
    return sourceLibrary?.categories?.find((category) => category.id === categoryId)?.label || categoryId || "기타";
  }

  function getTypeLabel(typeId, sourceLibrary = library) {
    return sourceLibrary?.materialTypes?.find((type) => type.id === typeId)?.label || typeId || "자료";
  }

  function getFileName(filePath) {
    if (!filePath || typeof filePath !== "string") return "파일 경로 없음";
    try {
      const pathname = new URL(filePath, document.baseURI).pathname;
      return decodeURIComponent(pathname.split("/").pop()) || filePath;
    } catch (error) {
      return filePath;
    }
  }

  function formatDate(value) {
    if (!value) return "날짜 미등록";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
  }

  function getVideoSourceMethod() {
    return elements.videoSourceInputs.find((input) => input.checked)?.value || "file";
  }

  function normalizeYouTubeUrl(value) {
    let url;
    try {
      url = new URL(value.trim());
    } catch (error) {
      throw new Error("올바른 YouTube 영상 주소를 입력해 주세요.");
    }

    const hostname = url.hostname.toLowerCase();
    const isYoutubeHost =
      hostname === "youtu.be" ||
      hostname.endsWith(".youtu.be") ||
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com");
    if (!isYoutubeHost || !["http:", "https:"].includes(url.protocol)) {
      throw new Error("YouTube 또는 youtu.be 영상 주소만 등록할 수 있습니다.");
    }
    return url.href;
  }

  function updateFileAccept() {
    const type = getSelectedType();
    const isVideo = type?.id === "video";
    const videoSource = getVideoSourceMethod();
    const isYoutube = isVideo && videoSource === "youtube";

    elements.materialFile.accept = Array.isArray(type?.accept) ? type.accept.join(",") : "";
    elements.videoSourceFields.hidden = !isVideo;
    elements.materialFileGroup.hidden = isYoutube;
    elements.youtubeUrlGroup.hidden = !isYoutube;
    elements.materialFile.required = !isYoutube;
    elements.youtubeUrl.required = isYoutube;

    if (isVideo && !isYoutube) {
      elements.fileHelp.textContent = "MP4 또는 WebM 동영상 파일을 선택하세요. 최대 90MB입니다.";
    } else if (isYoutube) {
      elements.fileHelp.textContent = "";
    } else {
      elements.fileHelp.textContent = "PDF 자료는 최대 20MB입니다.";
    }
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

    if (type.id === "video" && getVideoSourceMethod() === "youtube") {
      elements.destinationPreview.textContent = elements.youtubeUrl.value.trim() || "YouTube 외부 링크로 등록";
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

  function setInventoryStatus(message = "", type = "", commitSha = "") {
    elements.inventoryStatus.replaceChildren();
    elements.inventoryStatus.className = `inventory-status${type ? ` status-${type}` : ""}`;
    if (!message) return;

    elements.inventoryStatus.appendChild(document.createTextNode(message));
    if (commitSha) {
      const link = document.createElement("a");
      link.href = `https://github.com/${config.owner}/${config.repo}/commit/${commitSha}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "커밋 확인";
      elements.inventoryStatus.appendChild(link);
    }
  }

  function createInventoryItem(material, sourceLibrary) {
    const item = createElement("article", "inventory-item");
    const main = createElement("div", "inventory-item-main");
    const thumbnail = createElement("div", "inventory-thumbnail", String(material.format || "FILE").toUpperCase());

    if (material.thumbnail) {
      const image = document.createElement("img");
      image.src = new URL(material.thumbnail, document.baseURI).href;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => image.remove());
      thumbnail.appendChild(image);
    }

    const copy = createElement("div", "inventory-item-copy");
    const meta = createElement("div", "inventory-item-meta");
    meta.append(
      createElement("span", "", getTypeLabel(material.type, sourceLibrary)),
      createElement("span", "", `업데이트 ${formatDate(material.updatedAt)}`),
    );
    const title = createElement("h4", "inventory-item-title", material.title || "이름 없는 자료");
    const fileName = createElement("p", "inventory-file-name", getFileName(material.file));
    copy.append(meta, title, fileName);
    main.append(thumbnail, copy);

    const deleteButton = createElement("button", "button button-danger inventory-delete-button", "삭제");
    deleteButton.type = "button";
    deleteButton.disabled = isDeleting || !verifiedToken;
    deleteButton.addEventListener("click", () => openDeleteDialog(material.id, deleteButton));
    item.append(main, deleteButton);
    return item;
  }

  function renderInventory(sourceLibrary = library) {
    const categories = Array.isArray(sourceLibrary?.categories)
      ? [...sourceLibrary.categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      : [];
    const materials = Array.isArray(sourceLibrary?.materials) ? [...sourceLibrary.materials] : [];
    const knownCategoryIds = new Set(categories.map((category) => category.id));
    const unknownMaterials = materials.filter((material) => !knownCategoryIds.has(material.category));
    const groups = categories.map((category) => ({ id: category.id, label: category.label, category }));
    if (unknownMaterials.length) groups.push({ id: "__other__", label: "기타", category: null });

    elements.inventorySummary.textContent = `${categories.length}개 사업 카테고리 · 등록 자료 ${materials.length}건`;
    const fragment = document.createDocumentFragment();

    groups.forEach((group) => {
      const groupMaterials = (group.id === "__other__"
        ? unknownMaterials
        : materials.filter((material) => material.category === group.id)
      ).sort((a, b) => {
        const orderDifference = (a.order ?? 999) - (b.order ?? 999);
        return orderDifference || String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""), "ko");
      });

      const section = createElement("section", "inventory-group");
      const heading = createElement("div", "inventory-group-heading");
      heading.append(
        createElement("h3", "", group.label || group.id),
        createElement("span", "inventory-count", `${groupMaterials.length}건`),
      );
      const list = createElement("div", "inventory-list");
      if (groupMaterials.length) {
        groupMaterials.forEach((material) => list.appendChild(createInventoryItem(material, sourceLibrary)));
      } else {
        list.appendChild(createElement("p", "inventory-empty", "등록된 자료가 없습니다."));
      }
      section.append(heading, list);
      fragment.appendChild(section);
    });

    if (!groups.length) fragment.appendChild(createElement("p", "inventory-empty", "등록된 카테고리가 없습니다."));
    elements.materialInventory.replaceChildren(fragment);
  }

  function openDeleteDialog(materialId, trigger) {
    const material = library?.materials?.find((item) => item.id === materialId);
    if (!material || isDeleting) return;
    pendingDeleteId = materialId;
    lastDeleteTrigger = trigger;
    elements.deleteDialogMessage.textContent = `‘${material.title}’ 자료를 삭제합니다.`;
    elements.deleteDialog.showModal();
    window.requestAnimationFrame(() => elements.cancelDeleteButton.focus());
  }

  function closeDeleteDialog() {
    if (elements.deleteDialog.open) elements.deleteDialog.close();
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

  function encodeRepositoryPath(filePath) {
    return filePath.split("/").map(encodeURIComponent).join("/");
  }

  async function fetchRepositoryState(token) {
    const [reference, dataFile] = await Promise.all([
      githubApi(`/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`, token),
      githubApi(
        `/repos/${config.owner}/${config.repo}/contents/${encodeRepositoryPath(config.dataPath)}?ref=${encodeURIComponent(config.branch)}`,
        token,
      ),
    ]);
    return {
      reference,
      library: JSON.parse(decodeBase64Utf8(dataFile.content)),
    };
  }

  function getDeletableRepositoryPath(value, allowedPrefix) {
    if (!value || typeof value !== "string" || !value.startsWith(allowedPrefix)) return "";
    const segments = value.split("/");
    if (segments.some((segment) => !segment || segment === "." || segment === "..")) return "";
    return value;
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
    const videoSource = type.id === "video" ? getVideoSourceMethod() : "file";
    const youtubeUrl = videoSource === "youtube" ? normalizeYouTubeUrl(elements.youtubeUrl.value) : "";

    if (videoSource === "file") {
      if (!file) throw new Error("업로드할 자료 파일을 선택해 주세요.");
      const maximumBytes = type.id === "video" ? config.maxVideoBytes : config.maxDocumentBytes;
      const maximumLabel = type.id === "video" ? "90MB" : "20MB";
      if (file.size > maximumBytes) throw new Error(`자료 파일은 ${maximumLabel} 이하만 업로드할 수 있습니다.`);
      if (!fileMatchesType(file, type)) throw new Error(`${type.label}에 허용되지 않는 파일 형식입니다.`);
    }
    if (!elements.title.value.trim()) throw new Error("자료명을 입력해 주세요.");
    if (!elements.description.value.trim()) throw new Error("자료 설명을 입력해 주세요.");
    if (!elements.updatedAt.value) throw new Error("등록·수정일을 선택해 주세요.");

    if (thumbnail) {
      const validThumbnailTypes = ["image/webp", "image/jpeg", "image/png"];
      if (!validThumbnailTypes.includes(thumbnail.type)) throw new Error("표지는 WebP, JPG 또는 PNG만 사용할 수 있습니다.");
      if (thumbnail.size > config.maxThumbnailBytes) throw new Error("표지 이미지는 5MB 이하만 업로드할 수 있습니다.");
    }

    return { category, type, file, thumbnail, videoSource, youtubeUrl };
  }

  function userFriendlyError(error) {
    if (!(error instanceof GitHubApiError)) return error.message || "업로드 중 알 수 없는 오류가 발생했습니다.";
    if (error.status === 0) return error.message;
    if (error.status === 401) return "토큰이 올바르지 않거나 만료되었습니다. 새 토큰으로 다시 연결해 주세요.";
    if (error.status === 403) return "저장소 쓰기 권한이 없습니다. 토큰의 저장소 범위와 Contents 권한을 확인해 주세요.";
    if (error.status === 404) return "저장소 또는 브랜치를 찾지 못했습니다. 토큰이 nice-hub 저장소에 접근 가능한지 확인해 주세요.";
    if (error.status === 409) return "다른 변경사항이 먼저 반영되었습니다. 새로고침한 뒤 다시 시도해 주세요.";
    if (error.status === 422) return "다른 변경이 먼저 반영되었거나 브랜치 규칙 때문에 커밋하지 못했습니다. 목록을 새로고침한 뒤 다시 시도해 주세요.";
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
      const [repository, state] = await Promise.all([
        githubApi(`/repos/${config.owner}/${config.repo}`, token),
        fetchRepositoryState(token),
      ]);
      if (repository.permissions && repository.permissions.push === false) {
        throw new GitHubApiError(403, "저장소 쓰기 권한이 없습니다.");
      }
      verifiedToken = token;
      library = state.library;
      elements.fields.disabled = false;
      elements.inventorySection.hidden = false;
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      updateFileAccept();
      renderInventory(library);
      setInventoryStatus();
      const materialCount = Array.isArray(library.materials) ? library.materials.length : 0;
      setConnectionStatus(`연결되었습니다. 현재 등록 자료 ${materialCount}건을 불러왔습니다.`, "success");
      return true;
    } catch (error) {
      verifiedToken = "";
      elements.fields.disabled = true;
      elements.inventorySection.hidden = true;
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
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      const { category, type, file, thumbnail, videoSource, youtubeUrl } = validateInputs(latestLibrary);
      const now = new Date();
      const stamp = timestampString(now);
      const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
      const typeFolder = validateFolderSegment(type.folder, "자료 유형");
      const isYoutubeVideo = type.id === "video" && videoSource === "youtube";
      const materialPath = isYoutubeVideo
        ? youtubeUrl
        : `assets/materials/${categoryFolder}/${typeFolder}/${stamp}-${sanitizeFileName(file.name)}`;
      const thumbnailPath = thumbnail ? `assets/thumbnails/${stamp}-${sanitizeFileName(thumbnail.name)}` : "";

      let fileBlob = null;
      if (!isYoutubeVideo) {
        setProgress("자료 파일을 변환하고 있습니다.", `${file.name}을(를) 업로드할 준비 중입니다.`);
        const fileContent = bytesToBase64(await file.arrayBuffer());
        fileBlob = await createBlob(verifiedToken, fileContent);
      } else {
        setProgress("YouTube 링크를 준비하고 있습니다.", "영상 주소와 자료 정보를 등록하는 중입니다.");
      }

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
      if (type.id === "video") material.sourceType = videoSource;
      latestLibrary.materials = Array.isArray(latestLibrary.materials) ? latestLibrary.materials : [];
      latestLibrary.materials.push(material);

      setProgress("자료 목록을 업데이트하고 있습니다.", "파일과 자료 정보를 하나의 커밋으로 묶는 중입니다.");
      const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
      const parentCommit = await githubApi(
        `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
        verifiedToken,
      );
      const treeEntries = [{ path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha }];
      if (fileBlob) {
        treeEntries.unshift({ path: materialPath, mode: "100644", type: "blob", sha: fileBlob.sha });
      }
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
        isYoutubeVideo
          ? "YouTube 링크와 자료 정보가 GitHub에 저장됐습니다. Pages 반영에는 잠시 시간이 걸릴 수 있습니다."
          : "파일과 자료 목록이 GitHub에 저장됐습니다. Pages 반영에는 잠시 시간이 걸릴 수 있습니다.",
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
      elements.inventorySection.hidden = false;
      renderInventory(library);
      setInventoryStatus("새 자료가 목록에 추가되었습니다.", "success", commit.sha);
    } catch (error) {
      elements.progress.hidden = true;
      showResult("error", "업로드하지 못했습니다.", userFriendlyError(error));
    } finally {
      isUploading = false;
      elements.fields.disabled = !verifiedToken;
    }
  }

  async function refreshMaterials() {
    if (!verifiedToken || isUploading || isDeleting) return;
    elements.refreshMaterialsButton.disabled = true;
    setInventoryStatus("GitHub에서 최신 자료 목록을 불러오고 있습니다.", "progress");

    try {
      const state = await fetchRepositoryState(verifiedToken);
      library = state.library;
      renderInventory(library);
      setInventoryStatus("최신 자료 목록으로 갱신했습니다.", "success");
    } catch (error) {
      setInventoryStatus(userFriendlyError(error), "error");
    } finally {
      elements.refreshMaterialsButton.disabled = false;
    }
  }

  async function deleteSelectedMaterial() {
    const materialId = pendingDeleteId;
    if (!materialId || isDeleting) return;
    closeDeleteDialog();

    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      setInventoryStatus("토큰 연결을 다시 확인한 뒤 삭제해 주세요.", "error");
      return;
    }

    isDeleting = true;
    elements.fields.disabled = true;
    elements.refreshMaterialsButton.disabled = true;
    renderInventory(library);
    setInventoryStatus("GitHub에서 자료 파일과 목록을 삭제하고 있습니다. 이 화면을 닫지 마세요.", "progress");

    try {
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      const material = latestLibrary.materials?.find((item) => item.id === materialId);
      if (!material) throw new Error("삭제할 자료를 최신 목록에서 찾지 못했습니다. 목록을 새로고침해 주세요.");

      latestLibrary.materials = latestLibrary.materials.filter((item) => item.id !== materialId);
      const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
      const parentCommit = await githubApi(
        `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
        verifiedToken,
      );
      const treeEntries = [{ path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha }];
      const materialPath = getDeletableRepositoryPath(material.file, "assets/materials/");
      const thumbnailPath = getDeletableRepositoryPath(material.thumbnail, "assets/thumbnails/");
      const materialPathIsShared = latestLibrary.materials.some((item) => item.file === material.file);
      const thumbnailPathIsShared = latestLibrary.materials.some((item) => item.thumbnail === material.thumbnail);
      if (materialPath && !materialPathIsShared) {
        treeEntries.push({ path: materialPath, mode: "100644", type: "blob", sha: null });
      }
      if (thumbnailPath && !thumbnailPathIsShared) {
        treeEntries.push({ path: thumbnailPath, mode: "100644", type: "blob", sha: null });
      }

      const tree = await githubApi(`/repos/${config.owner}/${config.repo}/git/trees`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries }),
      });
      const commit = await githubApi(`/repos/${config.owner}/${config.repo}/git/commits`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({
          message: `Delete ${getCategoryLabel(material.category, latestLibrary)} ${getTypeLabel(material.type, latestLibrary)}: ${material.title}`,
          tree: tree.sha,
          parents: [reference.object.sha],
        }),
      });
      await githubApi(`/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`, verifiedToken, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      library = latestLibrary;
      setInventoryStatus(
        materialPath
          ? `‘${material.title}’ 자료와 원본 파일을 삭제했습니다.`
          : `‘${material.title}’ 외부 링크 자료를 목록에서 삭제했습니다.`,
        "success",
        commit.sha,
      );
    } catch (error) {
      setInventoryStatus(userFriendlyError(error), "error");
    } finally {
      isDeleting = false;
      elements.fields.disabled = !verifiedToken;
      elements.refreshMaterialsButton.disabled = false;
      renderInventory(library);
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
  elements.refreshMaterialsButton.addEventListener("click", refreshMaterials);
  elements.cancelDeleteButton.addEventListener("click", closeDeleteDialog);
  elements.confirmDeleteButton.addEventListener("click", deleteSelectedMaterial);
  elements.deleteDialog.addEventListener("click", (event) => {
    if (event.target === elements.deleteDialog) closeDeleteDialog();
  });
  elements.deleteDialog.addEventListener("close", () => {
    pendingDeleteId = "";
    if (lastDeleteTrigger && document.contains(lastDeleteTrigger)) lastDeleteTrigger.focus();
    lastDeleteTrigger = null;
  });
  elements.category.addEventListener("change", updateDestinationPreview);
  elements.materialType.addEventListener("change", updateFileAccept);
  elements.videoSourceInputs.forEach((input) => input.addEventListener("change", updateFileAccept));
  elements.youtubeUrl.addEventListener("input", updateDestinationPreview);
  elements.materialFile.addEventListener("change", updateFileLabels);
  elements.thumbnailFile.addEventListener("change", updateFileLabels);
  elements.description.addEventListener("input", () => {
    elements.descriptionCount.textContent = String(elements.description.value.length);
  });
  elements.token.addEventListener("input", () => {
    if (!verifiedToken || elements.token.value.trim() === verifiedToken) return;
    verifiedToken = "";
    elements.fields.disabled = true;
    elements.inventorySection.hidden = true;
    closeDeleteDialog();
    setConnectionStatus("토큰이 변경되었습니다. 연결을 다시 확인해 주세요.");
  });
  window.addEventListener("beforeunload", () => {
    verifiedToken = "";
    elements.token.value = "";
  });

  initialize();
})();
