from PIL import Image, ImageDraw, ImageFilter
import os

TARGET_SIZE = (1400, 560)
BG_COLOR = (17, 24, 39) # #111827
LOGO_PATH = "public/logowallet_big.png"
SCREENSHOT_PATH = "public/GravityHome.png" # The vertical one
OUTPUT_PATH = "public/promo_marquee_1400x560.png"

def generate_marquee():
    canvas = Image.new('RGB', TARGET_SIZE, BG_COLOR)
    
    # 1. Place Logo (Left side)
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH)
        # Target height ~300px
        ratio = 350 / logo.height
        new_size = (int(logo.width * ratio), int(logo.height * ratio))
        logo = logo.resize(new_size, Image.Resampling.LANCZOS)
        
        # Position: Center of Left Half (x=350)
        x_pos = 350 - (logo.width // 2)
        y_pos = (560 - logo.height) // 2
        
        if logo.mode == 'RGBA':
            canvas.paste(logo, (x_pos, y_pos), logo)
        else:
            canvas.paste(logo, (x_pos, y_pos))

    # 2. Place UI Screenshot (Right side)
    if os.path.exists(SCREENSHOT_PATH):
        ss = Image.open(SCREENSHOT_PATH)
        # Target height ~480px (leaving 40px padding top/bottom)
        # 400x640 original
        ss_ratio = 480 / ss.height
        ss_new_size = (int(ss.width * ss_ratio), int(ss.height * ss_ratio))
        ss_resized = ss.resize(ss_new_size, Image.Resampling.LANCZOS)
        
        # Position: Center of Right Half (x=1050)
        x_ss = 1050 - (ss_resized.width // 2)
        y_ss = (560 - ss_resized.height) // 2
        
        # Add a subtle shadow/border? simpler: just paste
        if ss_resized.mode == 'RGBA':
            canvas.paste(ss_resized, (x_ss, y_ss), ss_resized)
        else:
            canvas.paste(ss_resized, (x_ss, y_ss))

    # Save
    canvas.save(OUTPUT_PATH, "PNG")
    print(f"Generated: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_marquee()
