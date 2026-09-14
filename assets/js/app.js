var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var canvasWidth = 1080;
var canvasHeight = 1080;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var lang = document.documentElement.lang === "ar" ? "ar" : "en";
var isRTL = lang === "ar";

var STRINGS = {
  en: {
    loadError: "Could not load card image. Check your connection and try again.",
    chooseFirst: "Please choose a message first.",
    generating: "<span class=\"download-spinner\" aria-hidden=\"true\"></span> Generating your card…",
    shareTitle: "SATORP National Day Greeting",
    cardAlt: "National Day greeting card"
  },
  ar: {
    loadError: "تعذر تحميل صورة البطاقة. تحقق من الاتصال وحاول مرة أخرى.",
    chooseFirst: "اختر رسالة أولاً",
    generating: "<span class=\"download-spinner\" aria-hidden=\"true\"></span> جاري إنشاء بطاقتك…",
    shareTitle: "تهنئة اليوم الوطني من ساتورب",
    cardAlt: "بطاقة تهنئة اليوم الوطني"
  }
};
var S = STRINGS[lang];

var imageObj = new Image();
imageObj.onload = function () {
  var loading = document.getElementById("cardPreviewLoading");
  if (loading) loading.hidden = true;
  updatePreview();
};
imageObj.onerror = function () {
  var loading = document.getElementById("cardPreviewLoading");
  if (loading) {
    loading.textContent = S.loadError;
    loading.hidden = false;
  }
  console.error("Failed to load card image.");
};

var selectedCardId = getSelectedCardId();
var cardConfig = getCardConfig(selectedCardId);
imageObj.src = cardConfig.image;

var chosenMessage = null;
var currentStep = 1;

function updatePreview() {
  var nameEl = document.getElementById("name");
  var nameText = nameEl ? nameEl.value.trim() : "";
  var message = currentStep >= 1 ? chosenMessage : null;
  var showName = currentStep >= 2 ? nameText : "";
  /* Load the exact faces the canvas draws with; document.fonts.ready is not
     enough because no page text uses Satorp, so it would never load */
  Promise.all([
    document.fonts.load("300 28pt Satorp"),
    document.fonts.load("500 28pt Satorp")
  ]).then(function () {
    drawCardWithText(message, showName);
    updateCanvasLabel(message, showName);
    refreshFinalImage();
  });
}

function updateCanvasLabel(messageText, nameText) {
  var label = S.cardAlt;
  if (messageText) label += ": " + messageText;
  if (nameText) label += " — " + nameText;
  canvas.setAttribute("aria-label", label);
  var img = document.getElementById("finalCard");
  if (img) img.alt = label;
}

/* On step 3 the card is shown as a real <img> instead of the canvas, so it
   can be long-pressed to save/share inside in-app browsers (WhatsApp, Teams)
   where programmatic downloads are unreliable */
var finalImgUrl = null;
function refreshFinalImage() {
  var img = document.getElementById("finalCard");
  if (!img) return;
  if (currentStep !== 3) {
    img.hidden = true;
    canvas.hidden = false;
    return;
  }
  generateCardBlob(function (blob) {
    if (finalImgUrl) URL.revokeObjectURL(finalImgUrl);
    finalImgUrl = URL.createObjectURL(blob);
    img.src = finalImgUrl;
    img.hidden = false;
    canvas.hidden = true;
    var hint = document.getElementById("saveHint");
    if (hint) hint.hidden = !window.matchMedia("(pointer: coarse)").matches;
  });
}

var stepTransitionMs = 220;
var stepTransitioning = false;

function maxAllowedStep() {
  if (!chosenMessage) return 1;
  var nameEl = document.getElementById("name");
  if (!nameEl || !nameEl.value.trim()) return 2;
  return 3;
}

function goToStep(step) {
  if (stepTransitioning || step === currentStep) return;
  history.pushState({ step: step }, "", "#step" + step);
  showStep(step);
}

window.addEventListener("popstate", function () {
  var m = /step([123])/.exec(window.location.hash);
  var step = m ? parseInt(m[1], 10) : 1;
  step = Math.min(step, maxAllowedStep());
  if (step !== currentStep && !stepTransitioning) showStep(step);
});

function showStep(step) {
  if (stepTransitioning) return;
  var prevStep = currentStep;
  currentStep = step;

  function applyStepVisibility(stepNum, visible) {
    var el = document.getElementById("step" + stepNum);
    if (!el) return;
    el.hidden = !visible;
    el.classList.toggle("step-visible", visible);
  }

  if (prevStep === step) {
    [1, 2, 3].forEach(function (n) {
      applyStepVisibility(n, n === step);
    });
    updateDots();
    updatePreview();
    if (step === 2) {
      updateNameStepUI();
      setTimeout(function () {
        var nameEl = document.getElementById("name");
        if (nameEl) nameEl.focus();
      }, 100);
    } else if (step === 3) {
      setTimeout(function () {
        var downloadBtn = document.getElementById("downloadCard");
        if (downloadBtn) downloadBtn.focus();
      }, 100);
    }
    return;
  }

  var currentEl = document.getElementById("step" + prevStep);
  var nextEl = document.getElementById("step" + step);
  stepTransitioning = true;
  currentEl.classList.remove("step-visible");
  setTimeout(function () {
    stepTransitioning = false;
    currentEl.hidden = true;
    if (nextEl) {
      nextEl.hidden = false;
      nextEl.classList.remove("step-visible");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (nextEl) nextEl.classList.add("step-visible");
        });
      });
    }
    updateDots();
    updatePreview();
    if (step === 2) {
      updateNameStepUI();
      setTimeout(function () {
        var nameEl = document.getElementById("name");
        if (nameEl) nameEl.focus();
      }, 100);
    } else if (step === 3) {
      setTimeout(function () {
        var downloadBtn = document.getElementById("downloadCard");
        if (downloadBtn) downloadBtn.focus();
      }, 100);
    }
  }, stepTransitionMs);
}

function updateDots() {
  var step = currentStep;
  document.querySelectorAll(".step-dot").forEach(function (dot) {
    var n = parseInt(dot.getAttribute("data-step"), 10);
    dot.classList.toggle("active", n === step);
    dot.classList.toggle("completed", n < step);
    dot.setAttribute("aria-current", n === step ? "step" : "false");
  });
}

function updateNameStepUI() {
  var nameEl = document.getElementById("name");
  var nextBtn = document.getElementById("step2Next");
  var errorEl = document.getElementById("nameError");
  if (!nameEl) return;
  var val = nameEl.value.trim();
  if (nextBtn) nextBtn.disabled = val.length === 0;
  if (errorEl && val.length > 0) {
    errorEl.hidden = true;
    nameEl.setAttribute("aria-invalid", "false");
  }
}

function buildMessageOptions() {
  var container = document.getElementById("messageOptions");
  if (!container || typeof MESSAGES === "undefined" || !MESSAGES[lang]) return;
  container.innerHTML = "";
  MESSAGES[lang].forEach(function (text) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-light message-option w-100";
    btn.textContent = text;
    btn.addEventListener("click", function () {
      chosenMessage = text;
      container.querySelectorAll(".message-option").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      var nextBtn = document.getElementById("step1Next");
      if (nextBtn) nextBtn.disabled = false;
      updatePreview();
    });
    container.appendChild(btn);
  });
}

function sanitizeFileName(str) {
  return (str || "").trim().replace(/[\s]+/g, "-").replace(/[<>:"/\\|?*]/g, "") || "Greeting";
}

function cardFileName() {
  var nameEl = document.getElementById("name");
  var namePart = sanitizeFileName(nameEl ? nameEl.value : "");
  return "6D-Satorp-National-Day-Greeting" + (namePart ? "-" + namePart : "") + ".jpg";
}

function generateCardBlob(callback) {
  canvas.toBlob(callback, "image/jpeg", 0.92);
}

function downloadCanvasAsImage(onComplete) {
  var imageName = cardFileName();
  var downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", imageName);
  generateCardBlob(function (blob) {
    var url = URL.createObjectURL(blob);
    downloadLink.setAttribute("href", url);
    downloadLink.click();
    URL.revokeObjectURL(url);
    if (typeof onComplete === "function") onComplete();
  });
}

/* Native share sheet (mobile): lets people send the card straight to
   WhatsApp etc. instead of download-then-attach */
function canShareFiles() {
  if (!navigator.canShare || !window.File) return false;
  try {
    var probe = new File([""], "card.jpg", { type: "image/jpeg" });
    return navigator.canShare({ files: [probe] });
  } catch (e) {
    return false;
  }
}

function shareCard(onComplete) {
  generateCardBlob(function (blob) {
    var file = new File([blob], cardFileName(), { type: "image/jpeg" });
    navigator.share({ files: [file], title: S.shareTitle })
      .catch(function () { /* user cancelled the share sheet */ })
      .then(function () {
        if (typeof onComplete === "function") onComplete();
      });
  });
}

function wrapCanvasText(ctx, text, maxWidth) {
  var words = text.split(/\s+/);
  var lines = [];
  var current = "";
  for (var i = 0; i < words.length; i++) {
    var test = current ? current + " " + words[i] : words[i];
    var m = ctx.measureText(test);
    if (m.width > maxWidth && current) {
      lines.push(current);
      current = words[i];
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCardWithText(messageText, nameText) {
  if (!imageObj.complete || !imageObj.naturalWidth) return;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);

  context.textAlign = "center";
  context.fillStyle = cardConfig.textColor;
  /* Soft shadow keeps text readable over the patterned artwork */
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = 12;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  var centerX = canvasWidth / 2;
  var nameY = canvasHeight * cardConfig.nameYRatio;
  var messageMaxWidth = 820;

  if (messageText) {
    var maxMessageLines = 6;
    var messageFontPt = 28;
    var minMessageFontPt = 20;
    var messageLineHeight = Math.round(messageFontPt * 1.6);

    context.font = "300 " + messageFontPt + "pt Satorp";
    var messageLines = wrapCanvasText(context, messageText, messageMaxWidth);
    while (messageLines.length > maxMessageLines && messageFontPt > minMessageFontPt) {
      messageFontPt -= 2;
      context.font = "300 " + messageFontPt + "pt Satorp";
      messageLineHeight = Math.round(messageFontPt * 1.6);
      messageLines = wrapCanvasText(context, messageText, messageMaxWidth);
    }

    if (messageLines.length > maxMessageLines) messageLines = messageLines.slice(0, maxMessageLines);
    var messageYOffset = isRTL ? 90 : 70;
    var messageY = nameY + messageYOffset;
    for (var i = 0; i < messageLines.length; i++) {
      context.fillText(messageLines[i], centerX, messageY + i * messageLineHeight);
    }
  }

  context.font = "500 28pt Satorp";
  if (nameText) {
    var nameYPos = messageText ? messageY + messageLines.length * messageLineHeight + 10 : nameY + 40;
    context.fillText(nameText, centerX, nameYPos, messageMaxWidth);
  }

  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
}

document.addEventListener("DOMContentLoaded", function () {
  buildMessageOptions();
  updateDots();
  history.replaceState({ step: 1 }, "", "#step1");

  document.querySelectorAll(".step-dot").forEach(function (dot) {
    dot.addEventListener("click", function () {
      var n = parseInt(dot.getAttribute("data-step"), 10);
      if (n !== currentStep && n <= maxAllowedStep()) goToStep(n);
    });
  });

  var nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      updateNameStepUI();
      if (currentStep >= 2) updatePreview();
    });
    nameInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        var nextBtn = document.getElementById("step2Next");
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      }
    });
  }

  var step1Next = document.getElementById("step1Next");
  if (step1Next) step1Next.addEventListener("click", function () {
    if (!chosenMessage) {
      alert(S.chooseFirst);
      return;
    }
    goToStep(2);
  });

  var step2Back = document.getElementById("step2Back");
  if (step2Back) step2Back.addEventListener("click", function () {
    goToStep(1);
  });

  var step2Next = document.getElementById("step2Next");
  if (step2Next) step2Next.addEventListener("click", function () {
    var nameEl = document.getElementById("name");
    var nameText = nameEl ? nameEl.value.trim() : "";
    var errorEl = document.getElementById("nameError");
    if (!nameText) {
      if (nameEl) nameEl.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.hidden = false;
      if (nameEl) nameEl.focus();
      return;
    }
    if (nameEl) nameEl.setAttribute("aria-invalid", "false");
    if (errorEl) errorEl.hidden = true;
    goToStep(3);
  });

  var step3Back = document.getElementById("step3Back");
  if (step3Back) step3Back.addEventListener("click", function () {
    goToStep(2);
  });

  var shareBtn = document.getElementById("shareCard");
  if (shareBtn && canShareFiles()) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", function () {
      if (shareBtn.disabled) return;
      shareBtn.disabled = true;
      shareCard(function () {
        shareBtn.disabled = false;
      });
    });
  }

  var downloadCard = document.getElementById("downloadCard");
  if (downloadCard) downloadCard.addEventListener("click", function () {
    var btn = document.getElementById("downloadCard");
    if (!btn) return;
    if (btn.disabled) return;
    var defaultHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = S.generating;
    downloadCanvasAsImage(function () {
      btn.disabled = false;
      btn.innerHTML = defaultHtml;
      var successEl = document.getElementById("downloadSuccess");
      if (successEl) {
        successEl.hidden = false;
        clearTimeout(window._downloadSuccessHide);
        window._downloadSuccessHide = setTimeout(function () {
          successEl.hidden = true;
        }, 4000);
      }
    });
  });
});
