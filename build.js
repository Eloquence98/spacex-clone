const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const variables = require(__dirname + "/variables.js");

const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");
const outputDir = path.join(__dirname, "dist");

// 1. Clean and Create dist directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 2. Copy Public Assets (CSS, Images, JS)
// This function recursively copies files from public/ to dist/
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirectory(publicDir, outputDir);

// 3. Render EJS with Partials and Variables
ejs.renderFile(
  path.join(viewsDir, "index.ejs"),
  { homeSections: variables.homeSections }, // Pass your data
  { views: [viewsDir] }, // Tell EJS where to look for partials
  (err, html) => {
    if (err) {
      console.error("❌ Build Failed:", err);
      process.exit(1);
    }
    fs.writeFileSync(path.join(outputDir, "index.html"), html);
    console.log("✅ Build Successful: dist/index.html created");
    process.exit(0);
  },
);
