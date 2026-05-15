import os
import urllib.request
from urllib.parse import urljoin
import re
import ssl

url = "https://club199.com"
output_dir = "/Users/martindrendel/741website/club199/assets/images"
os.makedirs(output_dir, exist_ok=True)

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8')

    img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    other_urls = re.findall(r'(?:url\(|["\'])([^"\']+\.(?:jpg|jpeg|png|webp|svg))', html)
    all_urls = set(img_urls + other_urls)

    for img_url in all_urls:
        if img_url.startswith('data:'): continue
        full_url = urljoin(url, img_url)
        try:
            req_img = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            img_data = urllib.request.urlopen(req_img, context=ctx).read()
            filename = os.path.basename(full_url.split('?')[0])
            if not filename: continue
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(img_data)
            print(f"Downloaded: {filename}")
        except Exception as e:
            print(f"Failed {full_url}: {e}")
except Exception as e:
    print(f"Failed to fetch {url}: {e}")
