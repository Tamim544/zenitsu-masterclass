from PIL import Image
import sys

def make_transparent(img_path, out_path, target_color, tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # item is (R, G, B, A)
        if abs(item[0] - target_color[0]) <= tolerance and \
           abs(item[1] - target_color[1]) <= tolerance and \
           abs(item[2] - target_color[2]) <= tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")

# White background (awake)
make_transparent('/Users/tamimchowdhury/ZEntisu file/assets/zenitsu_awake.png', 
                 '/Users/tamimchowdhury/ZEntisu file/assets/zenitsu_awake_transparent.png', 
                 (255, 255, 255), 15)

# Black background (asleep)
make_transparent('/Users/tamimchowdhury/ZEntisu file/assets/zenitsu_asleep.png', 
                 '/Users/tamimchowdhury/ZEntisu file/assets/zenitsu_asleep_transparent.png', 
                 (0, 0, 0), 20)
