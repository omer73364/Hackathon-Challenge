# feature_extraction.py
# A robust, template-based feature extraction pipeline for fingerprints.

import cv2
import numpy as np

def extract_features(image):
    """
    Creates a simplified but effective feature representation of the fingerprint
    focusing on ridge patterns and local intensity distributions.
    """
    # Convert to grayscale if needed
    if len(image.shape) > 2:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Resize to standard size
    image = cv2.resize(image, (256, 256))
    
    # Basic contrast enhancement
    image = cv2.equalizeHist(image)
    
    # Initialize feature vector
    feature_vector = []
    block_size = 16
    
    # Grid-based feature extraction
    for y in range(0, image.shape[0], block_size):
        for x in range(0, image.shape[1], block_size):
            # Extract block
            block = image[y:min(y+block_size, image.shape[0]), 
                         x:min(x+block_size, image.shape[1])]
            
            if block.shape[0] < block_size or block.shape[1] < block_size:
                continue
                
            # 1. Block statistics
            mean_val = np.mean(block)
            std_val = np.std(block)
            feature_vector.extend([mean_val/255.0, std_val/255.0])
            
            # 2. Simple gradient features
            gx = cv2.Sobel(block, cv2.CV_32F, 1, 0, ksize=3)
            gy = cv2.Sobel(block, cv2.CV_32F, 0, 1, ksize=3)
            
            # Gradient magnitude and direction
            magnitude = np.sqrt(gx*gx + gy*gy)
            angle = np.arctan2(gy, gx)
            
            # Add statistical features of gradients
            feature_vector.extend([
                np.mean(magnitude)/255.0,
                np.std(magnitude)/255.0,
                np.cos(2*np.mean(angle)),  # Ridge orientation
                np.sin(2*np.mean(angle))
            ])

    # Convert to numpy array and normalize
    feature_vector = np.array(feature_vector, dtype=np.float32)
    norm = np.linalg.norm(feature_vector)
    if norm > 0:
        feature_vector = feature_vector / norm
    
    return feature_vector
