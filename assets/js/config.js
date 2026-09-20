/* Official Corporate Communication copy (GA & PR update, 20 Sep 2026);
   Arabic and English lines are paired by index */
var MESSAGES = {
  en: [
    "On National Day, we celebrate the achievements of our nation and embrace a bright future.",
    "On National Day, our aspiration unites us in our endeavor towards growth and prosperity.",
    "With our determination, we advance towards achievements and glorious future."
  ],
  ar: [
    "في يوم الوطن، نفخر بإنجازات شعبنا ونتطلع إلى مستقبل مشرق.",
    "في يوم الوطن، نتحد بطموح نحو مزيد من النمو والازدهار.",
    "بعزيمتنا، نمضي معاً نحو مستقبل حافل بالمجد والإنجاز."
  ]
};

/*
 * Per-card settings: swap in real artwork by replacing the image file, and
 * tune where/how the text is drawn per design — no app.js changes needed.
 * nameYRatio: vertical anchor of the text block (0 = top, 1 = bottom).
 */
var CARDS = {
  "1": {
    image: "assets/images/National-Day-1.jpg?v=3",
    textColor: "#FFFFFF",
    nameYRatio: 0.30
  },
  "2": {
    image: "assets/images/National-Day-2.jpg?v=3",
    textColor: "#FFFFFF",
    nameYRatio: 0.34
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
