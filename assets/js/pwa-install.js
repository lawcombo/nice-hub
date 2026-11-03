(function () {
  "use strict";

  const elements = {
    installButton: document.querySelector("#installPwaButton"),
    modal: document.querySelector("#pwaInstallModal"),
    title: document.querySelector("#pwaInstallTitle"),
    description: document.querySelector("#pwaInstallDescription"),
    steps: document.querySelector("#pwaInstallSteps"),
    status: document.querySelector("#pwaInstallStatus"),
    closeButton: document.querySelector("#closePwaInstall"),
    confirmButton: document.querySelector("#confirmPwaInstall"),
    copyButton: document.querySelector("#copyInstallUrl"),
  };

  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isKakaoInApp = /KAKAOTALK/i.test(userAgent);
  const installUrl = new URL("./", document.baseURI).href;
  const installFlagKey = "nice-hub-pwa-installed";
  let deferredInstallPrompt = null;
  let installedThisSession = false;
  let lastFocusedElement = null;
  let visibilityCheck = 0;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || document.referrer.startsWith("android-app://");
  }

  function rememberInstallation() {
    try {
      window.localStorage.setItem(installFlagKey, "true");
    } catch (error) {
      console.warn("설치 상태를 브라우저에 기록하지 못했습니다.", error);
    }
  }

  function hasRememberedInstallation() {
    try {
      return window.localStorage.getItem(installFlagKey) === "true";
    } catch (error) {
      return false;
    }
  }

  async function isRelatedPwaInstalled() {
    if (typeof navigator.getInstalledRelatedApps !== "function") return false;
    try {
      const apps = await navigator.getInstalledRelatedApps();
      return apps.some((app) => app.platform === "webapp");
    } catch (error) {
      console.warn("설치 여부를 확인하지 못했습니다.", error);
      return false;
    }
  }

  function setInstallButtonVisible(visible) {
    elements.installButton.hidden = !visible;
  }

  async function refreshInstallButton() {
    const check = ++visibilityCheck;
    if (!isAndroid || isStandalone() || installedThisSession) {
      setInstallButtonVisible(false);
      return;
    }

    const supportsInstalledAppCheck = typeof navigator.getInstalledRelatedApps === "function";
    const installed = supportsInstalledAppCheck ? await isRelatedPwaInstalled() : hasRememberedInstallation();
    if (check !== visibilityCheck) return;
    setInstallButtonVisible(!installed);
  }

  function setInstallSteps(items) {
    elements.steps.replaceChildren(
      ...items.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
      }),
    );
  }

  function openInDefaultBrowser() {
    const targetUrl = new URL(installUrl);
    const intentTarget = `${targetUrl.host}${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    const scheme = targetUrl.protocol.replace(":", "");
    const fallbackUrl = encodeURIComponent(targetUrl.href);
    const intentUrl =
      `intent://${intentTarget}#Intent;` +
      `scheme=${scheme};` +
      "action=android.intent.action.VIEW;" +
      "category=android.intent.category.BROWSABLE;" +
      `S.browser_fallback_url=${fallbackUrl};end`;
    window.location.assign(intentUrl);
  }

  function openInstallGuide() {
    lastFocusedElement = document.activeElement;
    elements.status.textContent = "";

    if (isKakaoInApp) {
      elements.title.textContent = "기본 브라우저에서 열어 설치하기";
      elements.description.textContent =
        "카카오톡 안에서는 설치창을 바로 열 수 없습니다. 아래 순서로 기본 브라우저에서 열어 주세요.";
      setInstallSteps([
        "카카오톡 화면 오른쪽 위의 더보기(⋮)를 누릅니다.",
        "‘다른 브라우저로 열기’를 선택합니다.",
        "열린 기본 브라우저에서 ‘앱으로 설치’를 눌러 설치합니다.",
      ]);
    } else {
      elements.title.textContent = "홈 화면에 설치하기";
      elements.description.textContent =
        "현재 브라우저에서는 설치창을 자동으로 열 수 없습니다. 브라우저 메뉴에서 홈 화면 설치 기능을 선택해 주세요.";
      setInstallSteps([
        "브라우저의 더보기 또는 메뉴 버튼을 누릅니다.",
        "‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택합니다.",
        "설치를 확인하면 홈 화면에서 NICE 자료허브를 실행할 수 있습니다.",
      ]);
    }

    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleInstallGuideKeydown);
    window.requestAnimationFrame(() => elements.closeButton.focus());
  }

  function closeInstallGuide() {
    if (elements.modal.hidden) return;
    elements.modal.hidden = true;
    elements.status.textContent = "";
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleInstallGuideKeydown);
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function handleInstallGuideKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeInstallGuide();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...elements.modal.querySelectorAll('button:not([disabled])')].filter(
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

  async function copyInstallUrl() {
    try {
      await navigator.clipboard.writeText(installUrl);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = installUrl;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    elements.status.textContent = "주소를 복사했습니다. 기본 브라우저 주소창에 붙여넣어 주세요.";
  }

  async function requestInstallation() {
    if (isKakaoInApp) {
      openInDefaultBrowser();
      return;
    }

    if (!deferredInstallPrompt) {
      openInstallGuide();
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    const result = await promptEvent.prompt();
    if (result?.outcome === "accepted") {
      installedThisSession = true;
      rememberInstallation();
      setInstallButtonVisible(false);
    } else {
      await refreshInstallButton();
    }
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    try {
      const serviceWorkerUrl = new URL("sw.js", document.baseURI);
      const scope = new URL("./", document.baseURI).pathname;
      await navigator.serviceWorker.register(serviceWorkerUrl, { scope });
    } catch (error) {
      console.warn("오프라인 실행 기능을 등록하지 못했습니다.", error);
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    void refreshInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    installedThisSession = true;
    rememberInstallation();
    deferredInstallPrompt = null;
    setInstallButtonVisible(false);
    closeInstallGuide();
  });

  elements.installButton.addEventListener("click", requestInstallation);
  elements.closeButton.addEventListener("click", closeInstallGuide);
  elements.confirmButton.addEventListener("click", closeInstallGuide);
  elements.copyButton.addEventListener("click", copyInstallUrl);
  elements.modal.querySelector("[data-close-pwa-install]").addEventListener("click", closeInstallGuide);

  if (isStandalone()) setInstallButtonVisible(false);
  window.addEventListener(
    "load",
    () => {
      void registerServiceWorker();
      void refreshInstallButton();
    },
    { once: true },
  );
})();
