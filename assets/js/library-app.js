(function () {
  "use strict";

  const elements = {
    tabs: document.querySelector("#categoryTabs"),
    panel: document.querySelector("#materialsPanel"),
    grid: document.querySelector("#materialsGrid"),
    empty: document.querySelector("#emptyState"),
    emptyTitle: document.querySelector("#emptyState h3"),
    emptyMessage: document.querySelector("#emptyState p"),
    summary: document.querySelector("#resultSummary"),
    modal: document.querySelector("#previewModal"),
    modalTitle: document.querySelector("#previewTitle"),
    closeModal: document.querySelector("#closePreview"),
    previewFrame: document.querySelector("#previewFrame"),
    downloadPreview: document.querySelector("#downloadPreview"),
    openPreviewNewTab: document.querySelector("#openPreviewNewTab"),
  };

  let categories = [];
  let materials = [];
  let materialTypeMap = new Map();
  let categoryMap = new Map();
  let activeCategory = "all";
  let lastFocusedElement = null;

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

  function getVisibleMaterials() {
    return materials
      .filter((material) => activeCategory === "all" || material.category === activeCategory)
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
    elements.summary.textContent = `${categoryLabel} 자료 ${visibleMaterials.length}건`;
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

  function openPreview(material, trigger) {
    const fileUrl = resolveUrl(material.file);
    if (!fileUrl) return;

    const previewUrl = new URL(fileUrl);
    previewUrl.hash = "toolbar=1&navpanes=0&view=FitH";
    lastFocusedElement = trigger || document.activeElement;
    elements.modalTitle.textContent = material.title;
    elements.previewFrame.src = previewUrl.href;
    elements.downloadPreview.href = fileUrl;
    elements.downloadPreview.download = getFileName(material.file, material.title);
    elements.openPreviewNewTab.href = fileUrl;
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleModalKeydown);
    window.requestAnimationFrame(() => elements.closeModal.focus());
  }

  function closePreview() {
    if (elements.modal.hidden) return;

    elements.modal.hidden = true;
    elements.previewFrame.src = "about:blank";
    elements.downloadPreview.removeAttribute("href");
    elements.openPreviewNewTab.removeAttribute("href");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleModalKeydown);

    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;
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
      const materialTypes = Array.isArray(data.materialTypes) ? data.materialTypes : [];
      categoryMap = new Map(categories.map((category) => [category.id, category]));
      materialTypeMap = new Map(materialTypes.map((type) => [type.id, type]));

      renderTabs();
      renderMaterials();
    } catch (error) {
      console.error("자료 목록을 불러오지 못했습니다.", error);
      renderTabs();
      elements.grid.hidden = true;
      elements.empty.hidden = false;
      elements.emptyTitle.textContent = "자료 목록을 불러오지 못했습니다.";
      elements.emptyMessage.textContent = "잠시 후 새로고침해 주세요.";
      elements.summary.textContent = "자료 목록 오류";
    }
  }

  elements.closeModal.addEventListener("click", closePreview);
  elements.modal.querySelector("[data-close-modal]").addEventListener("click", closePreview);
  initialize();
})();
