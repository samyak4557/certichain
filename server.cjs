const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

const certificatesFile = path.join(
  dataFolder,
  "certificates.json"
);

const blockchainFile = path.join(
  dataFolder,
  "blockchain.json"
);

if (!fs.existsSync(certificatesFile)) {
  fs.writeFileSync(
    certificatesFile,
    JSON.stringify([], null, 2)
  );
}

if (!fs.existsSync(blockchainFile)) {
  fs.writeFileSync(
    blockchainFile,
    JSON.stringify([], null, 2)
  );
}

// ===============================
// FILE FUNCTIONS
// ===============================

function readCertificates() {
  try {
    return JSON.parse(
      fs.readFileSync(certificatesFile, "utf8")
    );
  } catch (error) {
    return [];
  }
}

function saveCertificates(data) {
  fs.writeFileSync(
    certificatesFile,
    JSON.stringify(data, null, 2)
  );
}

function readBlockchain() {
  try {
    return JSON.parse(
      fs.readFileSync(blockchainFile, "utf8")
    );
  } catch (error) {
    return [];
  }
}

function saveBlockchain(data) {
  fs.writeFileSync(
    blockchainFile,
    JSON.stringify(data, null, 2)
  );
}

// ===============================
// SHA-256 HASH FUNCTION
// ===============================

function calculateHash(data) {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
}

// ===============================
// CREATE BLOCK HASH
// ===============================

function calculateBlockHash(block) {
  const blockData =
    block.blockNumber +
    block.certificateId +
    block.certificateHash +
    block.previousHash +
    block.timestamp;

  return calculateHash(blockData);
}

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "CertiChain Backend Server is running",
    status: "online",
  });
});

// ===============================
// CERTIFICATE APIs
// ===============================

// Get all certificates
app.get("/api/certificates", (req, res) => {
  const certificates = readCertificates();
  res.json(certificates);
});

// Get one certificate
app.get("/api/certificates/:id", (req, res) => {
  const certificates = readCertificates();

  const certificate = certificates.find(
    (cert) =>
      String(cert.id).toUpperCase() ===
      String(req.params.id).toUpperCase()
  );

  if (!certificate) {
    return res.status(404).json({
      message: "Certificate not found",
    });
  }

  res.json(certificate);
});

// Create certificate
app.post("/api/certificates", (req, res) => {
  const certificates = readCertificates();
  const newCertificate = req.body;

  if (!newCertificate.id) {
    return res.status(400).json({
      message: "Certificate ID is required",
    });
  }

  const alreadyExists = certificates.some(
    (cert) => cert.id === newCertificate.id
  );

  if (alreadyExists) {
    return res.status(409).json({
      message: "Certificate already exists",
    });
  }

  certificates.push(newCertificate);
  saveCertificates(certificates);

  res.status(201).json({
    message: "Certificate created successfully",
    certificate: newCertificate,
  });
});

// Update certificate
app.put("/api/certificates/:id", (req, res) => {
  const certificates = readCertificates();

  const index = certificates.findIndex(
    (cert) =>
      String(cert.id).toUpperCase() ===
      String(req.params.id).toUpperCase()
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

  saveCertificates(certificates);

  res.json({
    message: "Certificate updated successfully",
    certificate: certificates[index],
  });
});

// ===============================
// BLOCKCHAIN APIs
// ===============================

// Get all blockchain records
app.get("/api/blockchain", (req, res) => {
  const blockchain = readBlockchain();
  res.json(blockchain);
});

// Add blockchain block
app.post("/api/blockchain", (req, res) => {
  const blockchain = readBlockchain();
  const data = req.body;

  if (!data.certificateId || !data.certificateHash) {
    return res.status(400).json({
      message:
        "Certificate ID and Certificate Hash are required",
    });
  }

  const blockNumber = blockchain.length + 1;

  const previousHash =
    blockchain.length === 0
      ? "0"
      : blockchain[blockchain.length - 1].blockHash;

  const timestamp = new Date().toISOString();

  const newBlock = {
    blockNumber,
    certificateId: data.certificateId,
    certificateHash: data.certificateHash,
    previousHash,
    timestamp,
    blockHash: "",
    status: "Confirmed",
  };

  newBlock.blockHash = calculateBlockHash(newBlock);

  blockchain.push(newBlock);

  saveBlockchain(blockchain);

  res.status(201).json({
    message: "Blockchain block added successfully",
    block: newBlock,
  });
});

// ===============================
// VERIFY BLOCKCHAIN
// ===============================

app.get("/api/blockchain/verify/:certificateId", (req, res) => {
  const blockchain = readBlockchain();

  const certificateId = String(
    req.params.certificateId
  ).toUpperCase();

  const blockIndex = blockchain.findIndex(
    (block) =>
      String(block.certificateId).toUpperCase() ===
      certificateId
  );

  if (blockIndex === -1) {
    return res.status(404).json({
      verified: false,
      message: "Blockchain record not found",
    });
  }

  const block = blockchain[blockIndex];

  const recalculatedHash = calculateBlockHash(block);

  const blockHashValid =
    recalculatedHash === block.blockHash;

  let previousHashValid = true;

  if (blockIndex > 0) {
    const previousBlock = blockchain[blockIndex - 1];

    previousHashValid =
      block.previousHash === previousBlock.blockHash;
  } else {
    previousHashValid =
      block.previousHash === "0";
  }

  const verified =
    blockHashValid && previousHashValid;

  res.json({
    verified,
    certificateId: block.certificateId,
    blockNumber: block.blockNumber,
    blockHashValid,
    previousHashValid,
    message: verified
      ? "Blockchain record is valid"
      : "Blockchain record integrity check failed",
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("CertiChain Backend Server");
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://10.11.113.49:${PORT}`);
  console.log("================================");
});