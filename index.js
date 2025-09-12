const app = require('./app');
const db = require('./db'); 
const wss = require("./ws");
const { saveBase64Image } = require('./helpers');

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
  const fileUrl = `${req.protocol}://${req.get('host')}/${filename}`;
  
  saveBase64Image(fingerprint_img, filename);
  
  await db.execute(
    "INSERT INTO fingerprints (name, fingerprint_img, matched, score) VALUES (?, ?, ?, ?)",
    [name, fileUrl, matched, score]
  );

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({name, matched, fingerprint_img:fileUrl, score})
      );
    }
  });

  res.status(200).send({ message: "broadcasts to all clients" });
});

app.listen(8080, () => {
  console.log("Express listening on 8080");
  console.log("Websocket on 8081");
});
