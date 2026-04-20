# 🛡️ PII Shield: Real-Time Data Loss Prevention

**PII Shield** is a high-performance, privacy-centric browser extension built on the principle of **Zero-Knowledge Privacy**. It intercepts, validates, and prevents the accidental exposure of Personally Identifiable Information (PII) and Payment Card Information (PCI) during real-time user interaction with web applications.

---
<p align="center">
  <img width="280" height="470" alt="image" src="https://github.com/user-attachments/assets/07714fa3-10ae-412a-9013-877ead463003" />
  <img width="280" height="470" alt="image" src="https://github.com/user-attachments/assets/73434c24-2752-4fe0-956d-15f2658058fa" />
</p>



## 🚀 Key Features

* **Multi-Tier Detection Pipeline**: Combines Tier 1 Regex pattern matching with Tier 3 algorithmic verification (Luhn Algorithm for Cards and Modulus 11 for SL NIC) to eliminate false positives.
* **Local-First Execution**: 100% of detection and validation occur within the local browser sandbox. Sensitive data never leaves your machine.
* **Shadow DOM Protection**: Warning banners are injected via a **closed Shadow DOM**, ensuring the security interface is tamper-proof and isolated from host website styles.
* **Site Integrity Dashboard**: Includes an "Exposed Sites" registry with integrated **URL.io** threat intelligence for domain reputation analysis.

---

## 🏗️ System Architecture

The extension follows a decoupled, event-driven model to ensure zero-latency security responses:

1.  **Content Script (`content-main.js`)**: Real-time DOM sensor monitoring input events and managing the UI injection.
2.  **Service Worker (`service-worker.js`)**: The central orchestrator for the validation pipeline and background tasks.
3.  **Validation Engine (`validators.js`)**: Algorithmic gatekeeper for NIC, Mobile, and PCI verification.
4.  **UI Controller (`ui-controller.js`)**: Manages the life cycle of isolated security interventions.

---

## 🛠️ Installation & Setup

1.  **Clone the Repository**
2.  **Open Chrome Extensions**:
    Navigate to `chrome://extensions/` in any Chromium-based browser.
3.  **Enable Developer Mode**:
    Toggle the switch in the top-right corner.
4.  **Load the Extension**:
    Click **Load unpacked** and select the root directory of this project.

---

## 🔒 Security & Privacy

This tool treats all user input as **Volatile Data**. 
* **Memory-Only Processing**: Raw PII is processed strictly in-memory and is never persisted to logs or databases.
* **Zero Cloud Exposure**: No sensitive data is transmitted to external servers. 
* **Selective Telemetry**: Only non-sensitive metadata (aggregate detection counts and site URLs) is stored locally to provide the exposure history feature.

---

*Developed as part of the Information Security Project module - SLIIT 2026*
