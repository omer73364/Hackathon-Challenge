# Feature extraction for fingerprint images
# You can use OpenCV or custom logic for minutiae/ridge extraction

import cv2
import numpy as np


def extract_features(image):
    """
    Extract robust features from a preprocessed fingerprint image.
    Uses SIFT if available, otherwise ORB. Returns both if possible.
    """
    features = {}
    # Try SIFT (best for fingerprints, if available)
    try:
        sift = cv2.SIFT_create()
        kp_sift, desc_sift = sift.detectAndCompute(image, None)
        features['sift'] = (kp_sift, desc_sift)
    except AttributeError:
        features['sift'] = ([], None)
    # Always compute ORB as fallback/alternative
    orb = cv2.ORB_create(nfeatures=1000, scaleFactor=1.2, edgeThreshold=15, patchSize=31)
    kp_orb, desc_orb = orb.detectAndCompute(image, None)
    features['orb'] = (kp_orb, desc_orb)
    return features