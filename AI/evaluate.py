# Example script to train or evaluate fingerprint recognition
# This is a template for you to expand with your dataset and logic

from preprocess import preprocess_image
from feature_extraction import extract_minutiae_features
from matcher import match_minutiae_features
from utils import list_images
import cv2

# Example usage: compare all images in two folders
folder1 = '../dataset/person1/normal/'
folder2 = '../dataset/person1/distorted/'

images1 = list_images(folder1)
images2 = list_images(folder2)

for img1_path in images1:
    term1, bif1 = extract_minutiae_features(img1_path)
    for img2_path in images2:
        term2, bif2 = extract_minutiae_features(img2_path)
        match_score = match_minutiae_features(term1, bif1, term2, bif2)
        print(f"{img1_path} vs {img2_path}: {match_score} minutiae matches")
