(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NiceHubSharePage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const defaultPublicBaseUrl = "https://lawcombo.github.io/nice-hub/";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value, fallback) {
    return String(value || fallback || "").replace(/\s+/g, " ").trim();
  }

  function getSafeMaterialId(material) {
    const id = String(material?.id || "").trim();
    return id && /^[a-z0-9][a-z0-9-]*$/i.test(id) ? id : "material";
  }

  function getSharePagePath(material) {
    return `share/${getSafeMaterialId(material)}.html`;
  }

  function toAbsoluteUrl(path, publicBaseUrl = defaultPublicBaseUrl) {
    try {
      return new URL(String(path || ""), publicBaseUrl).href;
    } catch (error) {
      return new URL("assets/icons/app-icon-512.png", publicBaseUrl).href;
    }
  }

  function getSharePageUrl(material, options = {}) {
    const url = new URL(getSharePagePath(material), options.publicBaseUrl || defaultPublicBaseUrl);
    if (options.includeVersion) {
      const version = material?.modifiedAt || material?.updatedAt || material?.registeredAt;
      if (version) url.searchParams.set("v", version);
    }
    return url.href;
  }

  function createSharePage(material, options = {}) {
    const publicBaseUrl = options.publicBaseUrl || defaultPublicBaseUrl;
    const title = normalizeText(material?.title, "NICE 허브 자료");
    const description = normalizeText(
      material?.description,
      "NICE 허브에서 최신 자료를 확인하고 내려받으세요.",
    );
    const thumbnailUrl = toAbsoluteUrl(material?.thumbnail || "assets/icons/app-icon-512.png", publicBaseUrl);
    const pageUrl = getSharePageUrl(material, { publicBaseUrl });
    const materialId = getSafeMaterialId(material);

    return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b315c" />
    <base href="../" />
    <title>${escapeHtml(title)} | NICE 허브</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="nice-material-id" content="${escapeHtml(materialId)}" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="NICE 허브" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:image" content="${escapeHtml(thumbnailUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(`${title} 표지`)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(thumbnailUrl)}" />
    <link rel="stylesheet" href="assets/css/styles.css" />
    <link rel="manifest" href="manifest.webmanifest" />
    <script src="assets/js/material-open.js" defer></script>
  </head>
  <body class="share-redirect-page">
    <main class="share-redirect-card" aria-labelledby="shareRedirectTitle">
      <div id="shareRedirectSpinner" class="share-redirect-spinner" aria-hidden="true"></div>
      <p class="share-redirect-kicker">NICE HUB</p>
      <h1 id="shareRedirectTitle">최신 자료를 확인하고 있습니다.</h1>
      <p id="shareRedirectMessage" class="share-redirect-message" aria-live="polite">
        잠시만 기다려 주세요. 현재 등록된 최신 파일로 연결합니다.
      </p>
      <form id="shareSecurityForm" class="share-security-form" autocomplete="off" hidden>
        <label for="shareSecurityPassword">비밀번호</label>
        <input
          id="shareSecurityPassword"
          type="password"
          inputmode="numeric"
          maxlength="4"
          autocomplete="off"
          required
        />
        <p id="shareSecurityError" class="share-security-error" aria-live="polite"></p>
        <button class="button button-primary" type="submit">보안 문서 열기</button>
      </form>
      <a id="shareDownloadFallback" class="button button-primary share-download-fallback" href="#" download hidden>
        다시 다운로드
      </a>
    </main>
  </body>
</html>
`;
  }

  return {
    createSharePage,
    getSafeMaterialId,
    getSharePagePath,
    getSharePageUrl,
  };
});
