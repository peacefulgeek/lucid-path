#!/usr/bin/env python3
"""
Upload generated images to Bunny CDN as WebP.
Reads from /home/ubuntu/generated-images/ directory.
Compresses to WebP and uploads to Bunny CDN storage.
"""
import os
import sys
import json
import requests
from PIL import Image
from io import BytesIO

BUNNY_STORAGE_ZONE = "lucid-path"
BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com"
BUNNY_STORAGE_PASSWORD = "e1425c2f-1fef-4562-b1621adad2ce-c84a-41d5"
BUNNY_CDN_BASE = "https://lucid-path.b-cdn.net"

def compress_to_webp(input_path, width, height, quality=82):
    """Compress image to WebP format."""
    img = Image.open(input_path)
    img = img.convert('RGB')
    img = img.resize((width, height), Image.LANCZOS)
    
    buffer = BytesIO()
    img.save(buffer, format='WEBP', quality=quality)
    data = buffer.getvalue()
    
    # If too large, reduce quality
    if len(data) > 200 * 1024:
        buffer = BytesIO()
        img.save(buffer, format='WEBP', quality=70)
        data = buffer.getvalue()
    
    return data

def upload_to_bunny(data, remote_path):
    """Upload binary data to Bunny CDN storage."""
    url = f"https://{BUNNY_STORAGE_HOST}/{BUNNY_STORAGE_ZONE}/{remote_path}"
    response = requests.put(
        url,
        headers={
            'AccessKey': BUNNY_STORAGE_PASSWORD,
            'Content-Type': 'image/webp',
        },
        data=data,
    )
    if response.status_code not in (200, 201):
        raise Exception(f"Upload failed: {response.status_code} {response.text}")
    return f"{BUNNY_CDN_BASE}/{remote_path}"

def process_image(local_path, slug, img_type='hero'):
    """Process and upload a single image."""
    if img_type == 'hero':
        width, height = 1200, 675
        remote_path = f"images/hero/{slug}.webp"
    else:
        width, height = 1200, 630
        remote_path = f"images/og/{slug}.webp"
    
    webp_data = compress_to_webp(local_path, width, height)
    cdn_url = upload_to_bunny(webp_data, remote_path)
    size_kb = len(webp_data) / 1024
    print(f"  ✓ {img_type} {slug}: {size_kb:.0f}KB -> {cdn_url}")
    return cdn_url

if __name__ == '__main__':
    # Read the mapping file
    mapping_path = sys.argv[1] if len(sys.argv) > 1 else '/home/ubuntu/image-mapping.json'
    
    with open(mapping_path) as f:
        mapping = json.load(f)
    
    results = {}
    for item in mapping:
        slug = item['slug']
        hero_path = item.get('hero_path')
        og_path = item.get('og_path')
        
        if hero_path and os.path.exists(hero_path):
            results[f"{slug}_hero"] = process_image(hero_path, slug, 'hero')
        if og_path and os.path.exists(og_path):
            results[f"{slug}_og"] = process_image(og_path, slug, 'og')
    
    # Save results
    with open('/home/ubuntu/upload-results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nDone! {len(results)} images uploaded.")
