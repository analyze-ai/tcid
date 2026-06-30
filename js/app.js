/* =========================================================
   app.js
   Logika UI Analyze-AI (upload, analyze, navigasi sidebar)
   Catatan: logika analisis CSV sesungguhnya belum diimplementasikan.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Elemen ===== 
  const dropzone   = document.getElementById('dropzone');
  const chooseBtn  = document.getElementById('chooseBtn');
  const fileInput  = document.getElementById('fileInput');
  const fileNameEl = document.getElementById('fileName');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const spinner    = document.getElementById('spinner');
  const btnLabel   = document.getElementById('btnLabel');
  const trendVal   = document.getElementById('trendVal');
  const swingVal   = document.getElementById('swingVal');
  const statusVal  = document.getElementById('statusVal');

  let uploadedFile = null;

  // ===== Upload: klik tombol ===== 
  chooseBtn.addEventListener('click', () => fileInput.click());

  // ===== Upload: drag & drop ===== 
  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.add('drag');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.remove('drag');
    });
  });

  dropzone.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // ===== Upload: input file manual ===== 
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Mohon unggah file berformat .csv');
      return;
    }
    uploadedFile = file;
    fileNameEl.textContent = `${file.name}  ·  ${(file.size / 1024).toFixed(1)} KB`;
    analyzeBtn.disabled = false;
  }

  // ===== Analyze ===== 
  analyzeBtn.addEventListener('click', () => {
    if (!uploadedFile) return;
    runAnalysis(uploadedFile);
  });

  function runAnalysis(file) {
    setLoading(true);

    // Placeholder: panggil fungsi analisis CSV yang sesungguhnya di sini
    // (mis. parsing CSV, hitung trend & swing, lalu kirim ke renderResult)
    setTimeout(() => {
      const dummyResult = {
        trend: 'Belum tersedia',
        swing: 'Belum tersedia',
        status: 'Selesai (logika analisis belum diimplementasikan)'
      };
      renderResult(dummyResult);
      setLoading(false);
    }, 1200);
  }

  function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    spinner.style.display = isLoading ? 'inline-block' : 'none';
    btnLabel.textContent = isLoading ? 'Analyzing...' : 'Analyze';
    if (isLoading) {
      statusVal.textContent = 'Processing...';
      statusVal.className = 'val waiting';
    }
  }

  function renderResult(result) {
    trendVal.textContent = result.trend;
    trendVal.className = 'val waiting';

    swingVal.textContent = result.swing;
    swingVal.className = 'val waiting';

    statusVal.textContent = result.status;
    statusVal.className = 'val up';
  }

  // ===== Navigasi sidebar ===== 
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

});
