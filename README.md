# SATORP National Day Greeting Card

A small static site where employees type their name, see it drawn onto the
National Day card, and download the result as a PNG to share.

- `index.html` — Arabic version
- `en.html` — English version
- `assets/js/card.js` — shared canvas logic for both pages (card image and
  download filename are set via `data-*` attributes on `<body>`)

## ⚠️ Placeholder artwork

`assets/images/National-Day-ARA.jpg` and `assets/images/National-Day-ENG.jpg`
are currently **copies of the Eid card artwork** as placeholders. Replace them
with the National Day designs (1080×1080 px) before launch. If the name should
sit somewhere else on the new design, adjust `textY` in `assets/js/card.js`.

## Running locally

Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then open http://localhost:8000
