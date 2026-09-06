#!/usr/bin/env python3
"""Build the gallery manifest, optimized images, and optional deploy folder."""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PHOTO_DIR = ROOT / "assets" / "photos"
WEB_DIR = PHOTO_DIR / "web"
MANIFEST = ROOT / "assets" / "gallery-data.js"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_WIDTH = 2400
CAPTION_PATTERN = re.compile(
    r"^(?P<subtitle>\d{4}-\d{2}-\d{2}_[^_]+_\d+)-(?P<caption>.+)$"
)


def output_name(source: Path, used_names: set[str]) -> str:
    safe_stem = re.sub(r"[^A-Za-z0-9._-]+", "-", source.stem).strip("-.") or "photo"
    candidate = f"{safe_stem}.jpg"
    suffix = 2
    while candidate.casefold() in used_names:
        candidate = f"{safe_stem}-{suffix}.jpg"
        suffix += 1
    used_names.add(candidate.casefold())
    return candidate


def caption_parts(source: Path) -> tuple[str, str]:
    match = CAPTION_PATTERN.match(source.stem)
    if not match:
        return source.stem, ""
    return match.group("caption").strip(), match.group("subtitle").strip()


def build_gallery() -> list[dict[str, object]]:
    sources = sorted(
        (
            path
            for path in PHOTO_DIR.iterdir()
            if path.is_file() and path.suffix.casefold() in SUPPORTED_EXTENSIONS
        ),
        key=lambda path: path.name.casefold(),
    )

    WEB_DIR.mkdir(parents=True, exist_ok=True)
    for generated in WEB_DIR.iterdir():
        if generated.is_file() and generated.suffix.casefold() in SUPPORTED_EXTENSIONS:
            generated.unlink()

    photos: list[dict[str, object]] = []
    used_names: set[str] = set()

    for source in sources:
        destination_name = output_name(source, used_names)
        destination = WEB_DIR / destination_name
        caption, subtitle = caption_parts(source)

        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            if image.mode != "RGB":
                if "A" in image.getbands():
                    background = Image.new("RGB", image.size, "white")
                    background.paste(image, mask=image.getchannel("A"))
                    image = background
                else:
                    image = image.convert("RGB")

            if image.width > MAX_WIDTH:
                height = round(image.height * MAX_WIDTH / image.width)
                image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)

            image.save(destination, "JPEG", quality=86, optimize=True, progressive=True)
            width, height = image.size

        photos.append(
            {
                "src": f"assets/photos/web/{destination_name}",
                "width": width,
                "height": height,
                "caption": caption,
                "subtitle": subtitle,
            }
        )

    manifest = "window.GALLERY_PHOTOS = " + json.dumps(photos, ensure_ascii=False, indent=2) + ";\n"
    MANIFEST.write_text(manifest, encoding="utf-8")
    return photos


def build_site(site_dir: Path) -> None:
    if site_dir.exists():
        shutil.rmtree(site_dir)
    site_dir.mkdir(parents=True)

    for html_file in ROOT.glob("*.html"):
        shutil.copy2(html_file, site_dir / html_file.name)

    for optional_name in ("CNAME", "robots.txt", "favicon.ico"):
        optional_file = ROOT / optional_name
        if optional_file.exists():
            shutil.copy2(optional_file, site_dir / optional_name)

    output_assets = site_dir / "assets"
    output_assets.mkdir()
    for asset_name in ("styles.css", "site.js", "gallery-data.js"):
        shutil.copy2(ROOT / "assets" / asset_name, output_assets / asset_name)
    shutil.copytree(WEB_DIR, output_assets / "photos" / "web")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", type=Path, help="Also create a clean deploy folder")
    args = parser.parse_args()

    photos = build_gallery()
    if args.site_dir:
        site_dir = args.site_dir if args.site_dir.is_absolute() else ROOT / args.site_dir
        build_site(site_dir)
    print(f"Built {len(photos)} photographs.")


if __name__ == "__main__":
    main()
