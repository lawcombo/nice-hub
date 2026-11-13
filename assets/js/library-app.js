(function () {
  "use strict";

  const elements = {
    tabs: document.querySelector("#categoryTabs"),
    typeTabs: document.querySelector("#materialTypeTabs"),
    categoryTabsShell: document.querySelector("#categoryTabsShell"),
    categoryTabsScroll: document.querySelector("#categoryTabsScroll"),
    categoryTabsProgress: document.querySelector("#categoryTabsProgress"),
    materialTypeTabsShell: document.querySelector("#materialTypeTabsShell"),
    materialTypeTabsScroll: document.querySelector("#materialTypeTabsScroll"),
    materialTypeTabsProgress: document.querySelector("#materialTypeTabsProgress"),
    tabScrollArrows: [...document.querySelectorAll("[data-scroll-target][data-scroll-direction]")],
    materialControls: document.querySelector(".material-controls"),
    footer: document.querySelector(".site-footer"),
    floatingFooterActions: document.querySelector("#floatingFooterActions"),
    viewModeButtons: document.querySelectorAll("[data-view-mode]"),
    openQrBundle: document.querySelector("#openQrBundle"),
    qrBundleModal: document.querySelector("#qrBundleModal"),
    qrBundleDialog: document.querySelector(".qr-bundle-dialog"),
    qrBundleForm: document.querySelector("#qrBundleForm"),
    qrBundleBoardTitle: document.querySelector("#qrBundleBoardTitle"),
    qrBundleSearch: document.querySelector("#qrBundleSearch"),
    qrBundleCategory: document.querySelector("#qrBundleCategory"),
    qrBundleType: document.querySelector("#qrBundleType"),
    qrBundleMaterials: document.querySelector("#qrBundleMaterials"),
    qrBundleMatchCount: document.querySelector("#qrBundleMatchCount"),
    qrBundleEmpty: document.querySelector("#qrBundleEmpty"),
    qrBundleStatus: document.querySelector("#qrBundleStatus"),
    qrBundleToast: document.querySelector("#qrBundleToast"),
    clearQrBundleSelection: document.querySelector("#clearQrBundleSelection"),
    generateQrBundle: document.querySelector("#generateQrBundle"),
    closeQrBundle: document.querySelector("#closeQrBundle"),
    cancelQrBundle: document.querySelector("#cancelQrBundle"),
    panel: document.querySelector("#materialsPanel"),
    grid: document.querySelector("#materialsGrid"),
    pagination: document.querySelector("#materialsPagination"),
    loadMore: document.querySelector("#loadMoreMaterials"),
    endSentinel: document.querySelector("#materialsEndSentinel"),
    endToast: document.querySelector("#materialsEndToast"),
    shareFeedbackToast: document.querySelector("#shareFeedbackToast"),
    materialDescriptionTooltip: document.querySelector("#materialDescriptionTooltip"),
    empty: document.querySelector("#emptyState"),
    emptyTitle: document.querySelector("#emptyState h3"),
    emptyMessage: document.querySelector("#emptyState p"),
    summary: document.querySelector("#resultSummary"),
    searchInput: document.querySelector("#materialSearch"),
    clearSearch: document.querySelector("#clearMaterialSearch"),
    scrollToTop: document.querySelector("#scrollToTop"),
    floatingUtilityDock: document.querySelector("#floatingUtilityDock"),
    openQuickFilter: document.querySelector("#openQuickFilter"),
    quickFilterActiveCount: document.querySelector("#quickFilterActiveCount"),
    quickFilterModal: document.querySelector("#quickFilterModal"),
    quickFilterDialog: document.querySelector(".quick-filter-dialog"),
    quickFilterForm: document.querySelector("#quickFilterForm"),
    quickFilterSearch: document.querySelector("#quickFilterSearch"),
    quickFilterCategories: document.querySelector("#quickFilterCategories"),
    quickFilterTypes: document.querySelector("#quickFilterTypes"),
    quickFilterResult: document.querySelector("#quickFilterResult"),
    resetQuickFilter: document.querySelector("#resetQuickFilter"),
    applyQuickFilter: document.querySelector("#applyQuickFilter"),
    closeQuickFilter: document.querySelector("#closeQuickFilter"),
    openAdminAccess: document.querySelector("#openAdminAccess"),
    floatingOpenAdminAccess: document.querySelector("#floatingOpenAdminAccess"),
    adminAccessModal: document.querySelector("#adminAccessModal"),
    adminAccessForm: document.querySelector("#adminAccessForm"),
    adminAccessPassword: document.querySelector("#adminAccessPassword"),
    adminAccessError: document.querySelector("#adminAccessError"),
    closeAdminAccess: document.querySelector("#closeAdminAccess"),
    cancelAdminAccess: document.querySelector("#cancelAdminAccess"),
    materialSecurityModal: document.querySelector("#materialSecurityModal"),
    materialSecurityForm: document.querySelector("#materialSecurityForm"),
    materialSecurityName: document.querySelector("#materialSecurityName"),
    materialSecurityPassword: document.querySelector("#materialSecurityPassword"),
    materialSecurityError: document.querySelector("#materialSecurityError"),
    closeMaterialSecurity: document.querySelector("#closeMaterialSecurity"),
    cancelMaterialSecurity: document.querySelector("#cancelMaterialSecurity"),
    qrModal: document.querySelector("#qrModal"),
    qrModalTitle: document.querySelector("#qrModalTitle"),
    qrModalCode: document.querySelector("#qrModalCode"),
    closeQrModal: document.querySelector("#closeQrModal"),
    modal: document.querySelector("#previewModal"),
    previewTypeLabel: document.querySelector("#previewTypeLabel"),
    modalTitle: document.querySelector("#previewTitle"),
    closeModal: document.querySelector("#closePreview"),
    pdfCanvasViewer: document.querySelector("#pdfCanvasViewer"),
    pdfPreviewStatus: document.querySelector("#pdfPreviewStatus"),
    pdfPreviewPlaceholder: document.querySelector("#pdfPreviewPlaceholder"),
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
  let activeViewMode = getSavedViewMode();
  let visibleMaterialCount = 12;
  let hasMoreMaterialsAvailable = false;
  let hasAnnouncedMaterialEnd = false;
  let endToastTimer = 0;
  let shareToastTimer = 0;
  let shareToastCleanupTimer = 0;
  let lastFocusedElement = null;
  let pdfJsModulePromise = null;
  let pdfViewerWarmupScheduled = false;
  let pdfDocument = null;
  let pdfLoadingTask = null;
  let pdfRenderTask = null;
  let currentPdfPage = 1;
  let previewSession = 0;
  let renderRequest = 0;
  let resizeTimer = null;
  let lastAccessFocusedElement = null;
  let lastSecurityFocusedElement = null;
  let pendingSecurityAction = null;
  let lastVideoFocusedElement = null;
  let lastQrFocusedElement = null;
  let pendingHistoryModalClose = "";
  let exitGuardEnabled = false;
  let quickFilterDraftCategory = "all";
  let quickFilterDraftType = "all";
  let lastQuickFilterFocusedElement = null;
  let quickFilterVisibilityFrame = 0;
  let descriptionTooltipMeasureFrame = 0;
  let activeDescriptionTooltipTarget = null;
  let lastQrBundleFocusedElement = null;
  let qrBundleToastTimer = 0;
  const qrBundleSelectedIds = new Set();

  const adminAccessPassword = "5959";
  const materialSecurityPassword = "1004";
  const modalHistoryKey = "niceHubModal";
  const exitGuardHistoryKey = "niceHubExitGuard";
  const exitBaseHistoryKey = "niceHubExitBase";
  const viewModeStorageKey = "niceHubViewMode";
  const materialsPageSize = 12;
  const qrBundleSelectionLimit = 10;

  function getSavedViewMode() {
    try {
      return window.localStorage.getItem("niceHubViewMode") === "list" ? "list" : "card";
    } catch (error) {
      return "card";
    }
  }

  function setViewMode(viewMode, persist = true) {
    hideMaterialDescriptionTooltip();
    activeViewMode = viewMode === "list" ? "list" : "card";
    elements.grid.classList.toggle("is-list-view", activeViewMode === "list");
    elements.viewModeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.viewMode === activeViewMode ? "true" : "false");
    });
    scheduleDescriptionTooltipMeasurement();

    if (!persist) return;
    try {
      window.localStorage.setItem(viewModeStorageKey, activeViewMode);
    } catch (error) {
      console.warn("보기 방식을 저장하지 못했습니다.", error);
    }
  }

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
    if (!elements.qrBundleModal.hidden) {
      closeQrBundle();
      return true;
    }
    if (!elements.quickFilterModal.hidden) {
      closeQuickFilter();
      return true;
    }
    if (!elements.modal.hidden) {
      closePreview();
      return true;
    }
    if (!elements.qrModal.hidden) {
      closeQrModal();
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
    if (!elements.materialSecurityModal.hidden) {
      closeMaterialSecurity();
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

  function materialMatchesSearch(material, search) {
    if (!search) return true;
    return [material?.title, material?.description].some((value) =>
      String(value || "").toLocaleLowerCase("ko").includes(search),
    );
  }

  function appendHighlightedText(element, value) {
    const text = String(value || "");
    const query = elements.searchInput.value.trim();
    if (!activeSearch || !query) {
      element.textContent = text;
      return element;
    }

    const normalizedText = text.toLocaleLowerCase("ko");
    const normalizedQuery = query.toLocaleLowerCase("ko");
    let cursor = 0;
    let matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
    while (matchIndex !== -1) {
      if (matchIndex > cursor) element.appendChild(document.createTextNode(text.slice(cursor, matchIndex)));
      const mark = createElement("mark", "search-highlight", text.slice(matchIndex, matchIndex + query.length));
      element.appendChild(mark);
      cursor = matchIndex + query.length;
      matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
    }
    if (cursor < text.length) element.appendChild(document.createTextNode(text.slice(cursor)));
    return element;
  }

  function updateTabScroller(scroller, shell, progress) {
    if (!scroller || !shell || !progress) return;
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const scrollable = maxScroll > 3;
    const currentScroll = Math.min(maxScroll, Math.max(0, scroller.scrollLeft));
    const canScrollLeft = scrollable && currentScroll > 2;
    const canScrollRight = scrollable && currentScroll < maxScroll - 2;
    const thumbWidth = scrollable ? Math.max(12, (scroller.clientWidth / scroller.scrollWidth) * 100) : 100;
    const thumbLeft = scrollable ? (currentScroll / scroller.scrollWidth) * 100 : 0;

    shell.classList.toggle("is-scrollable", scrollable);
    shell.classList.toggle("can-scroll-left", canScrollLeft);
    shell.classList.toggle("can-scroll-right", canScrollRight);
    progress.style.width = `${thumbWidth}%`;
    progress.style.left = `${thumbLeft}%`;

    shell.querySelectorAll("[data-scroll-direction]").forEach((button) => {
      const direction = Number(button.dataset.scrollDirection);
      button.hidden = direction < 0 ? !canScrollLeft : !canScrollRight;
    });
  }

  function updateAllTabScrollers() {
    updateTabScroller(elements.categoryTabsScroll, elements.categoryTabsShell, elements.categoryTabsProgress);
    updateTabScroller(elements.materialTypeTabsScroll, elements.materialTypeTabsShell, elements.materialTypeTabsProgress);
  }

  function centerSelectedTab(button, scroller) {
    if (!button || !scroller) return;
    const desiredLeft = button.offsetLeft - (scroller.clientWidth - button.offsetWidth) / 2;
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    scroller.scrollTo({ left: Math.min(maxScroll, Math.max(0, desiredLeft)), behavior: "smooth" });
  }

  function scrollTabStrip(button) {
    const target = document.querySelector(`#${CSS.escape(button.dataset.scrollTarget || "")}`);
    if (!target) return;
    const direction = Number(button.dataset.scrollDirection) || 1;
    target.scrollBy({ left: direction * Math.max(180, target.clientWidth * 0.68), behavior: "smooth" });
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

  function isSecureMaterial(material) {
    return material?.isSecure === true;
  }

  function getOfficeFormat(material) {
    const format = String(material?.format || "").toLowerCase();
    if (["ppt", "pptx", "doc", "docx"].includes(format)) return format;
    return String(material?.file || "").match(/\.(pptx?|docx?)(?:[?#].*)?$/i)?.[1]?.toLowerCase() || "";
  }

  function getMaterialFileKindLabel(material) {
    const format = String(material?.format || "").toLowerCase();
    const officeFormat = getOfficeFormat(material);
    if (format === "pdf") return "PDF";
    if (officeFormat) return officeFormat.toUpperCase();
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

  function isDisplayableMaterial(material) {
    return Boolean(material && material.id && material.title && material.file && material.isPublished !== false);
  }

  function renderTabs() {
    const tabItems = [{ id: "all", label: "전체" }, ...categories];
    const fragment = document.createDocumentFragment();

    tabItems.forEach((category) => {
      const count = materials.filter(
        (material) =>
          isDisplayableMaterial(material) &&
          (category.id === "all" || material.category === category.id),
      ).length;
      const button = createElement("button", "tab-button");
      button.append(
        document.createTextNode(category.label),
        createElement("span", "tab-button-count", `(${count})`),
      );
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
    window.requestAnimationFrame(updateAllTabScrollers);
  }

  function renderMaterialTypeTabs() {
    const typeItems = [{ id: "all", label: "전체 자료" }, ...materialTypes];
    const fragment = document.createDocumentFragment();

    typeItems.forEach((type) => {
      const count = materials.filter(
        (material) =>
          isDisplayableMaterial(material) &&
          (activeCategory === "all" || material.category === activeCategory) &&
          (type.id === "all" || material.type === type.id),
      ).length;
      const button = createElement("button", "material-type-button");
      button.append(
        document.createTextNode(type.label),
        createElement("span", "material-type-count", `(${count})`),
      );
      button.type = "button";
      button.dataset.materialType = type.id;
      button.setAttribute("aria-pressed", type.id === activeMaterialType ? "true" : "false");
      button.addEventListener("click", () => selectMaterialType(type.id));
      fragment.appendChild(button);
    });

    elements.typeTabs.replaceChildren(fragment);
    window.requestAnimationFrame(updateAllTabScrollers);
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
    resetMaterialPagination();

    elements.tabs.querySelectorAll('[role="tab"]').forEach((tab) => {
      const selected = tab.dataset.category === categoryId;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });

    const selectedTab = elements.tabs.querySelector(`[data-category="${CSS.escape(categoryId)}"]`);
    if (selectedTab) elements.panel.setAttribute("aria-labelledby", selectedTab.id);
    centerSelectedTab(selectedTab, elements.categoryTabsScroll);
    renderMaterialTypeTabs();
    renderMaterials();
    updateQuickFilterActiveCount();
  }

  function selectMaterialType(typeId) {
    activeMaterialType = typeId;
    resetMaterialPagination();
    elements.typeTabs.querySelectorAll("[data-material-type]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.materialType === typeId ? "true" : "false");
    });
    const selectedType = elements.typeTabs.querySelector(`[data-material-type="${CSS.escape(typeId)}"]`);
    centerSelectedTab(selectedType, elements.materialTypeTabsScroll);
    renderMaterials();
    updateQuickFilterActiveCount();
  }

  function getVisibleMaterials() {
    return materials
      .filter(isDisplayableMaterial)
      .filter((material) => activeCategory === "all" || material.category === activeCategory)
      .filter((material) => activeMaterialType === "all" || material.type === activeMaterialType)
      .filter((material) => materialMatchesSearch(material, activeSearch))
      .sort((a, b) => {
        const registrationDifference = getRegistrationTime(b) - getRegistrationTime(a);
        return registrationDifference || String(b.id || "").localeCompare(String(a.id || ""), "ko");
      });
  }

  function getQuickFilterMatchCount() {
    const search = elements.quickFilterSearch.value.trim().toLocaleLowerCase("ko");
    return materials.filter(
      (material) =>
        isDisplayableMaterial(material) &&
        (quickFilterDraftCategory === "all" || material.category === quickFilterDraftCategory) &&
        (quickFilterDraftType === "all" || material.type === quickFilterDraftType) &&
        materialMatchesSearch(material, search),
    ).length;
  }

  function updateQuickFilterResult() {
    const categoryLabel = quickFilterDraftCategory === "all" ? "전체 사업" : getCategoryLabel(quickFilterDraftCategory);
    const typeLabel = quickFilterDraftType === "all" ? "전체 자료" : getTypeLabel(quickFilterDraftType);
    const matchCount = getQuickFilterMatchCount();
    elements.quickFilterResult.textContent = `${categoryLabel} · ${typeLabel} · ${matchCount}건`;
    elements.applyQuickFilter.textContent = `자료 ${matchCount}건 보기`;
  }

  function updateQuickFilterActiveCount() {
    const activeCount =
      Number(Boolean(elements.searchInput.value.trim())) +
      Number(activeCategory !== "all") +
      Number(activeMaterialType !== "all");
    elements.quickFilterActiveCount.textContent = String(activeCount);
    elements.quickFilterActiveCount.hidden = activeCount === 0;
    scheduleQuickFilterFloatingVisibility();
  }

  function setQuickFilterDraft(group, value) {
    if (group === "category") quickFilterDraftCategory = value;
    else quickFilterDraftType = value;

    const container = group === "category" ? elements.quickFilterCategories : elements.quickFilterTypes;
    container.querySelectorAll("[data-filter-value]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.filterValue === value ? "true" : "false");
    });
    centerQuickFilterOption(container, value);
    updateQuickFilterResult();
  }

  function centerQuickFilterOption(container, value) {
    const selected = container.querySelector(`[data-filter-value="${CSS.escape(value)}"]`);
    if (!selected) return;
    const desiredLeft = selected.offsetLeft - (container.clientWidth - selected.offsetWidth) / 2;
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    container.scrollTo({ left: Math.min(maxScroll, Math.max(0, desiredLeft)), behavior: "smooth" });
  }

  function renderQuickFilterOptions(container, items, selectedValue, group) {
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const button = createElement("button", "quick-filter-option", item.label);
      button.type = "button";
      button.dataset.filterValue = item.id;
      button.setAttribute("aria-pressed", item.id === selectedValue ? "true" : "false");
      button.addEventListener("click", () => setQuickFilterDraft(group, item.id));
      fragment.appendChild(button);
    });
    container.replaceChildren(fragment);
    window.requestAnimationFrame(() => centerQuickFilterOption(container, selectedValue));
  }

  function syncQuickFilterDialog() {
    quickFilterDraftCategory = activeCategory;
    quickFilterDraftType = activeMaterialType;
    elements.quickFilterSearch.value = elements.searchInput.value;
    renderQuickFilterOptions(
      elements.quickFilterCategories,
      [{ id: "all", label: "전체" }, ...categories],
      quickFilterDraftCategory,
      "category",
    );
    renderQuickFilterOptions(
      elements.quickFilterTypes,
      [{ id: "all", label: "전체 자료" }, ...materialTypes],
      quickFilterDraftType,
      "type",
    );
    updateQuickFilterResult();
  }

  function openQuickFilter() {
    if (!elements.quickFilterModal.hidden) return;
    pushModalHistory("quick-filter");
    lastQuickFilterFocusedElement = document.activeElement;
    syncQuickFilterDialog();
    elements.quickFilterModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleQuickFilterKeydown);
    window.requestAnimationFrame(() => {
      positionQuickFilterDialog();
      elements.quickFilterSearch.focus();
    });
  }

  function closeQuickFilter() {
    if (elements.quickFilterModal.hidden) return;
    elements.quickFilterModal.hidden = true;
    resetQuickFilterDialogPosition();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleQuickFilterKeydown);
    if (lastQuickFilterFocusedElement && document.contains(lastQuickFilterFocusedElement)) {
      lastQuickFilterFocusedElement.focus();
    }
    lastQuickFilterFocusedElement = null;
  }

  function resetQuickFilterDialogPosition() {
    ["top", "right", "bottom", "left", "width", "maxHeight"].forEach((property) => {
      elements.quickFilterDialog.style[property] = "";
    });
    elements.quickFilterDialog.classList.remove("opens-downward");
  }

  function positionQuickFilterDialog() {
    resetQuickFilterDialogPosition();
    if (window.matchMedia("(max-width: 620px)").matches || elements.quickFilterModal.hidden) return;

    const buttonRect = elements.openQuickFilter.getBoundingClientRect();
    const viewportPadding = 16;
    const gap = 11;
    const dialogWidth = Math.min(420, window.innerWidth - viewportPadding * 2);
    elements.quickFilterDialog.style.width = `${dialogWidth}px`;
    elements.quickFilterDialog.style.right = `${Math.max(viewportPadding, window.innerWidth - buttonRect.right)}px`;

    const preferredHeight = Math.min(elements.quickFilterDialog.scrollHeight, Math.round(window.innerHeight * 0.76));
    const spaceAbove = buttonRect.top - gap - viewportPadding;
    const spaceBelow = window.innerHeight - buttonRect.bottom - gap - viewportPadding;
    if (spaceAbove >= Math.min(preferredHeight, 420) || spaceAbove >= spaceBelow) {
      elements.quickFilterDialog.style.bottom = `${window.innerHeight - buttonRect.top + gap}px`;
      elements.quickFilterDialog.style.maxHeight = `${Math.max(240, spaceAbove)}px`;
      return;
    }

    elements.quickFilterDialog.classList.add("opens-downward");
    elements.quickFilterDialog.style.top = `${buttonRect.bottom + gap}px`;
    elements.quickFilterDialog.style.maxHeight = `${Math.max(240, spaceBelow)}px`;
  }

  function resetQuickFilter() {
    quickFilterDraftCategory = "all";
    quickFilterDraftType = "all";
    elements.quickFilterSearch.value = "";
    renderQuickFilterOptions(
      elements.quickFilterCategories,
      [{ id: "all", label: "전체" }, ...categories],
      quickFilterDraftCategory,
      "category",
    );
    renderQuickFilterOptions(
      elements.quickFilterTypes,
      [{ id: "all", label: "전체 자료" }, ...materialTypes],
      quickFilterDraftType,
      "type",
    );
    updateQuickFilterResult();
    elements.quickFilterSearch.focus();
  }

  function applyQuickFilter(event) {
    event.preventDefault();
    activeCategory = quickFilterDraftCategory;
    activeMaterialType = quickFilterDraftType;
    elements.searchInput.value = elements.quickFilterSearch.value.trim();
    activeSearch = elements.searchInput.value.toLocaleLowerCase("ko");
    elements.clearSearch.hidden = !elements.searchInput.value;
    resetMaterialPagination();

    elements.tabs.querySelectorAll('[role="tab"]').forEach((tab) => {
      const selected = tab.dataset.category === activeCategory;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    renderMaterialTypeTabs();
    elements.typeTabs.querySelectorAll("[data-material-type]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.materialType === activeMaterialType ? "true" : "false");
    });

    const selectedCategory = elements.tabs.querySelector(`[data-category="${CSS.escape(activeCategory)}"]`);
    const selectedType = elements.typeTabs.querySelector(`[data-material-type="${CSS.escape(activeMaterialType)}"]`);
    if (selectedCategory) elements.panel.setAttribute("aria-labelledby", selectedCategory.id);
    centerSelectedTab(selectedCategory, elements.categoryTabsScroll);
    centerSelectedTab(selectedType, elements.materialTypeTabsScroll);
    renderMaterials();
    updateQuickFilterActiveCount();

    if (getHistoryState()[modalHistoryKey] === "quick-filter") {
      history.replaceState({ ...getHistoryState(), [modalHistoryKey]: "" }, "", window.location.href);
    }
    closeQuickFilter();
    window.requestAnimationFrame(() => elements.panel.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function handleQuickFilterKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("quick-filter", closeQuickFilter);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [
      ...elements.quickFilterModal.querySelectorAll('button:not([disabled]), input:not([disabled])'),
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

  function populateQrBundleSelect(select, items, allLabel) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(new Option(allLabel, "all"));
    items.forEach((item) => fragment.appendChild(new Option(item.label, item.id)));
    select.replaceChildren(fragment);
    select.value = "all";
  }

  function getQrBundleMatches() {
    const search = elements.qrBundleSearch.value.trim().toLocaleLowerCase("ko");
    const category = elements.qrBundleCategory.value || "all";
    const type = elements.qrBundleType.value || "all";
    return materials
      .filter(isDisplayableMaterial)
      .filter((material) => category === "all" || material.category === category)
      .filter((material) => type === "all" || material.type === type)
      .filter((material) => materialMatchesSearch(material, search))
      .sort((a, b) => {
        const registrationDifference = getRegistrationTime(b) - getRegistrationTime(a);
        return registrationDifference || String(b.id || "").localeCompare(String(a.id || ""), "ko");
      });
  }

  function updateQrBundleStatus(message = "") {
    const selectedCount = qrBundleSelectedIds.size;
    const reachedLimit = selectedCount >= qrBundleSelectionLimit;
    const strong = elements.qrBundleStatus.querySelector("strong");
    const detail = elements.qrBundleStatus.querySelector("span");
    strong.textContent = `${selectedCount}개 선택됨`;
    detail.textContent = message || (reachedLimit ? "최대 10개를 모두 선택했습니다." : "최대 10개까지 선택할 수 있습니다.");
    elements.qrBundleStatus.classList.toggle("is-limit", reachedLimit || Boolean(message));
    elements.clearQrBundleSelection.disabled = selectedCount === 0;
  }

  function hideQrBundleToast() {
    window.clearTimeout(qrBundleToastTimer);
    elements.qrBundleToast.hidden = true;
  }

  function showQrBundleToast(message) {
    window.clearTimeout(qrBundleToastTimer);
    elements.qrBundleToast.textContent = message;
    elements.qrBundleToast.hidden = false;
    qrBundleToastTimer = window.setTimeout(() => {
      elements.qrBundleToast.hidden = true;
    }, 2200);
  }

  function toggleQrBundleMaterial(materialId, button) {
    hideQrBundleToast();
    if (qrBundleSelectedIds.has(materialId)) {
      qrBundleSelectedIds.delete(materialId);
    } else if (qrBundleSelectedIds.size >= qrBundleSelectionLimit) {
      updateQrBundleStatus("최대 10개까지 선택할 수 있습니다.");
      showQrBundleToast("자료는 최대 10개까지 선택할 수 있습니다.");
      return;
    } else {
      qrBundleSelectedIds.add(materialId);
    }

    const selected = qrBundleSelectedIds.has(materialId);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    const materialTitle = button.querySelector(".qr-bundle-material-copy strong")?.textContent || "자료";
    button.setAttribute("aria-label", `${materialTitle} ${selected ? "선택 해제" : "선택"}`);
    button.querySelector(".qr-bundle-material-check").textContent = selected ? "✓" : "";
    updateQrBundleStatus();
  }

  function createQrBundleMaterialOption(material) {
    const selected = qrBundleSelectedIds.has(material.id);
    const button = createElement("button", "qr-bundle-material-option");
    button.type = "button";
    button.dataset.materialId = material.id;
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.setAttribute("aria-label", `${material.title} ${selected ? "선택 해제" : "선택"}`);

    const thumbnail = document.createElement("img");
    thumbnail.className = "qr-bundle-material-thumbnail";
    thumbnail.src = resolveUrl(material.thumbnail || "assets/icons/app-icon-192.png");
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    thumbnail.addEventListener("error", () => {
      thumbnail.src = resolveUrl("assets/icons/app-icon-192.png");
    }, { once: true });

    const copy = createElement("span", "qr-bundle-material-copy");
    const meta = `${getCategoryLabel(material.category)} · ${getTypeLabel(material.type)}${isSecureMaterial(material) ? " · 보안 문서" : ""}`;
    copy.append(createElement("strong", "", material.title), createElement("small", "", meta));
    const check = createElement("span", "qr-bundle-material-check", selected ? "✓" : "");
    check.setAttribute("aria-hidden", "true");
    button.append(thumbnail, copy, check);
    button.addEventListener("click", () => toggleQrBundleMaterial(material.id, button));
    return button;
  }

  function renderQrBundleMaterials() {
    const matches = getQrBundleMatches();
    const fragment = document.createDocumentFragment();
    matches.forEach((material) => fragment.appendChild(createQrBundleMaterialOption(material)));
    elements.qrBundleMaterials.replaceChildren(fragment);
    elements.qrBundleMatchCount.textContent = `${matches.length}건`;
    elements.qrBundleMaterials.classList.toggle("is-scrollable", matches.length > 10);
    elements.qrBundleMaterials.hidden = matches.length === 0;
    elements.qrBundleEmpty.hidden = matches.length !== 0;
    updateQrBundleStatus();
  }

  function syncQrBundleDialog() {
    elements.qrBundleBoardTitle.value = "NICE HUB 추천자료";
    elements.qrBundleSearch.value = "";
    populateQrBundleSelect(elements.qrBundleCategory, categories, "전체 사업");
    populateQrBundleSelect(elements.qrBundleType, materialTypes, "전체 자료");
    qrBundleSelectedIds.clear();
    renderQrBundleMaterials();
  }

  function openQrBundle() {
    if (!elements.qrBundleModal.hidden) return;
    pushModalHistory("qr-bundle");
    lastQrBundleFocusedElement = document.activeElement;
    syncQrBundleDialog();
    hideQrBundleToast();
    elements.qrBundleModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleQrBundleKeydown);
    window.requestAnimationFrame(() => elements.qrBundleDialog.focus({ preventScroll: true }));
  }

  function closeQrBundle() {
    if (elements.qrBundleModal.hidden) return;
    elements.qrBundleModal.hidden = true;
    hideQrBundleToast();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleQrBundleKeydown);
    if (lastQrBundleFocusedElement && document.contains(lastQrBundleFocusedElement)) {
      lastQrBundleFocusedElement.focus();
    }
    lastQrBundleFocusedElement = null;
  }

  function clearQrBundleSelection() {
    qrBundleSelectedIds.clear();
    elements.qrBundleMaterials.querySelectorAll(".qr-bundle-material-option").forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      const materialTitle = button.querySelector(".qr-bundle-material-copy strong")?.textContent || "자료";
      button.setAttribute("aria-label", `${materialTitle} 선택`);
      button.querySelector(".qr-bundle-material-check").textContent = "";
    });
    updateQrBundleStatus();
  }

  function generateQrBundle(event) {
    event.preventDefault();
    const selectedIds = [...qrBundleSelectedIds].filter((id) =>
      materials.some((material) => material.id === id && isDisplayableMaterial(material)),
    );
    if (!selectedIds.length) {
      showQrBundleToast("자료를 선택해 주세요.");
      return;
    }

    const url = new URL("qr-bundle.html", document.baseURI);
    url.searchParams.set("ids", selectedIds.join(","));
    const boardTitle = elements.qrBundleBoardTitle.value.trim();
    if (boardTitle) url.searchParams.set("title", boardTitle);

    const bundleWindow = window.open(url.href, "_blank");
    if (bundleWindow) {
      bundleWindow.opener = null;
      requestModalClose("qr-bundle", closeQrBundle);
    } else {
      window.location.assign(url.href);
    }
  }

  function handleQrBundleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("qr-bundle", closeQrBundle);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [
      ...elements.qrBundleDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled])'),
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

  function updateQuickFilterFloatingVisibility() {
    quickFilterVisibilityFrame = 0;
    const controlsRect = elements.materialControls.getBoundingClientRect();
    const panelRect = elements.panel.getBoundingClientRect();
    const footerRect = elements.footer.getBoundingClientRect();
    const footerLift = Math.max(0, Math.min(footerRect.height, window.innerHeight - footerRect.top));
    const footerVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;
    const floatingToolsHidden = controlsRect.bottom >= 12;
    elements.openQuickFilter.hidden = floatingToolsHidden;
    elements.openQuickFilter.style.setProperty("--quick-filter-footer-lift", `${footerLift}px`);
    elements.scrollToTop.hidden = floatingToolsHidden;
    elements.scrollToTop.style.setProperty("--quick-filter-footer-lift", `${footerLift}px`);
    elements.scrollToTop.style.setProperty(
      "--quick-filter-button-width",
      `${elements.openQuickFilter.hidden ? 0 : elements.openQuickFilter.getBoundingClientRect().width}px`,
    );
    elements.openQuickFilter.classList.toggle("is-footer-visible", footerRect.top < window.innerHeight);
    const dockRect = elements.floatingUtilityDock.getBoundingClientRect();
    const lastCardRect = elements.grid.lastElementChild?.getBoundingClientRect();
    if (dockRect.width > 0 && dockRect.height > 0) {
      const gridRect = elements.grid.getBoundingClientRect();
      const sideGap = 10;
      const viewportGap = 18;
      const desiredLeft = gridRect.right + sideGap;
      const maximumLeft = window.innerWidth - dockRect.width - viewportGap;
      const hasSideRoom = desiredLeft <= maximumLeft;
      const dockLeft = Math.max(viewportGap, Math.min(desiredLeft, maximumLeft));
      const viewportDockTop = window.innerHeight - dockRect.height - 22;
      const cardAlignedTop = lastCardRect ? lastCardRect.bottom - dockRect.height : viewportDockTop;
      const belowCardTop = lastCardRect ? lastCardRect.bottom + sideGap : viewportDockTop;
      const dockTop = Math.max(16, Math.min(viewportDockTop, hasSideRoom ? cardAlignedTop : belowCardTop));
      elements.floatingUtilityDock.style.setProperty("--floating-utility-left", `${dockLeft}px`);
      elements.floatingUtilityDock.style.setProperty("--floating-utility-top", `${dockTop}px`);
    }
    elements.floatingFooterActions.style.setProperty("--floating-actions-top", `${Math.max(16, panelRect.top)}px`);
    elements.floatingFooterActions.classList.add("is-positioned");
    elements.floatingFooterActions.classList.toggle("is-footer-visible", footerVisible);
    if (!elements.quickFilterModal.hidden) positionQuickFilterDialog();
  }

  function scheduleQuickFilterFloatingVisibility() {
    if (quickFilterVisibilityFrame) return;
    quickFilterVisibilityFrame = window.requestAnimationFrame(updateQuickFilterFloatingVisibility);
  }

  function scrollPageToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
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
    hideMaterialDescriptionTooltip();
    const filteredMaterials = getVisibleMaterials();
    const visibleMaterials = filteredMaterials.slice(0, visibleMaterialCount);
    const fragment = document.createDocumentFragment();

    visibleMaterials.forEach((material) => fragment.appendChild(createMaterialCard(material)));
    elements.grid.replaceChildren(fragment);
    const hasMaterials = filteredMaterials.length !== 0;
    const hasMoreMaterials = visibleMaterials.length < filteredMaterials.length;
    hasMoreMaterialsAvailable = hasMoreMaterials;
    elements.grid.hidden = !hasMaterials;
    elements.empty.hidden = hasMaterials;
    elements.pagination.hidden = !hasMaterials;
    elements.loadMore.hidden = !hasMoreMaterials;
    elements.endSentinel.hidden = hasMoreMaterials;
    elements.emptyTitle.textContent = activeSearch ? "검색 결과가 없습니다." : "등록된 자료가 없습니다.";
    elements.emptyMessage.textContent = activeSearch
      ? "다른 검색어를 입력하거나 사업·자료 유형을 변경해 보세요."
      : "자료를 준비 중입니다.";

    const categoryLabel = activeCategory === "all" ? "전체" : getCategoryLabel(activeCategory);
    const typeLabel = activeMaterialType === "all" ? "전체 유형" : getTypeLabel(activeMaterialType);
    elements.summary.textContent = activeSearch
      ? `‘${elements.searchInput.value.trim()}’ 검색 결과 ${filteredMaterials.length}건`
      : `${categoryLabel} · ${typeLabel} 자료 ${filteredMaterials.length}건`;
    scheduleDescriptionTooltipMeasurement();
    scheduleQuickFilterFloatingVisibility();
  }

  function supportsDescriptionHover() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function isDescriptionTruncated(description) {
    return description.scrollHeight > description.clientHeight + 1 || description.scrollWidth > description.clientWidth + 1;
  }

  function hideMaterialDescriptionTooltip(target = activeDescriptionTooltipTarget) {
    if (!activeDescriptionTooltipTarget || (target && target !== activeDescriptionTooltipTarget)) return;
    activeDescriptionTooltipTarget.removeAttribute("aria-describedby");
    activeDescriptionTooltipTarget = null;
    elements.materialDescriptionTooltip.classList.remove("is-visible", "is-above");
    elements.materialDescriptionTooltip.hidden = true;
  }

  function positionMaterialDescriptionTooltip(target) {
    if (!target || target !== activeDescriptionTooltipTarget || elements.materialDescriptionTooltip.hidden) return;
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = elements.materialDescriptionTooltip.getBoundingClientRect();
    const viewportGap = 12;
    const targetGap = 9;
    const showAbove = targetRect.bottom + targetGap + tooltipRect.height > window.innerHeight - viewportGap;
    const top = showAbove
      ? Math.max(viewportGap, targetRect.top - tooltipRect.height - targetGap)
      : Math.min(window.innerHeight - tooltipRect.height - viewportGap, targetRect.bottom + targetGap);
    const centeredLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
    const left = Math.min(
      window.innerWidth - tooltipRect.width - viewportGap,
      Math.max(viewportGap, centeredLeft),
    );
    elements.materialDescriptionTooltip.classList.toggle("is-above", showAbove);
    elements.materialDescriptionTooltip.style.left = `${left}px`;
    elements.materialDescriptionTooltip.style.top = `${top}px`;
  }

  function showMaterialDescriptionTooltip(target) {
    if (!supportsDescriptionHover() || !target.classList.contains("has-description-tooltip")) return;
    if (activeDescriptionTooltipTarget && activeDescriptionTooltipTarget !== target) {
      activeDescriptionTooltipTarget.removeAttribute("aria-describedby");
    }
    activeDescriptionTooltipTarget = target;
    elements.materialDescriptionTooltip.textContent = target.dataset.fullDescription || target.textContent.trim();
    elements.materialDescriptionTooltip.hidden = false;
    target.setAttribute("aria-describedby", "materialDescriptionTooltip");
    positionMaterialDescriptionTooltip(target);
    window.requestAnimationFrame(() => {
      if (activeDescriptionTooltipTarget === target && !elements.materialDescriptionTooltip.hidden) {
        elements.materialDescriptionTooltip.classList.add("is-visible");
      }
    });
  }

  function updateDescriptionTooltipTargets() {
    descriptionTooltipMeasureFrame = 0;
    const hoverSupported = supportsDescriptionHover();
    elements.grid.querySelectorAll(".material-description").forEach((description) => {
      const truncated = hoverSupported && isDescriptionTruncated(description);
      description.classList.toggle("has-description-tooltip", truncated);
      if (truncated) description.tabIndex = 0;
      else description.removeAttribute("tabindex");
      if (!truncated && activeDescriptionTooltipTarget === description) hideMaterialDescriptionTooltip(description);
    });
  }

  function scheduleDescriptionTooltipMeasurement() {
    if (descriptionTooltipMeasureFrame) window.cancelAnimationFrame(descriptionTooltipMeasureFrame);
    descriptionTooltipMeasureFrame = window.requestAnimationFrame(updateDescriptionTooltipTargets);
  }

  function updateSearch() {
    activeSearch = elements.searchInput.value.trim().toLocaleLowerCase("ko");
    resetMaterialPagination();
    elements.clearSearch.hidden = !elements.searchInput.value;
    renderMaterials();
    updateQuickFilterActiveCount();
  }

  function resetMaterialPagination() {
    visibleMaterialCount = materialsPageSize;
    hasAnnouncedMaterialEnd = false;
    hideMaterialEndToast();
  }

  function loadMoreMaterials() {
    visibleMaterialCount += materialsPageSize;
    renderMaterials();
  }

  function showMaterialEndToast() {
    if (hasAnnouncedMaterialEnd || hasMoreMaterialsAvailable || elements.endSentinel.hidden || window.scrollY <= 0) return;
    hasAnnouncedMaterialEnd = true;
    window.clearTimeout(endToastTimer);
    elements.endToast.hidden = false;
    elements.endToast.classList.add("avoid-quick-filter");
    window.requestAnimationFrame(() => elements.endToast.classList.add("is-visible"));
    endToastTimer = window.setTimeout(hideMaterialEndToast, 2200);
  }

  function hideMaterialEndToast() {
    window.clearTimeout(endToastTimer);
    elements.endToast.classList.remove("is-visible");
    endToastTimer = window.setTimeout(() => {
      if (!elements.endToast.classList.contains("is-visible")) {
        elements.endToast.hidden = true;
        elements.endToast.classList.remove("avoid-quick-filter");
      }
    }, 220);
  }

  function initializeMaterialEndObserver() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) showMaterialEndToast();
        },
        { rootMargin: "0px 0px 80px" },
      );
      observer.observe(elements.endSentinel);
      return;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (elements.endSentinel.getBoundingClientRect().top <= window.innerHeight + 80) showMaterialEndToast();
      },
      { passive: true },
    );
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

    if (material.thumbnail) {
      const loading = createThumbnailLoading();
      const image = document.createElement("img");
      image.className = "thumbnail-image";
      image.alt = `${material.title} 표지`;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => {
        loading.remove();
        image.classList.add("is-loaded");
      });
      image.addEventListener("error", () => {
        loading.remove();
        image.remove();
        thumbnail.appendChild(createThumbnailFallback(material));
      });
      thumbnail.append(loading, image);
      image.src = resolveUrl(material.thumbnail);
    } else {
      thumbnail.appendChild(createThumbnailFallback(material));
    }
    if (isSecureMaterial(material)) {
      thumbnail.appendChild(createSecurityLabel());
    }

    const body = createElement("div", "card-body");
    const meta = createElement("div", "card-meta");
    meta.append(
      createElement("span", "badge", getCategoryLabel(material.category)),
      createElement("span", "badge badge-subtle", getTypeLabel(material.type)),
    );

    const title = appendHighlightedText(createElement("h3", "material-title"), material.title);
    const heading = createElement("div", "card-heading-content");
    heading.append(meta, title);
    const description = appendHighlightedText(
      createElement("p", "material-description"),
      material.description || "자료의 자세한 내용은 파일에서 확인해 주세요.",
    );
    description.dataset.fullDescription = material.description || "자료의 자세한 내용은 파일에서 확인해 주세요.";
    description.addEventListener("mouseenter", () => showMaterialDescriptionTooltip(description));
    description.addEventListener("mouseleave", () => hideMaterialDescriptionTooltip(description));
    description.addEventListener("focus", () => showMaterialDescriptionTooltip(description));
    description.addEventListener("blur", () => hideMaterialDescriptionTooltip(description));
    const fileInfo = createElement("p", "material-file-info", getMaterialFileInfo(material));
    const dateInfo = getMaterialDateInfo(material);
    const date = createElement("p", "material-date", `${dateInfo.label} ${dateInfo.text}`);
    date.setAttribute("aria-label", `${dateInfo.label} 일시 ${dateInfo.text}`);
    const detailRow = createElement("div", "material-detail-row");
    detailRow.append(fileInfo, date);
    const previewNotice = getOfficeFormat(material)
      ? createElement("p", "material-preview-note", "PPT · Word 파일은 미리보기 제공 불가")
      : null;
    const actions = createElement("div", "card-actions");
    const qrCode = createMaterialQr(material);

    if (String(material.format).toLowerCase() === "pdf" || isImageMaterial(material)) {
      const previewButton = createElement("button", "button button-primary mobile-preview-action", "미리보기");
      previewButton.type = "button";
      previewButton.addEventListener("click", () =>
        runMaterialAction(material, previewButton, () => openPreview(material, previewButton)),
      );
      actions.appendChild(previewButton);

      const openLink = createElement("a", "button button-primary desktop-open-action", "문서보기");
      openLink.href = getMaterialOpenUrl(material);
      openLink.target = "_blank";
      openLink.rel = "noopener";
      protectOpenLink(openLink, material);
      actions.appendChild(openLink);

      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-secondary";
      downloadLink.textContent = "다운로드";
      protectDownloadLink(downloadLink, material);
      actions.appendChild(downloadLink);
      actions.classList.add("card-actions-three", "responsive-preview-actions");
    } else if (material.type === "video" && isYouTubeMaterial(material)) {
      actions.classList.add("youtube-actions");
      const openLink = createElement("a", "button button-primary", "YouTube에서 보기");
      openLink.href = getMaterialOpenUrl(material);
      openLink.target = "_blank";
      openLink.rel = "noopener";
      protectOpenLink(openLink, material);
      actions.appendChild(openLink);
    } else if (material.type === "video") {
      const playButton = createElement("button", "button button-primary", "바로 재생");
      playButton.type = "button";
      playButton.addEventListener("click", () =>
        runMaterialAction(material, playButton, () => openVideoPreview(material, playButton)),
      );
      actions.appendChild(playButton);

      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-secondary";
      downloadLink.textContent = "다운로드";
      protectDownloadLink(downloadLink, material);
      actions.appendChild(downloadLink);
    } else {
      const downloadLink = createDownloadLink(material);
      downloadLink.className = "button button-primary";
      downloadLink.textContent = "다운로드";
      protectDownloadLink(downloadLink, material);
      actions.appendChild(downloadLink);
    }

    actions.appendChild(createShareButton(material));
    if (actions.childElementCount === 3) actions.classList.add("card-actions-three");

    const content = createElement("div", "card-content");
    content.append(heading, description, detailRow);
    if (previewNotice) content.appendChild(previewNotice);
    body.append(content, qrCode, actions);
    card.append(thumbnail, body);
    return card;
  }

  function createSecurityLabel() {
    const label = createElement("span", "material-security-label");
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    icon.classList.add("material-security-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    path.setAttribute("d", "M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10M6.5 10h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    icon.appendChild(path);
    label.append(icon, document.createTextNode("보안 문서"));
    return label;
  }

  function createThumbnailFallback(material) {
    const fallback = createElement("div", "thumbnail-fallback");
    const mark = createElement("span", "file-mark");
    mark.dataset.format = getFormatLabel(material);
    mark.setAttribute("aria-hidden", "true");
    fallback.append(mark, createElement("span", "thumbnail-type", getTypeLabel(material.type)));
    return fallback;
  }

  function createThumbnailLoading() {
    const loading = createElement("div", "thumbnail-loading");
    loading.setAttribute("role", "status");
    loading.append(
      createElement("span", "thumbnail-loading-spinner"),
      createElement("span", "thumbnail-loading-text", "썸네일 이미지 로딩중"),
    );
    return loading;
  }

  function getMaterialQrUrl(material) {
    if (isYouTubeMaterial(material)) return resolveUrl(material.file);
    const url = new URL(getMaterialShareUrl(material, false));
    url.searchParams.set("mode", "download");
    return url.href;
  }

  function createMaterialQr(material) {
    const targetUrl = getMaterialQrUrl(material);
    const button = createElement("button", "material-card-qr");
    button.type = "button";
    button.setAttribute("aria-label", `${material.title} QR 코드 크게 보기`);
    button.title = "QR 코드를 크게 보기";
    button.addEventListener("click", () => openQrModal(material, targetUrl, button));

    if (typeof window.qrcode !== "function" || !targetUrl) {
      button.appendChild(createElement("span", "material-card-qr-fallback", "QR"));
      return button;
    }

    try {
      const qr = window.qrcode(0, "M");
      qr.addData(targetUrl);
      qr.make();
      button.innerHTML = qr.createSvgTag({ cellSize: 2, margin: 2, scalable: true });
      const svg = button.querySelector("svg");
      if (svg) {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      }
    } catch (error) {
      console.error("자료 QR을 만들지 못했습니다.", error);
      button.appendChild(createElement("span", "material-card-qr-fallback", "QR"));
    }
    return button;
  }

  function openQrModal(material, targetUrl, trigger) {
    if (!targetUrl || typeof window.qrcode !== "function") return;
    pushModalHistory("qr");
    lastQrFocusedElement = trigger || document.activeElement;
    elements.qrModalTitle.textContent = material.title;
    elements.qrModalCode.replaceChildren();

    try {
      const qr = window.qrcode(0, "M");
      qr.addData(targetUrl);
      qr.make();
      elements.qrModalCode.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 4, scalable: true });
      const svg = elements.qrModalCode.querySelector("svg");
      if (svg) {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      }
    } catch (error) {
      console.error("확대 QR을 만들지 못했습니다.", error);
      elements.qrModalCode.appendChild(createElement("span", "material-card-qr-fallback", "QR"));
    }

    elements.qrModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleQrModalKeydown);
    window.requestAnimationFrame(() => elements.closeQrModal.focus());
  }

  function closeQrModal() {
    if (elements.qrModal.hidden) return;
    elements.qrModal.hidden = true;
    elements.qrModalCode.replaceChildren();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleQrModalKeydown);
    if (lastQrFocusedElement && document.contains(lastQrFocusedElement)) lastQrFocusedElement.focus();
    lastQrFocusedElement = null;
  }

  function handleQrModalKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("qr", closeQrModal);
      return;
    }
    if (event.key === "Tab") event.preventDefault();
  }

  function createDownloadLink(material) {
    const link = document.createElement("a");
    link.href = resolveUrl(material.file);
    link.download = getMaterialDownloadName(material);
    return link;
  }

  function getMaterialOpenUrl(material) {
    if (isYouTubeMaterial(material)) return resolveUrl(material.file);
    try {
      const target = new URL(material.file, document.baseURI);
      if (target.origin === window.location.origin) {
        target.searchParams.set("filename", getMaterialDownloadName(material));
      }
      return target.href;
    } catch (error) {
      return resolveUrl(material.file);
    }
  }

  function downloadMaterial(material) {
    const link = createDownloadLink(material);
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function protectDownloadLink(link, material) {
    if (!isSecureMaterial(material)) return;
    convertSecureLinkToButton(link, material, () => downloadMaterial(material));
  }

  function protectOpenLink(link, material) {
    if (!isSecureMaterial(material)) return;
    const targetUrl = getMaterialOpenUrl(material);
    convertSecureLinkToButton(link, material, () => {
      const opened = window.open(targetUrl, "_blank", "noopener");
      if (opened) opened.opener = null;
    });
  }

  function convertSecureLinkToButton(link, material, action) {
    link.removeAttribute("href");
    link.removeAttribute("download");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("role", "button");
    link.setAttribute("aria-haspopup", "dialog");
    link.tabIndex = 0;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      runMaterialAction(material, link, action);
    });
    link.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      link.click();
    });
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
    button.addEventListener("click", () =>
      runMaterialAction(material, button, () => shareMaterialLink(material, button)),
    );
    return button;
  }

  async function shareMaterialLink(material, button) {
    const url = getMaterialShareUrl(material);
    if (!url) return;
    const message = `안녕하세요. 요청하신 ‘${material.title}’ 자료를 전달드립니다.\n아래 링크에서 확인해 주세요.`;

    if (isMobileDevice() && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: material.title,
          text: message,
          url,
        });
        showShareFeedback(button, "공유되었습니다.");
        showShareToast("공유가 완료되었습니다.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.warn("모바일 공유창을 열지 못해 링크 복사로 전환합니다.", error);
      }
    }

    try {
      await copyText(url);
      showShareFeedback(button, "복사되었습니다.");
      showShareToast("링크를 복사했습니다.");
    } catch (error) {
      console.error("자료 링크를 복사하지 못했습니다.", error);
      showShareFeedback(button, "복사 실패");
      showShareToast("링크를 복사하지 못했습니다.", "error");
    }
  }

  function getMaterialShareUrl(material, includeVersion = true) {
    if (!material?.id) return "";
    if (window.NiceHubSharePage?.getSharePageUrl) {
      return window.NiceHubSharePage.getSharePageUrl(material, {
        publicBaseUrl: new URL("./", document.baseURI).href,
        includeVersion,
      });
    }
    const url = new URL("open.html", document.baseURI);
    url.searchParams.set("id", material.id);
    if (includeVersion) {
      const version = material.modifiedAt || material.updatedAt || material.registeredAt;
      if (version) url.searchParams.set("v", version);
    }
    return url.href;
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

  function showShareToast(message, tone = "success") {
    if (!elements.shareFeedbackToast) return;

    window.clearTimeout(shareToastTimer);
    window.clearTimeout(shareToastCleanupTimer);
    elements.shareFeedbackToast.textContent = message;
    elements.shareFeedbackToast.dataset.tone = tone;
    elements.shareFeedbackToast.hidden = false;
    window.requestAnimationFrame(() => elements.shareFeedbackToast.classList.add("is-visible"));

    shareToastTimer = window.setTimeout(() => {
      elements.shareFeedbackToast.classList.remove("is-visible");
      shareToastCleanupTimer = window.setTimeout(() => {
        if (!elements.shareFeedbackToast.classList.contains("is-visible")) {
          elements.shareFeedbackToast.hidden = true;
        }
      }, 200);
    }, 2000);
  }

  function getFileExtension(path) {
    try {
      const pathname = new URL(path, document.baseURI).pathname;
      const fileName = decodeURIComponent(pathname.split("/").pop() || "");
      const extension = fileName.match(/\.[a-z0-9]{1,10}$/i)?.[0] || "";
      return extension.toLowerCase();
    } catch (error) {
      return "";
    }
  }

  function getMaterialDownloadName(material) {
    const extension = getFileExtension(material?.file);
    const fallbackName = `NICE-자료${extension}`;
    const safeTitle = String(material?.title || "NICE-자료")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[. ]+$/g, "")
      .trim();
    if (!safeTitle) return fallbackName;
    return extension && safeTitle.toLowerCase().endsWith(extension) ? safeTitle : `${safeTitle}${extension}`;
  }

  function formatDateOnly(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[1]}. ${Number(match[2])}. ${Number(match[3])}.` : "날짜 미등록";
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return formatDateOnly(value);
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function getSeoulDateKey(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function getMaterialDateInfo(material) {
    if (material?.modifiedAt) {
      return { label: "업데이트", text: formatDateTime(material.modifiedAt) };
    }

    const registeredDateKey = getSeoulDateKey(material?.registeredAt);
    if (material?.updatedAt && registeredDateKey && material.updatedAt !== registeredDateKey) {
      return { label: "업데이트", text: formatDateOnly(material.updatedAt) };
    }

    if (material?.registeredAt) {
      return { label: "등록", text: formatDateTime(material.registeredAt) };
    }

    return { label: "등록", text: formatDateOnly(material?.updatedAt) };
  }

  function loadPdfJs() {
    if (!pdfJsModulePromise) {
      pdfJsModulePromise = import(resolveUrl("assets/vendor/pdfjs/pdf.min.mjs"))
        .then((pdfjs) => {
          pdfjs.GlobalWorkerOptions.workerSrc = resolveUrl("assets/vendor/pdfjs/pdf.worker.min.mjs");
          return pdfjs;
        })
        .catch((error) => {
          pdfJsModulePromise = null;
          throw error;
        });
    }
    return pdfJsModulePromise;
  }

  function schedulePdfViewerWarmup() {
    if (
      pdfViewerWarmupScheduled ||
      !isMobileDevice() ||
      !materials.some((material) => String(material?.format).toLowerCase() === "pdf")
    ) {
      return;
    }
    pdfViewerWarmupScheduled = true;

    const warmup = () => {
      void loadPdfJs().catch((error) => console.warn("PDF 뷰어를 미리 준비하지 못했습니다.", error));
      if (navigator.connection?.saveData) return;
      void fetch(resolveUrl("assets/vendor/pdfjs/pdf.worker.min.mjs"), { cache: "force-cache" }).catch((error) =>
        console.warn("PDF 작업 파일을 미리 준비하지 못했습니다.", error),
      );
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(warmup, { timeout: 3500 });
      } else {
        window.setTimeout(warmup, 1200);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  }

  function showPdfPreviewPlaceholder(material, session) {
    const thumbnailUrl = resolveUrl(material.thumbnail);
    const placeholder = elements.pdfPreviewPlaceholder;
    placeholder.onload = null;
    placeholder.onerror = null;
    placeholder.hidden = true;
    placeholder.removeAttribute("src");
    placeholder.removeAttribute("alt");
    elements.pdfCanvasViewer.classList.remove("has-preview-placeholder");
    if (!thumbnailUrl) return;

    placeholder.alt = `${material.title} 표지 미리보기`;
    placeholder.hidden = false;
    elements.pdfCanvasViewer.classList.add("has-preview-placeholder");
    placeholder.onload = () => {
      if (session !== previewSession) return;
      placeholder.hidden = false;
    };
    placeholder.onerror = () => {
      if (session !== previewSession) return;
      placeholder.hidden = true;
      elements.pdfCanvasViewer.classList.remove("has-preview-placeholder");
    };
    placeholder.src = thumbnailUrl;
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
      elements.pdfPreviewPlaceholder.hidden = true;
      elements.pdfCanvasViewer.classList.remove("has-preview-placeholder");
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

  async function openCanvasPreview(material, fileUrl, session) {
    elements.pdfCanvasViewer.hidden = false;
    elements.previewPagination.hidden = false;
    currentPdfPage = 1;
    updatePagination();
    showPdfPreviewPlaceholder(material, session);
    setCanvasPreviewStatus("PDF 첫 페이지를 준비하고 있습니다.", false);

    try {
      const pdfjs = await loadPdfJs();
      if (session !== previewSession) return;

      pdfLoadingTask = pdfjs.getDocument({
        url: fileUrl,
        disableStream: true,
        disableAutoFetch: true,
        rangeChunkSize: 262144,
      });
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
    elements.downloadPreview.download = getMaterialDownloadName(material);
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
      openCanvasPreview(material, fileUrl, session);
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
    elements.pdfPreviewPlaceholder.hidden = true;
    elements.pdfPreviewPlaceholder.onload = null;
    elements.pdfPreviewPlaceholder.onerror = null;
    elements.pdfPreviewPlaceholder.removeAttribute("src");
    elements.pdfPreviewPlaceholder.removeAttribute("alt");
    elements.pdfCanvasViewer.classList.remove("has-preview-placeholder");
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
    elements.downloadVideo.download = getMaterialDownloadName(material);
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

  function runMaterialAction(material, trigger, action) {
    if (!isSecureMaterial(material)) {
      try {
        Promise.resolve(action()).catch((error) => console.error("자료 기능을 실행하지 못했습니다.", error));
      } catch (error) {
        console.error("자료 기능을 실행하지 못했습니다.", error);
      }
      return;
    }

    if (!elements.materialSecurityModal.hidden) return;
    pushModalHistory("material-security");
    lastSecurityFocusedElement = trigger || document.activeElement;
    pendingSecurityAction = action;
    elements.materialSecurityName.textContent = material.title || "이름 없는 자료";
    elements.materialSecurityPassword.value = "";
    elements.materialSecurityError.textContent = "";
    elements.materialSecurityModal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleMaterialSecurityKeydown);
    window.requestAnimationFrame(() => elements.materialSecurityPassword.focus());
  }

  function closeMaterialSecurity() {
    if (elements.materialSecurityModal.hidden) return;
    elements.materialSecurityModal.hidden = true;
    elements.materialSecurityPassword.value = "";
    elements.materialSecurityError.textContent = "";
    elements.materialSecurityName.textContent = "";
    pendingSecurityAction = null;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleMaterialSecurityKeydown);
    if (lastSecurityFocusedElement && document.contains(lastSecurityFocusedElement)) lastSecurityFocusedElement.focus();
    lastSecurityFocusedElement = null;
  }

  function handleMaterialSecuritySubmit(event) {
    event.preventDefault();
    if (elements.materialSecurityPassword.value !== materialSecurityPassword) {
      elements.materialSecurityError.textContent = "비밀번호가 올바르지 않습니다.";
      elements.materialSecurityPassword.select();
      return;
    }

    const action = pendingSecurityAction;
    if (getHistoryState()[modalHistoryKey] === "material-security") {
      history.replaceState({ ...getHistoryState(), [modalHistoryKey]: "" }, "", window.location.href);
    }
    closeMaterialSecurity();
    if (!action) return;
    try {
      Promise.resolve(action()).catch((error) => console.error("보안 문서 기능을 실행하지 못했습니다.", error));
    } catch (error) {
      console.error("보안 문서 기능을 실행하지 못했습니다.", error);
    }
  }

  function handleMaterialSecurityKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestModalClose("material-security", closeMaterialSecurity);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [
      ...elements.materialSecurityModal.querySelectorAll('button:not([disabled]), input:not([disabled])'),
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
      materialTypes = Array.isArray(data.materialTypes)
        ? [...data.materialTypes].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        : [];
      categoryMap = new Map(categories.map((category) => [category.id, category]));
      materialTypeMap = new Map(materialTypes.map((type) => [type.id, type]));

      renderTabs();
      renderMaterialTypeTabs();
      renderMaterials();
      updateQuickFilterActiveCount();
      if (!elements.qrBundleModal.hidden) syncQrBundleDialog();
      window.requestAnimationFrame(() => {
        updateAllTabScrollers();
        updateQuickFilterFloatingVisibility();
      });
      schedulePdfViewerWarmup();
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
  elements.closeQrModal.addEventListener("click", () => requestModalClose("qr", closeQrModal));
  elements.qrModal
    .querySelector("[data-close-qr-modal]")
    .addEventListener("click", () => requestModalClose("qr", closeQrModal));
  elements.closeVideo.addEventListener("click", () => requestModalClose("video", closeVideoPreview));
  elements.videoModal
    .querySelector("[data-close-video-modal]")
    .addEventListener("click", () => requestModalClose("video", closeVideoPreview));
  elements.openAdminAccess.addEventListener("click", openAdminAccess);
  elements.floatingOpenAdminAccess.addEventListener("click", openAdminAccess);
  elements.adminAccessForm.addEventListener("submit", handleAdminAccessSubmit);
  elements.closeAdminAccess.addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.cancelAdminAccess.addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.adminAccessModal
    .querySelector("[data-close-admin-access]")
    .addEventListener("click", () => requestModalClose("admin-access", closeAdminAccess));
  elements.materialSecurityForm.addEventListener("submit", handleMaterialSecuritySubmit);
  elements.closeMaterialSecurity.addEventListener("click", () =>
    requestModalClose("material-security", closeMaterialSecurity),
  );
  elements.cancelMaterialSecurity.addEventListener("click", () =>
    requestModalClose("material-security", closeMaterialSecurity),
  );
  elements.materialSecurityModal
    .querySelector("[data-close-material-security]")
    .addEventListener("click", () => requestModalClose("material-security", closeMaterialSecurity));
  elements.previousPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage - 1));
  elements.nextPreviewPage.addEventListener("click", () => renderPdfPage(currentPdfPage + 1));
  elements.searchInput.addEventListener("input", updateSearch);
  elements.searchInput.addEventListener("search", updateSearch);
  elements.clearSearch.addEventListener("click", clearSearch);
  elements.scrollToTop.addEventListener("click", scrollPageToTop);
  elements.openQrBundle.addEventListener("click", openQrBundle);
  elements.closeQrBundle.addEventListener("click", () => requestModalClose("qr-bundle", closeQrBundle));
  elements.cancelQrBundle.addEventListener("click", () => requestModalClose("qr-bundle", closeQrBundle));
  elements.qrBundleForm.addEventListener("submit", generateQrBundle);
  elements.qrBundleSearch.addEventListener("input", renderQrBundleMaterials);
  elements.qrBundleSearch.addEventListener("search", renderQrBundleMaterials);
  elements.qrBundleCategory.addEventListener("change", renderQrBundleMaterials);
  elements.qrBundleType.addEventListener("change", renderQrBundleMaterials);
  elements.clearQrBundleSelection.addEventListener("click", clearQrBundleSelection);
  elements.openQuickFilter.addEventListener("click", openQuickFilter);
  elements.closeQuickFilter.addEventListener("click", () => requestModalClose("quick-filter", closeQuickFilter));
  elements.quickFilterModal
    .querySelector("[data-close-quick-filter]")
    .addEventListener("click", () => requestModalClose("quick-filter", closeQuickFilter));
  elements.quickFilterForm.addEventListener("submit", applyQuickFilter);
  elements.quickFilterSearch.addEventListener("input", updateQuickFilterResult);
  elements.quickFilterSearch.addEventListener("search", updateQuickFilterResult);
  elements.resetQuickFilter.addEventListener("click", resetQuickFilter);
  elements.loadMore.addEventListener("click", loadMoreMaterials);
  elements.tabScrollArrows.forEach((button) => button.addEventListener("click", () => scrollTabStrip(button)));
  elements.categoryTabsScroll.addEventListener("scroll", updateAllTabScrollers, { passive: true });
  elements.materialTypeTabsScroll.addEventListener("scroll", updateAllTabScrollers, { passive: true });
  elements.viewModeButtons.forEach((button) => {
    button.addEventListener("click", () => setViewMode(button.dataset.viewMode));
  });
  window.addEventListener("resize", () => {
    updateAllTabScrollers();
    scheduleQuickFilterFloatingVisibility();
    scheduleDescriptionTooltipMeasurement();
    if (activeDescriptionTooltipTarget) positionMaterialDescriptionTooltip(activeDescriptionTooltipTarget);
    if (elements.modal.hidden || elements.pdfCanvasViewer.hidden || !pdfDocument) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderPdfPage(currentPdfPage), 180);
  });
  window.addEventListener("scroll", scheduleQuickFilterFloatingVisibility, { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      if (activeDescriptionTooltipTarget) positionMaterialDescriptionTooltip(activeDescriptionTooltipTarget);
    },
    { passive: true },
  );
  initializeBackNavigation();
  initializeMaterialEndObserver();
  setViewMode(activeViewMode, false);
  initialize();
})();
