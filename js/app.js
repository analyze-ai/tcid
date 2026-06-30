/* ==========================================
   Analyze-AI
   Version 0.1.0
========================================== */

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

const analyzeBtn = document.getElementById("analyzeBtn");

const csvStatus = document.getElementById("csvStatusVal");
const statusVal = document.getElementById("statusVal");

/* ==========================================
   FILE SELECTED
========================================== */

fileInput.addEventListener("change", function () {

    if (!this.files.length) return;

    const file = this.files[0];

    fileName.textContent = file.name;

    csvStatus.textContent = "CSV Loaded";
    csvStatus.className = "val success";

    statusVal.textContent = "Ready to Analyze";
    statusVal.className = "val success";

    analyzeBtn.disabled = false;

});
