# match_scan.py
# Script to scan a fingerprint and compare it to all fingerprints in the dataset
# This version uses a template-based feature vector matching approach.

import os
import cv2
import numpy as np
from feature_extraction import extract_features
import requests
import base64
import time

# Path to the latest scanned fingerprint (from scanbmp.py)
INPUT_SCAN_PATH = os.path.join('scans', 'input_scan.bmp')
DATASET_DIR = 'dataset'
MATCH_THRESHOLD = 0.65  # More permissive base threshold
DISTINCTIVENESS_THRESHOLD = 0.05  # Minimum difference from second-best match

def load_and_compare_fingerprint(image_path1, image_path2):
    """
    Load and compare two fingerprint images using template-based feature vectors.
    """
    # Load images
    img1 = cv2.imread(image_path1, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imread(image_path2, cv2.IMREAD_GRAYSCALE)
    
    if img1 is None or img2 is None:
        return 0.0
    
    # Extract feature vectors
    features1 = extract_features(img1)
    features2 = extract_features(img2)
    
    # --- Calculate Similarity Score using Cosine Similarity ---
    # This is the standard way to compare two normalized feature vectors.
    # A score of 1.0 means the vectors are identical.
    # A score of 0.0 means they are completely different.
    
    dot_product = np.dot(features1, features2)
    norm1 = np.linalg.norm(features1)
    norm2 = np.linalg.norm(features2)
    
    # Avoid division by zero
    if norm1 == 0 or norm2 == 0:
        return 0.0
        
    similarity = dot_product / (norm1 * norm2)
                  
    return similarity

# --- Main Watcher Loop ---

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
    if not os.path.exists(INPUT_SCAN_PATH):
        print(f"Input scan file not found: {INPUT_SCAN_PATH}")
        continue
    print("Successfully found input scan")
    
    dataset_root = os.path.join(os.path.dirname(__file__), DATASET_DIR)
    print(f"Searching in dataset: {dataset_root}")
    
    if not os.path.exists(dataset_root):
        print(f"Dataset directory {dataset_root} does not exist!")
        continue
        
    people_found = os.listdir(dataset_root)
    print(f"Found people: {people_found}")

    start_time = time.time()
    
    scores_per_person = {}

    for person in people_found:
        person_dir = os.path.join(dataset_root, person)
        if not os.path.isdir(person_dir):
            continue
            
        print(f"Checking fingerprints for {person}...")
        max_score_for_person = 0
        for fp_file in os.listdir(person_dir):
            if not fp_file.endswith('.bmp'):
                continue
                
            fp_path = os.path.join(person_dir, fp_file)
            try:
                score = load_and_compare_fingerprint(INPUT_SCAN_PATH, fp_path)
                
                if score > max_score_for_person:
                    max_score_for_person = score
                    
            except Exception as e:
                print(f"Error processing {fp_path}: {e}")
                continue
        
        if max_score_for_person > 0:
            scores_per_person[person] = max_score_for_person

    best_person = "Unknown"
    best_score = 0
    sorted_scores = []

    # Analyze the collected scores to find the best match
    if scores_per_person:
        # Sort by score descending
        sorted_scores = sorted(scores_per_person.items(), key=lambda item: item[1], reverse=True)
        best_person_candidate, best_score_candidate = sorted_scores[0]
        
        # If confidence is above 70%, consider it a match
        if best_score_candidate >= 0.70:
            best_person = best_person_candidate
            best_score = best_score_candidate
        else:
            # Score is too low for a confident match
            best_person = "Unknown"
            best_score = best_score_candidate

    end_time = time.time()
    latency = end_time - start_time
    print(f"Matching completed in {latency:.4f} seconds.")

    # Convert input scan to base64
    try:
        with open(INPUT_SCAN_PATH, "rb") as img_file:
            img_b64 = 'data:image/bmp;base64,' + base64.b64encode(img_file.read()).decode("utf-8")
    except Exception as e:
        print(f"Failed to read image for base64: {e}")
        img_b64 = None

    if best_person != "Unknown":
        print(f"\nMATCH FOUND!")
        print(f"Person: {best_person}")
        print(f"Confidence: {best_score:.2%}")
        
        # Send success match to API
        try:
            response = requests.post(
                'http://10.21.55.109:8080/fingerprint',
                json={
                    "name": best_person,
                    "fingerprint_img": img_b64,
                    "score": float(best_score),
                    "matched": True,
                    "latency": latency
                },
                timeout=5
            )
            print(f"API response: {response.status_code}")
        except Exception as e:
            print(f"Failed to send API request: {e}")
    else:
        print("\nNo match found.")
        if scores_per_person:
            # Log the best candidate even if it wasn't a confident match
            best_candidate_person, best_candidate_score = sorted_scores[0]
            print(f"Best candidate was {best_candidate_person} with confidence {best_candidate_score:.2%}, but it was not distinct or confident enough.")
            
        # Send no match to API
        try:
            response = requests.post(
                'http://10.21.55.109:8080/fingerprint',
                json={
                    "name": "Unknown",
                    "fingerprint_img": img_b64,
                    "score": float(best_score),
                    "matched": False,
                    "latency": latency
                },
                timeout=5
            )
            print(f"API response: {response.status_code}")
        except Exception as e:
            print(f"Failed to send API request: {e}")

