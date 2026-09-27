const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

let certificates = [];
let blockchainRecords = [];

/* =========================
   GET CERTIFICATES
========================= */

app.get("/api/certificates", (req, res) => {
  res.json(certificates);
});

/* =========================
   ADD CERTIFICATE
========================= */

app.post("/api/certificates", (req, res) => {
  const certificate = req.body;

  certificates.push(certificate);

  res.status(201).json({
    message: "Certificate saved successfully",
    certificate,
  });
});

/* =========================
   UPDATE CERTIFICATE
   Used for REVOKE
========================= */

app.put("/api/certificates/:id", (req, res) => {
  const { id } = req.params;

  const index = certificates.findIndex(
    (certificate) => certificate.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Certificate not found",
    });
  }

  certificates[index] = {
    ...certificates[index],
    ...req.body,
  };

  res.json({
    message: "Certificate updated successfully",
    certificate: certificates[index],
  });
});

/* =========================
   DELETE CERTIFICATE
========================= */

app.delete("/api/certificates/:id", (req, res) => {
  const { id } = req.params;

  certificates = certificates.filter(
    (certificate) => certificate.id !== id
  );

  res.json({
    message: "Certificate deleted successfully",
  });
});

/* =========================
   GET BLOCKCHAIN RECORDS
========================= */

app.get("/api/blockchain", (req, res) => {
  res.json(blockchainRecords);
});

/* =========================
   ADD BLOCKCHAIN RECORD
========================= */

app.post("/api/blockchain", (req, res) => {
  const block = req.body;

  blockchainRecords.push(block);

  res.status(201).json({
    message: "Blockchain record saved successfully",
    block,
  });
});

/* =========================
   SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Backend server running on http://0.0.0.0:${PORT}`
  );

  console.log(
    `Network API: http://10.11.113.49:${PORT}`
  );
});