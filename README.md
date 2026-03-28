# 510 Visuals — Custom Code

Custom CSS and JS for [510-visuals.webflow.io](https://510-visuals.webflow.io), hosted via jsDelivr CDN.

## File Structure

```
css/
├── global.css            Site-wide styles (navbar, transitions, utilities)
├── homepage.css          Homepage-only (layout484, header5, layout357, layout423, services cards)
├── project-template.css  Project template (gallery21, gallery10, content17, portfolio header)
└── about.css             About page (team grid)

js/
├── global.js             Site-wide scripts (Unicorn Studio, navbar, CTA38, column transitions)
├── homepage.js           Homepage scripts (layout423 scroller, layout357 reveal, services reveal)
└── project-template.js   Project template scripts (gallery21 drag, content17 reveal)
```

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

jsDelivr caches files. After pushing updates, purge the cache:
```
https://purge.jsdelivr.net/gh/AngelinoBarajas/510-visuals@main/css/global.css
```

Or use versioned tags (`@v1.0`) instead of `@main` for production stability.
