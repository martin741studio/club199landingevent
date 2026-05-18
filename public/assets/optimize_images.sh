#!/bin/bash

# Create optimized directory
mkdir -p assets/images/optimized

# Loop through all jpg images
for img in assets/images/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        
        # Get dimensions
        w=$(sips -g pixelWidth "$img" | awk -F': ' '{print $2}' | tr -d '[:space:]')
        h=$(sips -g pixelHeight "$img" | awk -F': ' '{print $2}' | tr -d '[:space:]')
        
        if [ ! -z "$w" ] && [ ! -z "$h" ]; then
            # Calculate double size
            new_w=$((w * 2))
            new_h=$((h * 2))
            
            echo "Processing $filename -> ${new_w}x${new_h} at 70% quality"
            
            # Upscale and compress (70% JPEG quality)
            sips --resampleHeightWidth $new_h $new_w -s formatOptions 70 "$img" --out "assets/images/optimized/$filename" > /dev/null
        fi
    fi
done

echo "Done! High-resolution, compressed images are in assets/images/optimized/"
