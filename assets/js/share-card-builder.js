(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NiceHubShareCard = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const width = 1200;
  const height = 630;

  function getSafeMaterialId(material) {
    const id = String(material?.id || "").trim();
    return id && /^[a-z0-9][a-z0-9-]*$/i.test(id) ? id : "material";
  }

  function getShareImagePath(material) {
    return `assets/share-cards/${getSafeMaterialId(material)}.jpg`;
  }

  function getSettingLabel(items, id, fallback) {
    return items?.find((item) => item.id === id)?.label || fallback;
  }

  function roundedRect(context, x, y, boxWidth, boxHeight, radius) {
    const safeRadius = Math.min(radius, boxWidth / 2, boxHeight / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + boxWidth - safeRadius, y);
    context.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + safeRadius);
    context.lineTo(x + boxWidth, y + boxHeight - safeRadius);
    context.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - safeRadius, y + boxHeight);
    context.lineTo(x + safeRadius, y + boxHeight);
    context.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
  }

  function drawPill(context, label, x, y, options = {}) {
    const font = options.font || "700 22px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.font = font;
    const paddingX = options.paddingX || 18;
    const pillWidth = Math.ceil(context.measureText(label).width + paddingX * 2);
    const pillHeight = options.height || 42;
    roundedRect(context, x, y, pillWidth, pillHeight, pillHeight / 2);
    context.fillStyle = options.background || "#eaf3ff";
    context.fill();
    context.fillStyle = options.color || "#1769c7";
    context.textBaseline = "middle";
    context.fillText(label, x + paddingX, y + pillHeight / 2 + 1);
    return pillWidth;
  }

  function splitText(context, text, maxWidth, maxLines) {
    const characters = Array.from(String(text || ""));
    const lines = [];
    let current = "";

    characters.forEach((character) => {
      const candidate = current + character;
      if (current && context.measureText(candidate).width > maxWidth) {
        lines.push(current.trimEnd());
        current = character.trimStart();
      } else {
        current = candidate;
      }
    });
    if (current) lines.push(current.trimEnd());

    if (lines.length > maxLines) {
      lines.length = maxLines;
      let last = lines[maxLines - 1];
      while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
      lines[maxLines - 1] = `${last.trimEnd()}…`;
    }
    return lines;
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      if (!source || typeof Image === "undefined") {
        resolve(null);
        return;
      }

      const image = new Image();
      let objectUrl = "";
      if (source instanceof Blob) objectUrl = URL.createObjectURL(source);
      else image.crossOrigin = "anonymous";

      image.onload = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        reject(new Error("공유 카드에 사용할 표지 이미지를 불러오지 못했습니다."));
      };
      image.src = objectUrl || new URL(String(source), document.baseURI).href;
    });
  }

  function drawCoverImage(context, image, x, y, boxWidth, boxHeight, radius) {
    context.save();
    roundedRect(context, x, y, boxWidth, boxHeight, radius);
    context.clip();

    if (image) {
      const scale = Math.max(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, x + (boxWidth - drawWidth) / 2, y + (boxHeight - drawHeight) / 2, drawWidth, drawHeight);
    } else {
      const fallback = context.createLinearGradient(x, y, x + boxWidth, y + boxHeight);
      fallback.addColorStop(0, "#eef5ff");
      fallback.addColorStop(1, "#dbeaff");
      context.fillStyle = fallback;
      context.fillRect(x, y, boxWidth, boxHeight);
      context.strokeStyle = "#1769c7";
      context.lineWidth = 10;
      roundedRect(context, x + 145, y + 70, 140, 170, 20);
      context.stroke();
      context.fillStyle = "#1769c7";
      context.fillRect(x + 175, y + 115, 80, 8);
      context.fillRect(x + 175, y + 145, 80, 8);
      context.fillRect(x + 175, y + 175, 56, 8);
    }
    context.restore();
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("공유 카드 이미지를 만들지 못했습니다."))),
        "image/jpeg",
        0.92,
      );
    });
  }

  async function createShareCardBlob(material, library, thumbnailSource) {
    if (typeof document === "undefined") throw new Error("공유 카드 이미지는 브라우저에서 생성해야 합니다.");

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const categoryLabel = getSettingLabel(library?.categories, material?.category, "NICE HUB");
    const typeLabel = getSettingLabel(library?.materialTypes, material?.type, "자료");
    const title = String(material?.title || "NICE HUB 자료").replace(/\s+/g, " ").trim();
    let image = null;
    try {
      image = await loadImage(thumbnailSource || material?.thumbnail);
    } catch (error) {
      image = null;
    }

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#f8fbff");
    background.addColorStop(1, "#edf4fc");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const header = context.createLinearGradient(0, 0, width, 0);
    header.addColorStop(0, "#092f59");
    header.addColorStop(0.65, "#0f4d91");
    header.addColorStop(1, "#1d72cf");
    context.fillStyle = header;
    context.fillRect(0, 0, width, 108);
    context.fillStyle = "rgba(255,255,255,.08)";
    context.beginPath();
    context.arc(1065, 54, 156, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "800 38px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.textBaseline = "middle";
    context.fillText("NICE HUB", 58, 54);
    context.font = "600 20px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.fillStyle = "#d6e9ff";
    context.fillText("현장 영업 자료허브", 260, 56);
    drawPill(context, "고객 공유 자료", 954, 31, {
      background: "rgba(255,255,255,.16)",
      color: "#ffffff",
      font: "700 18px 'Noto Sans KR', 'Malgun Gothic', sans-serif",
      height: 46,
      paddingX: 20,
    });

    context.shadowColor = "rgba(30, 65, 105, .14)";
    context.shadowBlur = 28;
    context.shadowOffsetY = 10;
    roundedRect(context, 42, 132, 1116, 444, 32);
    context.fillStyle = "#ffffff";
    context.fill();
    context.shadowColor = "transparent";

    drawCoverImage(context, image, 72, 162, 470, 326, 24);
    context.strokeStyle = "#dbe6f4";
    context.lineWidth = 2;
    roundedRect(context, 72, 162, 470, 326, 24);
    context.stroke();

    let pillX = 590;
    pillX += drawPill(context, categoryLabel, pillX, 172) + 12;
    drawPill(context, typeLabel, pillX, 172, { background: "#eef2f7", color: "#42566f" });

    context.fillStyle = "#10233f";
    context.font = "800 42px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.textBaseline = "top";
    splitText(context, title, 500, 3).forEach((line, index) => {
      context.fillText(line, 590, 242 + index * 59);
    });

    roundedRect(context, 590, 438, 500, 58, 16);
    context.fillStyle = "#f1f7ff";
    context.fill();
    context.fillStyle = "#1769c7";
    context.beginPath();
    context.arc(620, 467, 14, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(613, 467);
    context.lineTo(618, 472);
    context.lineTo(627, 461);
    context.stroke();
    context.fillStyle = "#244466";
    context.font = "700 21px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.textBaseline = "middle";
    context.fillText("항상 최신 자료로 연결됩니다", 648, 468);

    context.fillStyle = "#6a7e95";
    context.font = "500 18px 'Noto Sans KR', 'Malgun Gothic', sans-serif";
    context.fillText("NICE HUB에서 안전하고 편리하게 확인하세요", 590, 533);

    return canvasToBlob(canvas);
  }

  return {
    createShareCardBlob,
    getShareImagePath,
    height,
    width,
  };
});
