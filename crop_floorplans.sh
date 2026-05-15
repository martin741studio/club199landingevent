#!/bin/bash
cd /Users/martindrendel/741website/club199/assets/Tagungsmappe

sips --cropOffset 145 435 -c 200 260 "Screenshot 2026-05-15 at 12.45.37.png" --out fp_the_office.png
sips --cropOffset 145 40 -c 200 260 "Screenshot 2026-05-15 at 12.45.42.png" --out fp_thinktank.png
sips --cropOffset 145 435 -c 200 260 "Screenshot 2026-05-15 at 12.45.47.png" --out fp_workshop_iii.png
sips --cropOffset 145 40 -c 200 260 "Screenshot 2026-05-15 at 12.45.51.png" --out fp_living_room.png
sips --cropOffset 145 435 -c 200 260 "Screenshot 2026-05-15 at 12.45.56.png" --out fp_the_studio.png
sips --cropOffset 145 40 -c 200 260 "Screenshot 2026-05-15 at 12.46.02.png" --out fp_atelier.png
sips --cropOffset 145 435 -c 200 260 "Screenshot 2026-05-15 at 12.46.14.png" --out fp_1og.png
sips --cropOffset 145 40 -c 200 260 "Screenshot 2026-05-15 at 12.46.19.png" --out fp_the_kitchen.png
sips --cropOffset 145 435 -c 200 260 "Screenshot 2026-05-15 at 12.46.23.png" --out fp_4og.png

echo "Done"
