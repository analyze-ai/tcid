/* ==========================================
   Analyze-AI
   Version : v0.1.0 Alpha
   File    : app.js
========================================== */

/* ==========================================
   CONSTANTS
========================================== */

const ANALYZE_DELAY = 2000;

/* ==========================================
   DOM ELEMENTS
========================================== */

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

const analyzeBtn = document.getElementById("analyzeBtn");

const spinner = document.getElementById("spinner");
const btnLabel = document.getElementById("btnLabel");

const csvStatus = document.getElementById("csvStatusVal");
const statusVal = document.getElementById("statusVal");

/* ==========================================
   VARIABLES
========================================== */

let selectedFile = null;

/* ==========================================
   INITIALIZE
========================================== */

spinner.style.display = "none";
analyzeBtn.disabled = true;

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function setStatus(text, type = "waiting") {

    statusVal.textContent = text;
    statusVal.className = `val ${type}`;

}

function setCSVStatus(text, type = "waiting") {

    csvStatus.textContent = text;
    csvStatus.className = `val ${type}`;

}

function resetAnalyzeButton() {

    spinner.style.display = "none";
    btnLabel.textContent = "Analyze";
    analyzeBtn.disabled = false;

}

/* ==========================================
   FILE SELECTED
========================================== */

fileInput.addEventListener("change", function () {

    if (!this.files.length) return;

    const file = this.files[0];

    // Validasi file CSV
    if (!file.name.toLowerCase().endsWith(".csv")) {

        alert("Please select a CSV file.");

        this.value = "";

        return;

    }

    selectedFile = file;

    fileName.textContent = file.name;

    setCSVStatus("CSV Loaded", "success");

    setStatus("Ready to Analyze", "success");

    spinner.style.display = "none";

    btnLabel.textContent = "Analyze";

    analyzeBtn.disabled = false;

});

/* ==========================================
   ANALYZE BUTTON
========================================== */

analyzeBtn.addEventListener("click", () => {

    if (!selectedFile) {

        alert("Please select a CSV file first.");

        return;

    }

    spinner.style.display = "inline-block";

    btnLabel.textContent = "Analyzing...";

    analyzeBtn.disabled = true;

    setStatus("Analyzing CSV...", "waiting");

    // Simulasi proses analisis
    setTimeout(() => {

        spinner.style.display = "none";

        btnLabel.textContent = "Analyze";

        analyzeBtn.disabled = false;

        setStatus("Analysis Complete", "success");

    }, ANALYZE_DELAY);

});
