# Matcher for fingerprint features
# Uses OpenCV's BFMatcher with improved accuracy parameters

import cv2

def match_features(desc1, desc2, method='orb'):
    """
    Match two sets of fingerprint descriptors with improved accuracy.
    Returns the list of good matches. Supports ORB and SIFT.
    """
    if method == 'sift':
        bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)
        matches = bf.knnMatch(desc1, desc2, k=2)
        # Stricter Lowe's ratio test for better discrimination
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                # More strict ratio test: 0.65 instead of 0.75
                if m.distance < 0.65 * n.distance:
                    good_matches.append(m)
        return good_matches
    else:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(desc1, desc2)
        matches = sorted(matches, key=lambda x: x.distance)
        # More strict distance threshold: 30 instead of 50
        good_matches = [m for m in matches if m.distance < 30]
        return good_matches

def calculate_match_confidence(desc1, desc2, good_matches, kp1, kp2, method='orb'):
    """
    Calculate a confidence score for the matches based on quality metrics and geometric verification.
    Returns a normalized confidence score between 0 and 1.
    """
    if len(good_matches) == 0:
        return 0.0
    
    # Calculate match ratio (percentage of features that matched well)
    total_features = min(len(desc1), len(desc2))
    match_ratio = len(good_matches) / max(total_features, 1)
    
    # Calculate average distance of good matches (lower is better)
    avg_distance = sum(m.distance for m in good_matches) / len(good_matches)
    
    if method == 'sift':
        # For SIFT, good distances are typically < 300
        distance_score = max(0, 1 - (avg_distance / 300))
    else:
        # For ORB, good distances are typically < 50
        distance_score = max(0, 1 - (avg_distance / 50))
    
    # Geometric verification using RANSAC
    geometric_score = 0.0
    if len(good_matches) >= 4:  # Need at least 4 points for homography
        try:
            # Extract matched keypoint coordinates
            src_pts = [kp1[m.queryIdx].pt for m in good_matches]
            dst_pts = [kp2[m.trainIdx].pt for m in good_matches]
            
            if len(src_pts) >= 4 and len(dst_pts) >= 4:
                import numpy as np
                src_pts = np.float32(src_pts).reshape(-1, 1, 2)
                dst_pts = np.float32(dst_pts).reshape(-1, 1, 2)
                
                # Find homography with RANSAC
                _, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
                if mask is not None:
                    inliers = np.sum(mask)
                    geometric_score = inliers / len(good_matches)
        except Exception:
            geometric_score = 0.0
    
    # Combine all factors: match ratio, distance quality, and geometric consistency
    confidence = (match_ratio * 0.3) + (distance_score * 0.3) + (geometric_score * 0.4)
    return min(confidence, 1.0)