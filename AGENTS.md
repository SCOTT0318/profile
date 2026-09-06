# Repository Guidelines

## Project Structure & Module Organization

This repository is a static actor portfolio with no package manager or compilation step.

- `index.html` is the main profile page; `gallery.html` is the full gallery.
- `assets/css/` contains shared, gallery, and mobile styles.
- `assets/script/index.js` and `assets/script/gallery.js` render JSON content and manage sliders, filters, and media modals.
- `data/profile.json` holds biography and contact content; `data/gallery.json` defines gallery sections and items.
- `images/` is grouped by use (`profile/`, `about/`, `editorial/`, `stills/`, `videos/`). Video files live under `videos/gallery/` and `videos/optimized/`.

Keep content in JSON when an existing `data-*` binding supports it. Keep page structure in HTML and behavior in the corresponding JavaScript file.

## Build, Test, and Development Commands

Run a local server from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`; do not rely on `file://`, because the pages fetch JSON data. Useful pre-commit checks are:

```sh
node --check assets/script/index.js
node --check assets/script/gallery.js
python3 -m json.tool data/profile.json >/dev/null
python3 -m json.tool data/gallery.json >/dev/null
```

There is currently no build command, dependency installation, linter, or automated test runner.

## Coding Style & Naming Conventions

Follow the surrounding style: two-space indentation in JavaScript and CSS, semantic HTML, single-quoted JavaScript strings, and trailing semicolons. Use `camelCase` for JavaScript identifiers, kebab-case for CSS classes and media filenames, and descriptive `data-*` attributes for bindings and controls. Preserve accessibility attributes, meaningful image `alt` text, keyboard modal controls, and `rel="noopener"` on external links.

## Testing Guidelines

After the syntax checks, manually verify both pages at desktop and mobile widths. Confirm JSON content renders, images and videos load, gallery filters work, slider controls advance, and modals open and close by button, backdrop, and Escape. When changing media paths, check exact case and URL-encode or test filenames containing spaces or Korean characters.

## Commit & Pull Request Guidelines

Recent history mostly uses placeholder `-` messages, so it provides no reliable convention. Use short, imperative commits such as `Fix gallery video navigation`. Keep each commit focused. Pull requests should summarize user-visible changes, list manual checks, link relevant issues, and include before/after screenshots for layout or styling changes. Avoid committing `.DS_Store` or unrelated generated media.
