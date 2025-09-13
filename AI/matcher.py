# Matcher for fingerprint features
# Uses OpenCV's BFMatcher for demonstration

import cv2

def match_features(desc1, desc2, method='orb'):
    """
    Match two sets of fingerprint descriptors.
    Returns the list of good matches. Supports ORB and SIFT.
    """
    if method == 'sift':
        bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)
        matches = bf.knnMatch(desc1, desc2, k=2)
        # Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < 0.75 * n.distance:
                    good_matches.append(m)
        return good_matches
    else:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(desc1, desc2)
        matches = sorted(matches, key=lambda x: x.distance)
        good_matches = [m for m in matches if m.distance < 50]
        return good_matches
