(function () {
  var deck = document.getElementById("cardDeck");
  var langAr = document.getElementById("langAr");
  var langEn = document.getElementById("langEn");
  if (!deck) return;

  /* config.js is loaded before this script and defines CARD_IMAGES */
  var DECK_IMAGES = CARD_IMAGES;

  function getSelectedCard() {
    var selected = deck.querySelector(".card-deck-item.selected");
    return selected ? selected.getAttribute("data-card") : "1";
  }

  function updateLangLinks() {
    var card = getSelectedCard();
    var q = "?card=" + card;
    if (langAr) langAr.href = "ar.html" + q;
    if (langEn) langEn.href = "en.html" + q;
  }

  var deckDots = document.querySelectorAll("#deckDots button");
  deckDots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      selectCardByIndex(i);
    });
  });

  function selectCardByIndex(index) {
    var items = deck.querySelectorAll(".card-deck-item");
    var target = items[index];
    if (!target) return;
    items.forEach(function (el, i) {
      el.classList.remove("selected");
      el.setAttribute("aria-selected", "false");
      var dist = Math.abs(i - index);
      el.style.zIndex = dist === 0 ? 10 : (5 - dist);
    });
    target.classList.add("selected");
    target.setAttribute("aria-selected", "true");
    target.style.zIndex = 10;
    deckDots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
    });
    updateLangLinks();
    updateBgMirror();
  }

  function selectNextCard() {
    var items = deck.querySelectorAll(".card-deck-item");
    var current = deck.querySelector(".card-deck-item.selected");
    var idx = current ? Array.prototype.indexOf.call(items, current) : 0;
    selectCardByIndex((idx + 1) % items.length);
  }

  function selectPrevCard() {
    var items = deck.querySelectorAll(".card-deck-item");
    var current = deck.querySelector(".card-deck-item.selected");
    var idx = current ? Array.prototype.indexOf.call(items, current) : 0;
    selectCardByIndex((idx - 1 + items.length) % items.length);
  }

  /* Swipe/drag: works on both touch and mouse */
  var startX = 0;
  var didSwipe = false;
  var minSwipe = 50;
  var isDragging = false;

  /* Touch events (mobile) */
  deck.addEventListener("touchstart", function (e) {
    if (!e.touches || !e.touches.length) return;
    startX = e.touches[0].screenX;
    didSwipe = false;
  }, { passive: true });

  deck.addEventListener("touchend", function (e) {
    if (!e.changedTouches || !e.changedTouches.length) return;
    var delta = startX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > minSwipe) {
      didSwipe = true;
      if (delta > 0) selectNextCard();
      else selectPrevCard();
    }
  }, { passive: true });

  /* Mouse events (desktop) */
  deck.addEventListener("mousedown", function (e) {
    startX = e.screenX;
    isDragging = true;
    didSwipe = false;
    e.preventDefault();
  });

  document.addEventListener("mouseup", function (e) {
    if (!isDragging) return;
    isDragging = false;
    var delta = startX - e.screenX;
    if (Math.abs(delta) > minSwipe) {
      didSwipe = true;
      if (delta > 0) selectNextCard();
      else selectPrevCard();
    }
  });

  deck.addEventListener("click", function (e) {
    if (didSwipe) { didSwipe = false; return; }
    var items = deck.querySelectorAll(".card-deck-item");
    /* Prefer the card that was actually clicked; fall back to position */
    var clicked = e.target.closest ? e.target.closest(".card-deck-item") : null;
    var idx;
    if (clicked) {
      idx = Array.prototype.indexOf.call(items, clicked);
    } else {
      var rect = deck.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      idx = Math.min(Math.floor(pct * items.length), items.length - 1);
    }
    selectCardByIndex(idx);
  });

  deck.querySelectorAll(".card-deck-item").forEach(function (item) {
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCardByIndex(Array.prototype.indexOf.call(deck.querySelectorAll(".card-deck-item"), item));
      }
    });
  });

  function updateBgMirror() {
    var mirror = document.getElementById("langSelectBgMirror");
    if (!mirror) return;
    var card = getSelectedCard();
    var url = DECK_IMAGES[card] || DECK_IMAGES["1"];
    mirror.style.backgroundImage = "url(" + url + ")";
  }

  var langParam = /[?&]lang=(ar|en)/.exec(window.location.search);
  if (langParam) {
    var preferred = langParam[1] === "ar" ? langAr : langEn;
    if (preferred) preferred.classList.add("lang-btn-preferred");
  }

  var initiallySelected = deck.querySelector(".card-deck-item.selected");
  var items = deck.querySelectorAll(".card-deck-item");
  selectCardByIndex(initiallySelected ? Array.prototype.indexOf.call(items, initiallySelected) : 0);
})();
