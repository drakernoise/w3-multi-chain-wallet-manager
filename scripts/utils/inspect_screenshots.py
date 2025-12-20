from PIL import Image
import os

files = [
    "public/GravityHome_fixed.png",
    "public/GravityHomeG_fixed.png",
    "public/GravityLogin_fixed.png",
    "public/GravityLogin2_fixed.png"
]

print("Inspecting images...")
for f in files:
    if os.path.exists(f):
        try:
            img = Image.open(f)
            print(f"File: {f}")
            print(f"  Size: {img.width}x{img.height}")
            print(f"  Mode: {img.mode}")
            
            valid_sizes = [(1280, 800), (640, 400)]
            if (img.width, img.height) not in valid_sizes:
                 print(f"  ❌ INVALID SIZE! Expected 1280x800 or 640x400.")
            else:
                 print(f"  ✅ Size OK.")

            if img.mode == 'RGBA' or 'A' in img.mode:
                print(f"  ❌ HAS ALPHA CHANNEL (Transparency)! Store requires 24-bit (RGB).")
            else:
                print(f"  ✅ Mode OK (No Alpha).")
            print("-" * 20)
        except Exception as e:
            print(f"Error reading {f}: {e}")
    else:
        print(f"File {f} not found.")
