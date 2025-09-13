const fs = require("fs");
const db = require("./db");
const wss = require("./ws");
require("dotenv").config(); // For environment variables

function saveBase64Image(dataUrl, filename) {
  if (!dataUrl) return;
  const filePath = `./public/${filename}`;
  const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, "").trim();
  const buffer = Buffer.from(base64Data, "base64");

  if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public");
  }

  fs.writeFileSync(filePath, buffer);
}

function saveUploadedImage(tempFilePath) {
  const filename = `${Date.now()}.png`;
  const filePath = `${__dirname}/../public/${filename}`;
  fs.renameSync(`${tempFilePath}`, filePath);
  return filename;
}

async function storeFingerprintLogInDB(data) {
  const { name, matched, score, fileUrl } = data;
  return await db.execute(
    "INSERT INTO fingerprints_log (name, fingerprint_img, matched, score) VALUES (?, ?, ?, ?)",
    [name, fileUrl, matched, score*100]
  );
}

async function storePersonInDB(data) {
  const { name, birthday, phone, address, gender } = data;
  return await db.execute(
    "INSERT INTO persons (name, birthday, phone, address, gender) VALUES (?, ?, ?, ?, ?)",
    [name, birthday, phone, address, gender]
  );
}

async function storePersonFingerprintInDB(data) {
  const { person_id, fingerprint_img } = data;
  return await db.execute(
    "INSERT INTO fingerprints (person_id, fingerprint_img) VALUES (?, ?)",
    [person_id, fingerprint_img]
  );
}

async function getFingerprintsLog() {
  return (await db.execute("SELECT * FROM fingerprints_log ORDER BY id DESC"))[0];
}

async function getPersons() {
  return (await db.execute("SELECT * FROM persons ORDER BY id DESC"))[0];
}

async function getPersonFingerprints(person_id) {
  return (await db.execute("SELECT * FROM fingerprints WHERE person_id = ?", [person_id]))[0];
}

function broadcastData(data) {
  data.fingerprint_img = data.fileUrl;
  delete data.fileUrl;
  wss.clients.forEach((client) => {
    if (client.readyState == 1) {
      client.send(JSON.stringify(data));
    }
  });
}

async function getDashboardStatistics() {
  const statistics = {
    totalPersons: (await getPersons())?.length,
    totalFingerprints: (await getFingerprintsLog())?.length,
    totalMatched: (await getFingerprintsLog())?.filter((log) => log.matched).length,
    totalUnmatched: (await getFingerprintsLog())?.filter((log) => !log.matched).length,
    checkedToday: (await getFingerprintsLog())?.filter((log) => log.created_at.toDateString() === new Date().toDateString()).length,
    checkedYesterday: (await getFingerprintsLog())?.filter((log) => log.created_at.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()).length,
    matchedToday: (await getFingerprintsLog())?.filter((log) => log.matched && log.created_at.toDateString() === new Date().toDateString()).length,
    matchedYesterday: (await getFingerprintsLog())?.filter((log) => log.matched && log.created_at.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()).length,
    unmatchedToday: (await getFingerprintsLog())?.filter((log) => !log.matched && log.created_at.toDateString() === new Date().toDateString()).length,
    unmatchedYesterday: (await getFingerprintsLog())?.filter((log) => !log.matched && log.created_at.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()).length,
    matchedPerDay: (await getFingerprintsLog())
      ?.reduce((acc, log) => {
        const date = log.created_at.toDateString();
        if (!acc[date]) {
          acc[date] = 0;
        }
        if (log.matched) {
          acc[date]++;
        }
        return acc;
      }, {})
  
  };
  return statistics;
}

module.exports = {
  saveBase64Image,
  storeFingerprintLogInDB,
  broadcastData,
  saveUploadedImage,
  storePersonInDB,
  storePersonFingerprintInDB,
  getFingerprintsLog,
  getPersons,
  getPersonFingerprints,
  getDashboardStatistics
};
