import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./VerifyCertificate.css";

const API_URL = "http://10.11.113.49:5000";

function VerifyCertificate() {
  const [searchParams] = useSearchParams();

  const [certificateId, setCertificateId] = useState("");
  const [verified, setVerified] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [blockchainRecord, setBlockchainRecord] = useState(null);
  const [blockchainVerification, setBlockchainVerification] = useState(null);

  // =========================
  // FIND AND VERIFY CERTIFICATE
  // =========================

  const findCertificate = async (id) => {
    const enteredId = String(id).trim().toUpperCase();

    setSearched(true);

    if (!enteredId) {
      setCertificate(null);
      setVerified(false);
      setBlockchainRecord(null);
      setBlockchainVerification(null);
      return;
    }

    try {
      setLoading(true);

      setCertificate(null);
      setVerified(false);
      setBlockchainRecord(null);
      setBlockchainVerification(null);

      // =========================
      // GET CERTIFICATE
      // =========================

      const certificateResponse = await fetch(
        `${API_URL}/api/certificates/${enteredId}`
      );

      if (!certificateResponse.ok) {
        setCertificate(null);
        setVerified(false);
        setLoading(false);
        return;
      }

      const foundCertificate = await certificateResponse.json();

      setCertificate(foundCertificate);

      // =========================
      // GET BLOCKCHAIN RECORD
      // =========================

      const blockchainResponse = await fetch(
        `${API_URL}/api/blockchain`
      );

      if (blockchainResponse.ok) {
        const blockchainRecords = await blockchainResponse.json();

        const matchingBlock = blockchainRecords.find(
          (block) =>
            String(block.certificateId).trim().toUpperCase() ===
            enteredId
        );

        if (matchingBlock) {
          setBlockchainRecord(matchingBlock);
        }
      }

      // =========================
      // ACTUAL BLOCKCHAIN VERIFY
      // =========================

      const blockchainVerificationResponse = await fetch(
        `${API_URL}/api/blockchain/verify/${enteredId}`
      );

      if (blockchainVerificationResponse.ok) {
        const blockchainResult =
          await blockchainVerificationResponse.json();

        setBlockchainVerification(blockchainResult);

        // Certificate is verified only when:
        // 1. Certificate is not revoked
        // 2. Blockchain integrity is valid

        if (
          foundCertificate.status !== "Revoked" &&
          blockchainResult.verified === true
        ) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      } else {
        setBlockchainVerification({
          verified: false,
          message: "Blockchain record not found",
          blockHashValid: false,
          previousHashValid: false,
        });

        setVerified(false);
      }
    } catch (error) {
      console.error("Verification Error:", error);

      setCertificate(null);
      setVerified(false);
      setBlockchainRecord(null);
      setBlockchainVerification(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // QR CODE VERIFICATION
  // =========================

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setCertificateId(id);
      findCertificate(id);
    }
  }, [searchParams]);

  // =========================
  // VERIFY BUTTON
  // =========================

  const handleVerify = () => {
    const id = certificateId.trim();

    if (!id) {
      alert("Please enter Certificate ID!");
      return;
    }

    findCertificate(id);
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const handleClear = () => {
    setCertificateId("");
    setCertificate(null);
    setVerified(false);
    setSearched(false);
    setBlockchainRecord(null);
    setBlockchainVerification(null);
  };

  const isRevoked = certificate?.status === "Revoked";

  return (
    <div className="verify-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="verify-navbar">

        <div className="verify-logo">

          <div className="verify-logo-icon">
            ✓
          </div>

          <div>
            <strong>CertiChain</strong>
            <span>Blockchain Credentials</span>
          </div>

        </div>

        <a href="/" className="back-home">
          ← Back to Home
        </a>

      </nav>

      {/* =========================
          MAIN
      ========================= */}

      <main className="verify-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="verify-heading">

          <div className="verify-badge">
            🔐 BLOCKCHAIN VERIFICATION
          </div>

          <h1>
            Verify a Certificate
          </h1>

          <p>
            Enter the certificate ID to verify
            the authenticity of an academic
            credential.
          </p>

        </div>

        {/* =========================
            VERIFICATION CARD
        ========================= */}

        <div className="verify-card">

          <div className="search-icon">
            🔍
          </div>

          <h2>
            Certificate Verification
          </h2>

          <p className="card-description">
            Enter the unique certificate ID
            provided on the certificate.
          </p>

          <label>
            Certificate ID
          </label>

          <div className="input-row">

            <input
              type="text"
              placeholder="Example: CERT-2026-001"
              value={certificateId}
              onChange={(e) => {
                setCertificateId(e.target.value);
                setVerified(false);
                setCertificate(null);
                setBlockchainRecord(null);
                setBlockchainVerification(null);
                setSearched(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleVerify();
                }
              }}
            />

            <button
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Checking..." : "Verify"}
            </button>

          </div>

          <div className="demo-note">
            💡 Try Certificate ID:
            {" "}
            <strong>CERT-2026-004</strong>
          </div>

        </div>

        {/* =========================
            VERIFIED RESULT
        ========================= */}

        {verified && certificate && (
          <div className="result-card">

            <div className="result-header">

              <div className="success-icon">
                ✓
              </div>

              <div>

                <span className="verified-label">
                  CERTIFICATE VERIFIED
                </span>

                <h2>
                  Authentic Credential
                </h2>

              </div>

            </div>

            {/* CERTIFICATE DETAILS */}

            <div className="certificate-details">

              <div>
                <span>Student Name</span>
                <strong>
                  {certificate.studentName}
                </strong>
              </div>

              <div>
                <span>Course</span>
                <strong>
                  {certificate.course}
                </strong>
              </div>

              <div>
                <span>Certificate Type</span>
                <strong>
                  {certificate.certificateType ||
                    "Academic Certificate"}
                </strong>
              </div>

              <div>
                <span>Institution</span>
                <strong>
                  {certificate.institution ||
                    "G.H. Raisoni College"}
                </strong>
              </div>

              <div>
                <span>Issue Date</span>
                <strong>
                  {certificate.issueDate}
                </strong>
              </div>

              <div>
                <span>Certificate ID</span>
                <strong>
                  {certificate.id}
                </strong>
              </div>

              <div>
                <span>Blockchain Status</span>
                <strong className="status">
                  ✓ VERIFIED
                </strong>
              </div>

            </div>

            {/* CERTIFICATE HASH */}

            <div className="hash-box">

              <span>
                Certificate Hash
              </span>

              <code>
                {certificate.hash}
              </code>

            </div>

            {/* =========================
                BLOCKCHAIN VERIFICATION
            ========================= */}

            <div className="blockchain-box">

              <div className="chain-symbol">
                ⛓
              </div>

              <div>

                <strong>
                  Blockchain Verification Successful
                </strong>

                <p>
                  The certificate record passed
                  the blockchain integrity check.
                </p>

                {blockchainVerification && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "grid",
                      gap: "6px"
                    }}
                  >

                    <p>
                      ✓ Block Hash Valid
                    </p>

                    <p>
                      ✓ Previous Hash Valid
                    </p>

                    {blockchainVerification.blockNumber && (
                      <p>
                        Block #
                        {" "}
                        {blockchainVerification.blockNumber}
                      </p>
                    )}

                  </div>
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={handleClear}
              style={{
                marginTop: "18px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #31506c",
                background: "#142d45",
                color: "white",
                cursor: "pointer"
              }}
            >
              Verify Another Certificate
            </button>

          </div>
        )}

        {/* =========================
            REVOKED RESULT
        ========================= */}

        {searched &&
          isRevoked &&
          certificate && (

          <div
            className="result-card"
            style={{
              borderColor: "#713b45"
            }}
          >

            <div className="result-header">

              <div
                className="success-icon"
                style={{
                  background: "#5a2732",
                  color: "#ff6b7d"
                }}
              >
                ✕
              </div>

              <div>

                <span
                  className="verified-label"
                  style={{
                    color: "#ff6b7d"
                  }}
                >
                  CERTIFICATE REVOKED
                </span>

                <h2>
                  Invalid Credential
                </h2>

              </div>

            </div>

            <div className="certificate-details">

              <div>
                <span>Student Name</span>
                <strong>
                  {certificate.studentName}
                </strong>
              </div>

              <div>
                <span>Course</span>
                <strong>
                  {certificate.course}
                </strong>
              </div>

              <div>
                <span>Certificate Type</span>
                <strong>
                  {certificate.certificateType ||
                    "Academic Certificate"}
                </strong>
              </div>

              <div>
                <span>Institution</span>
                <strong>
                  {certificate.institution ||
                    "G.H. Raisoni College"}
                </strong>
              </div>

              <div>
                <span>Issue Date</span>
                <strong>
                  {certificate.issueDate}
                </strong>
              </div>

              <div>
                <span>Certificate ID</span>
                <strong>
                  {certificate.id}
                </strong>
              </div>

              <div>
                <span>Blockchain Status</span>

                <strong
                  style={{
                    color: "#ff6b7d"
                  }}
                >
                  ✕ REVOKED
                </strong>

              </div>

            </div>

            <div className="hash-box">

              <span>
                Certificate Hash
              </span>

              <code>
                {certificate.hash}
              </code>

            </div>

            <div
              className="blockchain-box"
              style={{
                borderColor: "#713b45",
                background: "#321b22"
              }}
            >

              <div
                className="chain-symbol"
                style={{
                  color: "#ff6b7d"
                }}
              >
                ✕
              </div>

              <div>

                <strong
                  style={{
                    color: "#ff6b7d"
                  }}
                >
                  Certificate Has Been Revoked
                </strong>

                <p>
                  This certificate was previously
                  registered but has been revoked by
                  the administrator and is no longer
                  considered valid.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={handleClear}
              style={{
                marginTop: "18px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #713b45",
                background: "#321b22",
                color: "#ff7b89",
                cursor: "pointer"
              }}
            >
              Verify Another Certificate
            </button>

          </div>
        )}

        {/* =========================
            BLOCKCHAIN FAILED
        ========================= */}

        {searched &&
          !loading &&
          certificate &&
          !isRevoked &&
          !verified && (

          <div
            className="result-card"
            style={{
              borderColor: "#713b45"
            }}
          >

            <div className="result-header">

              <div
                className="success-icon"
                style={{
                  background: "#5a2732",
                  color: "#ff6b7d"
                }}
              >
                ✕
              </div>

              <div>

                <span
                  className="verified-label"
                  style={{
                    color: "#ff6b7d"
                  }}
                >
                  BLOCKCHAIN VERIFICATION FAILED
                </span>

                <h2>
                  Integrity Check Failed
                </h2>

              </div>

            </div>

            <p
              style={{
                color: "#9aabba",
                marginTop: "20px",
                lineHeight: "1.7"
              }}
            >
              The certificate exists, but its blockchain
              record could not pass the integrity
              verification.
            </p>

            {blockchainVerification && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#321b22",
                  border: "1px solid #713b45",
                  color: "#ff7b89"
                }}
              >

                <p>
                  Block Hash:
                  {" "}
                  {blockchainVerification.blockHashValid
                    ? "✓ Valid"
                    : "✕ Invalid"}
                </p>

                <p style={{ marginTop: "7px" }}>
                  Previous Hash:
                  {" "}
                  {blockchainVerification.previousHashValid
                    ? "✓ Valid"
                    : "✕ Invalid"}
                </p>

              </div>
            )}

            <button
              type="button"
              onClick={handleClear}
              style={{
                marginTop: "18px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #713b45",
                background: "#321b22",
                color: "#ff7b89",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            CERTIFICATE NOT FOUND
        ========================= */}

        {searched &&
          !loading &&
          !certificate && (

          <div
            className="result-card"
            style={{
              borderColor: "#713b45"
            }}
          >

            <div className="result-header">

              <div
                className="success-icon"
                style={{
                  background: "#5a2732",
                  color: "#ff6b7d"
                }}
              >
                ×
              </div>

              <div>

                <span
                  className="verified-label"
                  style={{
                    color: "#ff6b7d"
                  }}
                >
                  CERTIFICATE NOT FOUND
                </span>

                <h2>
                  Invalid Certificate
                </h2>

              </div>

            </div>

            <p
              style={{
                color: "#9aabba",
                marginTop: "20px",
                lineHeight: "1.7"
              }}
            >
              The certificate ID you entered
              could not be found in the registered
              certificate records. Please check
              the Certificate ID and try again.
            </p>

            <button
              type="button"
              onClick={handleClear}
              style={{
                marginTop: "18px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #713b45",
                background: "#321b22",
                color: "#ff7b89",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>

          </div>
        )}

      </main>

    </div>
  );
}

export default VerifyCertificate;