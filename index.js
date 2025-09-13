const app = require("./src/app");
const {
  saveBase64Image,
  storeFingerprintLogInDB,
  broadcastData,
  saveUploadedImage,
  getFingerprintsLog,
  storePersonFingerprintInDB,
  storePersonInDB,
  getPersons,
  getPersonFingerprints,
} = require("./src/helpers");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/log", async (req, res) => {
  return res.send(await getFingerprintsLog());
});

app.get("/persons", async (req, res) => {
  return res.send(await getPersons());
});

app.get("/persons/:id", async (req, res) => {
  return res.send(await getPersonFingerprints(req.params.id));
});

// add person
app.post("/person", async (req, res) => {
  const { name, birthday, phone, address, gender, fingerprints } = req.body;
  const data = { name, birthday, phone, address, gender };
  const result = await storePersonInDB(data);
  const person_id = result[0].insertId;
  for await (const fingerprint of fingerprints || []) {
    await storePersonFingerprintInDB({
      person_id,
      fingerprint_img: fingerprint,
    });
  }
  res.status(200).send({ message: "Person added successfully" });
});

app.post("/fingerprint", async (req, res) => {
  const { name = null, matched, fingerprint_img, score } = req.body;

  const filename = `${Date.now()}.png`;
  const fileUrl = `http://${req.get("host")}/${filename}`;
  const data = { name, matched, score, fileUrl };

  saveBase64Image(fingerprint_img, filename);
  await storeFingerprintLogInDB(data);
  broadcastData(data);

  res.status(200).send({ message: "broadcasts to all clients" });
});

app.listen(8080, () => {
  console.log("Express listening on 8080");
  console.log("Websocket on 8081");
});
