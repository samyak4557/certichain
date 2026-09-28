import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import "./CertificateDetails.css";

function CertificateDetails() {

  const [searchParams] = useSearchParams();

  const [certificate, setCertificate] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://certichain-f0cn.onrender.com";

  // =========================
  // FETCH EXACT CERTIFICATE
  // =========================

  useEffect(() => {

    const certificateId = searchParams.get("id");

    if (!certificateId) {
      setError("Certificate ID not found.");
      setLoading(false);
      return;
    }

    const fetchCertificate = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/certificates/${encodeURIComponent(
            certificateId
          )}`
        );

        if (!response.ok) {
          throw new Error("Certificate not found.");
        }

        const data = await response.json();

        console.log("Certificate loaded:", data);

        setCertificate(data);

      } catch (err) {

        console.error(
          "Unable to load certificate:",
          err
        );

        setCertificate(null);

        setError(
          "Certificate not found or unable to connect to server."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCertificate();

  }, [searchParams]);


  // =========================
// GENERATE QR
// =========================

useEffect(() => {

  if (!certificate) {
    return;
  }

  const verifyUrl =
    `https://certichain-j7xs.vercel.app/verify?id=` +
    encodeURIComponent(certificate.id);

  QRCode.toDataURL(
    verifyUrl,
    {
      width: 240,
      margin: 2,
      errorCorrectionLevel: "H",
    },
    (error, url) => {

      if (error) {

        console.error(
          "QR generation failed:",
          error
        );

        return;
      }

      setQrCode(url);

    }
  );

}, [certificate]);

  // =========================
  // DOWNLOAD PDF
  // =========================

  const downloadCertificate = () => {

    if (!certificate) {
      return;
    }

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();


    // Background

    pdf.setFillColor(
      250,
      248,
      240
    );

    pdf.rect(
      0,
      0,
      pageWidth,
      pageHeight,
      "F"
    );


    // Outer border

    pdf.setDrawColor(
      25,
      174,
      188
    );

    pdf.setLineWidth(2);

    pdf.rect(
      10,
      10,
      pageWidth - 20,
      pageHeight - 20
    );


    // Inner border

    pdf.setLineWidth(0.5);

    pdf.rect(
      14,
      14,
      pageWidth - 28,
      pageHeight - 28
    );


    pdf.setTextColor(
      20,
      50,
      70
    );


    // College

    pdf.setFontSize(20);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "G.H. RAISONI COLLEGE",
      pageWidth / 2,
      30,
      {
        align: "center",
      }
    );


    // Department

    pdf.setFontSize(11);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "Department of Science & Technology",
      pageWidth / 2,
      38,
      {
        align: "center",
      }
    );


    // Certificate

    pdf.setFontSize(24);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "CERTIFICATE",
      pageWidth / 2,
      52,
      {
        align: "center",
      }
    );


    pdf.setFontSize(10);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "Blockchain Verified Academic Credential",
      pageWidth / 2,
      59,
      {
        align: "center",
      }
    );


    // Presented to

    pdf.setFontSize(11);

    pdf.text(
      "This certificate is proudly presented to",
      pageWidth / 2,
      75,
      {
        align: "center",
      }
    );


    // Student name

    pdf.setFontSize(22);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      certificate.studentName,
      pageWidth / 2,
      88,
      {
        align: "center",
      }
    );


    // Course

    pdf.setFontSize(12);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      `for ${certificate.course}`,
      pageWidth / 2,
      99,
      {
        align: "center",
      }
    );


    // Certificate type

    pdf.setFontSize(11);

    pdf.text(
      certificate.certificateType ||
        "Academic Certificate",
      pageWidth / 2,
      108,
      {
        align: "center",
      }
    );


    // Certificate details

    pdf.setFontSize(10);

    pdf.text(
      `Certificate ID: ${certificate.id}`,
      30,
      128
    );

    pdf.text(
      `Issue Date: ${certificate.issueDate}`,
      30,
      137
    );

    pdf.text(
      "Issuer: G.H. Raisoni College",
      30,
      146
    );

    pdf.text(
      `Blockchain Hash: ${certificate.hash}`,
      30,
      155
    );


    // QR

    if (qrCode) {

      pdf.addImage(
        qrCode,
        "PNG",
        pageWidth - 65,
        120,
        38,
        38
      );

      pdf.setFontSize(8);

      pdf.text(
        "Scan to Verify",
        pageWidth - 46,
        162,
        {
          align: "center",
        }
      );

    }


    // Status seal

    pdf.setDrawColor(
      25,
      174,
      188
    );

    pdf.setLineWidth(1);

    pdf.circle(
      pageWidth - 45,
      75,
      15
    );

    pdf.setFontSize(9);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      certificate.status === "Revoked"
        ? "REVOKED"
        : "VERIFIED",
      pageWidth - 45,
      74,
      {
        align: "center",
      }
    );

    pdf.setFontSize(7);

    pdf.text(
      "BLOCKCHAIN",
      pageWidth - 45,
      80,
      {
        align: "center",
      }
    );


    // Footer

    pdf.setFontSize(8);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      certificate.status === "Revoked"
        ? "This certificate has been revoked."
        : "This certificate can be verified using the QR code.",
      pageWidth / 2,
      pageHeight - 25,
      {
        align: "center",
      }
    );

    pdf.text(
      "CertiChain • Blockchain-Based Certificate Verification System",
      pageWidth / 2,
      pageHeight - 18,
      {
        align: "center",
      }
    );


    // Save

    pdf.save(
      `${certificate.id}_Certificate.pdf`
    );

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="certificate-details-page">

        <div className="loading-certificate">
          Loading Certificate...
        </div>

      </div>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error || !certificate) {

    return (

      <div className="certificate-details-page">

        <nav className="certificate-navbar">

          <div className="certificate-logo">

            <div className="certificate-logo-icon">
              ✓
            </div>

            <div>

              <strong>
                CertiChain
              </strong>

              <span>
                Blockchain Credentials
              </span>

            </div>

          </div>

          <Link
            to="/student"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>

        </nav>


        <main className="certificate-container">

          <div className="certificate-heading">

            <div className="certificate-badge revoked-badge">
              ✕ CERTIFICATE NOT FOUND
            </div>

            <h1>
              Certificate Details
            </h1>

            <p>
              {error}
            </p>

          </div>

        </main>

      </div>

    );

  }


  // =========================
  // STATUS
  // =========================

  const isRevoked =
    String(certificate.status).toLowerCase() ===
    "revoked";


  // =========================
  // MAIN UI
  // =========================

  return (

    <div className="certificate-details-page">


      {/* NAVBAR */}

      <nav className="certificate-navbar">

        <div className="certificate-logo">

          <div className="certificate-logo-icon">
            ✓
          </div>

          <div>

            <strong>
              CertiChain
            </strong>

            <span>
              Blockchain Credentials
            </span>

          </div>

        </div>


        <Link
          to="/student"
          className="back-link"
        >
          ← Back to Dashboard
        </Link>

      </nav>


      {/* MAIN */}

      <main className="certificate-container">


        {/* HEADING */}

        <div className="certificate-heading">

          <div
            className={
              isRevoked
                ? "certificate-badge revoked-badge"
                : "certificate-badge"
            }
          >

            {isRevoked
              ? "✕ REVOKED CREDENTIAL"
              : "✓ VERIFIED CREDENTIAL"}

          </div>


          <h1>
            Certificate Details
          </h1>


          <p>

            {isRevoked
              ? "This certificate has been revoked and is no longer valid."
              : "View and verify the authenticity of this academic credential."}

          </p>

        </div>


        {/* CERTIFICATE PAPER */}

        <div
          className={
            isRevoked
              ? "certificate-paper revoked-paper"
              : "certificate-paper"
          }
        >

          <div className="certificate-paper-border">


            <div className="college-name">
              G.H. RAISONI COLLEGE
            </div>


            <div className="department-name">
              Department of Science & Technology
            </div>


            <div className="certificate-title">
              CERTIFICATE
            </div>


            <div className="certificate-subtitle">
              Blockchain Verified Academic Credential
            </div>


            <div className="presented-text">
              This certificate is proudly presented to
            </div>


            <div className="student-name">
              {certificate.studentName}
            </div>


            <div className="course-name">
              {certificate.course}
            </div>


            <div className="type-name">

              {certificate.certificateType ||
                "Academic Certificate"}

            </div>


            {/* DETAILS */}

            <div className="certificate-info">


              <div>

                <span>
                  Certificate ID
                </span>

                <strong>
                  {certificate.id}
                </strong>

              </div>


              <div>

                <span>
                  Issue Date
                </span>

                <strong>
                  {certificate.issueDate}
                </strong>

              </div>


              <div>

                <span>
                  Issued By
                </span>

                <strong>
                  {certificate.institution ||
                    "G.H. Raisoni College"}
                </strong>

              </div>


              <div>

                <span>
                  Blockchain Hash
                </span>

                <strong>
                  {certificate.hash}
                </strong>

              </div>


            </div>


            {/* QR */}

            <div className="certificate-qr">

              {qrCode ? (

                <img
                  src={qrCode}
                  alt="Certificate Verification QR Code"
                />

              ) : (

                <div className="qr-loading">
                  Generating QR...
                </div>

              )}

              <span>
                Scan to Verify
              </span>

            </div>


            {/* STATUS SEAL */}

            <div
              className={
                isRevoked
                  ? "verified-seal revoked-seal"
                  : "verified-seal"
              }
            >

              <div>

                {isRevoked
                  ? "✕"
                  : "✓"}

              </div>


              <strong>

                {isRevoked
                  ? "REVOKED"
                  : "VERIFIED"}

              </strong>


              <span>
                BLOCKCHAIN
              </span>

            </div>


            <div className="certificate-footer-text">

              {isRevoked
                ? "This certificate has been revoked."
                : "This certificate can be verified using the QR code."}

            </div>


          </div>

        </div>


        {/* VERIFICATION PANEL */}

        <div
          className={
            isRevoked
              ? "verification-panel revoked-panel"
              : "verification-panel"
          }
        >

          <div className="verification-icon">

            {isRevoked
              ? "✕"
              : "✓"}

          </div>


          <div>

            <span>

              {isRevoked
                ? "CERTIFICATE REVOKED"
                : "CERTIFICATE VERIFIED"}

            </span>


            <h2>

              {isRevoked
                ? "Invalid Credential"
                : "Authentic Credential"}

            </h2>


            <p>

              {isRevoked
                ? "This certificate has been revoked by the administrator and should not be considered a valid academic credential."
                : "This certificate is registered in the CertiChain verification system and can be verified using its unique Certificate ID."}

            </p>

          </div>

        </div>


        {/* HASH PANEL */}

        <div className="hash-panel">


          <div>

            <span>
              CERTIFICATE HASH
            </span>

            <code>
              {certificate.hash}
            </code>

          </div>


          <div>

            <span>
              STATUS
            </span>


            <strong
              className={
                isRevoked
                  ? "revoked-status"
                  : ""
              }
            >

              {isRevoked
                ? "✕ Revoked"
                : "✓ Verified"}

            </strong>

          </div>


        </div>


        {/* ACTIONS */}

        <div className="certificate-actions">


          <button
            className="download-certificate-btn"
            onClick={downloadCertificate}
          >
            ↓ Download Certificate PDF
          </button>


          <Link
            to={`/verify?id=${encodeURIComponent(
              certificate.id
            )}`}
            className="verify-again-btn"
          >
            ✓ Verify Certificate
          </Link>


        </div>


      </main>

    </div>

  );

}

export default CertificateDetails;