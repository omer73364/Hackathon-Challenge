import cv2
import os
import numpy as np

# Enhancement pipeline: denoise, CLAHE, unsharp mask
def enhance_image(image):
	# Denoise
	denoised = cv2.fastNlMeansDenoising(image, None, h=15, templateWindowSize=7, searchWindowSize=21)
	# CLAHE (Contrast Limited Adaptive Histogram Equalization)
	clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
	contrast = clahe.apply(denoised)
	# Unsharp mask
	gaussian = cv2.GaussianBlur(contrast, (0,0), sigmaX=2)
	unsharp = cv2.addWeighted(contrast, 1.5, gaussian, -0.5, 0)
	return unsharp


def enhance_distorted_dataset(input_root="distorted_dataset", output_root="enhanced_dataset"):
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
			img = cv2.imread(in_path, cv2.IMREAD_GRAYSCALE)
			if img is None:
				print(f"Failed to read {in_path}")
				continue
			enhanced = enhance_image(img)
			cv2.imwrite(out_path, enhanced)
			print(f"Enhanced and saved: {out_path}")

if __name__ == "__main__":
	enhance_distorted_dataset()
