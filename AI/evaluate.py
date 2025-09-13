# Example script to train or evaluate fingerprint recognition
# This is a template for you to expand with your dataset and logic

from preprocess import preprocess_image
from feature_extraction import extract_features
from matcher import match_features
from utils import list_images
import cv2

# Example usage: compare all images in two folders
folder1 = '../dataset/person1/normal/'
folder2 = '../dataset/person1/distorted/'

images1 = list_images(folder1)
images2 = list_images(folder2)

for img1_path in images1:
    img1 = preprocess_image(img1_path)
    kp1, desc1 = extract_features(img1)
    for img2_path in images2:
        img2 = preprocess_image(img2_path)
        kp2, desc2 = extract_features(img2)
        if desc1 is not None and desc2 is not None:
            good_matches = match_features(desc1, desc2)
            print(f"{img1_path} vs {img2_path}: {len(good_matches)} good matches")
        else:
            print(f"No descriptors for {img1_path} or {img2_path}")
