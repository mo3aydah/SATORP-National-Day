# SATORP National Day Greeting Card

A small static site where employees type their name, see it drawn onto the
National Day card, and download the result as a PNG to share.

- `index.html` — Arabic version
- `en.html` — English version
- `assets/js/card.js` — shared canvas logic for both pages (card image and
  download filename are set via `data-*` attributes on `<body>`)

## Artwork

The card images come from the SND campaign "Social media Post" design
(1080×1080 px). Both language pages currently use the same artwork; to give
the English page its own design, replace `assets/images/National-Day-ENG.jpg`.
The name position is set by `textY` in `assets/js/card.js`.

## Running locally

Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then open http://localhost:8000
