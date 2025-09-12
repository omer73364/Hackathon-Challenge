const fs = require("fs");

function saveBase64Image(dataUrl, filename) {
  const filePath = `./public/${filename}`;
  const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, "").trim();
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);
}

module.exports = { saveBase64Image };