"""Crop UPI/payment logos from the attached sprite sheet."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\ASUS\.cursor\projects\c-Users-ASUS-OneDrive-Documents-1-coding-spices-market\assets\c__Users_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_cb5bb4a38d377a17f0fb42ed3b13ce0d_images_image-960dbff4-25e0-46fb-907b-9560569523b3.png"
)
OUT = Path(__file__).resolve().parents[1] / "assets" / "brands" / "upi"
OUT.mkdir(parents=True, exist_ok=True)


def segments(flags: list[bool]) -> list[tuple[int, int]]:
    segs: list[tuple[int, int]] = []
    start = None
    for i, v in enumerate(flags):
        if v and start is None:
            start = i
        if not v and start is not None:
            segs.append((start, i - 1))
            start = None
    if start is not None:
        segs.append((start, len(flags) - 1))
    return segs


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    pixels = im.load()
    w, h = im.size

    # Treat near-black as background
    mask = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 10 and (r + g + b) > 40:
                mask[y][x] = True

    rows = [any(mask[y][x] for x in range(w)) for y in range(h)]
    cols = [any(mask[y][x] for y in range(h)) for x in range(w)]
    rsegs = segments(rows)
    csegs = segments(cols)

    print("size", w, h)
    print("row segs", len(rsegs), [(a, b, b - a + 1) for a, b in rsegs])
    print("col segs", len(csegs), [(a, b, b - a + 1) for a, b in csegs])

    # Merge adjacent tiny gaps in columns into logical logo cells.
    # Each brand appears twice side-by-side; keep left of each pair.
    merged_cols: list[tuple[int, int]] = []
    for a, b in csegs:
        if merged_cols and a - merged_cols[-1][1] <= 8:
            merged_cols[-1] = (merged_cols[-1][0], b)
        else:
            merged_cols.append((a, b))

    merged_rows: list[tuple[int, int]] = []
    for a, b in rsegs:
        if merged_rows and a - merged_rows[-1][1] <= 6:
            merged_rows[-1] = (merged_rows[-1][0], b)
        else:
            merged_rows.append((a, b))

    print("merged rows", len(merged_rows), merged_rows)
    print("merged cols", len(merged_cols), merged_cols)

    # Labels from visual inspection of the sheet (left logo of each pair).
    # Grid is roughly 5 pairs across (10 logos) × ~10 rows — but pairs mean
    # ~5 unique brands per row. We'll save every unique left-of-pair cell.
    labels_by_row: list[list[str]] = [
        ["phonepe", "gpay", "paytm", "amazonpay"],
        ["axis", "icici", "freecharge", "mobikwik", "whatsapp"],
        ["hdfc", "kotak", "bhim", "yesbank", "airtel"],
        ["idfc", "fi", "federal", "jupiter", "sbi"],
        ["canara", "bob", "indusind", "slice", "iob"],
        ["cred", "dbs", "deutsche", "bandhan", "jiopay"],
        ["pnb", "tataneu", "au", "sib", "union"],
        ["boi", "cbi", "aubank", "karnataka", "indian"],
        ["rbl", "bom", "hsbc", "cub", "uco"],
        ["sc", "kvb", "kotak2", "other1", "other2"],
    ]

    pad = 2
    saved = 0
    for ry, (y0, y1) in enumerate(merged_rows):
        # find content cols intersecting this row band
        row_cols: list[tuple[int, int]] = []
        for x0, x1 in merged_cols:
            hit = False
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    if mask[y][x]:
                        hit = True
                        break
                if hit:
                    break
            if hit:
                row_cols.append((x0, x1))

        # pair columns: take odd indices skip duplicates (0,2,4...)
        unique_cols = row_cols[::2] if len(row_cols) >= 2 else row_cols
        names = labels_by_row[ry] if ry < len(labels_by_row) else []
        print(f"row {ry}: {len(row_cols)} cells -> {len(unique_cols)} unique, names={names}")

        for cx, (x0, x1) in enumerate(unique_cols):
            name = names[cx] if cx < len(names) else f"r{ry}c{cx}"
            crop = im.crop(
                (
                    max(0, x0 - pad),
                    max(0, y0 - pad),
                    min(w, x1 + 1 + pad),
                    min(h, y1 + 1 + pad),
                )
            )
            # trim residual black
            bbox = crop.getbbox()
            if not bbox:
                continue
            # refine using non-black
            cpx = crop.load()
            cw, ch = crop.size
            minx, miny, maxx, maxy = cw, ch, 0, 0
            for yy in range(ch):
                for xx in range(cw):
                    r, g, b, a = cpx[xx, yy]
                    if a > 10 and (r + g + b) > 40:
                        minx = min(minx, xx)
                        miny = min(miny, yy)
                        maxx = max(maxx, xx)
                        maxy = max(maxy, yy)
            if maxx <= minx:
                continue
            # make transparent background
            out = crop.crop((minx, miny, maxx + 1, maxy + 1)).convert("RGBA")
            opx = out.load()
            ow, oh = out.size
            for yy in range(oh):
                for xx in range(ow):
                    r, g, b, a = opx[xx, yy]
                    if r + g + b < 35:
                        opx[xx, yy] = (0, 0, 0, 0)
            out_path = OUT / f"{name}.png"
            out.save(out_path)
            saved += 1
            print("saved", out_path.name, out.size)

    print("saved count", saved)


if __name__ == "__main__":
    main()
