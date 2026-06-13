"""
Re-encode all transition videos with keyframe at every frame (GOP=1)
for smooth scroll-based scrubbing without decoder crashes.
"""
import subprocess
import os
import sys

VIDEO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "çikokaanvideos")
OUTPUT_DIR = os.path.join(VIDEO_DIR, "scrub_ready")

os.makedirs(OUTPUT_DIR, exist_ok=True)

videos = [f for f in os.listdir(VIDEO_DIR) if f.endswith('.mp4')]

if not videos:
    print("No MP4 files found in", VIDEO_DIR)
    sys.exit(1)

print(f"Found {len(videos)} videos to re-encode for scroll scrubbing.\n")

for i, fname in enumerate(videos, 1):
    input_path = os.path.join(VIDEO_DIR, fname)
    output_path = os.path.join(OUTPUT_DIR, fname)
    
    print(f"[{i}/{len(videos)}] Re-encoding: {fname}")
    print(f"  -> GOP=1 (every frame is a keyframe)")
    
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",          # High quality
        "-g", "1",             # Keyframe every frame
        "-keyint_min", "1",    # Minimum keyframe interval = 1
        "-pix_fmt", "yuv420p", # Browser compatibility
        "-movflags", "+faststart",  # Web optimization
        "-an",                 # No audio (not needed)
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        orig_size = os.path.getsize(input_path) / (1024 * 1024)
        new_size = os.path.getsize(output_path) / (1024 * 1024)
        print(f"  [OK] Done! {orig_size:.1f}MB -> {new_size:.1f}MB")
    else:
        print(f"  [FAIL] ERROR: {result.stderr[-200:]}")

print(f"\n{'='*50}")
print("All videos re-encoded. Now replacing originals...")

# Replace originals with scrub-ready versions
for fname in os.listdir(OUTPUT_DIR):
    src = os.path.join(OUTPUT_DIR, fname)
    dst = os.path.join(VIDEO_DIR, fname)
    
    # Backup original
    backup = dst + ".backup"
    if os.path.exists(dst) and not os.path.exists(backup):
        os.rename(dst, backup)
    
    os.rename(src, dst)
    print(f"  Replaced: {fname}")

# Cleanup
try:
    os.rmdir(OUTPUT_DIR)
except:
    pass

print("\n[DONE] All videos are now scrub-ready!")
