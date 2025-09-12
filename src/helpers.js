const fs = require("fs");
const db = require('./db'); 
const wss = require("./ws");

function saveBase64Image(dataUrl, filename) {
  const filePath = `./public/${filename}`;
  const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, "").trim();
  const buffer = Buffer.from(base64Data, "base64");

  if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public");
  }

  fs.writeFileSync(filePath, buffer);
}

function storeFingerprintInDB(data) {
  const { name, matched, score, fileUrl } = data;
  return db.execute(
    "INSERT INTO fingerprints (name, fingerprint_img, matched, score) VALUES (?, ?, ?, ?)",
    [name, fileUrl, matched, score]
  );
}

function broadcastData(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { saveBase64Image, storeFingerprintInDB, broadcastData };