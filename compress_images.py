"""
Görselleri kaliteyi çok bozmadan küçültür.
- Uzun kenar max 1200px
- JPEG kalitesi %80
- Orijinallere dokunmaz, yeni klasöre kaydeder
"""
from PIL import Image
import os

src = r"c:\Users\Msi\çikokaan\çikokaanimage"
dst = r"c:\Users\Msi\çikokaan\çikokaanimage_compressed"
os.makedirs(dst, exist_ok=True)

MAX_SIZE = 1200
QUALITY = 80

for fname in sorted(os.listdir(src)):
    if not fname.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    src_path = os.path.join(src, fname)
    dst_path = os.path.join(dst, fname)
    
    img = Image.open(src_path)
    orig_w, orig_h = img.size
    
    # Uzun kenarı MAX_SIZE'a küçült
    ratio = min(MAX_SIZE / orig_w, MAX_SIZE / orig_h)
    if ratio < 1:
        new_w = int(orig_w * ratio)
        new_h = int(orig_h * ratio)
        img = img.resize((new_w, new_h), Image.LANCZOS)
    
    img.save(dst_path, "JPEG", quality=QUALITY, optimize=True)
    
    orig_kb = os.path.getsize(src_path) / 1024
    new_kb = os.path.getsize(dst_path) / 1024
    print(f"{fname}: {orig_w}x{orig_h} -> {img.size[0]}x{img.size[1]}  |  {orig_kb:.0f}KB -> {new_kb:.0f}KB  ({(1-new_kb/orig_kb)*100:.0f}% küçüldü)")

print("\nTamamlandı!")
