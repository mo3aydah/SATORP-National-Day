var MESSAGES = {
  en: [
    "Happy Saudi National Day — may our nation always prosper and thrive.",
    "Glory is in our nature. Wishing you a proud and joyful National Day.",
    "Celebrating our nation's glory and achievements — Happy Saudi National Day."
  ],
  ar: [
    "دام عزّك يا وطن، وكل عام ووطننا الغالي بخير وازدهار.",
    "عزّنا بطبعنا، ودامت راية وطننا خفّاقة عالية بالمجد والفخر.",
    "بمناسبة اليوم الوطني السعودي، أتمنى لوطننا دوام التقدم والازدهار."
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
    image: "assets/images/National-Day-2.jpg",
    textColor: "#FFFFFF",
    nameYRatio: 0.65
  },
  "3": {
    image: "assets/images/National-Day-3.jpg",
    textColor: "#FFFFFF",
    nameYRatio: 0.65
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
