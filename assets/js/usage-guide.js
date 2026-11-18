(function () {
  "use strict";

  const guideSections = {
    usage: {
      subtitle: "화면을 따라 NICE HUB의 핵심 기능을 익혀보세요.",
      steps: [
        {
          image: "assets/images/guide/nice-hub-manual-step-01.jpg",
          alt: "NICE HUB PC 화면에서 사업 카테고리, 자료 유형과 검색필터로 최신 자료를 찾는 방법",
          title: "PC에서 최신 자료 찾기",
          description: "사업 카테고리와 자료 유형을 선택하거나 검색필터에서 자료명을 검색하세요. 개인 PC에 저장된 파일 대신 NICE HUB에 등록된 최신 자료를 바로 확인할 수 있습니다.",
        },
        {
          image: "assets/images/guide/nice-hub-manual-step-02.jpg",
          alt: "모바일 NICE HUB 화면에서 필요한 최신 자료를 찾는 방법",
          title: "모바일에서도 언제 어디서나",
          description: "모바일 브라우저나 홈 화면에 추가한 NICE HUB를 열고 사업·자료 유형 탭과 검색필터를 이용하세요. 외부에서도 필요한 최신 자료를 빠르게 찾을 수 있습니다.",
        },
        {
          image: "assets/images/guide/nice-hub-manual-step-03.jpg",
          alt: "자료 카드의 링크 복사 버튼을 눌러 고객에게 공유하는 방법",
          title: "고객에게 링크로 바로 공유",
          description: "자료 카드의 ‘링크 복사’를 누른 뒤 카카오톡이나 문자에 붙여넣으세요. 고객은 전달받은 링크에서 현재 등록된 최신 문서를 확인할 수 있습니다.",
        },
        {
          image: "assets/images/guide/nice-hub-manual-step-04.jpg",
          alt: "묶음 QR 생성 버튼으로 여러 자료의 QR 모음판을 만드는 순서",
          title: "여러 자료는 묶음 QR로",
          description: "‘묶음 QR 생성’을 누르고 전달할 자료를 선택한 다음 ‘QR 자료 생성’을 누르세요. 완성된 QR 모음판은 인쇄하거나 PDF로 저장할 수 있습니다.",
        },
        {
          image: "assets/images/guide/nice-hub-manual-step-05.jpg",
          alt: "NICE HUB 보안 문서 라벨과 비밀번호 확인 화면 안내",
          title: "민감한 자료는 보안 문서로",
          description: "‘보안 문서’ 라벨이 표시된 자료는 비밀번호 확인 후 열 수 있습니다. 승인된 고객에게만 자료 링크와 비밀번호를 각각 안전하게 안내하세요.",
        },
        {
          image: "assets/images/guide/nice-hub-manual-step-06.jpg",
          alt: "필요한 자료의 사업명, 자료명과 사용 목적을 정리해 사업지원팀에 요청하는 방법",
          title: "필요한 자료는 사업지원팀에 요청",
          description: "원하는 자료가 없거나 최신화가 필요하면 사업지원팀에 사업명, 필요한 자료명과 사용 목적을 전달해 업로드를 요청하세요.",
        },
      ],
    },
    tips: {
      subtitle: "상담 전 준비부터 고객 전달까지, 현장에서 이렇게 활용하세요.",
      steps: [
        {
          image: "assets/images/guide/nice-hub-tip-step-01.jpg",
          alt: "한국인 영업자가 방문 전 노트북의 실제 NICE HUB 화면에서 최신 자료를 준비하는 모습",
          title: "방문 전, 보여줄 자료부터 준비하세요",
          description: "고객 업종과 상담 목적에 맞는 최신 자료를 미리 확인하고, 현장에서 바로 보여줄 자료와 상담 후 전달할 자료를 구분해 두세요.",
        },
        {
          image: "assets/images/guide/nice-hub-tip-step-02-v2.png",
          alt: "한국인 영업자가 고객의 요구를 들으며 모바일 NICE HUB에서 관련 자료를 찾는 모습",
          title: "고객의 관심사를 먼저 확인하세요",
          description: "처음부터 모든 자료를 보여주기보다 고객의 관심사와 불편사항을 먼저 듣고, 관련된 자료만 NICE HUB에서 빠르게 찾아 제시하세요.",
        },
        {
          image: "assets/images/guide/nice-hub-tip-step-03.jpg",
          alt: "한국인 영업자가 태블릿의 실제 NICE HUB 화면을 고객과 함께 보며 설명하는 모습",
          title: "짧고 시각적인 자료부터 보여주세요",
          description: "홍보영상이나 제품소개 이미지로 핵심을 짧게 보여준 뒤, 고객이 관심을 보이는 부분을 브로슈어와 제안서로 자세히 설명하세요.",
        },
        {
          image: "assets/images/guide/nice-hub-tip-step-04.jpg",
          alt: "상담 직후 영업자가 NICE HUB의 실제 자료 링크를 고객에게 공유하는 모습",
          title: "상담 직후, 약속한 자료만 공유하세요",
          description: "상담에서 언급한 자료를 바로 링크로 전달하세요. 불필요한 파일을 한꺼번에 보내기보다 고객이 요청한 자료만 선별하는 것이 효과적입니다.",
        },
        {
          image: "assets/images/guide/nice-hub-tip-step-05.jpg",
          alt: "영업자가 태블릿의 실제 NICE HUB 묶음 QR 화면을 보여주고 고객이 스캔하는 모습",
          title: "여러 자료는 고객이 직접 고르게 하세요",
          description: "전달할 자료가 여러 개라면 묶음 QR 모음판을 보여주세요. 고객이 관심 있는 자료의 QR을 직접 선택해 스캔할 수 있습니다.",
        },
        {
          image: "assets/images/guide/nice-hub-tip-step-06-v3.png",
          alt: "상담 후 고객이 이전에 공유받은 NICE HUB 링크에서 최신 문서를 다시 확인하는 모습",
          title: "상담 후에도 최신 링크로 이어가세요",
          description: "한 번 공유한 NICE HUB 자료 링크는 자료가 최신 버전으로 교체되어도 그대로 유지됩니다. 고객은 기존 링크를 다시 열기만 하면 항상 최신 문서를 확인할 수 있으므로 링크를 다시 공유할 필요가 없습니다.",
        },
      ],
    },
  };
  const guideAssetVersion = "20261118-4";

  const elements = {
    openButton: document.querySelector("#openUsageGuide"),
    modal: document.querySelector("#usageGuideModal"),
    dialog: document.querySelector(".usage-guide-dialog"),
    closeButton: document.querySelector("#closeUsageGuide"),
    installOpenButton: document.querySelector("#openUsageGuideInstall"),
    installModal: document.querySelector("#usageGuideInstallModal"),
    installDialog: document.querySelector(".usage-guide-install-dialog"),
    installCloseButton: document.querySelector("#closeUsageGuideInstall"),
    installConfirmButton: document.querySelector("#confirmUsageGuideInstall"),
    subtitle: document.querySelector("#usageGuideSubtitle"),
    tabs: [...document.querySelectorAll("[data-guide-section]")],
    slide: document.querySelector("#usageGuideSlide"),
    image: document.querySelector("#usageGuideImage"),
    imageFallback: document.querySelector("#usageGuideImageFallback"),
    step: document.querySelector("#usageGuideStep"),
    title: document.querySelector("#usageGuideStepTitle"),
    description: document.querySelector("#usageGuideStepDescription"),
    progress: document.querySelector("#usageGuideProgress"),
    previousButton: document.querySelector("#usageGuidePrevious"),
    nextButton: document.querySelector("#usageGuideNext"),
    counter: document.querySelector("#usageGuideCounter"),
  };

  let activeSection = "usage";
  const activeSteps = { usage: 0, tips: 0 };
  let lastFocusedElement = null;
  let touchStartX = null;
  let touchStartY = null;
  let pendingHistoryClose = false;
  let historyCloseTimer = 0;
  let installLastFocusedElement = null;
  let pendingInstallHistoryClose = false;
  let installHistoryCloseTimer = 0;
  const preloadedImages = new Map();

  const modalHistoryKey = "niceHubModal";
  const modalHistoryValue = "usage-guide";
  const installHistoryKey = "niceHubGuideSubmodal";
  const installHistoryValue = "install";

  function getCurrentGuide() {
    return guideSections[activeSection];
  }

  function getCurrentSteps() {
    return getCurrentGuide().steps;
  }

  function getHistoryState() {
    return history.state && typeof history.state === "object" ? history.state : {};
  }

  function pushGuideHistory() {
    if (getHistoryState()[modalHistoryKey] === modalHistoryValue) return true;
    try {
      history.pushState({ ...getHistoryState(), [modalHistoryKey]: modalHistoryValue }, "", window.location.href);
      return true;
    } catch (error) {
      console.warn("활용 가이드 뒤로가기 기록을 추가하지 못했습니다.", error);
      return false;
    }
  }

  function resolveAsset(path) {
    const url = new URL(path, document.baseURI);
    url.searchParams.set("guide", guideAssetVersion);
    return url.href;
  }

  function createProgressButtons() {
    const buttons = getCurrentSteps().map((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "usage-guide-progress-dot";
      button.setAttribute("aria-label", `${index + 1}단계: ${step.title}`);
      button.addEventListener("click", () => showStep(index));
      return button;
    });
    elements.progress.setAttribute(
      "aria-label",
      `${activeSection === "usage" ? "NICE HUB 사용법" : "현장 영업 꿀팁"} 단계 선택`,
    );
    elements.progress.replaceChildren(...buttons);
  }

  function preloadStep(section, index) {
    const steps = guideSections[section]?.steps || [];
    const key = `${section}:${index}`;
    if (index < 0 || index >= steps.length || preloadedImages.has(key)) return;
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = section === "usage" && index === 0 ? "high" : "low";
    image.src = resolveAsset(steps[index].image);
    preloadedImages.set(key, image);
  }

  function preloadGuideImages() {
    Object.keys(guideSections).forEach((section, sectionIndex) => {
      guideSections[section].steps.forEach((step, index) => {
        window.setTimeout(() => preloadStep(section, index), (sectionIndex * 6 + index) * 90);
      });
    });
  }

  function scheduleGuideImagePreload() {
    preloadStep("usage", 0);
    const startBackgroundPreload = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preloadGuideImages, { timeout: 1200 });
      } else {
        window.setTimeout(preloadGuideImages, 250);
      }
    };

    if (document.readyState === "complete") startBackgroundPreload();
    else window.addEventListener("load", startBackgroundPreload, { once: true });
  }

  function animateSlide() {
    elements.slide.classList.remove("is-changing");
    void elements.slide.offsetWidth;
    elements.slide.classList.add("is-changing");
  }

  function showStep(index, options = {}) {
    const steps = getCurrentSteps();
    const normalizedIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[normalizedIndex];
    activeSteps[activeSection] = normalizedIndex;
    elements.dialog.dataset.guideStep = String(normalizedIndex + 1);

    elements.step.textContent = `STEP ${String(normalizedIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    elements.title.textContent = step.title;
    elements.description.textContent = step.description;
    elements.counter.textContent = `${normalizedIndex + 1} / ${steps.length}`;
    elements.previousButton.disabled = normalizedIndex === 0;
    elements.nextButton.textContent =
      normalizedIndex === steps.length - 1 ? (activeSection === "usage" ? "현장 꿀팁 보기" : "처음부터 보기") : "다음";

    [...elements.progress.children].forEach((button, progressIndex) => {
      const isActive = progressIndex === normalizedIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "step" : "false");
    });

    elements.imageFallback.hidden = true;
    elements.image.hidden = false;
    elements.image.alt = step.alt;
    elements.slide.classList.add("is-loading");
    elements.image.onload = () => elements.slide.classList.remove("is-loading");
    elements.image.onerror = () => {
      elements.slide.classList.remove("is-loading");
      elements.image.hidden = true;
      elements.imageFallback.hidden = false;
    };
    elements.image.src = resolveAsset(step.image);

    if (options.animate !== false) animateSlide();
    preloadStep(activeSection, normalizedIndex + 1);
  }

  function showSection(section, options = {}) {
    if (!guideSections[section]) return;
    activeSection = section;
    elements.dialog.dataset.guideSection = activeSection;
    elements.subtitle.textContent = getCurrentGuide().subtitle;
    elements.installOpenButton.hidden = activeSection !== "usage";
    elements.tabs.forEach((tab) => {
      const isActive = tab.dataset.guideSection === activeSection;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    createProgressButtons();
    showStep(activeSteps[activeSection], options);
  }

  function showPreviousStep() {
    const current = activeSteps[activeSection];
    if (current > 0) showStep(current - 1);
  }

  function showNextStep() {
    const steps = getCurrentSteps();
    const current = activeSteps[activeSection];
    if (current < steps.length - 1) {
      showStep(current + 1);
      return;
    }
    if (activeSection === "usage") {
      showSection("tips");
      return;
    }
    activeSteps.tips = 0;
    showStep(0);
  }

  function openGuide() {
    if (!elements.modal.hidden) return;
    lastFocusedElement = document.activeElement;
    activeSteps.usage = 0;
    showSection("usage", { animate: false });
    pushGuideHistory();
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeydown);
    window.requestAnimationFrame(() => elements.closeButton.focus());
  }

  function openInstallGuide() {
    if (!elements.installModal.hidden) return;
    installLastFocusedElement = document.activeElement;
    try {
      history.pushState({ ...getHistoryState(), [installHistoryKey]: installHistoryValue }, "", window.location.href);
    } catch (error) {
      console.warn("편리한 사용 방법 뒤로가기 기록을 추가하지 못했습니다.", error);
    }
    elements.installModal.hidden = false;
    window.requestAnimationFrame(() => elements.installCloseButton.focus());
  }

  function finishClosingInstallGuide() {
    if (elements.installModal.hidden) return;
    window.clearTimeout(installHistoryCloseTimer);
    pendingInstallHistoryClose = false;
    elements.installModal.hidden = true;
    if (installLastFocusedElement && document.contains(installLastFocusedElement)) installLastFocusedElement.focus();
    installLastFocusedElement = null;
  }

  function closeInstallGuide() {
    if (elements.installModal.hidden || pendingInstallHistoryClose) return;
    if (getHistoryState()[installHistoryKey] !== installHistoryValue) {
      finishClosingInstallGuide();
      return;
    }
    pendingInstallHistoryClose = true;
    history.back();
    installHistoryCloseTimer = window.setTimeout(() => {
      if (!pendingInstallHistoryClose) return;
      finishClosingInstallGuide();
    }, 500);
  }

  function finishClosingGuide() {
    if (elements.modal.hidden) return;
    if (!elements.installModal.hidden) finishClosingInstallGuide();
    window.clearTimeout(historyCloseTimer);
    pendingHistoryClose = false;
    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function closeGuide() {
    if (elements.modal.hidden || pendingHistoryClose) return;
    if (getHistoryState()[modalHistoryKey] !== modalHistoryValue) {
      finishClosingGuide();
      return;
    }

    pendingHistoryClose = true;
    history.back();
    historyCloseTimer = window.setTimeout(() => {
      if (!pendingHistoryClose) return;
      finishClosingGuide();
    }, 500);
  }

  function handleBrowserBack() {
    if (!elements.installModal.hidden) {
      finishClosingInstallGuide();
      return;
    }
    if (elements.modal.hidden) return;
    finishClosingGuide();
  }

  function trapFocus(event, dialog = elements.dialog) {
    const focusable = [...dialog.querySelectorAll("button:not([disabled]), summary, a[href]")].filter(
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

  function handleKeydown(event) {
    if (!elements.installModal.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInstallGuide();
      } else if (event.key === "Tab") {
        trapFocus(event, elements.installDialog);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeGuide();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousStep();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextStep();
      return;
    }
    if (event.key === "Tab") trapFocus(event);
  }

  function handleTouchStart(event) {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchEnd(event) {
    if (touchStartX === null || touchStartY === null || !event.changedTouches.length) return;
    const distanceX = event.changedTouches[0].clientX - touchStartX;
    const distanceY = event.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(distanceX) < 48 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
    if (distanceX > 0) showPreviousStep();
    else showNextStep();
  }

  createProgressButtons();
  scheduleGuideImagePreload();
  elements.openButton.addEventListener("click", openGuide);
  elements.closeButton.addEventListener("click", closeGuide);
  elements.installOpenButton.addEventListener("click", openInstallGuide);
  elements.installCloseButton.addEventListener("click", closeInstallGuide);
  elements.installConfirmButton.addEventListener("click", closeInstallGuide);
  elements.installModal.querySelector("[data-close-usage-guide-install]").addEventListener("click", closeInstallGuide);
  elements.modal.querySelector("[data-close-usage-guide]").addEventListener("click", closeGuide);
  elements.previousButton.addEventListener("click", showPreviousStep);
  elements.nextButton.addEventListener("click", showNextStep);
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => showSection(tab.dataset.guideSection));
  });
  elements.slide.addEventListener("touchstart", handleTouchStart, { passive: true });
  elements.slide.addEventListener("touchend", handleTouchEnd, { passive: true });
  window.addEventListener("popstate", handleBrowserBack);
})();
