(function () {
  "use strict";

  const steps = [
    {
      image: "assets/images/guide/nice-hub-guide-step-01.png",
      alt: "영업자가 사무실 PC의 NICE HUB에서 흩어져 있던 최신 영업자료를 한 번에 찾아 기뻐하는 모습",
      title: "분산된 자료, NICE HUB에서 한 번에!",
      description:
        "여러 PC 폴더와 저장 위치를 뒤지지 않고 NICE HUB에서 사업·자료 유형별 최신 영업자료를 한 번에 검색하고 확인할 수 있습니다.",
    },
    {
      image: "assets/images/guide/nice-hub-guide-step-02.png",
      alt: "영업자가 고객 미팅 중 스마트폰 NICE HUB에서 필요한 영업자료를 찾는 모습",
      title: "필요한 영업자료, 현장에서도 바로!",
      description:
        "외부 영업 현장에서도 스마트폰으로 NICE HUB에 접속해 브로슈어, 제품소개서, 제안자료 등 필요한 영업자료를 즉시 확인할 수 있습니다.",
    },
    {
      image: "assets/images/guide/nice-hub-guide-step-03.png",
      alt: "영업자가 스마트폰의 제품소개서를 고객에게 보여주며 설명하는 모습",
      title: "출력물 없이 스마트폰으로 간편하게!",
      description:
        "선택한 자료를 스마트폰 화면으로 보여주며 고객에게 제품과 서비스를 설명할 수 있어 무거운 출력물을 따로 준비하지 않아도 됩니다.",
    },
    {
      image: "assets/images/guide/nice-hub-guide-step-04.png",
      alt: "영업자 스마트폰의 자료 QR 코드를 고객이 자신의 스마트폰으로 스캔하는 모습",
      title: "QR코드 하나로 고객에게 바로 공유!",
      description:
        "자료 카드의 QR코드를 고객에게 보여주거나 링크 복사·모바일 공유 기능을 이용해 고객의 스마트폰으로 바로 전달할 수 있습니다.",
    },
    {
      image: "assets/images/guide/nice-hub-guide-step-05.png",
      alt: "고객이 자신의 스마트폰에서 공유받은 제품소개 자료를 직접 확인하는 모습",
      title: "고객도 본인 스마트폰으로 편리하게!",
      description:
        "고객은 QR코드나 공유받은 링크를 통해 자료를 직접 확인하고, 미팅이 끝난 뒤에도 같은 링크에서 최신 자료를 다시 열어볼 수 있습니다.",
    },
  ];

  const elements = {
    openButton: document.querySelector("#openUsageGuide"),
    modal: document.querySelector("#usageGuideModal"),
    dialog: document.querySelector(".usage-guide-dialog"),
    closeButton: document.querySelector("#closeUsageGuide"),
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

  let activeStep = 0;
  let lastFocusedElement = null;
  let touchStartX = null;
  let touchStartY = null;

  function resolveAsset(path) {
    return new URL(path, document.baseURI).href;
  }

  function createProgressButtons() {
    const buttons = steps.map((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "usage-guide-progress-dot";
      button.setAttribute("aria-label", `${index + 1}단계: ${step.title}`);
      button.addEventListener("click", () => showStep(index));
      return button;
    });
    elements.progress.replaceChildren(...buttons);
  }

  function preloadStep(index) {
    if (index < 0 || index >= steps.length) return;
    const image = new Image();
    image.src = resolveAsset(steps[index].image);
  }

  function animateSlide() {
    elements.slide.classList.remove("is-changing");
    void elements.slide.offsetWidth;
    elements.slide.classList.add("is-changing");
  }

  function showStep(index, options = {}) {
    const normalizedIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[normalizedIndex];
    activeStep = normalizedIndex;

    elements.step.textContent = `STEP ${String(activeStep + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    elements.title.textContent = step.title;
    elements.description.textContent = step.description;
    elements.counter.textContent = `${activeStep + 1} / ${steps.length}`;
    elements.previousButton.disabled = activeStep === 0;
    elements.nextButton.textContent = activeStep === steps.length - 1 ? "처음부터 보기" : "다음";

    [...elements.progress.children].forEach((button, progressIndex) => {
      const isActive = progressIndex === activeStep;
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
    preloadStep(activeStep + 1);
  }

  function showPreviousStep() {
    if (activeStep > 0) showStep(activeStep - 1);
  }

  function showNextStep() {
    showStep(activeStep === steps.length - 1 ? 0 : activeStep + 1);
  }

  function openGuide() {
    if (!elements.modal.hidden) return;
    lastFocusedElement = document.activeElement;
    showStep(0, { animate: false });
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeydown);
    window.requestAnimationFrame(() => elements.closeButton.focus());
  }

  function closeGuide() {
    if (elements.modal.hidden) return;
    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function trapFocus(event) {
    const focusable = [...elements.dialog.querySelectorAll("button:not([disabled]), summary, a[href]")].filter(
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
  elements.openButton.addEventListener("click", openGuide);
  elements.closeButton.addEventListener("click", closeGuide);
  elements.modal.querySelector("[data-close-usage-guide]").addEventListener("click", closeGuide);
  elements.previousButton.addEventListener("click", showPreviousStep);
  elements.nextButton.addEventListener("click", showNextStep);
  elements.slide.addEventListener("touchstart", handleTouchStart, { passive: true });
  elements.slide.addEventListener("touchend", handleTouchEnd, { passive: true });
})();
