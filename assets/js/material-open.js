(function () {
  "use strict";

  const elements = {
    title: document.querySelector("#shareRedirectTitle"),
    message: document.querySelector("#shareRedirectMessage"),
    spinner: document.querySelector("#shareRedirectSpinner"),
    securityForm: document.querySelector("#shareSecurityForm"),
    securityPassword: document.querySelector("#shareSecurityPassword"),
    securityError: document.querySelector("#shareSecurityError"),
    securitySubmit: document.querySelector("#shareSecurityForm button[type='submit']"),
    downloadFallback: document.querySelector("#shareDownloadFallback"),
  };
  const securityPassword = "1004";
  let pendingTargetUrl = "";
  let pendingMaterial = null;
  const downloadMode = new URLSearchParams(window.location.search).get("mode") === "download";

  function showError(title, message) {
    elements.spinner.hidden = true;
    elements.title.textContent = title;
    elements.message.textContent = message;
    elements.securityForm.hidden = true;
    elements.downloadFallback.hidden = true;
  }

  function openTarget(targetUrl) {
    elements.spinner.hidden = false;
    elements.securityForm.hidden = true;
    elements.downloadFallback.hidden = true;
    elements.message.textContent = "현재 등록된 최신 파일로 이동합니다.";
    window.location.replace(targetUrl);
  }

  function isYouTubeMaterial(material) {
    if (material?.sourceType === "youtube") return true;
    try {
      const hostname = new URL(material?.file || "", document.baseURI).hostname.toLowerCase();
      return hostname === "youtu.be" || hostname.endsWith(".youtube.com");
    } catch (error) {
      return false;
    }
  }

  function getFileName(material) {
    try {
      const fileName = decodeURIComponent(new URL(material?.file || "", document.baseURI).pathname.split("/").pop());
      return fileName || material?.title || "NICE-자료";
    } catch (error) {
      return material?.title || "NICE-자료";
    }
  }

  async function downloadTarget(material, targetUrl) {
    const target = new URL(targetUrl);
    if (target.origin !== window.location.origin) {
      openTarget(targetUrl);
      return;
    }

    elements.spinner.hidden = false;
    elements.securityForm.hidden = true;
    elements.downloadFallback.hidden = true;
    elements.title.textContent = material.title || "자료를 내려받고 있습니다.";
    elements.message.textContent = "최신 파일을 내려받을 준비 중입니다.";

    try {
      const response = await fetch(targetUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`자료 파일 응답 오류: ${response.status}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getFileName(material);
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      elements.spinner.hidden = true;
      elements.title.textContent = "다운로드를 시작했습니다.";
      elements.message.textContent = "자동으로 시작되지 않으면 아래 버튼을 눌러 주세요.";
    } catch (error) {
      console.error("자료 다운로드를 시작하지 못했습니다.", error);
      elements.spinner.hidden = true;
      elements.title.textContent = "자동 다운로드를 시작하지 못했습니다.";
      elements.message.textContent = "아래 버튼을 눌러 최신 파일을 내려받아 주세요.";
    }

    elements.downloadFallback.href = targetUrl;
    elements.downloadFallback.download = getFileName(material);
    elements.downloadFallback.hidden = false;
  }

  function performTarget(material, targetUrl) {
    if (downloadMode && !isYouTubeMaterial(material)) return downloadTarget(material, targetUrl);
    openTarget(targetUrl);
    return Promise.resolve();
  }

  function showSecurityPrompt(material, targetUrl) {
    pendingTargetUrl = targetUrl;
    pendingMaterial = material;
    elements.spinner.hidden = true;
    elements.title.textContent = "보안 문서입니다.";
    elements.message.textContent = `‘${material.title || "이름 없는 자료"}’을(를) 열려면 비밀번호를 입력해 주세요.`;
    elements.securityPassword.value = "";
    elements.securityError.textContent = "";
    elements.securitySubmit.textContent = downloadMode && !isYouTubeMaterial(material) ? "확인 후 다운로드" : "보안 문서 열기";
    elements.securityForm.hidden = false;
    window.requestAnimationFrame(() => elements.securityPassword.focus());
  }

  function handleSecuritySubmit(event) {
    event.preventDefault();
    if (elements.securityPassword.value !== securityPassword) {
      elements.securityError.textContent = "비밀번호가 올바르지 않습니다.";
      elements.securityPassword.select();
      return;
    }
    if (pendingTargetUrl && pendingMaterial) void performTarget(pendingMaterial, pendingTargetUrl);
  }

  function getTargetUrl(material) {
    if (!material?.file) return "";
    const target = new URL(material.file, document.baseURI);
    if (!/^https?:$/.test(target.protocol)) return "";

    if (target.origin === window.location.origin) {
      const version = material.modifiedAt || material.updatedAt || material.registeredAt;
      if (version) target.searchParams.set("v", version);
    }
    return target.href;
  }

  async function openLatestMaterial() {
    const queryId = new URLSearchParams(window.location.search).get("id")?.trim();
    const pageId = document.querySelector('meta[name="nice-material-id"]')?.content?.trim();
    const materialId = queryId || pageId;
    if (!materialId) {
      showError("자료 주소가 올바르지 않습니다.", "자료 목록에서 다시 공유 링크를 복사해 주세요.");
      return;
    }

    try {
      const response = await fetch(new URL("assets/data/library.json", document.baseURI), { cache: "no-store" });
      if (!response.ok) throw new Error(`자료 목록 응답 오류: ${response.status}`);
      const library = await response.json();
      const material = Array.isArray(library.materials)
        ? library.materials.find((item) => item?.id === materialId)
        : null;
      if (!material) {
        showError("자료를 찾을 수 없습니다.", "삭제되었거나 더 이상 제공되지 않는 자료입니다.");
        return;
      }

      const targetUrl = getTargetUrl(material);
      if (!targetUrl) {
        showError("자료 파일을 열 수 없습니다.", "자료 경로를 확인한 뒤 다시 시도해 주세요.");
        return;
      }

      if (material.isSecure === true) {
        showSecurityPrompt(material, targetUrl);
        return;
      }

      elements.title.textContent = material.title || "최신 자료를 여는 중입니다.";
      await performTarget(material, targetUrl);
    } catch (error) {
      console.error("최신 자료를 확인하지 못했습니다.", error);
      showError("자료를 불러오지 못했습니다.", "인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  }

  elements.securityForm.addEventListener("submit", handleSecuritySubmit);
  openLatestMaterial();
})();
