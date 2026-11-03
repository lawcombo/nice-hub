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
    openAdminAccess: document.querySelector("#openAdminAccess"),
    adminAccessModal: document.querySelector("#adminAccessModal"),
    adminAccessForm: document.querySelector("#adminAccessForm"),
    adminAccessPassword: document.querySelector("#adminAccessPassword"),
    adminAccessError: document.querySelector("#adminAccessError"),
    closeAdminAccess: document.querySelector("#closeAdminAccess"),
    cancelAdminAccess: document.querySelector("#cancelAdminAccess"),
    modal: document.querySelector("#previewModal"),
    modalTitle: document.querySelector("#previewTitle"),
    closeModal: document.querySelector("#closePreview"),
    previewFrame: document.querySelector("#previewFrame"),
    pdfCanvasViewer: document.querySelector("#pdfCanvasViewer"),
    pdfPreviewStatus: document.querySelector("#pdfPreviewStatus"),
    pdfPreviewCanvas: document.querySelector("#pdfPreviewCanvas"),
    previewPagination: document.querySelector("#previewPagination"),
    previousPreviewPage: document.querySelector("#previousPreviewPage"),
    nextPreviewPage: document.querySelector("#nextPreviewPage"),
    previewPageIndicator: document.querySelector("#previewPageIndicator"),
    downloadPreview: document.querySelector("#downloadPreview"),
    openPreviewNewTab: document.querySelector("#openPreviewNewTab"),
  };

  let categories = [];
  let materialTypes = [];
  let materials = [];
  let materialTypeMap = new Map();
  let categoryMap = new Map();
  let activeCategory = "all";
  let activeMaterialType = "all";
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

  const adminAccessPassword = "5959";

  function resolveUrl(path) {
    if (!path || typeof path !== "string") return "";

    try {
      return new URL(path, document.baseURI).href;
    } catch (error) {
      console.warn("자료 경로를 해석할 수 없습니다.", path, error);
      return "";
    }
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
      .filter((material) => material && material.id && material.title && material.file)
      .sort((a, b) => {
        const orderDifference = (a.order ?? 999) - (b.order ?? 999);
        if (orderDifference !== 0) return orderDifference;
        return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""), "ko");
      });
  }

  function renderMaterials() {
    const visibleMaterials = getVisibleMaterials();
    const fragment = document.createDocumentFragment();

    visibleMaterials.forEach((material) => fragment.appendChild(createMaterialCard(material)));
    elements.grid.replaceChildren(fragment);
    elements.grid.hidden = visibleMaterials.length === 0;
    elements.empty.hidden = visibleMaterials.length !== 0;
    elements.emptyTitle.textContent = "등록된 자료가 없습니다.";
    elements.emptyMessage.textContent = "자료를 준비 중입니다.";

    const categoryLabel = activeCategory === "all" ? "전체" : getCategoryLabel(activeCategory);
    const typeLabel = activeMaterialType === "all" ? "전체 유형" : getTypeLabel(activeMaterialType);
    elements.summary.textContent = `${categoryLabel} · ${typeLabel} 자료 ${visibleMaterials.length}건`;
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
    const date = createElement("p", "material-date", formatUpdatedDate(material.updatedAt));
    const actions = createElement("div", "card-actions");

    if (String(material.format).toLowerCase() === "pdf") {
      const previewButton = createElement("button", "button button-primary", "미리보기");
      previewButton.type = "button";
      previewButton.addEventListener("click", () => openPreview(material, previewButton));
      actions.appendChild(previewButton);

      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-secondary";
      downloadLink.textContent = "다운로드";
      actions.appendChild(downloadLink);
    } else {
      const openLink = createElement("a", "button button-primary", material.type === "video" ? "영상 보기" : "자료 열기");
      openLink.href = resolveUrl(material.file);
      openLink.target = "_blank";
      openLink.rel = "noopener";
      actions.appendChild(openLink);
    }

    body.append(meta, title, description, date, actions);
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

  function getFileName(path, fallbackTitle) {
    try {
      const pathname = new URL(path, document.baseURI).pathname;
      return decodeURIComponent(pathname.split("/").pop()) || `${fallbackTitle}.pdf`;
    } catch (error) {
      return `${fallbackTitle}.pdf`;
    }
  }

  function formatUpdatedDate(value) {
    if (!value) return "업데이트 날짜 미등록";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return `업데이트 ${value}`;
    return `업데이트 ${new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date)}`;
  }

  function shouldUseCanvasPreview() {
    return window.matchMedia("(max-width: 800px), (pointer: coarse)").matches;
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
    elements.previewFrame.hidden = true;
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

  function openPreview(material, trigger) {
    const fileUrl = resolveUrl(material.file);
    if (!fileUrl) return;

    const session = ++previewSession;
    lastFocusedElement = trigger || document.activeElement;
    elements.modalTitle.textContent = material.title;
    elements.downloadPreview.href = fileUrl;
    elements.downloadPreview.download = getFileName(material.file, material.title);
    elements.openPreviewNewTab.href = fileUrl;
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleModalKeydown);
    window.requestAnimationFrame(() => elements.closeModal.focus());

    if (shouldUseCanvasPreview()) {
      openCanvasPreview(fileUrl, session);
    } else {
      const previewUrl = new URL(fileUrl);
      previewUrl.hash = "toolbar=1&navpanes=0&view=FitH";
      elements.pdfCanvasViewer.hidden = true;
      elements.previewPagination.hidden = true;
      elements.previewFrame.hidden = false;
      elements.previewFrame.src = previewUrl.href;
    }
  }

  function closePreview() {
    if (elements.modal.hidden) return;

    previewSession += 1;
    renderRequest += 1;
    elements.modal.hidden = true;
    elements.previewFrame.src = "about:blank";
    elements.previewFrame.hidden = false;
    elements.pdfCanvasViewer.hidden = true;
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

  function openAdminAccess() {
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
      window.location.assign(resolveUrl("admin.html"));
      return;
    }

    elements.adminAccessError.textContent = "비밀번호가 올바르지 않습니다.";
    elements.adminAccessPassword.select();
  }

  function handleAdminAccessKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAdminAccess();
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
      closePreview();
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

  elements.closeModal.addEventListener("click", closePreview);
  elements.modal.querySelector("[data-close-modal]").addEventListener("click", closePreview);
  elements.openAdminAccess.addEventListener("click", openAdminAccess);
  elements.adminAccessForm.addEventListener("submit", handleAdminAccessSubmit);
  elements.closeAdminAccess.addEventListener("click", closeAdminAccess);
  elements.cancelAdminAccess.addEventListener("click", closeAdminAccess);
  elements.adminAccessModal.querySelector("[data-close-admin-access]").addEventListener("click", closeAdminAccess);
  elements.previousPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage - 1));
  elements.nextPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage + 1));
  window.addEventListener("resize", () => {
    if (elements.modal.hidden || elements.pdfCanvasViewer.hidden || !pdfDocument) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderPdfPage(currentPdfPage), 180);
  });
  initialize();
})();
