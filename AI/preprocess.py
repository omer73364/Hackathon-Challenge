import cv2
import numpy as np
from skimage import exposure

def preprocess_image(image_path):

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Image not found: {image_path}")
    # 1. Denoise (robust to sensor noise)
    img = cv2.fastNlMeansDenoising(img, None, h=15, templateWindowSize=7, searchWindowSize=21)
    # 2. CLAHE (adaptive histogram equalization for local contrast)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    img = clahe.apply(img)
    # 3. Unsharp mask (sharpen ridges)
    gaussian = cv2.GaussianBlur(img, (0,0), sigmaX=2)
    img = cv2.addWeighted(img, 1.5, gaussian, -0.5, 0)
    # 4. Adaptive threshold (binarize, robust to lighting)
    img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv2.THRESH_BINARY, 17, 7)
    # 5. Ridge enhancement (morphological closing)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    img = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)
    # 6. Resize to standard size
    img = cv2.resize(img, (256, 288))
    return img


def enhance_dataset(input_root="distorted_dataset", output_root="enhanced_dataset"):
    """Process all images in distorted_dataset and save enhanced versions to enhanced_dataset."""
    import os
    
    for person in os.listdir(input_root):
        in_dir = os.path.join(input_root, person)
        out_dir = os.path.join(output_root, person)
        
        if not os.path.isdir(in_dir):
            continue
            
        os.makedirs(out_dir, exist_ok=True)
        
        for fname in os.listdir(in_dir):
            if not fname.lower().endswith('.bmp'):
                continue
                
            in_path = os.path.join(in_dir, fname)
            out_path = os.path.join(out_dir, fname)
            
            try:
                enhanced_img = preprocess_image(in_path)
                cv2.imwrite(out_path, enhanced_img)
                print(f"Enhanced: {out_path}")
            except Exception as e:
                print(f"Failed to process {in_path}: {e}")


if __name__ == "__main__":
    enhance_dataset()