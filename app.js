// FF14 CD Jacket Generator - app.js

// --- Data Definitions ---
const dcData = {
  "Mana": ["Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandaemonium", "Titan"],
  "Gaia": ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
  "Elemental": ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
  "Meteor": ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"]
};

// Jobs
const jobs = [
  { id: "pld", name: "Paladin", abbr: "PLD", category: "TANK" },
  { id: "war", name: "Warrior", abbr: "WAR", category: "TANK" },
  { id: "drk", name: "Dark Knight", abbr: "DRK", category: "TANK" },
  { id: "gnb", name: "Gunbreaker", abbr: "GNB", category: "TANK" },
  
  { id: "drg", name: "Dragoon", abbr: "DRG", category: "MELEE DPS" },
  { id: "rpr", name: "Reaper", abbr: "RPR", category: "MELEE DPS" },
  { id: "mnk", name: "Monk", abbr: "MNK", category: "MELEE DPS" },
  { id: "sam", name: "Samurai", abbr: "SAM", category: "MELEE DPS" },
  { id: "nin", name: "Ninja", abbr: "NIN", category: "MELEE DPS" },
  { id: "vpr", name: "Viper", abbr: "VPR", category: "MELEE DPS" },

  { id: "brd", name: "Bard", abbr: "BRD", category: "PHYSICAL RANGED" },
  { id: "mch", name: "Machinist", abbr: "MCH", category: "PHYSICAL RANGED" },
  { id: "dnc", name: "Dancer", abbr: "DNC", category: "PHYSICAL RANGED" },

  { id: "blm", name: "Black Mage", abbr: "BLM", category: "MAGICAL RANGED" },
  { id: "smn", name: "Summoner", abbr: "SMN", category: "MAGICAL RANGED" },
  { id: "rdm", name: "Red Mage", abbr: "RDM", category: "MAGICAL RANGED" },
  { id: "pct", name: "Pictomancer", abbr: "PCT", category: "MAGICAL RANGED" },

  { id: "whm", name: "White Mage", abbr: "WHM", category: "HEALER" },
  { id: "sch", name: "Scholar", abbr: "SCH", category: "HEALER" },
  { id: "ast", name: "Astrologian", abbr: "AST", category: "HEALER" },
  { id: "sge", name: "Sage", abbr: "SGE", category: "HEALER" }
];

// Playstyles
const playstyles = [
  { id: "main-scenario",  name: "メインシナリオ" },
  { id: "dungeons",       name: "ダンジョン" },
  { id: "extreme",        name: "極" },
  { id: "savage",         name: "零式" },
  { id: "ultimate",       name: "絶" },
  { id: "casual",         name: "カジュアル" },
  { id: "gpose",          name: "GPose / SS" },
  { id: "housing",        name: "ハウジング" },
  { id: "glamour",        name: "グラマー / ミラプリ" },
  { id: "gather-craft",   name: "採集 / 製作" },
  { id: "gold-saucer",    name: "ゴールドソーサー" },
  { id: "roleplay",       name: "ロールプレイ" },
  { id: "chatting",       name: "交流 / チャット" },
  { id: "pvp",            name: "PvP" }
];


// --- State ---
let selectedJobs = [];
let mainJobId = null;
let selectedPlaystyles = [];

let imageState = {
  src: "",
  scale: 1.0,
  x: 0,
  y: 0,
  isDragging: false,
  startX: 0,
  startY: 0
};

// --- DOM Elements ---
const selectDc = document.getElementById("select-dc");
const selectWorld = document.getElementById("select-world");
const inputName = document.getElementById("input-name");
const cardName = document.getElementById("card-name-val");
const cardServer = document.getElementById("card-server-val");

const jobsContainer = document.getElementById("jobs-container");
const cardJobsList = document.getElementById("card-jobs-list-val");

const playstylesContainer = document.getElementById("playstyles-container");
const cardPlaystylesList = document.getElementById("card-playstyles-list-val");

const inputTimeStart = document.getElementById("input-time-start");
const inputTimeEnd = document.getElementById("input-time-end");
const cardTimeDisplay = document.getElementById("card-time-display");

const colorJacket = document.getElementById("color-jacket");
const colorDisc = document.getElementById("color-disc");
const colorTextJacket = document.getElementById("color-text-jacket");
const colorTextDisc = document.getElementById("color-text-disc");
const colorBg = document.getElementById("color-bg");

const inputImage = document.getElementById("input-image");
const cardImage = document.getElementById("card-image");
const cardImageContainer = document.getElementById("card-image-container");
const imagePlaceholder = document.getElementById("image-placeholder");
const sliderZoom = document.getElementById("slider-zoom");
const toggleShadow = document.getElementById("toggle-shadow");
const toggleTextShadow = document.getElementById("toggle-text-shadow");

const btnDownload = document.getElementById("btn-download");
const cdComposition = document.getElementById("cd-composition");
const btnShareX = document.getElementById("btn-share-x");
const shareModal = document.getElementById("share-modal");
const modalBtnOpenX = document.getElementById("modal-btn-open-x");
const modalBtnClose = document.getElementById("modal-btn-close");

// --- Initialization ---

function initSelectors() {
  // DC / World
  selectDc.innerHTML = "";
  Object.keys(dcData).forEach(dc => {
    const option = document.createElement("option");
    option.value = dc; option.textContent = dc;
    selectDc.appendChild(option);
  });
  updateWorldOptions(selectDc.value);

  // Time
  for (let h = 0; h < 24; h++) {
    const label = String(h).padStart(2, '0') + ':00';
    const optStart = document.createElement('option'); optStart.value = h; optStart.textContent = label;
    const optEnd = document.createElement('option'); optEnd.value = h; optEnd.textContent = label;
    inputTimeStart.appendChild(optStart);
    inputTimeEnd.appendChild(optEnd);
  }
  inputTimeStart.value = 20; inputTimeEnd.value = 0;
  updateCardTimeDisplay();
}

function updateWorldOptions(dc) {
  selectWorld.innerHTML = "";
  const worlds = dcData[dc] || [];
  worlds.forEach(world => {
    const option = document.createElement("option");
    option.value = world; option.textContent = world;
    selectWorld.appendChild(option);
  });
  updateCardServerDisplay();
}

function updateCardServerDisplay() {
  cardServer.textContent = `${selectDc.value} / ${selectWorld.value}`;
}

function updateCardTimeDisplay() {
  const s = String(inputTimeStart.value).padStart(2, '0') + ':00';
  const e = String(inputTimeEnd.value).padStart(2, '0') + ':00';
  cardTimeDisplay.textContent = `${s} 〜 ${e}`;
}

function initJobsSelector() {
  const categories = {};
  jobs.forEach(job => {
    if (!categories[job.category]) categories[job.category] = [];
    categories[job.category].push(job);
  });

  jobsContainer.innerHTML = "";
  Object.keys(categories).forEach(catName => {
    const catTitle = document.createElement("div");
    catTitle.className = "job-category-title";
    catTitle.textContent = catName;
    jobsContainer.appendChild(catTitle);

    const grid = document.createElement("div");
    grid.className = "jobs-grid";

    categories[catName].forEach(job => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.id = `job-check-${job.id}`; checkbox.value = job.id;
      
      const label = document.createElement("label");
      label.htmlFor = `job-check-${job.id}`; label.className = "job-label";
      label.innerHTML = `
        <div class="job-icon-placeholder"><img src="icons/${job.id}.png" alt="${job.id}" width="32" height="32" style="display:block"></div>
        <div class="job-name">${job.abbr}</div>
      `;

      checkbox.addEventListener("change", (e) => handleJobSelection(job.id, e.target.checked));
      grid.appendChild(checkbox); grid.appendChild(label);
    });
    jobsContainer.appendChild(grid);
  });
}

function initPlaystylesSelector() {
  playstylesContainer.innerHTML = "";
  playstyles.forEach(style => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.id = `playstyle-check-${style.id}`; checkbox.value = style.id;
    const label = document.createElement("label");
    label.htmlFor = `playstyle-check-${style.id}`; label.className = "playstyle-label"; label.textContent = style.name;
    
    checkbox.addEventListener("change", (e) => handlePlaystyleSelection(style.id, e.target.checked));
    playstylesContainer.appendChild(checkbox); playstylesContainer.appendChild(label);
  });
}

// --- Interaction Logic ---

// Text & Selects
inputName.addEventListener("input", (e) => cardName.textContent = e.target.value || "Name");
selectDc.addEventListener("change", (e) => updateWorldOptions(e.target.value));
selectWorld.addEventListener("change", updateCardServerDisplay);
inputTimeStart.addEventListener("change", updateCardTimeDisplay);
inputTimeEnd.addEventListener("change", updateCardTimeDisplay);

// Colors
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
}

function updateColors() {
  document.documentElement.style.setProperty('--jacket-color', colorJacket.value);
  document.documentElement.style.setProperty('--disc-color', colorDisc.value);
  document.documentElement.style.setProperty('--jacket-text-color', colorTextJacket.value);
  document.documentElement.style.setProperty('--disc-text-color', colorTextDisc.value);
  document.documentElement.style.setProperty('--card-bg-color', colorBg.value);
  document.documentElement.style.setProperty('--disc-text-color-rgb', hexToRgb(colorTextDisc.value));
}
colorJacket.addEventListener("input", updateColors);
colorDisc.addEventListener("input", updateColors);
colorTextJacket.addEventListener("input", updateColors);
colorTextDisc.addEventListener("input", updateColors);
colorBg.addEventListener("input", updateColors);

// Shadow Toggle
toggleShadow.addEventListener("change", (e) => {
  if (e.target.checked) {
    cdComposition.classList.add("show-shadow");
  } else {
    cdComposition.classList.remove("show-shadow");
  }
});
// Initialize shadow state on load
if (toggleShadow.checked) {
  cdComposition.classList.add("show-shadow");
}

// Text Shadow Toggle
toggleTextShadow.addEventListener("change", (e) => {
  if (e.target.checked) {
    cdComposition.classList.add("show-text-shadow");
  } else {
    cdComposition.classList.remove("show-text-shadow");
  }
});
if (toggleTextShadow.checked) {
  cdComposition.classList.add("show-text-shadow");
}

// Fonts
document.querySelectorAll('input[name="font"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    cdComposition.className = cdComposition.className.replace(/\bfont-[\w-]+/g, "");
    if (e.target.value) {
      cdComposition.classList.add(e.target.value);
    }
  });
});

// Jobs
function handleJobSelection(jobId, isChecked) {
  if (isChecked) {
    if (selectedJobs.length >= 7) {
      alert("JOBは最大7個まで選択可能です。");
      const cb = document.getElementById(`job-check-${jobId}`);
      if (cb) cb.checked = false;
      return;
    }
    if (!selectedJobs.includes(jobId)) selectedJobs.push(jobId);
    if (!mainJobId) setMainJob(jobId);
  } else {
    selectedJobs = selectedJobs.filter(id => id !== jobId);
    if (mainJobId === jobId) mainJobId = selectedJobs.length > 0 ? selectedJobs[0] : null;
  }
  updateCardJobsPreview();
}

function setMainJob(jobId) {
  mainJobId = jobId;
}

function updateCardJobsPreview() {
  cardJobsList.innerHTML = "";
  if (selectedJobs.length === 0) {
    cardJobsList.innerHTML = `<span class="placeholder-text">No jobs selected</span>`;
    return;
  }

  const orderedJobs = [...selectedJobs].sort((a, b) => (a === mainJobId ? -1 : b === mainJobId ? 1 : 0));
  
  orderedJobs.forEach(jobId => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const badge = document.createElement("div");
    badge.className = `disc-badge disc-job-badge ${jobId === mainJobId ? 'is-main' : ''}`;
    badge.style.cursor = "pointer";
    badge.title = "Click to set as Main Job";
    badge.innerHTML = `<img src="icons/${job.id}.png" width="16" height="16" alt="${job.id}"><span>${job.abbr}${jobId === mainJobId ? ' ★' : ''}</span>`;
    
    badge.addEventListener("click", () => {
      setMainJob(jobId);
      updateCardJobsPreview();
    });
    
    cardJobsList.appendChild(badge);
  });
}

// Playstyles
function handlePlaystyleSelection(styleId, isChecked) {
  if (isChecked) {
    if (selectedPlaystyles.length >= 6) {
      alert("プレイスタイルは最大6個まで選択可能です。");
      const cb = document.getElementById(`playstyle-check-${styleId}`);
      if (cb) cb.checked = false;
      return;
    }
    if (!selectedPlaystyles.includes(styleId)) selectedPlaystyles.push(styleId);
  } else {
    selectedPlaystyles = selectedPlaystyles.filter(id => id !== styleId);
  }
  updateCardPlaystylesPreview();
}

function updateCardPlaystylesPreview() {
  cardPlaystylesList.innerHTML = "";
  if (selectedPlaystyles.length === 0) {
    cardPlaystylesList.innerHTML = `<span class="placeholder-text">Not set</span>`;
    return;
  }
  selectedPlaystyles.forEach(styleId => {
    const style = playstyles.find(p => p.id === styleId);
    if (!style) return;
    const badge = document.createElement("div");
    badge.className = "disc-badge";
    badge.textContent = style.name;
    cardPlaystylesList.appendChild(badge);
  });
}

// Image Handling
function applyImageTransform() {
  cardImage.style.transform = `translate(${imageState.x}px, ${imageState.y}px) scale(${imageState.scale})`;
}

inputImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    imageState.src = event.target.result;
    cardImage.src = event.target.result;
    cardImage.style.display = "block";
    imagePlaceholder.style.display = "none";
    cardImage.onload = () => resetImagePosition();
  };
  reader.readAsDataURL(file);
});

function resetImagePosition() {
  const containerWidth = cardImageContainer.clientWidth;
  const containerHeight = cardImageContainer.clientHeight;
  const imgWidth = cardImage.naturalWidth;
  const imgHeight = cardImage.naturalHeight;

  const scaleX = containerWidth / imgWidth;
  const scaleY = containerHeight / imgHeight;
  const initialScale = Math.max(scaleX, scaleY);

  imageState.scale = Math.round(initialScale * 10) / 10;
  imageState.x = (containerWidth - imgWidth * imageState.scale) / 2;
  imageState.y = (containerHeight - imgHeight * imageState.scale) / 2;
  
  sliderZoom.value = imageState.scale;
  applyImageTransform();
}

sliderZoom.addEventListener("input", (e) => {
  if (!imageState.src) return;
  imageState.scale = parseFloat(e.target.value);
  applyImageTransform();
});

// Drag
function startDrag(e) {
  if (!imageState.src) return;
  e.preventDefault();
  imageState.isDragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  imageState.startX = clientX - imageState.x;
  imageState.startY = clientY - imageState.y;
}
function doDrag(e) {
  if (!imageState.isDragging) return;
  e.preventDefault();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  imageState.x = clientX - imageState.startX;
  imageState.y = clientY - imageState.startY;
  applyImageTransform();
}
function endDrag() { imageState.isDragging = false; }

cardImageContainer.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", doDrag);
window.addEventListener("mouseup", endDrag);
cardImageContainer.addEventListener("touchstart", startDrag, { passive: false });
window.addEventListener("touchmove", doDrag, { passive: false });
window.addEventListener("touchend", endDrag);

cardImageContainer.addEventListener("wheel", (e) => {
  if (!imageState.src) return;
  e.preventDefault();
  const zoomStep = 0.05;
  if (e.deltaY < 0) imageState.scale = Math.min(imageState.scale + zoomStep, 3.0);
  else imageState.scale = Math.max(imageState.scale - zoomStep, 0.1);
  sliderZoom.value = imageState.scale;
  applyImageTransform();
}, { passive: false });


// Export
btnDownload.addEventListener("click", async () => {
  const originalBtnText = btnDownload.innerHTML;
  btnDownload.disabled = true;
  btnDownload.textContent = "Generating...";

  const isMobile = window.innerWidth <= 1000 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let newTab = null;
  if (isMobile) {
    // Open tab synchronously to bypass Safari/Chrome popup blockers
    newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Generating...</title>
          </head>
          <body style="background:#111; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0;">
            <h3>画像を生成中... しばらくお待ちください</h3>
          </body>
        </html>
      `);
    }
  }

  // Temporarily remove scaling from the wrapper to ensure html2canvas calculates coordinates correctly
  const scaleWrapper = document.querySelector('.preview-scale-wrapper');
  const originalTransform = scaleWrapper ? scaleWrapper.style.transform : '';
  if (scaleWrapper) {
    scaleWrapper.style.transform = 'none';
  }

  // Ensure all fonts are fully loaded before rendering
  try {
    await document.fonts.ready;
  } catch (err) {
    console.warn("Font loading wait failed:", err);
  }

  // Using modern-screenshot to render the CD composition flawlessly
  modernScreenshot.domToPng(cdComposition, {
    scale: 2,
    width: 900,
    height: 900
  }).then(dataUrl => {
    // Restore the scaling immediately
    if (scaleWrapper) {
      scaleWrapper.style.transform = originalTransform;
    }
    const charName = inputName.value.trim() || "ff14-character";

    if (isMobile && newTab) {
      newTab.document.body.innerHTML = `
        <style>
          body { 
            margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; 
            background-color: #111;
            color: #fff; font-family: sans-serif; text-align: center; 
          }
          img { max-width: 95vw; max-height: 80vh; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); object-fit: contain; background: transparent; }
          p { padding: 15px; margin: 0 0 15px 0; font-size: 15px; font-weight: bold; width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.8); }
        </style>
        <p>👇 画像を長押しして「写真に追加」または「保存」を選択してください 👇</p>
        <img src="${dataUrl}" alt="CD Jacket">
      `;
      newTab.document.title = "Save CD Jacket";
    } else {
      // Fallback for desktop or if popup was blocked
      const link = document.createElement("a");
      link.download = `${charName}_cd_jacket.png`;
      link.href = dataUrl;
      link.click();
    }

    btnDownload.disabled = false;
    btnDownload.innerHTML = originalBtnText;
  }).catch(err => {
    // Restore the scaling on error
    if (scaleWrapper) {
      scaleWrapper.style.transform = originalTransform;
    }
    console.error("Failed to generate image:", err);
    if (newTab) newTab.close();
    alert("Generation failed. Please try again.");
    btnDownload.disabled = false;
    btnDownload.innerHTML = originalBtnText;
  });
});

// --- Share to X (Twitter) ---
if (btnShareX) {
  // Modal buttons
  if (modalBtnClose) {
    modalBtnClose.addEventListener("click", () => {
      shareModal.style.display = "none";
    });
  }
  if (modalBtnOpenX) {
    modalBtnOpenX.addEventListener("click", () => {
      const shareText = "「FF14CDjacketGenerator」でCDジャケット風キャラクターカードを作成しました！\n";
      const hashtags = "FF14CDjacketGenerator,FF14キャラクターカード";
      const pageUrl = "https://hebinyororin.github.io/FF14CDjacketGenerator/";
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
      window.open(shareUrl, "_blank");
      shareModal.style.display = "none"; // Close modal after opening X
    });
  }

  btnShareX.addEventListener("click", () => {
    const origText = btnShareX.innerHTML;
    btnShareX.disabled = true;
    btnShareX.innerHTML = "画像コピー中...";

    const scaleWrapper = document.querySelector('.preview-scale-wrapper');
    const origTransform = scaleWrapper ? scaleWrapper.style.transform : "";
    if (scaleWrapper) scaleWrapper.style.transform = "none";

    modernScreenshot.domToBlob(cdComposition, {
      scale: 2,
      width: 900,
      height: 900,
      style: {
        transform: "none",
        margin: "0",
        padding: "0"
      }
    }).then(blob => {
      if (scaleWrapper) scaleWrapper.style.transform = origTransform;

      // Copy image to clipboard so user can simply paste it on X
      if (navigator.clipboard && navigator.clipboard.write) {
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]).then(() => {
          // Show modal overlays (contains user instructions) instead of alert dialog
          shareModal.style.display = "flex";
        }).catch(err => {
          console.error("Clipboard copy failed:", err);
          shareModal.style.display = "flex";
        });
      } else {
        console.warn("Clipboard API not supported in this environment");
        shareModal.style.display = "flex";
      }
    }).catch(err => {
      if (scaleWrapper) scaleWrapper.style.transform = origTransform;
      console.error("Failed to generate image for share:", err);
      shareModal.style.display = "flex";
    }).finally(() => {
      btnShareX.disabled = false;
      btnShareX.innerHTML = origText;
    });
  });
}

// Run Init
window.addEventListener("DOMContentLoaded", () => {
  initSelectors();
  initJobsSelector();
  initPlaystylesSelector();
  updateColors(); // ensure initial color setup
  updateFluidScale();
});

// --- Fluid Scale Logic for Responsive Layout ---
function updateFluidScale() {
  const isMobile = window.innerWidth <= 1000;
  let scale = 1;
  
  if (isMobile) {
    // Mobile layout: panel is below, so available width is window - padding
    scale = (window.innerWidth - 50) / 900;
  } else {
    // Desktop layout: panel is side-by-side, so available width is window - panel(350) - gap/padding(100)
    scale = (window.innerWidth - 450) / 900;
  }
  
  // Clamp scale between 0.2 and 1
  scale = Math.min(1, Math.max(0.2, scale));
  document.documentElement.style.setProperty('--preview-scale', scale);
}
window.addEventListener("resize", updateFluidScale);
