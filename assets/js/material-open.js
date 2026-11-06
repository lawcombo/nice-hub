(function () {
  "use strict";

  const elements = {
    title: document.querySelector("#shareRedirectTitle"),
    message: document.querySelector("#shareRedirectMessage"),
    spinner: document.querySelector("#shareRedirectSpinner"),
    returnLink: document.querySelector("#shareRedirectReturn"),
  };

  function showError(title, message) {
    elements.spinner.hidden = true;
    elements.title.textContent = title;
    elements.message.textContent = message;
    elements.returnLink.hidden = false;
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
    const materialId = new URLSearchParams(window.location.search).get("id")?.trim();
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

      elements.title.textContent = material.title || "최신 자료를 여는 중입니다.";
      elements.message.textContent = "현재 등록된 최신 파일로 이동합니다.";
      window.location.replace(targetUrl);
    } catch (error) {
      console.error("최신 자료를 확인하지 못했습니다.", error);
      showError("자료를 불러오지 못했습니다.", "인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  }

  openLatestMaterial();
})();
