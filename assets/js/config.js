/* Based on the official SND campaign copy; the two pillar lines carry an
   added greeting tail so every option reads as a wish (pending client OK) */
var MESSAGES = {
  en: [
    "Wishing our nation pride and prosperity.",
    "A vision that inspires greater ambition, happy Saudi National Day.",
    "Resolve that drives us forward, may our nation's glory endure."
  ],
  ar: [
    "كل عام ووطننا بخير وازدهار.",
    "نعتز برؤيةٍ تلهم طموحًا أكبر، وكل عام وأنتم بخير.",
    "نعتز بهمّةٍ تدفعنا إلى الأمام، ودام عزّ الوطن."
  ]
};

/*
 * Per-card settings: swap in real artwork by replacing the image file, and
 * tune where/how the text is drawn per design — no app.js changes needed.
 * nameYRatio: vertical anchor of the text block (0 = top, 1 = bottom).
 */
var CARDS = {
  "1": {
    image: "assets/images/National-Day-1.jpg",
    textColor: "#FFFFFF",
    nameYRatio: 0.65
  },
  "2": {
    image: "assets/images/National-Day-2.jpg?v=2",
    textColor: "#FFFFFF",
    nameYRatio: 0.42
  },
  "3": {
    image: "assets/images/National-Day-3.jpg?v=2",
    textColor: "#FFFFFF",
    nameYRatio: 0.34
  }
};

var CARD_IMAGES = {};
Object.keys(CARDS).forEach(function (id) {
  CARD_IMAGES[id] = CARDS[id].image;
});

function getSelectedCardId() {
  var m = /[?&]card=(\d+)/.exec(window.location.search);
  return m ? m[1] : "1";
}

function getCardConfig(cardId) {
  return CARDS[cardId] || CARDS["1"];
}

function getCardImageUrl(cardId) {
  return getCardConfig(cardId).image;
}
