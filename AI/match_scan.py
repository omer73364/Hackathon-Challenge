# match_scan.py
# Script to scan a fingerprint and compare it to all fingerprints in the dataset

import os
from preprocess import preprocess_image
from feature_extraction import extract_features
from matcher import match_features
from utils import list_images
import cv2
import requests
import base64

# Path to the latest scanned fingerprint (from scanbmp.py)
INPUT_SCAN_PATH = os.path.join('scans', 'input_scan.bmp')
DATASET_DIR = 'enhanced_dataset'
MATCH_THRESHOLD = 30  # Minimum matches required for valid identification

best_match = None
best_score = 0
best_person = None

import time

def get_file_mtime(path):
    try:
        return os.path.getmtime(path)
    except Exception:
        return None

print("Watching for new input_scan.bmp files in scans/ ... Press Ctrl+C to stop.")
last_mtime = get_file_mtime(INPUT_SCAN_PATH)
while True:
    time.sleep(1)
    mtime = get_file_mtime(INPUT_SCAN_PATH)
    if mtime is None or mtime == last_mtime:
        continue
    last_mtime = mtime
    print(f"\nNew scan detected at {time.ctime(mtime)}. Matching...")
    try:
        input_img = preprocess_image(INPUT_SCAN_PATH)
        input_feats = extract_features(input_img)
    except Exception as e:
        print(f"Error reading input scan: {e}")
        continue
    best_match = None
    best_score = 0
    best_person = None
    dataset_root = os.path.join(os.path.dirname(__file__), DATASET_DIR)
    print(f"Searching in dataset: {dataset_root}")
    
    if not os.path.exists(dataset_root):
        print(f"Dataset directory {dataset_root} does not exist!")
        continue
        
    people_found = os.listdir(dataset_root)
    print(f"Found people: {people_found}")
    
    for person in people_found:
        person_dir = os.path.join(dataset_root, person)
        if not os.path.isdir(person_dir):
            continue
        images_in_person = list_images(person_dir)
        print(f"Person {person}: found {len(images_in_person)} images")
        
        for img_path in images_in_person:
            db_img = preprocess_image(img_path)
            db_feats = extract_features(db_img)
            # Try both SIFT and ORB, aggregate best score
            score = 0
            for method in ['sift', 'orb']:
                kp1, desc1 = input_feats.get(method, ([], None))
                kp2, desc2 = db_feats.get(method, ([], None))
                if desc1 is not None and desc2 is not None and len(desc1) > 0 and len(desc2) > 0:
                    try:
                        good_matches = match_features(desc1, desc2, method=method)
                        match_score = len(good_matches)
                        print(f"  {method}: {match_score} matches")
                        score = max(score, match_score)
                    except Exception as e:
                        print(f"  {method}: matching failed - {e}")
                        continue
            if score > best_score:
                best_score = score
                best_match = img_path
                best_person = person
    
    # Check if best score meets threshold
    if best_person and best_score >= MATCH_THRESHOLD:
        print(f"Best match: {best_person} ({best_match}) with {best_score} good matches.")
        # Read matched fingerprint image as base64
        try:
            with open(INPUT_SCAN_PATH, "rb") as img_file:
                img_b64 = 'data:image/bmp;base64,' + base64.b64encode(img_file.read()).decode("utf-8")
        except Exception as e:
            print(f"Failed to read image for base64: {e}")
            img_b64 = None
        # Send POST request to API
        try:
            response = requests.post(
                os.environ.get('FINGERPRINT_API_URL', 'http://localhost:8080/fingerprint'),
                json={
                    "name": best_person,
                    "fingerprint_img": img_b64,
                    "score": best_score,
                    "matched": True
                },
                timeout=5
            )
            print(f"API response: {response.status_code} {response.text}")
        except Exception as e:
            print(f"Failed to send API request: {e}")
    elif best_person:
        print(f"Unknown person: Best match was {best_person} with only {best_score} matches (threshold: {MATCH_THRESHOLD})")
        # Send API response for unknown person
        try:
            response = requests.post(
                os.environ.get('FINGERPRINT_API_URL', 'http://localhost:8080/fingerprint'),
                json={
                    "name": "Unknown",
                    "fingerprint_img": None,
                    "score": best_score,
                    "matched": False
                },
                timeout=5
            )
            print(f"API response: {response.status_code} {response.text}")
        except Exception as e:
            print(f"Failed to send API request: {e}")
    else:
        print("No match found.")
