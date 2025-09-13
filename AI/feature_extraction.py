# Feature extraction for fingerprint images
# Using advanced OpenCV techniques for a robust feature set

import cv2
import numpy as np
from skimage.feature import hog
from skimage.feature import local_binary_pattern

def extract_features(image):
    """
    Extracts a comprehensive set of features from a fingerprint image for robust matching.
    This includes Gabor filter responses, minutiae points, LBP, and HOG features.
    """
    # 1. Preprocessing
    if len(image.shape) > 2:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    image = cv2.resize(image, (256, 256))
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    image = clahe.apply(image)

    # 2. Gabor Filter Bank for Ridge Texture
    gabor_features = []
    for theta in np.arange(0, np.pi, np.pi / 4):  # 4 orientations
        kernel = cv2.getGaborKernel((21, 21), 5.0, theta, 10.0, 0.5, 0, ktype=cv2.CV_32F)
        filtered = cv2.filter2D(image, cv2.CV_8UC3, kernel)
        gabor_features.extend(cv2.mean(filtered))

    # 3. Minutiae Detection (Endings and Bifurcations)
    _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Skeletonization (thinning) without ximgproc
    skeleton = np.zeros(binary.shape, np.uint8)
    element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3,3))
    temp_binary = binary.copy()

    while True:
        eroded = cv2.erode(temp_binary, element)
        temp = cv2.dilate(eroded, element)
        temp = cv2.subtract(temp_binary, temp)
        skeleton = cv2.bitwise_or(skeleton, temp)
        temp_binary = eroded.copy()
        if cv2.countNonZero(temp_binary) == 0:
            break
    
    minutiae_endings = 0
    minutiae_bifurcations = 0
    h, w = skeleton.shape
    for i in range(1, h - 1):
        for j in range(1, w - 1):
            if skeleton[i, j] == 255:
                p = skeleton[i-1:i+2, j-1:j+2]
                p[1, 1] = 0
                neighbors = np.sum(p) / 255
                if neighbors == 1:
                    minutiae_endings += 1
                elif neighbors == 3:
                    minutiae_bifurcations += 1
    
    # 4. Local Binary Patterns (LBP) for Texture
    lbp = local_binary_pattern(image, P=8, R=1, method='uniform')
    (lbp_hist, _) = np.histogram(lbp.ravel(), bins=np.arange(0, 11), range=(0, 10))
    lbp_hist = lbp_hist.astype("float")
    lbp_hist /= (lbp_hist.sum() + 1e-6)

    # 5. Histogram of Oriented Gradients (HOG) for Shape
    hog_features = hog(image, orientations=8, pixels_per_cell=(16, 16),
                       cells_per_block=(1, 1), visualize=False, block_norm='L2-Hys')

    # 6. Combine all features into a dictionary
    features = {
        "gabor": np.array(gabor_features),
        "minutiae": np.array([minutiae_endings, minutiae_bifurcations]),
        "lbp": lbp_hist,
        "hog": hog_features
    }
    
    return features