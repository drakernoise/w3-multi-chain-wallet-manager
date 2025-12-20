from PIL import Image, ImageDraw
import os

TARGET_SIZE = (440, 280)
BG_COLOR = (17, 24, 39) # #111827
LOGO_PATH = "public/logowallet_big.png"
OUTPUT_PATH = "public/promo_tile_440x280.png"

def generate_tile():
    if not os.path.exists(LOGO_PATH):
        print("Logo not found!")
        return

    # Create Canvas
    canvas = Image.new('RGB', TARGET_SIZE, BG_COLOR)
    
    # Load Logo
    logo = Image.open(LOGO_PATH)
    
    # Resize Logo to fit nicely (e.g. max 200px height, max 300px width)
    # Give it some padding
    max_w = 300
    max_h = 200
    
    ratio = min(max_w / logo.width, max_h / logo.height)
    new_size = (int(logo.width * ratio), int(logo.height * ratio))
    
    logo_resized = logo.resize(new_size, Image.Resampling.LANCZOS)
    
    # Center position
    x = (TARGET_SIZE[0] - new_size[0]) // 2
    y = (TARGET_SIZE[1] - new_size[1]) // 2
    
    # Paste (using alpha channel as mask if available)
    if logo_resized.mode == 'RGBA':
        canvas.paste(logo_resized, (x, y), logo_resized)
    else:
        canvas.paste(logo_resized, (x, y))
        
    # Save
    canvas.save(OUTPUT_PATH, "PNG")
    print(f"Generated: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_tile()
