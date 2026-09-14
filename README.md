# SATORP National Day Greeting Card

A small static site where employees create a personalized Saudi National Day
card: pick a design from a swipeable card deck, choose a greeting message,
enter their name, preview the card, and download it as a PNG to share.

Ported from the SATORP Eid greeting site design (same layout, flow, and
styling), with National Day content.

## Structure

- `index.html` — landing page: card-deck picker (swipe or tap) + language choice
- `ar.html` / `en.html` — 3-step wizard: message → name → preview & download;
  the chosen design is passed via `?card=N`
- `assets/js/config.js` — greeting messages (both languages) and per-card
  settings: image path, text color, and text position (`nameYRatio`)
- `assets/js/deck-select.js` — landing page deck swipe/selection
- `assets/js/app.js` — wizard steps and canvas rendering

## Artwork

`assets/images/National-Day-1.jpg`, `-2.jpg`, `-3.jpg` are the three card
designs (1080×1080 px). They are currently **the same design three times**
(from the SND campaign "Social media Post"); drop in the real second and third
designs by replacing the files — no code changes needed.

## Running locally

Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then open http://localhost:8000
