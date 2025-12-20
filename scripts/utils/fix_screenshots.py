from PIL import Image, ImageOps
import os

files = [
    "public/GravityHome.png",
    "public/GravityHomeG.png",
    "public/GravityLogin.png",
    "public/GravityLogin2.png",
    "public/GravityLogin2G.png",
    "public/GravityLoginG.png"
]

TARGET_SIZE = (1280, 800)
BG_COLOR = (17, 24, 39) # #111827 Dark Blue/Gray (Tailwind gray-900ish)

def fix_image(path):
    if not os.path.exists(path):
        return
    
    try:
        # Load
        img = Image.open(path)
        
        # Determine scaling needed if source is too big for target height?
        # Target Height 800. Source 640 or 1280.
        # If Source is 800x1280 (GravityHomeG), it's taller than 800.
        # We need to resize it to fit height 800.
        
        # Calculate ratio to fit inside 1280x800 padding
        # Let's target a height of 700px (50px padding)
        target_h = 700
        ratio = target_h / img.height
        new_w = int(img.width * ratio)
        new_h = int(img.height * ratio)
        
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create Canvas (RGB)
        canvas = Image.new('RGB', TARGET_SIZE, BG_COLOR)
        
        # Paste centered
        x = (1280 - new_w) // 2
        y = (800 - new_h) // 2
        
        # Handle transparency of source when pasting
        if resized.mode == 'RGBA':
            canvas.paste(resized, (x, y), resized)
        else:
            canvas.paste(resized, (x, y))
            
        # Save
        new_path = path.replace('.png', '_fixed.png')
        canvas.save(new_path, "PNG")
        print(f"Fixed: {path} -> {new_path}")
        
    except Exception as e:
        print(f"Failed {path}: {e}")

if __name__ == "__main__":
    for f in files:
        fix_image(f)
