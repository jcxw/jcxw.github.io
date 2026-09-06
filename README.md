# Still / Moving

A photography and essay portfolio with an automatically generated photo gallery.

## Pages

- `index.html` — responsive photo gallery with natural image ratios and a full-screen lightbox
- `essays.html` — essay collection with full-text reading panels
- `contact.html` — contact form delivered through FormSubmit

## Add or rearrange photographs

1. Put JPG, JPEG, PNG, or WebP originals directly in `assets/photos`.
2. Rename the files into the order you want. The gallery sorts them alphabetically.
3. Push the changes to GitHub. The site rebuilds and rearranges the gallery automatically.

On a Mac, double-click `Update Website.command` to rebuild the gallery and upload all changes. The first run prepares its image tools; later runs are faster.

For a main caption and smaller image title, name a photograph like `2026-06-13_SG_02-East Coast Park.JPG`. It appears with `East Coast Park` as the main caption and `2026-06-13_SG_02` beneath it. Filenames without that pattern appear as one main caption. Keep `assets/photos/web` untouched; it is generated automatically.

For a local preview after changing photographs, run:

```sh
python3 -m pip install -r requirements.txt
python3 scripts/build_gallery.py
```

Essay text remains in `essays.html` and `assets/site.js`. The contact form destination is in `contact.html`.

## Deploy on GitHub Pages

1. Create a GitHub repository and add these files.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to the `main` branch. The included workflow builds and publishes the site.

GitHub will publish the site at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

The workflow creates smaller web copies while preserving every photograph's original ratio.
