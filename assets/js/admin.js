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
    maxDescriptionLength: 100,
  };

  const documentAccept = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/webp",
    ".pdf",
    ".ppt",
    ".pptx",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
  ];

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
    materialDropZone: document.querySelector("#materialDropZone"),
    materialDropStatus: document.querySelector("#materialDropStatus"),
    materialFileName: document.querySelector("#materialFileName"),
    fileHelp: document.querySelector("#fileHelp"),
    youtubeUrlGroup: document.querySelector("#youtubeUrlGroup"),
    youtubeUrl: document.querySelector("#youtubeUrl"),
    thumbnailFile: document.querySelector("#thumbnailFile"),
    thumbnailDropZone: document.querySelector("#thumbnailDropZone"),
    thumbnailDropStatus: document.querySelector("#thumbnailDropStatus"),
    thumbnailFileName: document.querySelector("#thumbnailFileName"),
    uploadPreviewThumbnail: document.querySelector("#uploadPreviewThumbnail"),
    uploadPreviewThumbnailFallback: document.querySelector("#uploadPreviewThumbnailFallback"),
    uploadPreviewFormatMark: document.querySelector("#uploadPreviewFormatMark"),
    uploadPreviewTypeFallback: document.querySelector("#uploadPreviewTypeFallback"),
    uploadPreviewSecurity: document.querySelector("#uploadPreviewSecurity"),
    uploadPreviewCategory: document.querySelector("#uploadPreviewCategory"),
    uploadPreviewType: document.querySelector("#uploadPreviewType"),
    uploadPreviewTitle: document.querySelector("#uploadPreviewTitle"),
    uploadPreviewDescription: document.querySelector("#uploadPreviewDescription"),
    uploadPreviewFileInfo: document.querySelector("#uploadPreviewFileInfo"),
    uploadPreviewDate: document.querySelector("#uploadPreviewDate"),
    uploadPreviewQr: document.querySelector("#uploadPreviewQr"),
    uploadPreviewActions: document.querySelector("#uploadPreviewActions"),
    uploadListPreviewThumbnail: document.querySelector("#uploadListPreviewThumbnail"),
    uploadListPreviewThumbnailFallback: document.querySelector("#uploadListPreviewThumbnailFallback"),
    uploadListPreviewFormatMark: document.querySelector("#uploadListPreviewFormatMark"),
    uploadListPreviewTypeFallback: document.querySelector("#uploadListPreviewTypeFallback"),
    uploadListPreviewSecurity: document.querySelector("#uploadListPreviewSecurity"),
    uploadListPreviewCategory: document.querySelector("#uploadListPreviewCategory"),
    uploadListPreviewType: document.querySelector("#uploadListPreviewType"),
    uploadListPreviewTitle: document.querySelector("#uploadListPreviewTitle"),
    uploadListPreviewDescription: document.querySelector("#uploadListPreviewDescription"),
    uploadListPreviewFileInfo: document.querySelector("#uploadListPreviewFileInfo"),
    uploadListPreviewDate: document.querySelector("#uploadListPreviewDate"),
    uploadListPreviewQr: document.querySelector("#uploadListPreviewQr"),
    uploadListPreviewActions: document.querySelector("#uploadListPreviewActions"),
    title: document.querySelector("#title"),
    description: document.querySelector("#description"),
    descriptionCount: document.querySelector("#descriptionCount"),
    uploadSecurityInputs: [...document.querySelectorAll('input[name="uploadSecurityMode"]')],
    uploadSecurityPasswordGroup: document.querySelector("#uploadSecurityPasswordGroup"),
    uploadSecurityPassword: document.querySelector("#uploadSecurityPassword"),
    progress: document.querySelector("#uploadProgress"),
    progressTitle: document.querySelector("#progressTitle"),
    progressMessage: document.querySelector("#progressMessage"),
    result: document.querySelector("#uploadResult"),
    openUploadDialog: document.querySelector("#openUploadDialog"),
    uploadDialog: document.querySelector("#uploadDialog"),
    closeUploadDialog: document.querySelector("#closeUploadDialog"),
    discardUploadDialog: document.querySelector("#discardUploadDialog"),
    continueUploadButton: document.querySelector("#continueUploadButton"),
    discardUploadButton: document.querySelector("#discardUploadButton"),
    inventorySection: document.querySelector("#inventorySection"),
    inventorySummary: document.querySelector("#inventorySummary"),
    inventoryCategoryFilter: document.querySelector("#inventoryCategoryFilter"),
    inventoryTypeFilter: document.querySelector("#inventoryTypeFilter"),
    openCategoryOrderDialog: document.querySelector("#openCategoryOrderDialog"),
    openMaterialTypeOrderDialog: document.querySelector("#openMaterialTypeOrderDialog"),
    inventoryOpenCategoryDialog: document.querySelector("#inventoryOpenCategoryDialog"),
    inventoryOpenMaterialTypeDialog: document.querySelector("#inventoryOpenMaterialTypeDialog"),
    materialInventory: document.querySelector("#materialInventory"),
    refreshMaterialsButton: document.querySelector("#refreshMaterialsButton"),
    operationOverlay: document.querySelector("#operationOverlay"),
    operationProgressTitle: document.querySelector("#operationProgressTitle"),
    operationProgressMessage: document.querySelector("#operationProgressMessage"),
    operationResultDialog: document.querySelector("#operationResultDialog"),
    operationResultIcon: document.querySelector("#operationResultIcon"),
    operationResultTitle: document.querySelector("#operationResultTitle"),
    operationResultMessage: document.querySelector("#operationResultMessage"),
    closeOperationResult: document.querySelector("#closeOperationResult"),
    visibilityConfirmDialog: document.querySelector("#visibilityConfirmDialog"),
    visibilityConfirmTitle: document.querySelector("#visibilityConfirmTitle"),
    visibilityConfirmMessage: document.querySelector("#visibilityConfirmMessage"),
    cancelVisibilityConfirm: document.querySelector("#cancelVisibilityConfirm"),
    confirmVisibilityChange: document.querySelector("#confirmVisibilityChange"),
    settingsOrderDialog: document.querySelector("#settingsOrderDialog"),
    settingsOrderForm: document.querySelector("#settingsOrderForm"),
    settingsOrderKicker: document.querySelector("#settingsOrderKicker"),
    settingsOrderDialogTitle: document.querySelector("#settingsOrderDialogTitle"),
    settingsOrderDescription: document.querySelector("#settingsOrderDescription"),
    settingsOrderList: document.querySelector("#settingsOrderList"),
    closeSettingsOrderDialog: document.querySelector("#closeSettingsOrderDialog"),
    cancelSettingsOrderDialog: document.querySelector("#cancelSettingsOrderDialog"),
    saveSettingsOrderButton: document.querySelector("#saveSettingsOrderButton"),
    deleteDialog: document.querySelector("#deleteDialog"),
    deleteDialogMessage: document.querySelector("#deleteDialogMessage"),
    cancelDeleteButton: document.querySelector("#cancelDeleteButton"),
    confirmDeleteButton: document.querySelector("#confirmDeleteButton"),
    editContentDialog: document.querySelector("#editContentDialog"),
    editContentForm: document.querySelector("#editContentForm"),
    editMaterialTitle: document.querySelector("#editMaterialTitle"),
    editMaterialDescription: document.querySelector("#editMaterialDescription"),
    editDescriptionCount: document.querySelector("#editDescriptionCount"),
    editSecurityInputs: [...document.querySelectorAll('input[name="editSecurityMode"]')],
    editSecurityPasswordGroup: document.querySelector("#editSecurityPasswordGroup"),
    editSecurityPassword: document.querySelector("#editSecurityPassword"),
    editContentDialogStatus: document.querySelector("#editContentDialogStatus"),
    editContentProgress: document.querySelector("#editContentProgress"),
    editContentProgressTitle: document.querySelector("#editContentProgressTitle"),
    editContentProgressMessage: document.querySelector("#editContentProgressMessage"),
    saveEditContentButton: document.querySelector("#saveEditContentButton"),
    closeEditContentDialog: document.querySelector("#closeEditContentDialog"),
    cancelEditContentDialog: document.querySelector("#cancelEditContentDialog"),
    editVideoDialog: document.querySelector("#editVideoDialog"),
    editVideoForm: document.querySelector("#editVideoForm"),
    editVideoSourceInputs: [...document.querySelectorAll('input[name="editVideoSource"]')],
    editVideoFileGroup: document.querySelector("#editVideoFileGroup"),
    editVideoFile: document.querySelector("#editVideoFile"),
    editVideoFileName: document.querySelector("#editVideoFileName"),
    editVideoUrlGroup: document.querySelector("#editVideoUrlGroup"),
    editVideoUrl: document.querySelector("#editVideoUrl"),
    editVideoDialogStatus: document.querySelector("#editVideoDialogStatus"),
    saveEditVideoButton: document.querySelector("#saveEditVideoButton"),
    closeEditVideoDialog: document.querySelector("#closeEditVideoDialog"),
    cancelEditVideoDialog: document.querySelector("#cancelEditVideoDialog"),
    openCategoryDialog: document.querySelector("#openCategoryDialog"),
    categoryDialog: document.querySelector("#categoryDialog"),
    categoryForm: document.querySelector("#categoryForm"),
    newCategoryName: document.querySelector("#newCategoryName"),
    categoryDialogStatus: document.querySelector("#categoryDialogStatus"),
    saveCategoryButton: document.querySelector("#saveCategoryButton"),
    closeCategoryDialog: document.querySelector("#closeCategoryDialog"),
    cancelCategoryDialog: document.querySelector("#cancelCategoryDialog"),
    openMaterialTypeDialog: document.querySelector("#openMaterialTypeDialog"),
    materialTypeDialog: document.querySelector("#materialTypeDialog"),
    materialTypeForm: document.querySelector("#materialTypeForm"),
    newMaterialTypeName: document.querySelector("#newMaterialTypeName"),
    materialTypeDialogStatus: document.querySelector("#materialTypeDialogStatus"),
    saveMaterialTypeButton: document.querySelector("#saveMaterialTypeButton"),
    closeMaterialTypeDialog: document.querySelector("#closeMaterialTypeDialog"),
    cancelMaterialTypeDialog: document.querySelector("#cancelMaterialTypeDialog"),
  };

  let library = null;
  let verifiedToken = "";
  let isUploading = false;
  let isDeleting = false;
  let isEditingMaterial = false;
  let isAddingCategory = false;
  let isAddingMaterialType = false;
  let isReorderingSettings = false;
  let settingsOrderKind = "";
  let settingsOrderDraft = [];
  let settingsOrderInitial = [];
  let lastSettingsOrderTrigger = null;
  let pendingDeleteId = "";
  let lastDeleteTrigger = null;
  let pendingVisibilityId = "";
  let pendingVisibilityState = null;
  let lastVisibilityTrigger = null;
  let pendingContentEditId = "";
  let lastContentEditTrigger = null;
  let pendingVideoEditId = "";
  let lastVideoEditTrigger = null;
  let lastCategoryTrigger = null;
  let lastMaterialTypeTrigger = null;
  let pdfJsModulePromise = null;
  let uploadPreviewThumbnailFile = null;
  let uploadPreviewThumbnailUrl = "";
  let uploadFormDirty = false;
  const localThumbnailPreviews = new Map();

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

  function markMaterialUpdated(material, date = new Date()) {
    material.updatedAt = localDateString(date);
    material.modifiedAt = date.toISOString();
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

  function getSecurityMode(inputs) {
    return inputs.find((input) => input.checked)?.value === "secure" ? "secure" : "public";
  }

  function updateSecurityPasswordField(inputs, group, passwordInput) {
    const secure = getSecurityMode(inputs) === "secure";
    group.hidden = !secure;
    passwordInput.value = "1004";
    passwordInput.disabled = true;
  }

  function updateUploadSecurityFields() {
    updateSecurityPasswordField(
      elements.uploadSecurityInputs,
      elements.uploadSecurityPasswordGroup,
      elements.uploadSecurityPassword,
    );
    updateUploadCardPreview();
  }

  function updateEditSecurityFields() {
    updateSecurityPasswordField(
      elements.editSecurityInputs,
      elements.editSecurityPasswordGroup,
      elements.editSecurityPassword,
    );
  }

  function populateSelect(select, items) {
    const fragment = document.createDocumentFragment();
    sortSettingsByOrder(items).forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      fragment.appendChild(option);
    });
    select.replaceChildren(fragment);
  }

  function populateInventoryFilter(select, items, allLabel) {
    const currentValue = select.value || "all";
    const fragment = document.createDocumentFragment();
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = allLabel;
    fragment.appendChild(allOption);
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      fragment.appendChild(option);
    });
    select.replaceChildren(fragment);
    select.value = items.some((item) => item.id === currentValue) ? currentValue : "all";
  }

  function sortSettingsByOrder(items) {
    return items
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const aOrder = Number.isFinite(Number(a.item?.order)) ? Number(a.item.order) : (a.index + 1) * 10;
        const bOrder = Number.isFinite(Number(b.item?.order)) ? Number(b.item.order) : (b.index + 1) * 10;
        return aOrder - bOrder || a.index - b.index;
      })
      .map(({ item }) => item);
  }

  function populateInventoryFilters(sourceLibrary = library) {
    const categories = Array.isArray(sourceLibrary?.categories) ? sortSettingsByOrder(sourceLibrary.categories) : [];
    const materialTypes = Array.isArray(sourceLibrary?.materialTypes)
      ? sortSettingsByOrder(sourceLibrary.materialTypes)
      : [];
    populateInventoryFilter(elements.inventoryCategoryFilter, categories, "전체 사업");
    populateInventoryFilter(elements.inventoryTypeFilter, materialTypes, "전체 유형");
  }

  function resetUploadForm() {
    clearUploadPreviewThumbnail();
    elements.form.reset();
    elements.descriptionCount.textContent = "0";
    elements.materialFileName.textContent = "선택된 파일 없음";
    elements.thumbnailFileName.textContent = "선택된 이미지 없음";
    elements.materialDropStatus.textContent = "";
    elements.thumbnailDropStatus.textContent = "";
    elements.materialDropZone.classList.remove("is-dragover", "is-error");
    elements.thumbnailDropZone.classList.remove("is-dragover", "is-error");
    hideUploadProgress();
    updateUploadSecurityFields();
    updateFileAccept();
    updateFileLabels();
    uploadFormDirty = false;
  }

  function openUploadModal() {
    if (!verifiedToken || isUploading || elements.uploadDialog.open) return;
    clearResult();
    resetUploadForm();
    document.body.classList.add("upload-modal-open");
    elements.uploadDialog.showModal();
    elements.uploadDialog.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => elements.category.focus());
  }

  function openDiscardUploadDialog() {
    if (isUploading || elements.discardUploadDialog.open) return;
    elements.discardUploadDialog.showModal();
    window.requestAnimationFrame(() => elements.continueUploadButton.focus());
  }

  function closeDiscardUploadDialog() {
    if (elements.discardUploadDialog.open) elements.discardUploadDialog.close();
    window.requestAnimationFrame(() => elements.closeUploadDialog.focus());
  }

  function discardUploadDraft() {
    if (elements.discardUploadDialog.open) elements.discardUploadDialog.close();
    uploadFormDirty = false;
    resetUploadForm();
    closeUploadModal(true);
  }

  function closeUploadModal(force = false) {
    if ((!force && isUploading) || !elements.uploadDialog.open) return;
    if (!force && uploadFormDirty) {
      openDiscardUploadDialog();
      return;
    }
    if (elements.discardUploadDialog.open) elements.discardUploadDialog.close();
    elements.uploadDialog.close();
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function limitDescriptionLines(value) {
    const normalized = String(value || "").replace(/\r\n?/g, "\n");
    const lines = normalized.split("\n");
    if (lines.length <= 2) return normalized;
    return `${lines[0]}\n${lines.slice(1).join(" ")}`;
  }

  function hasExistingDescriptionLineBreakWithoutSelection(textarea) {
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;
    const remainingValue = `${textarea.value.slice(0, start)}${textarea.value.slice(end)}`;
    return remainingValue.includes("\n");
  }

  function preventThirdDescriptionLine(event) {
    const isLineBreak =
      (event.type === "beforeinput" && ["insertLineBreak", "insertParagraph"].includes(event.inputType)) ||
      (event.type === "keydown" && event.key === "Enter");
    if (!isLineBreak || event.isComposing) return;
    if (hasExistingDescriptionLineBreakWithoutSelection(event.currentTarget)) event.preventDefault();
  }

  function enforceDescriptionLineLimit(textarea, countElement) {
    const limitedValue = limitDescriptionLines(textarea.value).slice(0, Number(textarea.maxLength) || 300);
    if (limitedValue !== textarea.value) {
      const cursor = Math.min(textarea.selectionStart ?? limitedValue.length, limitedValue.length);
      textarea.value = limitedValue;
      textarea.setSelectionRange(cursor, cursor);
    }
    countElement.textContent = String(textarea.value.length);
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

  function getVideoSourceMethod() {
    return elements.videoSourceInputs.find((input) => input.checked)?.value || "file";
  }

  function isVideoType(type) {
    return type?.id === "video" || type?.format === "video";
  }

  function isYouTubeMaterial(material) {
    if (material?.sourceType === "youtube") return true;
    if (!material?.file || typeof material.file !== "string") return false;
    try {
      const hostname = new URL(material.file, document.baseURI).hostname.toLowerCase();
      return (
        hostname === "youtu.be" ||
        hostname.endsWith(".youtu.be") ||
        hostname === "youtube.com" ||
        hostname.endsWith(".youtube.com")
      );
    } catch (error) {
      return false;
    }
  }

  function getUploadedFormat(file, type) {
    if (isVideoType(type)) return "video";
    const lowerName = String(file?.name || "").toLowerCase();
    const lowerMime = String(file?.type || "").toLowerCase();
    if (lowerMime === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
    if (lowerMime.startsWith("image/") || /\.(?:png|jpe?g|webp)$/.test(lowerName)) return "image";
    const officeExtension = lowerName.match(/\.(pptx?|docx?)$/)?.[1];
    if (officeExtension) return officeExtension;
    return type?.format || "file";
  }

  function loadPdfJs() {
    if (!pdfJsModulePromise) {
      pdfJsModulePromise = import(new URL("assets/vendor/pdfjs/pdf.min.mjs", document.baseURI).href).then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("assets/vendor/pdfjs/pdf.worker.min.mjs", document.baseURI).href;
        return pdfjs;
      });
    }
    return pdfJsModulePromise;
  }

  async function getPdfPageCount(arrayBuffer) {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
    let document = null;
    try {
      document = await loadingTask.promise;
      return document.numPages;
    } catch (error) {
      throw new Error("PDF 페이지 수를 확인하지 못했습니다. 정상적인 PDF 파일인지 확인해 주세요.");
    } finally {
      if (document) await document.destroy();
      else await loadingTask.destroy().catch(() => {});
    }
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
    const isVideo = isVideoType(type);
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
      elements.fileHelp.textContent =
        "PDF, PNG, JPG, JPEG, WebP, PPT, PPTX, DOC 또는 DOCX 자료를 선택하세요. 최대 20MB입니다.";
    }
    updateUploadCardPreview();
  }

  function updateFileLabels() {
    const file = elements.materialFile.files[0];
    const thumbnail = elements.thumbnailFile.files[0];
    elements.materialFileName.textContent = file?.name || "선택된 파일 없음";
    elements.thumbnailFileName.textContent = thumbnail?.name || "선택된 이미지 없음";
    if (file) {
      elements.materialDropStatus.textContent = "";
      elements.materialDropZone.classList.remove("is-error");
    }
    if (thumbnail) {
      elements.thumbnailDropStatus.textContent = "";
      elements.thumbnailDropZone.classList.remove("is-error");
    }

    if (file && !elements.title.value.trim()) {
      elements.title.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    }
    updateUploadCardPreview();
  }

  function clearUploadPreviewThumbnail() {
    if (uploadPreviewThumbnailUrl) URL.revokeObjectURL(uploadPreviewThumbnailUrl);
    uploadPreviewThumbnailUrl = "";
    uploadPreviewThumbnailFile = null;
  }

  function formatPreviewFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const amount = bytes / 1024 ** unitIndex;
    return `${amount.toFixed(unitIndex === 0 || amount >= 10 ? 0 : 1)}${units[unitIndex]}`;
  }

  function getUploadPreviewFormatLabel(format) {
    const labels = {
      pdf: "PDF",
      image: "이미지",
      video: "동영상",
      youtube: "YouTube",
      ppt: "PPT",
      pptx: "PPTX",
      doc: "Word",
      docx: "Word",
      document: "파일",
      file: "파일",
    };
    return labels[String(format || "").toLowerCase()] || String(format || "파일").toUpperCase();
  }

  function syncUploadPreviewThumbnail(image, fallback) {
    if (!uploadPreviewThumbnailUrl) {
      image.hidden = true;
      image.removeAttribute("src");
      fallback.hidden = false;
      return;
    }

    image.onload = () => {
      image.hidden = false;
      fallback.hidden = true;
    };
    image.onerror = () => {
      image.hidden = true;
      fallback.hidden = false;
    };
    if (image.src !== uploadPreviewThumbnailUrl) {
      image.hidden = true;
      fallback.hidden = false;
      image.src = uploadPreviewThumbnailUrl;
    }
  }

  function updateUploadPreviewThumbnail(thumbnail) {
    if (thumbnail !== uploadPreviewThumbnailFile) {
      clearUploadPreviewThumbnail();
      uploadPreviewThumbnailFile = thumbnail || null;
      if (thumbnail) uploadPreviewThumbnailUrl = URL.createObjectURL(thumbnail);
    }

    syncUploadPreviewThumbnail(elements.uploadPreviewThumbnail, elements.uploadPreviewThumbnailFallback);
    syncUploadPreviewThumbnail(elements.uploadListPreviewThumbnail, elements.uploadListPreviewThumbnailFallback);
  }

  function updateUploadPreviewActions(format, isYoutube) {
    let labels;
    if (isYoutube) labels = ["YouTube에서 보기", "링크 복사"];
    else if (format === "video") labels = ["재생", "다운로드", "링크 복사"];
    else if (["pdf", "image"].includes(format)) labels = ["문서보기", "다운로드", "링크 복사"];
    else labels = ["다운로드", "링크 복사"];

    [elements.uploadPreviewActions, elements.uploadListPreviewActions].forEach((container) => {
      container.classList.toggle("is-three", labels.length === 3);
      container.classList.toggle("is-youtube", isYoutube);
      container.replaceChildren(
        ...labels.map((label, index) => createElement("span", index === 0 ? "is-primary" : "", label)),
      );
    });
  }

  function renderUploadPreviewQr(container, targetUrl) {
    if (!container) return;
    container.replaceChildren();
    if (typeof window.qrcode !== "function") {
      container.appendChild(createElement("span", "upload-preview-qr-fallback", "QR"));
      return;
    }

    try {
      const qr = window.qrcode(0, "M");
      qr.addData(targetUrl);
      qr.make();
      container.innerHTML = qr.createSvgTag({ cellSize: 2, margin: 2, scalable: true });
      const svg = container.querySelector("svg");
      if (svg) {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      }
    } catch (error) {
      container.appendChild(createElement("span", "upload-preview-qr-fallback", "QR"));
    }
  }

  function updateUploadCardPreview() {
    if (!elements.uploadPreviewTitle) return;
    const category = getSelectedCategory();
    const type = getSelectedType();
    const file = elements.materialFile.files?.[0];
    const thumbnail = elements.thumbnailFile.files?.[0];
    const isYoutube = isVideoType(type) && getVideoSourceMethod() === "youtube";
    const format = isYoutube ? "youtube" : getUploadedFormat(file, type);
    const formatLabel = getUploadPreviewFormatLabel(format);
    const typeLabel = type?.label || "자료 유형";
    const fileSize = file ? formatPreviewFileSize(file.size) : "";

    const categoryLabel = category?.label || "사업 카테고리";
    const title = elements.title.value.trim() || "자료명이 표시됩니다.";
    const description = elements.description.value.trim() || "짧은 설명이 표시됩니다.";
    const fileInfo = isYoutube
      ? "동영상 · YouTube"
      : [formatLabel, fileSize].filter(Boolean).join(" · ") || "파일 형식";
    const date = `등록 ${formatDate(localDateString())}`;
    const isSecure = getSecurityMode(elements.uploadSecurityInputs) === "secure";

    elements.uploadPreviewCategory.textContent = categoryLabel;
    elements.uploadPreviewType.textContent = typeLabel;
    elements.uploadPreviewTypeFallback.textContent = typeLabel;
    elements.uploadPreviewTitle.textContent = title;
    elements.uploadPreviewDescription.textContent = description;
    elements.uploadPreviewFormatMark.textContent = formatLabel.toUpperCase();
    elements.uploadPreviewFileInfo.textContent = fileInfo;
    elements.uploadPreviewDate.textContent = date;
    elements.uploadPreviewSecurity.hidden = !isSecure;

    elements.uploadListPreviewCategory.textContent = categoryLabel;
    elements.uploadListPreviewType.textContent = typeLabel;
    elements.uploadListPreviewTypeFallback.textContent = typeLabel;
    elements.uploadListPreviewTitle.textContent = title;
    elements.uploadListPreviewDescription.textContent = description;
    elements.uploadListPreviewFormatMark.textContent = formatLabel.toUpperCase();
    elements.uploadListPreviewFileInfo.textContent = fileInfo;
    elements.uploadListPreviewDate.textContent = date;
    elements.uploadListPreviewSecurity.hidden = !isSecure;

    let previewQrUrl = "https://lawcombo.github.io/nice-hub/share/material-preview.html";
    if (isYoutube && elements.youtubeUrl.value.trim()) {
      try {
        previewQrUrl = normalizeYouTubeUrl(elements.youtubeUrl.value);
      } catch (error) {
        // 입력 중인 YouTube 주소가 완성되기 전에는 대표 QR을 유지합니다.
      }
    }
    renderUploadPreviewQr(elements.uploadPreviewQr, previewQrUrl);
    renderUploadPreviewQr(elements.uploadListPreviewQr, previewQrUrl);

    updateUploadPreviewThumbnail(thumbnail);
    updateUploadPreviewActions(format, isYoutube);
  }

  function setConnectionStatus(message, type = "") {
    elements.connectionStatus.textContent = message;
    elements.connectionStatus.className = `inline-status${type ? ` status-${type}` : ""}`;
  }

  function showOperationProgress(title, message) {
    elements.operationProgressTitle.textContent = title;
    elements.operationProgressMessage.textContent = message;
    elements.operationOverlay.hidden = false;
  }

  function hideOperationProgress() {
    elements.operationOverlay.hidden = true;
  }

  function closeOperationResult() {
    if (elements.operationResultDialog.open) elements.operationResultDialog.close();
  }

  function showOperationResult(kind, title, message) {
    hideOperationProgress();
    elements.operationResultDialog.dataset.kind = kind;
    elements.operationResultIcon.textContent = kind === "error" ? "!" : "✓";
    elements.operationResultTitle.textContent = title;
    elements.operationResultMessage.textContent = message;
    if (elements.operationResultDialog.open) elements.operationResultDialog.close();
    elements.operationResultDialog.showModal();
    window.requestAnimationFrame(() => elements.closeOperationResult.focus());
  }

  function setProgress(title, message) {
    elements.progressTitle.textContent = title;
    elements.progressMessage.textContent = message;
    elements.progress.hidden = false;
    elements.uploadDialog.setAttribute("aria-busy", "true");
  }

  function hideUploadProgress() {
    elements.progress.hidden = true;
    elements.uploadDialog.removeAttribute("aria-busy");
  }

  function showEditContentProgress(title, message) {
    elements.editContentProgressTitle.textContent = title;
    elements.editContentProgressMessage.textContent = message;
    elements.editContentProgress.hidden = false;
    elements.editContentDialog.setAttribute("aria-busy", "true");
  }

  function hideEditContentProgress() {
    elements.editContentProgress.hidden = true;
    elements.editContentDialog.removeAttribute("aria-busy");
  }

  function clearResult() {
    elements.result.hidden = true;
    elements.result.replaceChildren();
  }

  function showResult(kind, title, message) {
    const heading = document.createElement("strong");
    const description = document.createElement("p");
    heading.textContent = title;
    description.textContent = message;
    elements.result.replaceChildren(heading, description);
    elements.result.className = `upload-result upload-result-${kind}`;

    elements.result.hidden = false;
    elements.result.tabIndex = -1;
    elements.result.focus({ preventScroll: true });
    showOperationResult(kind, title, message);
  }

  function setInventoryStatus() {}

  function createInventoryItem(material, sourceLibrary) {
    const item = createElement("article", "inventory-item");
    item.dataset.materialId = material.id;
    const main = createElement("div", "inventory-item-main");
    const thumbnail = createElement("div", "inventory-thumbnail", String(material.format || "FILE").toUpperCase());

    const localThumbnail = localThumbnailPreviews.get(material.id);
    if (localThumbnail || material.thumbnail) {
      const image = document.createElement("img");
      image.src = localThumbnail || new URL(material.thumbnail, document.baseURI).href;
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
    if (material.isSecure === true) meta.prepend(createElement("span", "inventory-secure-label", "보안 문서"));
    if (material.isPublished === false) meta.prepend(createElement("span", "inventory-private-label", "비공개"));
    const title = createElement("h4", "inventory-item-title", material.title || "이름 없는 자료");
    const fileName = createElement("p", "inventory-file-name", getFileName(material.file));
    copy.append(meta, title, fileName);
    main.append(thumbnail, copy);

    const actions = createElement("div", "inventory-item-actions");
    const actionsDisabled =
      !verifiedToken ||
      isUploading ||
      isDeleting ||
      isEditingMaterial ||
      isAddingCategory ||
      isAddingMaterialType ||
      isReorderingSettings;
    const thumbnailButton = createElement(
      "button",
      "button button-secondary inventory-action-button",
      "썸네일 이미지 변경",
    );
    thumbnailButton.type = "button";
    thumbnailButton.disabled = actionsDisabled;
    thumbnailButton.addEventListener("click", () => openReplacementFilePicker(material.id, "thumbnail", thumbnailButton));

    const materialType = sourceLibrary?.materialTypes?.find((type) => type.id === material.type);
    const videoMaterial = isVideoType(materialType);
    const fileButton = createElement(
      "button",
      "button button-secondary inventory-action-button",
      videoMaterial ? "영상 변경" : "업로드 파일 변경",
    );
    fileButton.type = "button";
    fileButton.disabled = actionsDisabled;
    fileButton.addEventListener("click", () => {
      if (videoMaterial) openEditVideoDialog(material.id, fileButton);
      else openReplacementFilePicker(material.id, "material", fileButton);
    });

    const contentButton = createElement("button", "button button-secondary inventory-action-button", "내용 변경");
    contentButton.type = "button";
    contentButton.disabled = actionsDisabled;
    contentButton.addEventListener("click", () => openEditContentDialog(material.id, contentButton));

    const deleteButton = createElement(
      "button",
      "button button-danger inventory-delete-button inventory-action-button",
      "삭제",
    );
    deleteButton.type = "button";
    deleteButton.disabled = actionsDisabled;
    deleteButton.addEventListener("click", () => openDeleteDialog(material.id, deleteButton));

    const visibilityControl = createElement("div", "inventory-visibility-control");
    visibilityControl.setAttribute("role", "group");
    visibilityControl.setAttribute("aria-label", `${material.title || "자료"} 공개 상태`);
    [
      { value: true, label: "공개" },
      { value: false, label: "비공개" },
    ].forEach((option) => {
      const selected = (material.isPublished !== false) === option.value;
      const button = createElement("button", "inventory-visibility-button", option.label);
      button.type = "button";
      button.disabled = actionsDisabled;
      button.dataset.visibility = option.value ? "public" : "private";
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.addEventListener("click", () => {
        if (!selected) openVisibilityConfirmDialog(material.id, option.value, button);
      });
      visibilityControl.appendChild(button);
    });

    const stateActions = createElement("div", "inventory-state-actions");
    stateActions.append(visibilityControl, deleteButton);
    actions.append(thumbnailButton, fileButton, contentButton, stateActions);
    item.append(main, actions);
    return item;
  }

  function setLocalThumbnailPreview(materialId, file) {
    const currentPreview = localThumbnailPreviews.get(materialId);
    if (currentPreview) URL.revokeObjectURL(currentPreview);
    localThumbnailPreviews.set(materialId, URL.createObjectURL(file));
  }

  function clearLocalThumbnailPreviews() {
    localThumbnailPreviews.forEach((url) => URL.revokeObjectURL(url));
    localThumbnailPreviews.clear();
  }

  function renderInventory(sourceLibrary = library) {
    const categories = Array.isArray(sourceLibrary?.categories)
      ? sortSettingsByOrder(sourceLibrary.categories)
      : [];
    const materialTypes = Array.isArray(sourceLibrary?.materialTypes)
      ? sortSettingsByOrder(sourceLibrary.materialTypes)
      : [];
    const allMaterials = Array.isArray(sourceLibrary?.materials) ? [...sourceLibrary.materials] : [];
    const settingsBusy =
      !verifiedToken ||
      isUploading ||
      isDeleting ||
      isEditingMaterial ||
      isAddingCategory ||
      isAddingMaterialType ||
      isReorderingSettings;
    elements.openCategoryOrderDialog.disabled = settingsBusy || categories.length < 2;
    elements.openMaterialTypeOrderDialog.disabled = settingsBusy || materialTypes.length < 2;
    elements.inventoryOpenCategoryDialog.disabled = settingsBusy;
    elements.inventoryOpenMaterialTypeDialog.disabled = settingsBusy;
    const selectedCategory = elements.inventoryCategoryFilter.value || "all";
    const selectedType = elements.inventoryTypeFilter.value || "all";
    const hasActiveFilter = selectedCategory !== "all" || selectedType !== "all";
    const materials = allMaterials.filter(
      (material) =>
        (selectedCategory === "all" || material.category === selectedCategory) &&
        (selectedType === "all" || material.type === selectedType),
    );
    const knownCategoryIds = new Set(categories.map((category) => category.id));
    const unknownMaterials = materials.filter((material) => !knownCategoryIds.has(material.category));
    const groups = categories
      .filter((category) => selectedCategory === "all" || category.id === selectedCategory)
      .map((category) => ({ id: category.id, label: category.label, category }));
    if (unknownMaterials.length) groups.push({ id: "__other__", label: "기타", category: null });

    elements.inventorySummary.textContent = hasActiveFilter
      ? `선택 조건 자료 ${materials.length}건 · 전체 ${allMaterials.length}건`
      : `${categories.length}개 사업 카테고리 · 등록 자료 ${allMaterials.length}건`;
    const fragment = document.createDocumentFragment();

    groups.forEach((group) => {
      const groupMaterials = (group.id === "__other__"
        ? unknownMaterials
        : materials.filter((material) => material.category === group.id)
      ).sort((a, b) => {
        const registrationDifference = getRegistrationTime(b) - getRegistrationTime(a);
        return registrationDifference || String(b.id || "").localeCompare(String(a.id || ""), "ko");
      });
      if (hasActiveFilter && !groupMaterials.length) return;

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

    if (!fragment.childNodes.length) {
      fragment.appendChild(
        createElement(
          "p",
          "inventory-empty inventory-filter-empty",
          hasActiveFilter ? "선택한 조건에 해당하는 자료가 없습니다." : "등록된 카테고리가 없습니다.",
        ),
      );
    }
    elements.materialInventory.replaceChildren(fragment);
  }

  function openDeleteDialog(materialId, trigger) {
    const material = library?.materials?.find((item) => item.id === materialId);
    if (!material || isUploading || isDeleting || isEditingMaterial) return;
    pendingDeleteId = materialId;
    lastDeleteTrigger = trigger;
    elements.deleteDialogMessage.textContent = `‘${material.title}’ 자료를 삭제합니다.`;
    elements.deleteDialog.showModal();
    syncDialogScrollLock();
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

  function getDroppedFileError(input, file) {
    if (!file) return "파일을 확인하지 못했습니다. 다시 시도해 주세요.";

    if (input === elements.thumbnailFile) {
      const validTypes = ["image/webp", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) return "표지는 JPG, PNG 또는 WebP 이미지만 사용할 수 있습니다.";
      if (file.size > config.maxThumbnailBytes) return "표지 이미지는 5MB 이하만 사용할 수 있습니다.";
      return "";
    }

    const type = getSelectedType();
    if (!type) return "자료 유형을 먼저 선택해 주세요.";
    const maximumBytes = isVideoType(type) ? config.maxVideoBytes : config.maxDocumentBytes;
    const maximumLabel = isVideoType(type) ? "90MB" : "20MB";
    if (file.size > maximumBytes) return `자료 파일은 ${maximumLabel} 이하만 사용할 수 있습니다.`;
    if (!fileMatchesType(file, type)) return `${type.label}에 허용되지 않는 파일 형식입니다.`;
    return "";
  }

  function assignDroppedFile(input, file) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function initializeDropZone(zone, input, status) {
    let dragDepth = 0;

    zone.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      input.click();
    });
    zone.addEventListener("dragenter", (event) => {
      event.preventDefault();
      dragDepth += 1;
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", (event) => {
      event.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) zone.classList.remove("is-dragover");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      dragDepth = 0;
      zone.classList.remove("is-dragover");
      const file = event.dataTransfer.files?.[0];
      const error = getDroppedFileError(input, file);
      status.textContent = error;
      zone.classList.toggle("is-error", Boolean(error));
      if (!error) assignDroppedFile(input, file);
    });
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
    const videoSource = isVideoType(type) ? getVideoSourceMethod() : "file";
    const youtubeUrl = videoSource === "youtube" ? normalizeYouTubeUrl(elements.youtubeUrl.value) : "";

    if (videoSource === "file") {
      if (!file) throw new Error("업로드할 자료 파일을 선택해 주세요.");
      const maximumBytes = isVideoType(type) ? config.maxVideoBytes : config.maxDocumentBytes;
      const maximumLabel = isVideoType(type) ? "90MB" : "20MB";
      if (file.size > maximumBytes) throw new Error(`자료 파일은 ${maximumLabel} 이하만 업로드할 수 있습니다.`);
      if (!fileMatchesType(file, type)) throw new Error(`${type.label}에 허용되지 않는 파일 형식입니다.`);
    }
    if (!elements.title.value.trim()) throw new Error("자료명을 입력해 주세요.");
    if (!elements.description.value.trim()) throw new Error("자료 설명을 입력해 주세요.");
    const isSecure = getSecurityMode(elements.uploadSecurityInputs) === "secure";

    if (thumbnail) {
      const validThumbnailTypes = ["image/webp", "image/jpeg", "image/png"];
      if (!validThumbnailTypes.includes(thumbnail.type)) throw new Error("표지는 WebP, JPG 또는 PNG만 사용할 수 있습니다.");
      if (thumbnail.size > config.maxThumbnailBytes) throw new Error("표지 이미지는 5MB 이하만 업로드할 수 있습니다.");
    }

    return { category, type, file, thumbnail, videoSource, youtubeUrl, isSecure };
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
      elements.openUploadDialog.disabled = false;
      elements.inventorySection.hidden = false;
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      populateInventoryFilters(library);
      updateFileAccept();
      renderInventory(library);
      setInventoryStatus();
      const materialCount = Array.isArray(library.materials) ? library.materials.length : 0;
      setConnectionStatus(`연결되었습니다. 현재 등록 자료 ${materialCount}건을 불러왔습니다.`, "success");
      return true;
    } catch (error) {
      verifiedToken = "";
      elements.fields.disabled = true;
      elements.openUploadDialog.disabled = true;
      elements.inventorySection.hidden = true;
      closeUploadModal(true);
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

  async function createSharePageTreeEntry(material) {
    if (!window.NiceHubSharePage?.createSharePage || !window.NiceHubSharePage?.getSharePagePath) {
      throw new Error("자료 공유 페이지 생성 기능을 불러오지 못했습니다. 화면을 새로고침해 주세요.");
    }
    const html = window.NiceHubSharePage.createSharePage(material);
    const blob = await createBlob(verifiedToken, textToBase64(html));
    return {
      path: window.NiceHubSharePage.getSharePagePath(material),
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    };
  }

  async function commitLibraryUpdate(reference, latestLibrary, treeEntries, message) {
    const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
    const parentCommit = await githubApi(
      `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
      verifiedToken,
    );
    const tree = await githubApi(`/repos/${config.owner}/${config.repo}/git/trees`, verifiedToken, {
      method: "POST",
      body: JSON.stringify({
        base_tree: parentCommit.tree.sha,
        tree: [{ path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha }, ...treeEntries],
      }),
    });
    const commit = await githubApi(`/repos/${config.owner}/${config.repo}/git/commits`, verifiedToken, {
      method: "POST",
      body: JSON.stringify({ message, tree: tree.sha, parents: [reference.object.sha] }),
    });
    await githubApi(`/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`, verifiedToken, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
    return commit;
  }

  async function runMaterialUpdate(materialId, progressMessage, updater) {
    if (isUploading || isDeleting || isEditingMaterial || isAddingCategory || isAddingMaterialType) return false;
    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      const message = "토큰 연결을 다시 확인한 뒤 자료를 수정해 주세요.";
      setInventoryStatus(message, "error");
      showOperationResult("error", "변경하지 못했습니다.", message);
      return false;
    }

    isEditingMaterial = true;
    elements.fields.disabled = true;
    elements.refreshMaterialsButton.disabled = true;
    renderInventory(library);
    setInventoryStatus(progressMessage, "progress");
    showOperationProgress("변경사항을 저장하고 있습니다.", progressMessage);

    try {
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      latestLibrary.materials = Array.isArray(latestLibrary.materials) ? latestLibrary.materials : [];
      const material = latestLibrary.materials.find((item) => item.id === materialId);
      if (!material) throw new Error("수정할 자료를 최신 목록에서 찾지 못했습니다. 목록을 새로고침해 주세요.");

      const update = await updater(material, latestLibrary);
      const sharePageEntry = await createSharePageTreeEntry(material);
      const commit = await commitLibraryUpdate(
        reference,
        latestLibrary,
        [...(update.treeEntries || []), sharePageEntry],
        update.commitMessage,
      );
      library = latestLibrary;
      setInventoryStatus(update.successMessage, "success");
      renderInventory(library);
      hideOperationProgress();
      window.setTimeout(
        () => showOperationResult("success", update.successTitle || "변경이 완료되었습니다.", update.successMessage),
        0,
      );
      return true;
    } catch (error) {
      const message = userFriendlyError(error);
      setInventoryStatus(message, "error");
      hideOperationProgress();
      window.setTimeout(() => showOperationResult("error", "변경하지 못했습니다.", message), 0);
      return false;
    } finally {
      isEditingMaterial = false;
      elements.fields.disabled = !verifiedToken;
      elements.refreshMaterialsButton.disabled = false;
      renderInventory(library);
    }
  }

  async function setMaterialVisibility(materialId, isPublished) {
    const currentMaterial = library?.materials?.find((item) => item.id === materialId);
    if (!currentMaterial || (currentMaterial.isPublished !== false) === isPublished) return;

    const actionLabel = isPublished ? "공개" : "비공개";
    await runMaterialUpdate(materialId, `‘${currentMaterial.title}’ 자료를 ${actionLabel}로 변경하고 있습니다.`, async (material) => {
      material.isPublished = isPublished;
      return {
        treeEntries: [],
        commitMessage: `${isPublished ? "Publish" : "Unpublish"} material: ${material.title}`,
        successTitle: `${actionLabel} 처리되었습니다.`,
        successMessage: "",
      };
    });
  }

  function openVisibilityConfirmDialog(materialId, isPublished, trigger) {
    const material = library?.materials?.find((item) => item.id === materialId);
    if (!material || (material.isPublished !== false) === isPublished || elements.visibilityConfirmDialog.open) return;
    pendingVisibilityId = materialId;
    pendingVisibilityState = isPublished;
    lastVisibilityTrigger = trigger;
    const actionLabel = isPublished ? "공개" : "비공개";
    elements.visibilityConfirmTitle.textContent = `정말 ${actionLabel}할까요?`;
    elements.visibilityConfirmMessage.textContent = isPublished
      ? `‘${material.title}’ 자료가 자료HUB 메인페이지에 노출됩니다.`
      : `‘${material.title}’ 자료가 자료HUB 메인페이지에 노출되지 않습니다.`;
    elements.confirmVisibilityChange.textContent = `${actionLabel}하기`;
    elements.confirmVisibilityChange.className = `button ${isPublished ? "button-primary" : "button-danger"}`;
    elements.visibilityConfirmDialog.showModal();
    syncDialogScrollLock();
    window.requestAnimationFrame(() => elements.cancelVisibilityConfirm.focus());
  }

  function closeVisibilityConfirmDialog() {
    if (elements.visibilityConfirmDialog.open) elements.visibilityConfirmDialog.close();
  }

  async function confirmMaterialVisibility() {
    const materialId = pendingVisibilityId;
    const isPublished = pendingVisibilityState;
    if (!materialId || typeof isPublished !== "boolean") return;
    closeVisibilityConfirmDialog();
    await setMaterialVisibility(materialId, isPublished);
  }

  function getSettingsOrderConfig(kind) {
    return kind === "category"
      ? {
          key: "categories",
          kicker: "사업 분류 설정",
          title: "사업 카테고리 순서 변경",
          description: "메인 자료허브의 사업 카테고리 탭 표시 순서를 변경합니다.",
          commitMessage: "Reorder business categories",
          successMessage: "사업 카테고리 순서를 저장했습니다.",
        }
      : {
          key: "materialTypes",
          kicker: "자료 분류 설정",
          title: "자료 유형 순서 변경",
          description: "메인 자료허브의 자료 유형 탭 표시 순서를 변경합니다.",
          commitMessage: "Reorder material types",
          successMessage: "자료 유형 순서를 저장했습니다.",
        };
  }

  function renderSettingsOrderList() {
    const config = getSettingsOrderConfig(settingsOrderKind);
    const items = Array.isArray(library?.[config.key]) ? library[config.key] : [];
    const itemMap = new Map(items.map((item) => [item.id, item]));
    const fragment = document.createDocumentFragment();

    settingsOrderDraft.forEach((id, index) => {
      const item = itemMap.get(id);
      if (!item) return;
      const row = createElement("div", "settings-order-item");
      row.dataset.settingId = id;
      row.append(
        createElement("span", "settings-order-number", String(index + 1)),
        createElement("strong", "settings-order-label", item.label || id),
      );

      const actions = createElement("div", "settings-order-actions");
      const upButton = createElement("button", "settings-order-move", "↑");
      upButton.type = "button";
      upButton.disabled = index === 0;
      upButton.setAttribute("aria-label", `${item.label || id} 위로 이동`);
      upButton.addEventListener("click", () => moveSettingsOrderItem(index, -1));

      const downButton = createElement("button", "settings-order-move", "↓");
      downButton.type = "button";
      downButton.disabled = index === settingsOrderDraft.length - 1;
      downButton.setAttribute("aria-label", `${item.label || id} 아래로 이동`);
      downButton.addEventListener("click", () => moveSettingsOrderItem(index, 1));
      actions.append(upButton, downButton);
      row.appendChild(actions);
      fragment.appendChild(row);
    });

    elements.settingsOrderList.replaceChildren(fragment);
  }

  function moveSettingsOrderItem(index, offset) {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= settingsOrderDraft.length) return;
    const movedId = settingsOrderDraft[index];
    [settingsOrderDraft[index], settingsOrderDraft[nextIndex]] = [
      settingsOrderDraft[nextIndex],
      settingsOrderDraft[index],
    ];
    renderSettingsOrderList();
    window.requestAnimationFrame(() => {
      const row = elements.settingsOrderList.querySelector(`[data-setting-id="${CSS.escape(movedId)}"]`);
      row?.querySelector(".settings-order-move:not(:disabled)")?.focus();
    });
  }

  function openSettingsOrderDialog(kind, trigger) {
    if (
      !verifiedToken ||
      isUploading ||
      isDeleting ||
      isEditingMaterial ||
      isAddingCategory ||
      isAddingMaterialType ||
      isReorderingSettings
    )
      return;

    const config = getSettingsOrderConfig(kind);
    const items = Array.isArray(library?.[config.key]) ? sortSettingsByOrder(library[config.key]) : [];
    if (items.length < 2) return;
    settingsOrderKind = kind;
    settingsOrderDraft = items.map((item) => item.id);
    settingsOrderInitial = [...settingsOrderDraft];
    lastSettingsOrderTrigger = trigger;
    elements.settingsOrderKicker.textContent = config.kicker;
    elements.settingsOrderDialogTitle.textContent = config.title;
    elements.settingsOrderDescription.textContent = config.description;
    renderSettingsOrderList();
    elements.settingsOrderDialog.showModal();
    syncDialogScrollLock();
    window.requestAnimationFrame(() => elements.settingsOrderList.querySelector("button:not(:disabled)")?.focus());
  }

  function closeSettingsOrderDialog() {
    if (isReorderingSettings || !elements.settingsOrderDialog.open) return;
    elements.settingsOrderDialog.close();
  }

  async function saveSettingsOrder(event) {
    event.preventDefault();
    if (isReorderingSettings || !settingsOrderKind) return;
    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      elements.settingsOrderDialog.close();
      showOperationResult("error", "순서를 저장하지 못했습니다.", "토큰 연결을 다시 확인해 주세요.");
      return;
    }

    const kind = settingsOrderKind;
    const config = getSettingsOrderConfig(kind);
    const requestedOrder = [...settingsOrderDraft];
    const orderChanged = requestedOrder.some((id, index) => id !== settingsOrderInitial[index]);
    if (!orderChanged) {
      elements.settingsOrderDialog.close();
      showOperationResult("success", "변경된 순서가 없습니다.", "현재 표시 순서를 그대로 유지합니다.");
      return;
    }

    isReorderingSettings = true;
    elements.settingsOrderDialog.close();
    elements.fields.disabled = true;
    elements.refreshMaterialsButton.disabled = true;
    renderInventory(library);
    showOperationProgress("순서를 저장하고 있습니다.", "GitHub에 변경된 표시 순서를 반영하는 중입니다.");

    try {
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      const latestItems = Array.isArray(latestLibrary[config.key]) ? latestLibrary[config.key] : [];
      const latestMap = new Map(latestItems.map((item) => [item.id, item]));
      const requestedIds = new Set(requestedOrder);
      const orderedItems = requestedOrder.map((id) => latestMap.get(id)).filter(Boolean);
      orderedItems.push(...latestItems.filter((item) => !requestedIds.has(item.id)));
      orderedItems.forEach((item, index) => {
        item.order = (index + 1) * 10;
      });
      latestLibrary[config.key] = orderedItems;

      await commitLibraryUpdate(reference, latestLibrary, [], config.commitMessage);
      const selectedCategory = elements.category.value;
      const selectedType = elements.materialType.value;
      library = latestLibrary;
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      if (library.categories?.some((item) => item.id === selectedCategory)) elements.category.value = selectedCategory;
      if (library.materialTypes?.some((item) => item.id === selectedType)) elements.materialType.value = selectedType;
      populateInventoryFilters(library);
      updateFileAccept();
      renderInventory(library);
      showOperationResult("success", "순서 변경이 완료되었습니다.", config.successMessage);
    } catch (error) {
      showOperationResult("error", "순서를 저장하지 못했습니다.", userFriendlyError(error));
    } finally {
      isReorderingSettings = false;
      elements.fields.disabled = !verifiedToken;
      elements.refreshMaterialsButton.disabled = false;
      renderInventory(library);
    }
  }

  function openReplacementFilePicker(materialId, replacementType, trigger) {
    if (!verifiedToken || isUploading || isDeleting || isEditingMaterial) return;
    const material = library?.materials?.find((item) => item.id === materialId);
    if (!material) return;
    const type = library?.materialTypes?.find((item) => item.id === material.type);
    if (replacementType === "material" && !type) {
      const message = "자료 유형 설정을 찾지 못했습니다. 목록을 새로고침해 주세요.";
      setInventoryStatus(message, "error");
      showOperationResult("error", "파일을 변경하지 못했습니다.", message);
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.className = "native-file-input";
    input.accept =
      replacementType === "thumbnail"
        ? "image/webp,image/jpeg,image/png,.webp,.jpg,.jpeg,.png"
        : Array.isArray(type.accept)
          ? type.accept.join(",")
          : documentAccept.join(",");
    document.body.appendChild(input);

    let selectionHandled = false;
    input.addEventListener(
      "change",
      () => {
        selectionHandled = true;
        const file = input.files?.[0];
        input.remove();
        if (!file) return;
        if (replacementType === "thumbnail") void replaceMaterialThumbnail(materialId, file);
        else void replaceMaterialFile(materialId, file);
      },
      { once: true },
    );
    window.addEventListener(
      "focus",
      () => {
        window.setTimeout(() => {
          if (!selectionHandled) {
            input.remove();
            if (trigger && document.contains(trigger)) trigger.focus();
          }
        }, 500);
      },
      { once: true },
    );
    input.click();
  }

  async function replaceMaterialThumbnail(materialId, file) {
    const validMimeTypes = ["image/webp", "image/jpeg", "image/png"];
    const validExtension = /\.(?:webp|jpe?g|png)$/i.test(file.name);
    if ((!validMimeTypes.includes(file.type) && !validExtension) || file.size > config.maxThumbnailBytes) {
      const message =
        file.size > config.maxThumbnailBytes
          ? "표지 이미지는 5MB 이하만 사용할 수 있습니다."
          : "표지는 WebP, JPG 또는 PNG 파일만 사용할 수 있습니다.";
      setInventoryStatus(message, "error");
      showOperationResult("error", "썸네일을 변경하지 못했습니다.", message);
      return;
    }

    const saved = await runMaterialUpdate(
      materialId,
      "새 썸네일 이미지를 GitHub에 반영하고 있습니다.",
      async (material, latestLibrary) => {
        const newPath = `assets/thumbnails/${timestampString()}-${sanitizeFileName(file.name)}`;
        const thumbnailBlob = await createBlob(verifiedToken, bytesToBase64(await file.arrayBuffer()));
        const oldPath = getDeletableRepositoryPath(material.thumbnail, "assets/thumbnails/");
        material.thumbnail = newPath;
        markMaterialUpdated(material);

        const treeEntries = [{ path: newPath, mode: "100644", type: "blob", sha: thumbnailBlob.sha }];
        const oldPathIsShared = latestLibrary.materials.some(
          (item) => item.id !== material.id && item.thumbnail === oldPath,
        );
        if (oldPath && oldPath !== newPath && !oldPathIsShared) {
          treeEntries.push({ path: oldPath, mode: "100644", type: "blob", sha: null });
        }

        return {
          treeEntries,
          commitMessage: `Update thumbnail: ${material.title}`,
          successMessage: `‘${material.title}’ 자료의 썸네일 이미지를 변경했습니다.`,
        };
      },
    );
    if (saved) {
      setLocalThumbnailPreview(materialId, file);
      renderInventory(library);
    }
  }

  async function replaceMaterialFile(materialId, file) {
    await runMaterialUpdate(materialId, "새 자료 파일을 확인하고 GitHub에 반영하고 있습니다.", async (material, latestLibrary) => {
      const type = latestLibrary.materialTypes?.find((item) => item.id === material.type);
      const category = latestLibrary.categories?.find((item) => item.id === material.category);
      if (!type || !category) throw new Error("자료의 사업 카테고리 또는 자료 유형 설정을 찾지 못했습니다.");

      const maximumBytes = isVideoType(type) ? config.maxVideoBytes : config.maxDocumentBytes;
      const maximumLabel = isVideoType(type) ? "90MB" : "20MB";
      if (file.size > maximumBytes) throw new Error(`자료 파일은 ${maximumLabel} 이하만 업로드할 수 있습니다.`);
      if (!fileMatchesType(file, type)) throw new Error(`${type.label}에 허용되지 않는 파일 형식입니다.`);

      const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
      const typeFolder = validateFolderSegment(type.folder, "자료 유형");
      const newPath = `assets/materials/${categoryFolder}/${typeFolder}/${timestampString()}-${sanitizeFileName(file.name)}`;
      const uploadedFormat = getUploadedFormat(file, type);
      const fileBuffer = await file.arrayBuffer();
      const pageCount = uploadedFormat === "pdf" ? await getPdfPageCount(fileBuffer) : null;
      const fileBlob = await createBlob(verifiedToken, bytesToBase64(fileBuffer));
      const oldPath = getDeletableRepositoryPath(material.file, "assets/materials/");

      material.file = newPath;
      material.format = uploadedFormat;
      material.fileSizeBytes = file.size;
      markMaterialUpdated(material);
      if (file.type) material.mimeType = file.type;
      else delete material.mimeType;
      if (Number.isInteger(pageCount) && pageCount > 0) material.pageCount = pageCount;
      else delete material.pageCount;
      if (isVideoType(type)) material.sourceType = "file";

      const treeEntries = [{ path: newPath, mode: "100644", type: "blob", sha: fileBlob.sha }];
      const oldPathIsShared = latestLibrary.materials.some((item) => item.id !== material.id && item.file === oldPath);
      if (oldPath && oldPath !== newPath && !oldPathIsShared) {
        treeEntries.push({ path: oldPath, mode: "100644", type: "blob", sha: null });
      }

      return {
        treeEntries,
        commitMessage: `Update file: ${material.title}`,
        successMessage: `‘${material.title}’ 자료의 업로드 파일을 변경했습니다.`,
      };
    });
  }

  function setEditContentDialogStatus(message = "", type = "") {
    elements.editContentDialogStatus.textContent = message;
    elements.editContentDialogStatus.className = `dialog-status${type ? ` status-${type}` : ""}`;
  }

  function syncDialogScrollLock() {
    const hasOpenLockingDialog = [
      elements.settingsOrderDialog,
      elements.editContentDialog,
      elements.categoryDialog,
      elements.materialTypeDialog,
      elements.deleteDialog,
      elements.visibilityConfirmDialog,
    ].some((dialog) => dialog.open);
    document.documentElement.classList.toggle("dialog-scroll-locked", hasOpenLockingDialog);
    document.body.classList.toggle("dialog-scroll-locked", hasOpenLockingDialog);
  }

  function openEditContentDialog(materialId, trigger) {
    if (!verifiedToken || isUploading || isDeleting || isEditingMaterial) return;
    const material = library?.materials?.find((item) => item.id === materialId);
    if (!material) return;
    pendingContentEditId = materialId;
    lastContentEditTrigger = trigger;
    elements.editMaterialTitle.value = material.title || "";
    elements.editMaterialDescription.value = limitDescriptionLines(material.description || "").slice(
      0,
      config.maxDescriptionLength,
    );
    const securityMode = material.isSecure === true ? "secure" : "public";
    const securityInput = elements.editSecurityInputs.find((input) => input.value === securityMode);
    if (securityInput) securityInput.checked = true;
    updateEditSecurityFields();
    elements.editDescriptionCount.textContent = String(elements.editMaterialDescription.value.length);
    setEditContentDialogStatus();
    hideEditContentProgress();
    elements.editContentDialog.showModal();
    syncDialogScrollLock();
    window.requestAnimationFrame(() => elements.editMaterialTitle.focus());
  }

  function closeEditContentDialog() {
    if (isEditingMaterial || !elements.editContentDialog.open) return;
    elements.editContentDialog.close();
  }

  async function saveMaterialContent(event) {
    event.preventDefault();
    const materialId = pendingContentEditId;
    const title = elements.editMaterialTitle.value.trim();
    const description = limitDescriptionLines(elements.editMaterialDescription.value)
      .slice(0, config.maxDescriptionLength)
      .trim();
    const isSecure = getSecurityMode(elements.editSecurityInputs) === "secure";
    if (!materialId || isEditingMaterial) return;
    if (!title || !description) {
      setEditContentDialogStatus("자료명과 짧은 설명을 모두 입력해 주세요.", "error");
      return;
    }

    elements.saveEditContentButton.disabled = true;
    elements.cancelEditContentDialog.disabled = true;
    elements.closeEditContentDialog.disabled = true;
    setEditContentDialogStatus();
    showEditContentProgress(
      "변경 내용을 저장하고 있습니다.",
      "자료명, 설명과 보안 설정을 GitHub에 반영하는 중입니다.",
    );
    let saved = false;
    try {
      saved = await runMaterialUpdate(
        materialId,
        "자료명과 짧은 설명을 GitHub에 반영하고 있습니다.",
        async (material) => {
          material.title = title;
          material.description = description;
          material.isSecure = isSecure;
          markMaterialUpdated(material);
          return {
            treeEntries: [],
            commitMessage: `Update material details: ${title}`,
            successMessage: `‘${title}’ 자료의 자료명과 짧은 설명을 변경했습니다.`,
          };
        },
      );
    } finally {
      hideEditContentProgress();
      elements.saveEditContentButton.disabled = false;
      elements.cancelEditContentDialog.disabled = false;
      elements.closeEditContentDialog.disabled = false;
    }
    if (saved && elements.editContentDialog.open) elements.editContentDialog.close();
    else if (!saved) setEditContentDialogStatus("변경 내용을 저장하지 못했습니다. 목록의 오류 안내를 확인해 주세요.", "error");
  }

  function getEditVideoSourceMethod() {
    return elements.editVideoSourceInputs.find((input) => input.checked)?.value || "file";
  }

  function setEditVideoDialogStatus(message = "", type = "") {
    elements.editVideoDialogStatus.textContent = message;
    elements.editVideoDialogStatus.className = `dialog-status${type ? ` status-${type}` : ""}`;
  }

  function updateEditVideoFields() {
    const source = getEditVideoSourceMethod();
    const youtube = source === "youtube";
    elements.editVideoFileGroup.hidden = youtube;
    elements.editVideoUrlGroup.hidden = !youtube;
    setEditVideoDialogStatus();
  }

  function openEditVideoDialog(materialId, trigger) {
    if (!verifiedToken || isUploading || isDeleting || isEditingMaterial) return;
    const material = library?.materials?.find((item) => item.id === materialId);
    const type = library?.materialTypes?.find((item) => item.id === material?.type);
    if (!material || !isVideoType(type)) return;

    pendingVideoEditId = materialId;
    lastVideoEditTrigger = trigger;
    elements.editVideoForm.reset();
    const currentSource = isYouTubeMaterial(material) ? "youtube" : "file";
    const sourceInput = elements.editVideoSourceInputs.find((input) => input.value === currentSource);
    if (sourceInput) sourceInput.checked = true;
    elements.editVideoUrl.value = currentSource === "youtube" ? material.file : "";
    elements.editVideoFileName.textContent =
      currentSource === "file" ? `새 파일을 선택해 주세요 (현재: ${getFileName(material.file)})` : "선택된 파일 없음";
    updateEditVideoFields();
    elements.editVideoDialog.showModal();
    window.requestAnimationFrame(() => sourceInput?.focus());
  }

  function closeEditVideoDialog() {
    if (isEditingMaterial || !elements.editVideoDialog.open) return;
    elements.editVideoDialog.close();
  }

  async function saveVideoChange(event) {
    event.preventDefault();
    const materialId = pendingVideoEditId;
    const source = getEditVideoSourceMethod();
    const file = elements.editVideoFile.files?.[0] || null;
    let youtubeUrl = "";
    if (!materialId || isEditingMaterial) return;

    try {
      if (source === "youtube") youtubeUrl = normalizeYouTubeUrl(elements.editVideoUrl.value);
      else if (!file) throw new Error("새로 업로드할 MP4 또는 WebM 영상 파일을 선택해 주세요.");
    } catch (error) {
      setEditVideoDialogStatus(error.message, "error");
      return;
    }

    elements.saveEditVideoButton.disabled = true;
    elements.cancelEditVideoDialog.disabled = true;
    elements.closeEditVideoDialog.disabled = true;
    elements.editVideoSourceInputs.forEach((input) => {
      input.disabled = true;
    });
    setEditVideoDialogStatus("변경할 영상을 GitHub에 저장하고 있습니다.", "progress");

    const saved = await runMaterialUpdate(materialId, "영상 자료를 GitHub에 반영하고 있습니다.", async (material, latestLibrary) => {
      const type = latestLibrary.materialTypes?.find((item) => item.id === material.type);
      const category = latestLibrary.categories?.find((item) => item.id === material.category);
      if (!isVideoType(type) || !category) throw new Error("영상의 사업 카테고리 또는 자료 유형 설정을 찾지 못했습니다.");

      const oldPath = getDeletableRepositoryPath(material.file, "assets/materials/");
      const treeEntries = [];

      if (source === "youtube") {
        material.file = youtubeUrl;
        material.sourceType = "youtube";
        material.format = "video";
        delete material.mimeType;
        delete material.fileSizeBytes;
        delete material.pageCount;
      } else {
        if (file.size > config.maxVideoBytes) throw new Error("영상 파일은 90MB 이하만 업로드할 수 있습니다.");
        if (!fileMatchesType(file, type)) throw new Error("동영상 자료에는 MP4 또는 WebM 파일만 사용할 수 있습니다.");
        const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
        const typeFolder = validateFolderSegment(type.folder, "자료 유형");
        const newPath = `assets/materials/${categoryFolder}/${typeFolder}/${timestampString()}-${sanitizeFileName(file.name)}`;
        const fileBlob = await createBlob(verifiedToken, bytesToBase64(await file.arrayBuffer()));
        treeEntries.push({ path: newPath, mode: "100644", type: "blob", sha: fileBlob.sha });
        material.file = newPath;
        material.sourceType = "file";
        material.format = "video";
        material.fileSizeBytes = file.size;
        if (file.type) material.mimeType = file.type;
        else delete material.mimeType;
        delete material.pageCount;
      }

      markMaterialUpdated(material);
      const oldPathIsShared = latestLibrary.materials.some((item) => item.id !== material.id && item.file === oldPath);
      if (oldPath && oldPath !== material.file && !oldPathIsShared) {
        treeEntries.push({ path: oldPath, mode: "100644", type: "blob", sha: null });
      }

      return {
        treeEntries,
        commitMessage: `Update video source: ${material.title}`,
        successMessage:
          source === "youtube"
            ? `‘${material.title}’ 영상을 YouTube 링크로 변경했습니다.`
            : `‘${material.title}’ 영상을 직접 업로드 파일로 변경했습니다.`,
      };
    });

    elements.saveEditVideoButton.disabled = false;
    elements.cancelEditVideoDialog.disabled = false;
    elements.closeEditVideoDialog.disabled = false;
    elements.editVideoSourceInputs.forEach((input) => {
      input.disabled = false;
    });
    if (saved && elements.editVideoDialog.open) elements.editVideoDialog.close();
    else if (!saved) setEditVideoDialogStatus("영상을 변경하지 못했습니다. 목록의 오류 안내를 확인해 주세요.", "error");
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (isUploading || isDeleting || isEditingMaterial) return;
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
      const { category, type, file, thumbnail, videoSource, youtubeUrl, isSecure } = validateInputs(latestLibrary);
      const now = new Date();
      const stamp = timestampString(now);
      const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
      const typeFolder = validateFolderSegment(type.folder, "자료 유형");
      const isYoutubeVideo = isVideoType(type) && videoSource === "youtube";
      const materialPath = isYoutubeVideo
        ? youtubeUrl
        : `assets/materials/${categoryFolder}/${typeFolder}/${stamp}-${sanitizeFileName(file.name)}`;
      const thumbnailPath = thumbnail ? `assets/thumbnails/${stamp}-${sanitizeFileName(thumbnail.name)}` : "";
      const uploadedFormat = getUploadedFormat(file, type);

      let fileBlob = null;
      let pageCount = null;
      if (!isYoutubeVideo) {
        setProgress("자료 파일을 변환하고 있습니다.", `${file.name}을(를) 업로드할 준비 중입니다.`);
        const fileBuffer = await file.arrayBuffer();
        if (uploadedFormat === "pdf") {
          setProgress("PDF 정보를 확인하고 있습니다.", "카드에 표시할 페이지 수를 계산하는 중입니다.");
          pageCount = await getPdfPageCount(fileBuffer);
        }
        const fileContent = bytesToBase64(fileBuffer);
        fileBlob = await createBlob(verifiedToken, fileContent);
      } else {
        setProgress("YouTube 링크를 준비하고 있습니다.", "영상 주소와 자료 정보를 등록하는 중입니다.");
      }

      let thumbnailBlob = null;
      if (thumbnail) {
        setProgress("표지 이미지를 준비하고 있습니다.", `${thumbnail.name}을(를) 처리 중입니다.`);
        thumbnailBlob = await createBlob(verifiedToken, bytesToBase64(await thumbnail.arrayBuffer()));
      }

      const material = {
        id: `${category.id}-${type.id}-${Date.now().toString(36)}`,
        category: category.id,
        type: type.id,
        format: uploadedFormat,
        title: elements.title.value.trim(),
        description: limitDescriptionLines(elements.description.value).slice(0, config.maxDescriptionLength).trim(),
        file: materialPath,
        thumbnail: thumbnailPath,
        updatedAt: localDateString(now),
        registeredAt: now.toISOString(),
        isSecure,
        isPublished: true,
      };
      if (file?.type) material.mimeType = file.type;
      if (file?.size) material.fileSizeBytes = file.size;
      if (Number.isInteger(pageCount) && pageCount > 0) material.pageCount = pageCount;
      if (isVideoType(type)) material.sourceType = videoSource;
      latestLibrary.materials = Array.isArray(latestLibrary.materials) ? latestLibrary.materials : [];
      latestLibrary.materials.push(material);

      setProgress("자료 목록을 업데이트하고 있습니다.", "파일과 자료 정보를 하나의 커밋으로 묶는 중입니다.");
      const sharePageEntry = await createSharePageTreeEntry(material);
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
      treeEntries.push(sharePageEntry);

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
      hideUploadProgress();
      closeUploadModal(true);
      showResult(
        "success",
        "업로드가 완료되었습니다.",
        isYoutubeVideo
          ? "YouTube 링크와 자료 정보가 GitHub에 저장됐습니다. Pages 반영에는 잠시 시간이 걸릴 수 있습니다."
          : "파일과 자료 목록이 GitHub에 저장됐습니다. Pages 반영에는 잠시 시간이 걸릴 수 있습니다.",
      );
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      populateInventoryFilters(library);
      resetUploadForm();
      elements.inventorySection.hidden = false;
      if (thumbnail) setLocalThumbnailPreview(material.id, thumbnail);
      renderInventory(library);
      setInventoryStatus("새 자료가 목록에 추가되었습니다.", "success");
    } catch (error) {
      hideUploadProgress();
      showResult("error", "업로드하지 못했습니다.", userFriendlyError(error));
    } finally {
      isUploading = false;
      elements.fields.disabled = !verifiedToken;
    }
  }

  async function refreshMaterials() {
    if (!verifiedToken || isUploading || isDeleting || isEditingMaterial) return;
    elements.refreshMaterialsButton.disabled = true;
    showOperationProgress("자료 목록을 새로고침하고 있습니다.", "GitHub에서 최신 자료 목록을 불러오는 중입니다.");

    try {
      const state = await fetchRepositoryState(verifiedToken);
      library = state.library;
      populateInventoryFilters(library);
      renderInventory(library);
      showOperationResult("success", "새로고침이 완료되었습니다.", "최신 자료 목록으로 갱신했습니다.");
    } catch (error) {
      showOperationResult("error", "새로고침하지 못했습니다.", userFriendlyError(error));
    } finally {
      elements.refreshMaterialsButton.disabled = false;
    }
  }

  async function deleteSelectedMaterial() {
    const materialId = pendingDeleteId;
    if (!materialId || isDeleting || isEditingMaterial) return;
    closeDeleteDialog();

    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      const message = "토큰 연결을 다시 확인한 뒤 삭제해 주세요.";
      setInventoryStatus(message, "error");
      showOperationResult("error", "삭제하지 못했습니다.", message);
      return;
    }

    isDeleting = true;
    elements.fields.disabled = true;
    elements.refreshMaterialsButton.disabled = true;
    renderInventory(library);
    setInventoryStatus("GitHub에서 자료 파일과 목록을 삭제하고 있습니다. 이 화면을 닫지 마세요.", "progress");
    showOperationProgress(
      "자료를 삭제하고 있습니다.",
      "GitHub에서 자료 파일과 목록을 삭제하고 있습니다. 이 화면을 닫지 마세요.",
    );

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
      if (window.NiceHubSharePage?.getSharePagePath) {
        treeEntries.push({
          path: window.NiceHubSharePage.getSharePagePath(material),
          mode: "100644",
          type: "blob",
          sha: null,
        });
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
      const message = materialPath
        ? `‘${material.title}’ 자료와 원본 파일을 삭제했습니다.`
        : `‘${material.title}’ 외부 링크 자료를 목록에서 삭제했습니다.`;
      const localThumbnail = localThumbnailPreviews.get(materialId);
      if (localThumbnail) URL.revokeObjectURL(localThumbnail);
      localThumbnailPreviews.delete(materialId);
      setInventoryStatus(message, "success");
      renderInventory(library);
      showOperationResult("success", "삭제가 완료되었습니다.", message);
    } catch (error) {
      const message = userFriendlyError(error);
      setInventoryStatus(message, "error");
      showOperationResult("error", "삭제하지 못했습니다.", message);
    } finally {
      isDeleting = false;
      elements.fields.disabled = !verifiedToken;
      elements.refreshMaterialsButton.disabled = false;
      renderInventory(library);
    }
  }

  function setCategoryDialogStatus(message = "", type = "") {
    elements.categoryDialogStatus.textContent = message;
    elements.categoryDialogStatus.className = `dialog-status${type ? ` status-${type}` : ""}`;
  }

  function openCategoryDialog() {
    if (
      !verifiedToken ||
      isUploading ||
      isDeleting ||
      isEditingMaterial ||
      isAddingCategory ||
      isAddingMaterialType ||
      isReorderingSettings
    )
      return;
    lastCategoryTrigger = document.activeElement;
    elements.categoryForm.reset();
    setCategoryDialogStatus();
    elements.categoryDialog.showModal();
    syncDialogScrollLock();
    window.requestAnimationFrame(() => elements.newCategoryName.focus());
  }

  function closeCategoryDialog() {
    if (isAddingCategory || !elements.categoryDialog.open) return;
    elements.categoryDialog.close();
  }

  function createCategorySetting(label, sourceLibrary) {
    const categories = Array.isArray(sourceLibrary.categories) ? sourceLibrary.categories : [];
    const existingLabels = new Set(
      categories.map((category) => String(category.label || "").trim().toLocaleLowerCase("ko")),
    );
    if (existingLabels.has(label.toLocaleLowerCase("ko"))) {
      throw new Error("같은 이름의 사업 카테고리가 이미 등록되어 있습니다.");
    }

    let suffix = Date.now().toString(36);
    const existingIds = new Set(categories.map((category) => category.id));
    const existingFolders = new Set(categories.map((category) => category.folder || category.id));
    while (existingIds.has(`category-${suffix}`) || existingFolders.has(`category-${suffix}`)) {
      suffix = `${suffix}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const orders = categories.map((category) => Number(category.order)).filter(Number.isFinite);
    const nextOrder = (orders.length ? Math.max(...orders) : 0) + 10;
    return {
      id: `category-${suffix}`,
      label,
      folder: `category-${suffix}`,
      description: `${label} 사업의 홍보·운영자료`,
      order: nextOrder,
    };
  }

  async function addCategory(event) {
    event.preventDefault();
    if (isAddingCategory) return;
    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      setCategoryDialogStatus("토큰 연결을 다시 확인한 뒤 추가해 주세요.", "error");
      return;
    }

    const label = elements.newCategoryName.value.trim().replace(/\s+/g, " ");
    if (!label) {
      setCategoryDialogStatus("사업 카테고리명을 입력해 주세요.", "error");
      elements.newCategoryName.focus();
      return;
    }

    isAddingCategory = true;
    elements.saveCategoryButton.disabled = true;
    elements.closeCategoryDialog.disabled = true;
    elements.cancelCategoryDialog.disabled = true;
    setCategoryDialogStatus("GitHub에 사업 카테고리와 자료 유형별 폴더를 만들고 있습니다.", "progress");

    try {
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      latestLibrary.categories = Array.isArray(latestLibrary.categories) ? latestLibrary.categories : [];
      const category = createCategorySetting(label, latestLibrary);
      latestLibrary.categories.push(category);

      const materialTypes = Array.isArray(latestLibrary.materialTypes) ? latestLibrary.materialTypes : [];
      if (!materialTypes.length) throw new Error("폴더를 만들 자료 유형이 없습니다.");

      const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
      const emptyBlob = await createBlob(verifiedToken, "");
      const parentCommit = await githubApi(
        `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
        verifiedToken,
      );
      const categoryFolder = validateFolderSegment(category.folder, "사업 카테고리");
      const treeEntries = [{ path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha }];
      materialTypes.forEach((materialType) => {
        const typeFolder = validateFolderSegment(materialType.folder, "자료 유형");
        treeEntries.push({
          path: `assets/materials/${categoryFolder}/${typeFolder}/.gitkeep`,
          mode: "100644",
          type: "blob",
          sha: emptyBlob.sha,
        });
      });

      const tree = await githubApi(`/repos/${config.owner}/${config.repo}/git/trees`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries }),
      });
      const commit = await githubApi(`/repos/${config.owner}/${config.repo}/git/commits`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({
          message: `Add category: ${category.label}`,
          tree: tree.sha,
          parents: [reference.object.sha],
        }),
      });
      await githubApi(`/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`, verifiedToken, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      library = latestLibrary;
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      populateInventoryFilters(library);
      elements.category.value = category.id;
      updateFileAccept();
      renderInventory(library);
      elements.categoryDialog.close();
      clearResult();
      showResult(
        "success",
        "사업 카테고리가 추가되었습니다.",
        `‘${category.label}’ 사업과 ${materialTypes.length}개 자료 유형 폴더를 GitHub에 만들었습니다.`,
      );
      setConnectionStatus(`‘${category.label}’ 사업 카테고리가 추가되었습니다.`, "success");
      window.requestAnimationFrame(() => elements.category.focus());
    } catch (error) {
      setCategoryDialogStatus(userFriendlyError(error), "error");
    } finally {
      isAddingCategory = false;
      elements.saveCategoryButton.disabled = false;
      elements.closeCategoryDialog.disabled = false;
      elements.cancelCategoryDialog.disabled = false;
      renderInventory(library);
    }
  }

  function setMaterialTypeDialogStatus(message = "", type = "") {
    elements.materialTypeDialogStatus.textContent = message;
    elements.materialTypeDialogStatus.className = `dialog-status${type ? ` status-${type}` : ""}`;
  }

  function openMaterialTypeDialog() {
    if (
      !verifiedToken ||
      isUploading ||
      isDeleting ||
      isEditingMaterial ||
      isAddingCategory ||
      isAddingMaterialType ||
      isReorderingSettings
    )
      return;
    lastMaterialTypeTrigger = document.activeElement;
    elements.materialTypeForm.reset();
    setMaterialTypeDialogStatus();
    elements.materialTypeDialog.showModal();
    syncDialogScrollLock();
    window.requestAnimationFrame(() => elements.newMaterialTypeName.focus());
  }

  function closeMaterialTypeDialog() {
    if (isAddingMaterialType || !elements.materialTypeDialog.open) return;
    elements.materialTypeDialog.close();
  }

  function createMaterialTypeSetting(label, sourceLibrary) {
    const materialTypes = Array.isArray(sourceLibrary.materialTypes) ? sourceLibrary.materialTypes : [];
    const existingLabels = new Set(
      materialTypes.map((type) => String(type.label || "").trim().toLocaleLowerCase("ko")),
    );
    if (existingLabels.has(label.toLocaleLowerCase("ko"))) {
      throw new Error("같은 이름의 자료 유형이 이미 등록되어 있습니다.");
    }

    let suffix = Date.now().toString(36);
    const existingIds = new Set(materialTypes.map((type) => type.id));
    while (existingIds.has(`type-${suffix}`)) suffix = `${suffix}-${Math.random().toString(36).slice(2, 6)}`;
    const orders = materialTypes.map((type) => Number(type.order)).filter(Number.isFinite);
    const nextOrder = (orders.length ? Math.max(...orders) : materialTypes.length * 10) + 10;
    return {
      id: `type-${suffix}`,
      label,
      folder: `type-${suffix}`,
      format: "document",
      accept: [...documentAccept],
      order: nextOrder,
    };
  }

  async function addMaterialType(event) {
    event.preventDefault();
    if (isAddingMaterialType) return;
    if (!verifiedToken || verifiedToken !== elements.token.value.trim()) {
      setMaterialTypeDialogStatus("토큰 연결을 다시 확인한 뒤 추가해 주세요.", "error");
      return;
    }

    const label = elements.newMaterialTypeName.value.trim().replace(/\s+/g, " ");
    if (!label) {
      setMaterialTypeDialogStatus("자료 유형명을 입력해 주세요.", "error");
      elements.newMaterialTypeName.focus();
      return;
    }

    isAddingMaterialType = true;
    elements.saveMaterialTypeButton.disabled = true;
    elements.closeMaterialTypeDialog.disabled = true;
    elements.cancelMaterialTypeDialog.disabled = true;
    setMaterialTypeDialogStatus("GitHub에 자료 유형과 사업별 폴더를 만들고 있습니다.", "progress");

    try {
      const { reference, library: latestLibrary } = await fetchRepositoryState(verifiedToken);
      latestLibrary.materialTypes = Array.isArray(latestLibrary.materialTypes) ? latestLibrary.materialTypes : [];
      const materialType = createMaterialTypeSetting(label, latestLibrary);
      latestLibrary.materialTypes.push(materialType);

      const categories = Array.isArray(latestLibrary.categories) ? latestLibrary.categories : [];
      if (!categories.length) throw new Error("폴더를 만들 사업 카테고리가 없습니다.");

      const dataBlob = await createBlob(verifiedToken, textToBase64(`${JSON.stringify(latestLibrary, null, 2)}\n`));
      const emptyBlob = await createBlob(verifiedToken, "");
      const parentCommit = await githubApi(
        `/repos/${config.owner}/${config.repo}/git/commits/${reference.object.sha}`,
        verifiedToken,
      );
      const treeEntries = [{ path: config.dataPath, mode: "100644", type: "blob", sha: dataBlob.sha }];
      categories.forEach((category) => {
        const categoryFolder = validateFolderSegment(category.folder || category.id, "사업 카테고리");
        treeEntries.push({
          path: `assets/materials/${categoryFolder}/${materialType.folder}/.gitkeep`,
          mode: "100644",
          type: "blob",
          sha: emptyBlob.sha,
        });
      });

      const tree = await githubApi(`/repos/${config.owner}/${config.repo}/git/trees`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries }),
      });
      const commit = await githubApi(`/repos/${config.owner}/${config.repo}/git/commits`, verifiedToken, {
        method: "POST",
        body: JSON.stringify({
          message: `Add material type: ${materialType.label}`,
          tree: tree.sha,
          parents: [reference.object.sha],
        }),
      });
      await githubApi(`/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`, verifiedToken, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      library = latestLibrary;
      populateSelect(elements.category, library.categories || []);
      populateSelect(elements.materialType, library.materialTypes || []);
      populateInventoryFilters(library);
      elements.materialType.value = materialType.id;
      updateFileAccept();
      renderInventory(library);
      elements.materialTypeDialog.close();
      clearResult();
      showResult(
        "success",
        "자료 유형이 추가되었습니다.",
        `‘${materialType.label}’ 유형과 ${categories.length}개 사업별 폴더를 GitHub에 만들었습니다.`,
      );
      setConnectionStatus(`‘${materialType.label}’ 자료 유형이 추가되었습니다.`, "success");
      window.requestAnimationFrame(() => elements.materialType.focus());
    } catch (error) {
      setMaterialTypeDialogStatus(userFriendlyError(error), "error");
    } finally {
      isAddingMaterialType = false;
      elements.saveMaterialTypeButton.disabled = false;
      elements.closeMaterialTypeDialog.disabled = false;
      elements.cancelMaterialTypeDialog.disabled = false;
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
      populateInventoryFilters(library);
      updateUploadSecurityFields();
      updateFileAccept();
    } catch (error) {
      setConnectionStatus("자료 설정을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.", "error");
      elements.connectButton.disabled = true;
    }
  }

  elements.connectButton.addEventListener("click", verifyConnection);
  elements.openUploadDialog.addEventListener("click", openUploadModal);
  elements.closeUploadDialog.addEventListener("click", () => closeUploadModal());
  elements.uploadDialog.addEventListener("cancel", (event) => {
    if (event.target !== elements.uploadDialog) return;
    event.preventDefault();
    closeUploadModal();
  });
  elements.uploadDialog.addEventListener("close", () => {
    document.body.classList.remove("upload-modal-open");
  });
  elements.continueUploadButton.addEventListener("click", closeDiscardUploadDialog);
  elements.discardUploadButton.addEventListener("click", discardUploadDraft);
  elements.discardUploadDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDiscardUploadDialog();
  });
  elements.form.addEventListener("submit", handleUpload);
  elements.form.addEventListener("input", () => {
    if (elements.uploadDialog.open && !isUploading) uploadFormDirty = true;
  });
  elements.form.addEventListener("change", () => {
    if (elements.uploadDialog.open && !isUploading) uploadFormDirty = true;
  });
  elements.uploadSecurityInputs.forEach((input) => input.addEventListener("change", updateUploadSecurityFields));
  elements.refreshMaterialsButton.addEventListener("click", refreshMaterials);
  elements.inventoryCategoryFilter.addEventListener("change", () => renderInventory(library));
  elements.inventoryTypeFilter.addEventListener("change", () => renderInventory(library));
  elements.openCategoryOrderDialog.addEventListener("click", (event) =>
    openSettingsOrderDialog("category", event.currentTarget),
  );
  elements.openMaterialTypeOrderDialog.addEventListener("click", (event) =>
    openSettingsOrderDialog("materialType", event.currentTarget),
  );
  elements.settingsOrderForm.addEventListener("submit", saveSettingsOrder);
  elements.closeSettingsOrderDialog.addEventListener("click", closeSettingsOrderDialog);
  elements.cancelSettingsOrderDialog.addEventListener("click", closeSettingsOrderDialog);
  elements.settingsOrderDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSettingsOrderDialog();
  });
  elements.settingsOrderDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    settingsOrderKind = "";
    settingsOrderDraft = [];
    settingsOrderInitial = [];
    elements.settingsOrderList.replaceChildren();
    if (lastSettingsOrderTrigger && document.contains(lastSettingsOrderTrigger)) lastSettingsOrderTrigger.focus();
    lastSettingsOrderTrigger = null;
  });
  elements.closeOperationResult.addEventListener("click", closeOperationResult);
  elements.operationResultDialog.addEventListener("click", (event) => {
    if (event.target === elements.operationResultDialog) closeOperationResult();
  });
  elements.cancelVisibilityConfirm.addEventListener("click", closeVisibilityConfirmDialog);
  elements.confirmVisibilityChange.addEventListener("click", () => void confirmMaterialVisibility());
  elements.visibilityConfirmDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
  });
  elements.visibilityConfirmDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    pendingVisibilityId = "";
    pendingVisibilityState = null;
    if (lastVisibilityTrigger && document.contains(lastVisibilityTrigger)) lastVisibilityTrigger.focus();
    lastVisibilityTrigger = null;
  });
  elements.cancelDeleteButton.addEventListener("click", closeDeleteDialog);
  elements.confirmDeleteButton.addEventListener("click", deleteSelectedMaterial);
  elements.editContentForm.addEventListener("submit", saveMaterialContent);
  elements.closeEditContentDialog.addEventListener("click", closeEditContentDialog);
  elements.cancelEditContentDialog.addEventListener("click", closeEditContentDialog);
  elements.editMaterialDescription.addEventListener("keydown", preventThirdDescriptionLine);
  elements.editMaterialDescription.addEventListener("beforeinput", preventThirdDescriptionLine);
  elements.editMaterialDescription.addEventListener("input", () => {
    enforceDescriptionLineLimit(elements.editMaterialDescription, elements.editDescriptionCount);
  });
  elements.editSecurityInputs.forEach((input) => input.addEventListener("change", updateEditSecurityFields));
  elements.editContentDialog.addEventListener("cancel", (event) => {
    if (isEditingMaterial) event.preventDefault();
  });
  elements.editContentDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    elements.editContentForm.reset();
    elements.editDescriptionCount.textContent = "0";
    setEditContentDialogStatus();
    pendingContentEditId = "";
    if (lastContentEditTrigger && document.contains(lastContentEditTrigger)) lastContentEditTrigger.focus();
    lastContentEditTrigger = null;
  });
  elements.editVideoForm.addEventListener("submit", saveVideoChange);
  elements.closeEditVideoDialog.addEventListener("click", closeEditVideoDialog);
  elements.cancelEditVideoDialog.addEventListener("click", closeEditVideoDialog);
  elements.editVideoSourceInputs.forEach((input) => input.addEventListener("change", updateEditVideoFields));
  elements.editVideoFile.addEventListener("change", () => {
    elements.editVideoFileName.textContent = elements.editVideoFile.files?.[0]?.name || "선택된 파일 없음";
    setEditVideoDialogStatus();
  });
  elements.editVideoUrl.addEventListener("input", () => setEditVideoDialogStatus());
  elements.editVideoDialog.addEventListener("cancel", (event) => {
    if (isEditingMaterial) event.preventDefault();
  });
  elements.editVideoDialog.addEventListener("click", (event) => {
    if (event.target === elements.editVideoDialog) closeEditVideoDialog();
  });
  elements.editVideoDialog.addEventListener("close", () => {
    elements.editVideoForm.reset();
    elements.editVideoFileName.textContent = "선택된 파일 없음";
    setEditVideoDialogStatus();
    pendingVideoEditId = "";
    if (lastVideoEditTrigger && document.contains(lastVideoEditTrigger)) lastVideoEditTrigger.focus();
    lastVideoEditTrigger = null;
  });
  elements.openCategoryDialog.addEventListener("click", openCategoryDialog);
  elements.inventoryOpenCategoryDialog.addEventListener("click", openCategoryDialog);
  elements.categoryForm.addEventListener("submit", addCategory);
  elements.closeCategoryDialog.addEventListener("click", closeCategoryDialog);
  elements.cancelCategoryDialog.addEventListener("click", closeCategoryDialog);
  elements.categoryDialog.addEventListener("cancel", (event) => {
    if (isAddingCategory) event.preventDefault();
  });
  elements.categoryDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    elements.categoryForm.reset();
    setCategoryDialogStatus();
    if (lastCategoryTrigger && document.contains(lastCategoryTrigger)) lastCategoryTrigger.focus();
    lastCategoryTrigger = null;
  });
  elements.openMaterialTypeDialog.addEventListener("click", openMaterialTypeDialog);
  elements.inventoryOpenMaterialTypeDialog.addEventListener("click", openMaterialTypeDialog);
  elements.materialTypeForm.addEventListener("submit", addMaterialType);
  elements.closeMaterialTypeDialog.addEventListener("click", closeMaterialTypeDialog);
  elements.cancelMaterialTypeDialog.addEventListener("click", closeMaterialTypeDialog);
  elements.materialTypeDialog.addEventListener("cancel", (event) => {
    if (isAddingMaterialType) event.preventDefault();
  });
  elements.materialTypeDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    elements.materialTypeForm.reset();
    setMaterialTypeDialogStatus();
    if (lastMaterialTypeTrigger && document.contains(lastMaterialTypeTrigger)) lastMaterialTypeTrigger.focus();
    lastMaterialTypeTrigger = null;
  });
  elements.deleteDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
  });
  elements.deleteDialog.addEventListener("close", () => {
    syncDialogScrollLock();
    pendingDeleteId = "";
    if (lastDeleteTrigger && document.contains(lastDeleteTrigger)) lastDeleteTrigger.focus();
    lastDeleteTrigger = null;
  });
  window.addEventListener("beforeunload", (event) => {
    if (elements.uploadDialog.open && (uploadFormDirty || isUploading)) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  elements.category.addEventListener("change", () => {
    updateUploadCardPreview();
  });
  elements.materialType.addEventListener("change", updateFileAccept);
  elements.videoSourceInputs.forEach((input) => input.addEventListener("change", updateFileAccept));
  elements.youtubeUrl.addEventListener("input", () => {
    updateUploadCardPreview();
  });
  elements.materialFile.addEventListener("change", updateFileLabels);
  elements.thumbnailFile.addEventListener("change", updateFileLabels);
  initializeDropZone(elements.materialDropZone, elements.materialFile, elements.materialDropStatus);
  initializeDropZone(elements.thumbnailDropZone, elements.thumbnailFile, elements.thumbnailDropStatus);
  elements.title.addEventListener("input", updateUploadCardPreview);
  elements.description.addEventListener("keydown", preventThirdDescriptionLine);
  elements.description.addEventListener("beforeinput", preventThirdDescriptionLine);
  elements.description.addEventListener("input", () => {
    enforceDescriptionLineLimit(elements.description, elements.descriptionCount);
    updateUploadCardPreview();
  });
  elements.token.addEventListener("input", () => {
    if (!verifiedToken || elements.token.value.trim() === verifiedToken) return;
    verifiedToken = "";
    elements.fields.disabled = true;
    elements.inventorySection.hidden = true;
    closeDeleteDialog();
    closeEditContentDialog();
    closeEditVideoDialog();
    setConnectionStatus("토큰이 변경되었습니다. 연결을 다시 확인해 주세요.");
  });
  window.addEventListener("pagehide", () => {
    clearLocalThumbnailPreviews();
    clearUploadPreviewThumbnail();
  });

  initialize();
})();
