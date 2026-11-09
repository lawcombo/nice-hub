"use strict";

const fs = require("node:fs");
const path = require("node:path");
const builder = require("../assets/js/share-page-builder.js");

const projectRoot = path.resolve(__dirname, "..");
const libraryPath = path.join(projectRoot, "assets", "data", "library.json");
const outputDirectory = path.join(projectRoot, "share");
const library = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
const materials = Array.isArray(library.materials) ? library.materials : [];

fs.mkdirSync(outputDirectory, { recursive: true });

const expectedFiles = new Set();
materials.forEach((material) => {
  const fileName = `${builder.getSafeMaterialId(material)}.html`;
  expectedFiles.add(fileName);
  fs.writeFileSync(path.join(outputDirectory, fileName), builder.createSharePage(material), "utf8");
});

fs.readdirSync(outputDirectory, { withFileTypes: true }).forEach((entry) => {
  if (!entry.isFile() || !entry.name.endsWith(".html") || expectedFiles.has(entry.name)) return;
  fs.unlinkSync(path.join(outputDirectory, entry.name));
});

console.log(`Generated ${materials.length} material share pages.`);
