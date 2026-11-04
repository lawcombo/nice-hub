(function () {
  "use strict";

  const elements = {
    tabs: document.querySelector("#categoryTabs"),
    typeTabs: document.querySelector("#materialTypeTabs"),
    panel: document.querySelector("#materialsPanel"),
    grid: document.querySelector("#materialsGrid"),
    empty: document.querySelector("#emptyState"),
    emptyTitle: document.querySelector("#emptyState h3"),
    emptyMessage: document.querySelector("#emptyState p"),
    summary: document.querySelector("#resultSummary"),
    searchInput: document.querySelector("#materialSearch"),
    clearSearch: document.querySelector("#clearMaterialSearch"),
    openAdminAccess: document.querySelector("#openAdminAccess"),
    adminAccessModal: document.querySelector("#adminAccessModal"),
    adminAccessForm: document.querySelector("#adminAccessForm"),
    adminAccessPassword: document.querySelector("#adminAccessPassword"),
    adminAccessError: document.querySelector("#adminAccessError"),
    closeAdminAccess: document.querySelector("#closeAdminAccess"),
    cancelAdminAccess: document.querySelector("#cancelAdminAccess"),
    modal: document.querySelector("#previewModal"),
    previewTypeLabel: document.querySelector("#previewTypeLabel"),
    modalTitle: document.querySelector("#previewTitle"),
    closeModal: document.querySelector("#closePreview"),
    pdfCanvasViewer: document.querySelector("#pdfCanvasViewer"),
    pdfPreviewStatus: document.querySelector("#pdfPreviewStatus"),
    pdfPreviewCanvas: document.querySelector("#pdfPreviewCanvas"),
    previewPagination: document.querySelector("#previewPagination"),
    previousPreviewPage: document.querySelector("#previousPreviewPage"),
    nextPreviewPage: document.querySelector("#nextPreviewPage"),
    previewPageIndicator: document.querySelector("#previewPageIndicator"),
    imagePreviewViewer: document.querySelector("#imagePreviewViewer"),
    imagePreviewStatus: document.querySelector("#imagePreviewStatus"),
    imagePreview: document.querySelector("#imagePreview"),
    downloadPreview: document.querySelector("#downloadPreview"),
    openPreviewNewTab: document.querySelector("#openPreviewNewTab"),
    videoModal: document.querySelector("#videoModal"),
    videoTitle: document.querySelector("#videoPreviewTitle"),
    videoPlayer: document.querySelector("#videoPlayer"),
    closeVideo: document.querySelector("#closeVideoPreview"),
    downloadVideo: document.querySelector("#downloadVideo"),
    openVideoNewTab: document.querySelector("#openVideoNewTab"),
  };

  let categories = [];
  let materialTypes = [];
  let materials = [];
  let materialTypeMap = new Map();
  let categoryMap = new Map();
  let activeCategory = "all";
  let activeMaterialType = "all";
  let activeSearch = "";
  let lastFocusedElement = null;
  let pdfJsModulePromise = null;
  let pdfDocument = null;
  let pdfLoadingTask = null;
  let pdfRenderTask = null;
  let currentPdfPage = 1;
  let previewSession = 0;
  let renderRequest = 0;
  let resizeTimer = null;
  let lastAccessFocusedElement = null;
  let lastVideoFocusedElement = null;
  let pendingHistoryModalClose = "";
  let exitGuardEnabled = false;

  const adminAccessPassword = "5959";
  const modalHistoryKey = "niceHubModal";
  const exitGuardHistoryKey = "niceHubExitGuard";
  const exitBaseHistoryKey = "niceHubExitBase";

  function resolveUrl(path) {
    if (!path || typeof path !== "string") return "";

    try {
      return new URL(path, document.baseURI).href;
    } catch (error) {
      console.warn("자료 경로를 해석할 수 없습니다.", path, error);
      return "";
    }
  }

  function getHistoryState() {
    return history.state && typeof history.state === "object" ? history.state : {};
  }

  function isStandaloneApp() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function pushModalHistory(modalName) {
    if (getHistoryState()[modalHistoryKey] === modalName) return true;
    try {
      history.pushState({ ...getHistoryState(), [modalHistoryKey]: modalName }, "", window.location.href);
      return true;
    } catch (error) {
      console.warn("미리보기 뒤로가기 기록을 추가하지 못했습니다.", error);
      return false;
    }
  }

  function pushExitGuard() {
    try {
      history.pushState(
        {
          ...getHistoryState(),
          [modalHistoryKey]: "",
          [exitBaseHistoryKey]: false,
          [exitGuardHistoryKey]: true,
        },
        "",
        window.location.href,
      );
      exitGuardEnabled = true;
    } catch (error) {
      console.warn("앱 종료 확인 기록을 추가하지 못했습니다.", error);
      exitGuardEnabled = false;
    }
  }

  function initializeBackNavigation() {
    window.addEventListener("popstate", handleBrowserBack);
    if (!isStandaloneApp()) return;

    const currentState = getHistoryState();
    if (currentState[modalHistoryKey]) {
      history.replaceState({ ...currentState, [modalHistoryKey]: "" }, "", window.location.href);
    }

    const normalizedState = getHistoryState();
    if (normalizedState[exitGuardHistoryKey]) {
      exitGuardEnabled = true;
      return;
    }
    if (normalizedState[exitBaseHistoryKey]) {
      pushExitGuard();
      return;
    }
    if (history.length > 1) return;

    try {
      history.replaceState(
        {
          ...normalizedState,
          [modalHistoryKey]: "",
          [exitBaseHistoryKey]: true,
          [exitGuardHistoryKey]: false,
        },
        "",
        window.location.href,
      );
      pushExitGuard();
    } catch (error) {
      console.warn("앱 종료 확인 기능을 준비하지 못했습니다.", error);
    }
  }

  function requestModalClose(modalName, closeFunction) {
    if (pendingHistoryModalClose) return;
    if (getHistoryState()[modalHistoryKey] !== modalName) {
      closeFunction();
      return;
    }

    pendingHistoryModalClose = modalName;
    history.back();
    window.setTimeout(() => {
      if (pendingHistoryModalClose !== modalName) return;
      pendingHistoryModalClose = "";
      closeFunction();
    }, 500);
  }

  function closeVisibleModal() {
    if (!elements.modal.hidden) {
      closePreview();
      return true;
    }
    if (!elements.videoModal.hidden) {
      closeVideoPreview();
      return true;
    }
    if (!elements.adminAccessModal.hidden) {
      closeAdminAccess();
      return true;
    }
    return false;
  }

  function handleBrowserBack(event) {
    pendingHistoryModalClose = "";
    if (closeVisibleModal()) return;
    if (!exitGuardEnabled || event.state?.[exitGuardHistoryKey]) return;

    if (!window.confirm("앱을 종료하시겠습니까?")) {
      pushExitGuard();
      return;
    }

    exitGuardEnabled = false;
    window.setTimeout(() => {
      window.close();
      window.setTimeout(() => history.back(), 100);
    }, 0);
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function getCategoryLabel(categoryId) {
    return categoryMap.get(categoryId)?.label || categoryId || "기타";
  }

  function getTypeLabel(type) {
    return materialTypeMap.get(type)?.label || type || "자료";
  }

  function getFormatLabel(material) {
    if (material.format) return String(material.format).toUpperCase();
    return material.type === "video" ? "VIDEO" : "FILE";
  }

  function isYouTubeMaterial(material) {
    if (material?.sourceType === "youtube") return true;
    if (!material?.file || typeof material.file !== "string") return false;
    try {
      const hostname = new URL(material.file, document.baseURI).hostname.toLowerCase();
      return hostname === "youtu.be" || hostname.endsWith(".youtu.be") || hostname === "youtube.com" || hostname.endsWith(".youtube.com");
    } catch (error) {
      return false;
    }
  }

  function isImageMaterial(material) {
    if (String(material?.format || "").toLowerCase() === "image") return true;
    return /\.(?:png|jpe?g|webp)(?:[?#].*)?$/i.test(String(material?.file || ""));
  }

  function getMaterialFileKindLabel(material) {
    const format = String(material?.format || "").toLowerCase();
    if (format === "pdf") return "PDF";
    if (["ppt", "pptx", "doc", "docx"].includes(format)) return format.toUpperCase();
    if (isImageMaterial(material)) return "이미지";
    if (format === "video" || material?.type === "video" || isYouTubeMaterial(material)) return "동영상";
    return "파일";
  }

  function formatFileSize(value) {
    const bytes = Number(value);
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const amount = bytes / 1024 ** unitIndex;
    const decimals = unitIndex === 0 || amount >= 100 ? 0 : 1;
    return `${amount.toFixed(decimals)}${units[unitIndex]}`;
  }

  function getMaterialFileInfo(material) {
    const details = [getMaterialFileKindLabel(material)];
    const fileSize = formatFileSize(material?.fileSizeBytes);
    const pageCount = Number(material?.pageCount);
    if (fileSize) details.push(fileSize);
    if (String(material?.format || "").toLowerCase() === "pdf" && Number.isInteger(pageCount) && pageCount > 0) {
      details.push(`${pageCount}페이지`);
    }
    return details.join(" · ");
  }

  function renderTabs() {
    const tabItems = [{ id: "all", label: "전체" }, ...categories];
    const fragment = document.createDocumentFragment();

    tabItems.forEach((category) => {
      const button = createElement("button", "tab-button", category.label);
      button.type = "button";
      button.id = `tab-${category.id}`;
      button.dataset.category = category.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "materialsPanel");
      button.setAttribute("aria-selected", category.id === activeCategory ? "true" : "false");
      button.tabIndex = category.id === activeCategory ? 0 : -1;
      button.addEventListener("click", () => selectCategory(category.id));
      button.addEventListener("keydown", handleTabKeydown);
      fragment.appendChild(button);
    });

    elements.tabs.replaceChildren(fragment);
  }

  function renderMaterialTypeTabs() {
    const typeItems = [{ id: "all", label: "전체 자료" }, ...materialTypes];
    const fragment = document.createDocumentFragment();

    typeItems.forEach((type) => {
      const button = createElement("button", "material-type-button", type.label);
      button.type = "button";
      button.dataset.materialType = type.id;
      button.setAttribute("aria-pressed", type.id === activeMaterialType ? "true" : "false");
      button.addEventListener("click", () => selectMaterialType(type.id));
      fragment.appendChild(button);
    });

    elements.typeTabs.replaceChildren(fragment);
  }

  function handleTabKeydown(event) {
    const tabs = [...elements.tabs.querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    tabs[nextIndex].focus();
    selectCategory(tabs[nextIndex].dataset.category);
  }

  function selectCategory(categoryId) {
    activeCategory = categoryId;

    elements.tabs.querySelectorAll('[role="tab"]').forEach((tab) => {
      const selected = tab.dataset.category === categoryId;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });

    const selectedTab = elements.tabs.querySelector(`[data-category="${CSS.escape(categoryId)}"]`);
    if (selectedTab) elements.panel.setAttribute("aria-labelledby", selectedTab.id);
    renderMaterials();
  }

  function selectMaterialType(typeId) {
    activeMaterialType = typeId;
    elements.typeTabs.querySelectorAll("[data-material-type]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.materialType === typeId ? "true" : "false");
    });
    renderMaterials();
  }

  function getVisibleMaterials() {
    return materials
      .filter((material) => activeCategory === "all" || material.category === activeCategory)
      .filter((material) => activeMaterialType === "all" || material.type === activeMaterialType)
      .filter((material) => !activeSearch || String(material?.title || "").toLocaleLowerCase("ko").includes(activeSearch))
      .filter((material) => material && material.id && material.title && material.file)
      .sort((a, b) => {
        const registrationDifference = getRegistrationTime(b) - getRegistrationTime(a);
        return registrationDifference || String(b.id || "").localeCompare(String(a.id || ""), "ko");
      });
  }

  function getRegistrationTime(material) {
    const registeredTime = Date.parse(material?.registeredAt || "");
    if (Number.isFinite(registeredTime)) return registeredTime;

    const pathTimestamp = String(material?.file || "").match(/(?:^|\/)(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-/);
    if (pathTimestamp) {
      const [, year, month, day, hour, minute, second] = pathTimestamp;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
      ).getTime();
    }

    const updatedTime = Date.parse(material?.updatedAt ? `${material.updatedAt}T00:00:00` : "");
    return Number.isFinite(updatedTime) ? updatedTime : 0;
  }

  function renderMaterials() {
    const visibleMaterials = getVisibleMaterials();
    const fragment = document.createDocumentFragment();

    visibleMaterials.forEach((material) => fragment.appendChild(createMaterialCard(material)));
    elements.grid.replaceChildren(fragment);
    elements.grid.hidden = visibleMaterials.length === 0;
    elements.empty.hidden = visibleMaterials.length !== 0;
    elements.emptyTitle.textContent = activeSearch ? "검색 결과가 없습니다." : "등록된 자료가 없습니다.";
    elements.emptyMessage.textContent = activeSearch
      ? "다른 검색어를 입력하거나 사업·자료 유형을 변경해 보세요."
      : "자료를 준비 중입니다.";

    const categoryLabel = activeCategory === "all" ? "전체" : getCategoryLabel(activeCategory);
    const typeLabel = activeMaterialType === "all" ? "전체 유형" : getTypeLabel(activeMaterialType);
    elements.summary.textContent = activeSearch
      ? `‘${elements.searchInput.value.trim()}’ 검색 결과 ${visibleMaterials.length}건`
      : `${categoryLabel} · ${typeLabel} 자료 ${visibleMaterials.length}건`;
  }

  function updateSearch() {
    activeSearch = elements.searchInput.value.trim().toLocaleLowerCase("ko");
    elements.clearSearch.hidden = !elements.searchInput.value;
    renderMaterials();
  }

  function clearSearch() {
    elements.searchInput.value = "";
    updateSearch();
    elements.searchInput.focus();
  }

  function createMaterialCard(material) {
    const card = createElement("article", "material-card");
    card.dataset.materialId = material.id;

    const thumbnail = createElement("div", "thumbnail");
    const fallback = createThumbnailFallback(material);
    thumbnail.appendChild(fallback);

    if (material.thumbnail) {
      const image = document.createElement("img");
      image.src = resolveUrl(material.thumbnail);
      image.alt = `${material.title} 표지`;
      image.loading = "lazy";
      image.addEventListener("load", () => fallback.remove());
      image.addEventListener("error", () => image.remove());
      thumbnail.prepend(image);
    }

    const body = createElement("div", "card-body");
    const meta = createElement("div", "card-meta");
    meta.append(
      createElement("span", "badge", getCategoryLabel(material.category)),
      createElement("span", "badge badge-subtle", getTypeLabel(material.type)),
    );

    const title = createElement("h3", "material-title", material.title);
    const description = createElement(
      "p",
      "material-description",
      material.description || "자료의 자세한 내용은 파일에서 확인해 주세요.",
    );
    const fileInfo = createElement("p", "material-file-info", getMaterialFileInfo(material));
    const date = createElement("p", "material-date", formatUpdatedDate(material.updatedAt));
    date.setAttribute("aria-label", `업데이트 날짜 ${material.updatedAt || "미등록"}`);
    const detailRow = createElement("div", "material-detail-row");
    detailRow.append(fileInfo, date);
    const actions = createElement("div", "card-actions");

    if (String(material.format).toLowerCase() === "pdf" || isImageMaterial(material)) {
      const previewButton = createElement("button", "button button-primary", "미리보기");
      previewButton.type = "button";
      previewButton.addEventListener("click", () => openPreview(material, previewButton));
      actions.appendChild(previewButton);

      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-secondary";
      downloadLink.textContent = "다운로드";
      actions.appendChild(downloadLink);
    } else if (material.type === "video" && isYouTubeMaterial(material)) {
      const openLink = createElement("a", "button button-primary", "YouTube에서 보기");
      openLink.href = resolveUrl(material.file);
      openLink.target = "_blank";
      openLink.rel = "noopener";
      actions.appendChild(openLink);
    } else if (material.type === "video") {
      const playButton = createElement("button", "button button-primary", "바로 재생");
      playButton.type = "button";
      playButton.addEventListener("click", () => openVideoPreview(material, playButton));
      actions.appendChild(playButton);

      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-secondary";
      downloadLink.textContent = "다운로드";
      actions.appendChild(downloadLink);
    } else {
      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-primary";
      downloadLink.textContent = "다운로드";
      actions.appendChild(downloadLink);
    }

    actions.appendChild(createShareButton(material));
    if (actions.childElementCount === 3) actions.classList.add("card-actions-three");

    body.append(meta, title, description, detailRow, actions);
    card.append(thumbnail, body);
    return card;
  }

  function createThumbnailFallback(material) {
    const fallback = createElement("div", "thumbnail-fallback");
    const mark = createElement("span", "file-mark");
    mark.dataset.format = getFormatLabel(material);
    mark.setAttribute("aria-hidden", "true");
    fallback.append(mark, createElement("span", "thumbnail-type", getTypeLabel(material.type)));
    return fallback;
  }

  function createDownloadLink(material) {
    const link = document.createElement("a");
    link.href = resolveUrl(material.file);
    link.download = getFileName(material.file, material.title);
    return link;
  }

  function isMobileDevice() {
    if (navigator.userAgentData?.mobile === true) return true;
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return true;
    return window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;
  }

  function getShareActionLabel() {
    return isMobileDevice() ? "공유하기" : "링크 복사";
  }

  function createShareButton(material) {
    const label = getShareActionLabel();
    const button = createElement("button", "button button-secondary share-link-button", label);
    button.type = "button";
    button.dataset.defaultLabel = label;
    button.dataset.defaultAriaLabel = `${material.title} ${label}`;
    button.setAttribute("aria-label", button.dataset.defaultAriaLabel);
    button.addEventListener("click", () => shareMaterialLink(material, button));
    return button;
  }

  async function shareMaterialLink(material, button) {
    const url = resolveUrl(material.file);
    if (!url) return;

    if (isMobileDevice() && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: material.title,
          text: `${material.title} 자료를 확인해 보세요.`,
          url,
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.warn("모바일 공유창을 열지 못해 링크 복사로 전환합니다.", error);
      }
    }

    try {
      await copyText(url);
      showShareFeedback(button, "링크 복사됨");
    } catch (error) {
      console.error("자료 링크를 복사하지 못했습니다.", error);
      showShareFeedback(button, "복사 실패");
    }
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    const copied = document.execCommand("copy");
    textArea.remove();
    if (!copied) throw new Error("브라우저가 클립보드 복사를 허용하지 않았습니다.");
  }

  function showShareFeedback(button, message) {
    window.clearTimeout(Number(button.dataset.feedbackTimer || 0));
    button.textContent = message;
    button.setAttribute("aria-label", message);
    const timer = window.setTimeout(() => {
      button.textContent = button.dataset.defaultLabel || getShareActionLabel();
      button.setAttribute("aria-label", button.dataset.defaultAriaLabel || button.textContent);
      delete button.dataset.feedbackTimer;
    }, 1800);
    button.dataset.feedbackTimer = String(timer);
  }

  function getFileName(path, fallbackTitle) {
    try {
      const pathname = new URL(path, document.baseURI).pathname;
      return decodeURIComponent(pathname.split("/").pop()) || fallbackTitle;
    } catch (error) {
      return fallbackTitle;
    }
  }

  function formatUpdatedDate(value) {
    if (!value) return "날짜 미등록";
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return String(value);
    return `${match[1]}.${match[2]}.${match[3]}`;
  }

  function loadPdfJs() {
    if (!pdfJsModulePromise) {
      pdfJsModulePromise = import(resolveUrl("assets/vendor/pdfjs/pdf.min.mjs")).then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = resolveUrl("assets/vendor/pdfjs/pdf.worker.min.mjs");
        return pdfjs;
      });
    }
    return pdfJsModulePromise;
  }

  function setCanvasPreviewStatus(message, isError) {
    elements.pdfPreviewStatus.textContent = message;
    elements.pdfPreviewStatus.classList.toggle("is-error", Boolean(isError));
    elements.pdfPreviewStatus.hidden = false;
    elements.pdfPreviewCanvas.hidden = true;
  }

  function updatePagination() {
    const pageCount = pdfDocument?.numPages || 1;
    elements.previewPageIndicator.textContent = `${currentPdfPage} / ${pageCount}`;
    elements.previousPreviewPage.disabled = currentPdfPage <= 1;
    elements.nextPreviewPage.disabled = currentPdfPage >= pageCount;
  }

  async function renderPdfPage(pageNumber, session = previewSession) {
    if (!pdfDocument || session !== previewSession) return;

    const request = ++renderRequest;
    currentPdfPage = Math.min(Math.max(pageNumber, 1), pdfDocument.numPages);
    updatePagination();
    setCanvasPreviewStatus(`${currentPdfPage}페이지를 표시하고 있습니다.`, false);

    if (pdfRenderTask) {
      pdfRenderTask.cancel();
      pdfRenderTask = null;
    }

    try {
      const page = await pdfDocument.getPage(currentPdfPage);
      if (session !== previewSession || request !== renderRequest) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(elements.pdfCanvasViewer.clientWidth - 16, 1);
      const availableHeight = Math.max(elements.pdfCanvasViewer.clientHeight - 16, 1);
      const widthScale = availableWidth / baseViewport.width;
      const heightScale = availableHeight / baseViewport.height;
      const cssScale = Math.min(widthScale, heightScale, 1.6);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
      const canvas = elements.pdfPreviewCanvas;
      const context = canvas.getContext("2d", { alpha: false });

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(baseViewport.width * cssScale)}px`;
      canvas.style.height = `${Math.floor(baseViewport.height * cssScale)}px`;

      const renderTask = page.render({ canvasContext: context, viewport: renderViewport });
      pdfRenderTask = renderTask;
      await renderTask.promise;
      if (session !== previewSession || request !== renderRequest) return;

      elements.pdfPreviewStatus.hidden = true;
      canvas.hidden = false;
      canvas.setAttribute("aria-label", `PDF ${currentPdfPage}페이지, 전체 ${pdfDocument.numPages}페이지`);
      elements.pdfCanvasViewer.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      if (error?.name === "RenderingCancelledException") return;
      console.error("PDF 페이지를 표시하지 못했습니다.", error);
      setCanvasPreviewStatus("미리보기를 표시하지 못했습니다. 새 탭에서 열기 또는 다운로드를 이용해 주세요.", true);
    } finally {
      if (request === renderRequest) pdfRenderTask = null;
    }
  }

  async function openCanvasPreview(fileUrl, session) {
    elements.pdfCanvasViewer.hidden = false;
    elements.previewPagination.hidden = false;
    currentPdfPage = 1;
    updatePagination();
    setCanvasPreviewStatus("PDF를 불러오고 있습니다.", false);

    try {
      const pdfjs = await loadPdfJs();
      if (session !== previewSession) return;

      pdfLoadingTask = pdfjs.getDocument({ url: fileUrl });
      pdfDocument = await pdfLoadingTask.promise;
      if (session !== previewSession) return;
      await renderPdfPage(1, session);
    } catch (error) {
      if (session !== previewSession) return;
      console.error("PDF를 불러오지 못했습니다.", error);
      setCanvasPreviewStatus("미리보기를 불러오지 못했습니다. 새 탭에서 열기 또는 다운로드를 이용해 주세요.", true);
    }
  }

  function openImagePreview(material, fileUrl, session) {
    elements.imagePreviewViewer.hidden = false;
    elements.imagePreviewStatus.hidden = false;
    elements.imagePreviewStatus.classList.remove("is-error");
    elements.imagePreviewStatus.textContent = "이미지를 불러오고 있습니다.";
    elements.imagePreview.hidden = true;
    elements.imagePreview.alt = `${material.title} 미리보기`;
    elements.imagePreview.onload = () => {
      if (session !== previewSession) return;
      elements.imagePreviewStatus.hidden = true;
      elements.imagePreview.hidden = false;
    };
    elements.imagePreview.onerror = () => {
      if (session !== previewSession) return;
      elements.imagePreview.hidden = true;
      elements.imagePreviewStatus.hidden = false;
      elements.imagePreviewStatus.classList.add("is-error");
      elements.imagePreviewStatus.textContent =
        "이미지를 표시하지 못했습니다. 새 탭에서 열기 또는 다운로드를 이용해 주세요.";
    };
    elements.imagePreview.src = fileUrl;
  }

  function openPreview(material, trigger) {
    const fileUrl = resolveUrl(material.file);
    if (!fileUrl) return;

    pushModalHistory("preview");
    const session = ++previewSession;
    const imageMaterial = isImageMaterial(material);
    lastFocusedElement = trigger || document.activeElement;
    elements.previewTypeLabel.textContent = imageMaterial ? "IMAGE 미리보기" : "PDF 미리보기";
    elements.modalTitle.textContent = material.title;
    elements.downloadPreview.href = fileUrl;
    elements.downloadPreview.download = getFileName(material.file, material.title);
    elements.openPreviewNewTab.href = fileUrl;
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleModalKeydown);
    window.requestAnimationFrame(() => elements.closeModal.focus());

    if (imageMaterial) {
      elements.previewPagination.hidden = true;
      elements.pdfCanvasViewer.hidden = true;
      openImagePreview(material, fileUrl, session);
    } else {
      elements.imagePreviewViewer.hidden = true;
      openCanvasPreview(fileUrl, session);
    }
  }

  function closePreview() {
    if (elements.modal.hidden) return;

    previewSession += 1;
    renderRequest += 1;
    elements.modal.hidden = true;
    elements.pdfCanvasViewer.hidden = true;
    elements.imagePreviewViewer.hidden = true;
    elements.imagePreview.hidden = true;
    elements.imagePreview.onload = null;
    elements.imagePreview.onerror = null;
    elements.imagePreview.removeAttribute("src");
    elements.imagePreview.removeAttribute("alt");
    elements.previewPagination.hidden = true;
    elements.pdfPreviewCanvas.hidden = true;
    elements.downloadPreview.removeAttribute("href");
    elements.openPreviewNewTab.removeAttribute("href");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleModalKeydown);

    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;

    if (pdfRenderTask) pdfRenderTask.cancel();
    if (pdfLoadingTask) void pdfLoadingTask.destroy().catch(() => {});
    pdfRenderTask = null;
    pdfLoadingTask = null;
    pdfDocument = null;
    currentPdfPage = 1;
  }

  function openVideoPreview(material, trigger) {
    const fileUrl = resolveUrl(material.file);
    if (!fileUrl) return;

    pushModalHistory("video");
    lastVideoFocusedElement = trigger || document.activeElement;
    elements.videoTitle.textContent = material.title;
    elements.videoPlayer.src = fileUrl;
    elements.downloadVideo.href = fileUrl;
    elements.downloadVideo.download = getFileName(material.file, material.title);
    elements.openVideoNewTab.href = fileUrl;
    elements.videoModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleVideoKeydown);
    elements.videoPlayer.load();
    void elements.videoPlayer.play().catch(() => {});
    window.requestAnimationFrame(() => elements.closeVideo.focus());
  }

  function closeVideoPreview() {
    if (elements.videoModal.hidden) return;

    elements.videoPlayer.pause();
    elements.videoPlayer.removeAttribute("src");
    elements.videoPlayer.load();
    elements.videoModal.hidden = true;
    elements.downloadVideo.removeAttribute("href");
    elements.openVideoNewTab.removeAttribute("href");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleVideoKeydown);

    if (lastVideoFocusedElement && document.contains(lastVideoFocusedElement)) lastVideoFocusedElement.focus();
    lastVideoFocusedElement = null;
  }

  function handleVideoKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("video", closeVideoPreview);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [
      ...elements.videoModal.querySelectorAll('button:not([disabled]), a[href], video[controls]'),
    ].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openAdminAccess() {
    pushModalHistory("admin-access");
    lastAccessFocusedElement = document.activeElement;
    elements.adminAccessPassword.value = "";
    elements.adminAccessError.textContent = "";
    elements.adminAccessModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleAdminAccessKeydown);
    window.requestAnimationFrame(() => elements.adminAccessPassword.focus());
  }

  function closeAdminAccess() {
    if (elements.adminAccessModal.hidden) return;
    elements.adminAccessModal.hidden = true;
    elements.adminAccessPassword.value = "";
    elements.adminAccessError.textContent = "";
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleAdminAccessKeydown);
    if (lastAccessFocusedElement && document.contains(lastAccessFocusedElement)) lastAccessFocusedElement.focus();
    lastAccessFocusedElement = null;
  }

  function handleAdminAccessSubmit(event) {
    event.preventDefault();
    if (elements.adminAccessPassword.value === adminAccessPassword) {
      window.location.replace(resolveUrl("admin.html"));
      return;
    }

    elements.adminAccessError.textContent = "비밀번호가 올바르지 않습니다.";
    elements.adminAccessPassword.select();
  }

  function handleAdminAccessKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("admin-access", closeAdminAccess);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...elements.adminAccessModal.querySelectorAll('button:not([disabled]), input:not([disabled])')].filter(
      (element) => element.offsetParent !== null,
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("preview", closePreview);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...elements.modal.querySelectorAll('button:not([disabled]), a[href]')].filter(
      (element) => element.offsetParent !== null,
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function initialize() {
    try {
      const response = await fetch(resolveUrl("assets/data/library.json"), { cache: "no-cache" });
      if (!response.ok) throw new Error(`자료 목록 응답 오류: ${response.status}`);
      const data = await response.json();

      categories = Array.isArray(data.categories)
        ? [...data.categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        : [];
      materials = Array.isArray(data.materials) ? data.materials : [];
      materialTypes = Array.isArray(data.materialTypes) ? data.materialTypes : [];
      categoryMap = new Map(categories.map((category) => [category.id, category]));
      materialTypeMap = new Map(materialTypes.map((type) => [type.id, type]));

      renderTabs();
      renderMaterialTypeTabs();
      renderMaterials();
    } catch (error) {
      console.error("자료 목록을 불러오지 못했습니다.", error);
      renderTabs();
      renderMaterialTypeTabs();
      elements.grid.hidden = true;
      elements.empty.hidden = false;
      elements.emptyTitle.textContent = "자료 목록을 불러오지 못했습니다.";
      elements.emptyMessage.textContent = "잠시 후 새로고침해 주세요.";
      elements.summary.textContent = "자료 목록 오류";
    }
  }

  elements.closeModal.addEventListener("click", () => requestModalClose("preview", closePreview));
  elements.modal
    .querySelector("[data-close-modal]")
    .addEventListener("click", () => requestModalClose("preview", closePreview));
  elements.closeVideo.addEventListener("click", () => requestModalClose("video", closeVideoPreview));
  elements.videoModal
    .querySelector("[data-close-video-modal]")
    .addEventListener("click", () => requestModalClose("video", closeVideoPreview));
  elements.openAdminAccess.addEventListener("click", openAdminAccess);
  elements.adminAccessForm.addEventListener("submit", handleAdminAccessSubmit);
  elements.closeAdminAccess.addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.cancelAdminAccess.addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.adminAccessModal
    .querySelector("[data-close-admin-access]")
    .addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.previousPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage - 1));
  elements.nextPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage + 1));
  elements.searchInput.addEventListener("input", updateSearch);
  elements.searchInput.addEventListener("search", updateSearch);
  elements.clearSearch.addEventListener("click", clearSearch);
  window.addEventListener("resize", () => {
    if (elements.modal.hidden || elements.pdfCanvasViewer.hidden || !pdfDocument) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderPdfPage(currentPdfPage), 180);
  });
  initializeBackNavigation();
  initialize();
})();
