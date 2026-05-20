#!/bin/bash

# Target directory containing the large PNGs
TARGET_DIR="assets/Tagungsmappe/NewClub199imags"

echo "Starting SEO image optimization (resizing to max 1200px width and converting to WebP)..."

# Process all PNG files in the directory
for img in "$TARGET_DIR"/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        echo "Optimizing: $filename"
        
        # -Z 1200 resizes the image so its longest edge is at most 1200px (maintaining aspect ratio)
        # -s format webp converts to WebP
        # -s formatOptions 80 sets quality to 80%
        sips -Z 1200 -s format webp -s formatOptions 80 "$img" --out "$TARGET_DIR/$name.webp" > /dev/null
        
        echo " -> Created $name.webp"
    fi
done

echo ""
echo "Done! Optimized WebP images are now in $TARGET_DIR/"
echo "You can now safely commit and push these changes."
