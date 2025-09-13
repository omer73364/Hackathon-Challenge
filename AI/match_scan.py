# match_scan.py
# Script to scan a fingerprint and compare it to all fingerprints in the dataset

import os
from preprocess import preprocess_image
from feature_extraction import extract_minutiae_features
# from matcher import match_minutiae_features  # Not used in current logic
from utils import list_images
import cv2
import requests
import base64

# Path to the latest scanned fingerprint (from scanbmp.py)
INPUT_SCAN_PATH = os.path.join('scans', 'input_scan.bmp')
DATASET_DIR = 'enhanced_dataset'
MATCH_THRESHOLD = 1  # Lowered threshold for easier recognition
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

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
        # Preprocess image if needed, or use raw image path
        input_img_path = INPUT_SCAN_PATH
        input_terminations, input_bifurcations = extract_minutiae_features(input_img_path)
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
    
    any_images = False
    for person in people_found:
        person_dir = os.path.join(dataset_root, person)
        if not os.path.isdir(person_dir):
            continue
        images_in_person = list_images(person_dir)
        print(f"Person {person}: found {len(images_in_person)} images")
        if images_in_person:
            any_images = True
        for img_path in images_in_person:
            db_img_path = img_path
            db_terminations, db_bifurcations = extract_minutiae_features(db_img_path)
            # Simple matching: count number of similar minutiae (can be improved)
            score = min(len(input_terminations), len(db_terminations)) + min(len(input_bifurcations), len(db_bifurcations))
            print(f"  Minutiae match score: {score} for {img_path}")
            if score > best_score:
                best_score = score
                best_match = img_path
                best_person = person
    if not any_images:
        print("WARNING: No images found in the dataset. Please check your enhanced_dataset folder structure.")
    
    # Always print the best match and score, even if below threshold
    print(f"\n=== MATCH SUMMARY ===")
    if best_person:
        print(f"Best match: {best_person} ({best_match}) with {best_score} minutiae matches (threshold: {MATCH_THRESHOLD})")
        if best_score >= MATCH_THRESHOLD:
            print(f"RECOGNIZED NAME: {best_person}")
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
                    "http://10.21.55.109:8080/fingerprint",
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
        else:
            print(f"No recognized person: best score {best_score} did not meet threshold {MATCH_THRESHOLD}.")
            # Send API response for unknown person
            try:
                response = requests.post(
                    "http://10.21.55.109:8080/fingerprint",
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
