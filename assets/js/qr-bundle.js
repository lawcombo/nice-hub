(function () {
  "use strict";

  const elements = {
    title: document.querySelector("#qrBoardTitle"),
    loading: document.querySelector("#qrBoardLoading"),
    grid: document.querySelector("#qrBoardGrid"),
    empty: document.querySelector("#qrBoardEmpty"),
    print: document.querySelector("#printQrBoard"),
  };

  const parameters = new URLSearchParams(window.location.search);
  const requestedIds = [...new Set(String(parameters.get("ids") || "").split(",").map((id) => id.trim()).filter(Boolean))]
    .slice(0, 10);
  const requestedTitle = String(parameters.get("title") || "NICE HUB 추천자료").trim().slice(0, 80);

  function resolveUrl(path) {
    try {
      return new URL(String(path || ""), document.baseURI).href;
    } catch (error) {
      return "";
    }
  }

  function isDisplayableMaterial(material) {
    return Boolean(material && material.id && material.title && material.file && material.isPublished !== false);
  }

  function isYouTubeMaterial(material) {
    if (material?.sourceType === "youtube") return true;
    try {
      const hostname = new URL(material?.file || "", document.baseURI).hostname.toLowerCase();
      return hostname === "youtu.be" || hostname.endsWith(".youtu.be") || hostname === "youtube.com" || hostname.endsWith(".youtube.com");
    } catch (error) {
      return false;
    }
  }

  function getMaterialQrUrl(material) {
    if (isYouTubeMaterial(material)) return resolveUrl(material.file);
    let shareUrl = "";
    if (window.NiceHubSharePage?.getSharePageUrl) {
      shareUrl = window.NiceHubSharePage.getSharePageUrl(material, {
        publicBaseUrl: new URL("./", document.baseURI).href,
        includeVersion: false,
      });
    } else {
      const fallbackUrl = new URL("open.html", document.baseURI);
      fallbackUrl.searchParams.set("id", material.id);
      shareUrl = fallbackUrl.href;
    }
    const url = new URL(shareUrl);
    url.searchParams.set("mode", "download");
    return url.href;
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createQrCode(targetUrl, title) {
    const container = createElement("div", "qr-board-code");
    if (typeof window.qrcode !== "function" || !targetUrl) {
      container.appendChild(createElement("strong", "qr-board-code-error", "QR 생성 실패"));
      return container;
    }

    try {
      const qr = window.qrcode(0, "M");
      qr.addData(targetUrl);
      qr.make();
      container.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 3, scalable: true });
      const svg = container.querySelector("svg");
      if (svg) {
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", `${title} 자료 QR 코드`);
      }
    } catch (error) {
      console.error("묶음 자료 QR을 생성하지 못했습니다.", error);
      container.appendChild(createElement("strong", "qr-board-code-error", "QR 생성 실패"));
    }
    return container;
  }

  function createMaterialCard(material, index, categoryMap, typeMap) {
    const targetUrl = getMaterialQrUrl(material);
    const article = createElement("article", "qr-board-card");
    const number = createElement("span", "qr-board-number", String(index + 1).padStart(2, "0"));
    const tags = createElement("div", "qr-board-tags");
    tags.append(
      createElement("span", "qr-board-tag qr-board-category", categoryMap.get(material.category) || "기타"),
      createElement("span", "qr-board-tag", typeMap.get(material.type) || "자료"),
    );

    const copy = createElement("div", "qr-board-card-copy");
    copy.append(tags, createElement("h2", "", material.title));

    const link = createElement("a", "qr-board-open-link", "자료 링크 열기");
    link.href = targetUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    copy.appendChild(link);

    article.appendChild(number);
    if (material.isSecure === true) {
      article.appendChild(createElement("span", "qr-board-security-badge", "보안 문서"));
    }
    article.append(createQrCode(targetUrl, material.title), copy);
    return article;
  }

  function showEmpty(message) {
    elements.loading.hidden = true;
    elements.grid.hidden = true;
    elements.empty.hidden = false;
    if (message) elements.empty.querySelector("p").textContent = message;
  }

  async function initialize() {
    elements.title.textContent = requestedTitle || "QR 자료 모음판";
    document.title = `${elements.title.textContent} | NICE HUB`;
    if (!requestedIds.length) {
      showEmpty("선택된 자료 정보가 없습니다.");
      return;
    }

    try {
      const response = await fetch(resolveUrl("assets/data/library.json"), { cache: "no-cache" });
      if (!response.ok) throw new Error(`자료 목록 응답 오류: ${response.status}`);
      const data = await response.json();
      const materialMap = new Map((Array.isArray(data.materials) ? data.materials : []).map((material) => [material.id, material]));
      const categoryMap = new Map((Array.isArray(data.categories) ? data.categories : []).map((category) => [category.id, category.label]));
      const typeMap = new Map((Array.isArray(data.materialTypes) ? data.materialTypes : []).map((type) => [type.id, type.label]));
      const selectedMaterials = requestedIds.map((id) => materialMap.get(id)).filter(isDisplayableMaterial);
      if (!selectedMaterials.length) {
        showEmpty("선택한 자료가 비공개되었거나 삭제되었습니다.");
        return;
      }

      const fragment = document.createDocumentFragment();
      selectedMaterials.forEach((material, index) => {
        fragment.appendChild(createMaterialCard(material, index, categoryMap, typeMap));
      });
      elements.grid.replaceChildren(fragment);
      elements.loading.hidden = true;
      elements.empty.hidden = true;
      elements.grid.hidden = false;
      elements.print.disabled = false;
    } catch (error) {
      console.error("QR 자료 모음판을 불러오지 못했습니다.", error);
      showEmpty("자료 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  elements.print.addEventListener("click", () => window.print());
  initialize();
})();
