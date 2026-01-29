from PIL import Image
import sys

try:
    # Use first argument as filename, default to slide5.jpg
    filename = sys.argv[1] if len(sys.argv) > 1 else "public/slide5.jpg"
    img = Image.open(filename)
    width, height = img.size
    
    # Analyze colors at 30% height (Wall Level)
    y_pos = int(height * 0.3)
    
    # Left Wall
    box_l = (0, y_pos, 50, y_pos + 20)
    # Center Wall
    box_c = (width//2 - 25, y_pos, width//2 + 25, y_pos + 20)
    # Right Wall
    box_r = (width - 50, y_pos, width, y_pos + 20)

    def get_avg(region):
        pixels = list(region.getdata())
        if not pixels: return "#000000"
        r = int(sum([p[0] for p in pixels]) / len(pixels))
        g = int(sum([p[1] for p in pixels]) / len(pixels))
        b = int(sum([p[2] for p in pixels]) / len(pixels))
        return f"#{r:02x}{g:02x}{b:02x}"

    print(f"L: {get_avg(img.crop(box_l))}")
    print(f"C: {get_avg(img.crop(box_c))}")
    print(f"R: {get_avg(img.crop(box_r))}")
    
except Exception as e:
    print(f"Error: {e}")
