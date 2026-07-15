# Jessie's. website

Static site — no build step, no dependencies. Drag the **contents** of this folder (not the folder itself) into the root of your repo, so `index.html` ends up at the repo root alongside `css/`, `js/`, and `images/`.

```
index.html
menu.html
events.html
about.html
contact.html
css/style.css
js/script.js
images/
```

## Preview locally
Open `index.html` directly in a browser, or serve it (avoids some browser file:// quirks):
```
python3 -m http.server 8000
```
then visit `localhost:8000`.

## Deploy
Works as-is on GitHub Pages, Netlify, Vercel, or any static host — just point it at the repo root (or set the publish directory to wherever these files land).

## Still placeholder — swap before launch
- TikTok and Facebook links (Contact page + footer) — currently `#`
- About page bio copy — written in Jessie's voice as a starting point, swap for her own words anytime

## Already live
Real email (`hello@jessies.coffee`), phone ((720) 985-1265), Instagram (@jessiescoffeeco), and the event inquiry form (posts to Formspree).
