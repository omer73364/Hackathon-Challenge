# match_scan.py
# Script to scan a fingerprint and compare it to all fingerprints in the dataset

import os
from utils import list_images
import cv2
import numpy as np
from feature_extraction import extract_features
import requests
import base64

# Path to the latest scanned fingerprint (from scanbmp.py)
INPUT_SCAN_PATH = os.path.join('scans', 'input_scan.bmp')
DATASET_DIR = 'enhanced_dataset'  # Using enhanced dataset
MATCH_THRESHOLD = 0.6  # Confidence must be >= 80% for a valid match

def load_and_compare_fingerprint(image_path1, image_path2):
    """Load and compare two fingerprint images."""
    # Load images
    img1 = cv2.imread(image_path1, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imread(image_path2, cv2.IMREAD_GRAYSCALE)
    
    if img1 is None or img2 is None:
        return 0.0
    
    # Extract features
    features1 = extract_features(img1)
    features2 = extract_features(img2)
    
    # Calculate similarity score using a weighted combination of different feature similarities
    
    # 1. Gabor similarity (Cosine)
    gabor_sim = np.dot(features1['gabor'], features2['gabor']) / (np.linalg.norm(features1['gabor']) * np.linalg.norm(features2['gabor']))
    
    # 2. Minutiae similarity (Euclidean distance)
    minutiae_sim = 1 - np.linalg.norm(features1['minutiae'] - features2['minutiae']) / (np.linalg.norm(features1['minutiae']) + np.linalg.norm(features2['minutiae']) + 1e-6)
    
    # 3. LBP similarity (Chi-Squared distance)
    lbp_sim = 1 - cv2.compareHist(features1['lbp'].astype(np.float32), features2['lbp'].astype(np.float32), cv2.HISTCMP_CHISQR)
    
    # 4. HOG similarity (Cosine)
    hog_sim = np.dot(features1['hog'], features2['hog']) / (np.linalg.norm(features1['hog']) * np.linalg.norm(features2['hog']))
    
    # Weighted combination of similarities
    weights = {
        "gabor": 0.3,
        "minutiae": 0.3,
        "lbp": 0.2,
        "hog": 0.2
    }
    
    similarity = (weights['gabor'] * gabor_sim +
                  weights['minutiae'] * minutiae_sim +
                  weights['lbp'] * lbp_sim +
                  weights['hog'] * hog_sim)
                  
    return similarity
    
    # Convert minutiae points to numpy arrays
    points1 = np.array([p[1] for p in minutiae1])
    points2 = np.array([p[1] for p in minutiae2])
    
    # Get pattern hashes
    patterns1 = [p[2] for p in minutiae1]
    patterns2 = [p[2] for p in minutiae2]
    
    # Calculate similarity matrix
    similarities = np.zeros((len(points1), len(points2)))
    
    for i, (p1, h1) in enumerate(zip(points1, patterns1)):
        for j, (p2, h2) in enumerate(zip(points2, patterns2)):
            # Distance similarity
            dist = euclidean_distance(p1, p2)
            dist_sim = max(0, 1 - (dist / 50))  # More strict distance threshold
            
            # Pattern similarity
            pattern_sim = 1 - abs(h1 - h2) / max(h1, h2)
            
            # Combined similarity with higher weight on pattern matching
            similarities[i,j] = 0.3 * dist_sim + 0.7 * pattern_sim
    
    # Find best matches
    from scipy.optimize import linear_sum_assignment
    row_ind, col_ind = linear_sum_assignment(-similarities)  # Negative because we want to maximize
    
    # Calculate final similarity score
    match_scores = similarities[row_ind, col_ind]
    good_matches = match_scores > 0.8  # Only count very good matches
    
    if not any(good_matches):
        return 0.0
        
    similarity = np.mean(match_scores[good_matches])
    
    # Require minimum number of good matches
    min_matches_required = 10
    if np.sum(good_matches) < min_matches_required:
        similarity *= (np.sum(good_matches) / min_matches_required)
    
    return similarity

def preprocess_fingerprint(img):
    """Basic preprocessing for fingerprint images."""
    # Just resize the image to standard size
    img = cv2.resize(img, (500, 500))
    
    # Simple binary thresholding
    _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
    return binary

def extract_minutiae(binary):
    """Extract feature points with local patterns from the binary image."""
    minutiae = []
    h, w = binary.shape
    step = 10  # Sample every 10 pixels
    window_size = 5  # Size of local pattern window
    
    for i in range(window_size, h-window_size, step):
        for j in range(window_size, w-window_size, step):
            if binary[i,j] == 255:  # If it's a white pixel
                # Get local pattern around the point
                pattern = binary[i-window_size:i+window_size+1, j-window_size:j+window_size+1]
                # Calculate pattern hash (sum of pixels in local window)
                pattern_hash = np.sum(pattern)
                minutiae.append(('pattern', (j,i), pattern_hash))
                    
    return minutiae

def load_and_encode_fingerprint(image_path):
    """Load and encode fingerprint image for matching."""
    # Load the image in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Could not load image: {image_path}")
    
    # Apply preprocessing pipeline
    processed = preprocess_fingerprint(img)
    
    # Extract minutiae features
    minutiae = extract_minutiae(processed)
    
    if not minutiae:
        raise ValueError(f"Could not extract features from image: {image_path}")
    
    return minutiae

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
    if not os.path.exists(INPUT_SCAN_PATH):
        print(f"Input scan file not found: {INPUT_SCAN_PATH}")
        continue
    print("Successfully found input scan")
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

    start_time = time.time()
    
    for person in people_found:
        person_dir = os.path.join(dataset_root, person)
        if not os.path.isdir(person_dir):
            continue
            
        print(f"Checking fingerprints for {person}...")
        for fp_file in os.listdir(person_dir):
            if not fp_file.endswith('.bmp'):
                continue
                
            fp_path = os.path.join(person_dir, fp_file)
            try:
                score = load_and_compare_fingerprint(INPUT_SCAN_PATH, fp_path)
                
                if score > best_score:
                    best_score = score
                    best_match = fp_file
                    best_person = person
                    
            except Exception as e:
                print(f"Error processing {fp_path}: {e}")
                continue
    
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

    if best_score >= MATCH_THRESHOLD:
        print(f"\nMATCH FOUND!")
        print(f"Person: {best_person}")
        print(f"File: {best_match}")
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
        if best_score > 0:
            print(f"Best candidate was {best_person} with confidence {best_score:.2%}")
            
        # Send no match to API
        try:
            response = requests.post(
                'http://10.21.55.109:8080/fingerprint',
                json={
                    "name": "Unknown",
                    "fingerprint_img": img_b64,
                    "score": float(best_score) if best_score > 0 else 0.0,
                    "matched": False,
                    "latency": latency
                },
                timeout=5
            )
            print(f"API response: {response.status_code}")
        except Exception as e:
            print(f"Failed to send API request: {e}")
