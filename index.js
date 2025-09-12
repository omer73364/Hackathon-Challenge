const app = require('./app');
const db = require('./db'); 
const { saveBase64Image, storeFingerprintInDB, broadcastData } = require('./helpers');

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/log", (req, res) => {
  db.execute("SELECT * FROM fingerprints ORDER BY id DESC")
  .then(([result]) => {
    res.send(result);
  });
});

app.post("/fingerprint", async (req, res) => {
  const { name = null, matched, fingerprint_img, score } = req.body;

  const filename = `${Date.now()}.png`;
  const fileUrl = `http://${req.get('host')}/${filename}`;

  const data = { name, matched, score, fileUrl };
  
  saveBase64Image(fingerprint_img, filename);
  storeFingerprintInDB(data);
  broadcastData(data);

  res.status(200).send({ message: "broadcasts to all clients" });
});

app.listen(8080, () => {
  console.log("Express listening on 8080");
  console.log("Websocket on 8081");
});
