# 510 Visuals — Custom Code

Custom CSS and JS for [510-visuals.webflow.io](https://510-visuals.webflow.io), hosted via jsDelivr CDN.

## Webflow Setup

### Site Settings > Head Code
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/global.css">
```

### Site Settings > Footer Code
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/global.js"></script>
```

### Homepage > Page Settings > Head Code
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/homepage.css">
```

### Homepage > Page Settings > Footer Code
```html
<script src="https://unpkg.com/split-type"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/homepage.js"></script>
```

### Project Template > Page Settings > Head Code
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/project-template.css">
```

### Project Template > Page Settings > Footer Code
```html
<script src="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/project-template.js"></script>
```

### About > Page Settings > Head Code
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/about.css">
```

## Cache Purging

After pushing updates, purge each file individually at:
```
https://purge.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/FILENAME
https://purge.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/js/FILENAME
```

## Notes
- GSAP CDN must load BEFORE global.js
- SplitType + Swiper must load BEFORE homepage.js
- w-embed scripts inside Webflow Designer stay in Webflow (not in this repo)
