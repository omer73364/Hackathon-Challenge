import cv2
import numpy as np
import random
import os

def elastic_transform(image, alpha, sigma):
	random_state = np.random.RandomState(None)
	shape = image.shape
	dx = (random_state.rand(*shape) * 2 - 1)
	dy = (random_state.rand(*shape) * 2 - 1)
	dx = cv2.GaussianBlur(dx, (17, 17), sigma) * alpha
	dy = cv2.GaussianBlur(dy, (17, 17), sigma) * alpha
	x, y = np.meshgrid(np.arange(shape[1]), np.arange(shape[0]))
	map_x = (x + dx).astype(np.float32)
	map_y = (y + dy).astype(np.float32)
	return cv2.remap(image, map_x, map_y, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

def random_affine(image):
	rows, cols = image.shape
	pts1 = np.float32([[0,0], [cols-1,0], [0,rows-1]])
	shift = 10
	pts2 = np.float32([
		[random.randint(0,shift), random.randint(0,shift)],
		[cols-1-random.randint(0,shift), random.randint(0,shift)],
		[random.randint(0,shift), rows-1-random.randint(0,shift)]
	])
	M = cv2.getAffineTransform(pts1, pts2)
	return cv2.warpAffine(image, M, (cols, rows), borderMode=cv2.BORDER_REFLECT)

def add_noise_and_blur(image):
	blurred = cv2.GaussianBlur(image, (7, 7), 0)
	noise = np.random.normal(0, 15, image.shape).astype(np.int16)
	noisy = np.clip(blurred.astype(np.int16) + noise, 0, 255).astype(np.uint8)
	return noisy

def partial_occlusion(image):
	img = image.copy()
	h, w = img.shape
	# 50% chance rectangle, 50% ellipse
	if random.random() < 0.5:
		x1, y1 = random.randint(0, w//2), random.randint(0, h//2)
		x2, y2 = x1 + random.randint(10, w//2), y1 + random.randint(10, h//2)
		cv2.rectangle(img, (x1, y1), (x2, y2), (0,), -1)
	else:
		center = (random.randint(w//4, 3*w//4), random.randint(h//4, 3*h//4))
		axes = (random.randint(10, w//3), random.randint(10, h//3))
		angle = random.randint(0, 180)
		cv2.ellipse(img, center, axes, angle, 0, 360, (0,), -1)
	return img
def random_erasing(image, max_rect=3):
	img = image.copy()
	h, w = img.shape
	for _ in range(random.randint(1, max_rect)):
		x1 = random.randint(0, w-1)
		y1 = random.randint(0, h-1)
		rect_w = random.randint(5, w//5)
		rect_h = random.randint(5, h//5)
		x2 = min(w, x1 + rect_w)
		y2 = min(h, y1 + rect_h)
		img[y1:y2, x1:x2] = random.randint(0, 40)  # dark patch
	return img

def add_line_artifacts(image, max_lines=5):
	img = image.copy()
	h, w = img.shape
	for _ in range(random.randint(1, max_lines)):
		x1, y1 = random.randint(0, w-1), random.randint(0, h-1)
		x2, y2 = random.randint(0, w-1), random.randint(0, h-1)
		thickness = random.randint(1, 3)
		color = random.randint(0, 80)
		cv2.line(img, (x1, y1), (x2, y2), color, thickness)
	return img

def random_intensity_contrast(image):
	# Random brightness and contrast
	alpha = random.uniform(0.7, 1.3)  # contrast
	beta = random.randint(-30, 30)    # brightness
	img = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
	return img

def strong_distort(image):
	img = elastic_transform(image, alpha=random.uniform(10, 20), sigma=random.uniform(5, 9))
	img = random_affine(img)
	img = add_noise_and_blur(img)
	img = random_intensity_contrast(img)
	# Advanced: random erasing
	if random.random() < 0.7:
		img = random_erasing(img, max_rect=3)
	# Advanced: line artifacts
	if random.random() < 0.5:
		img = add_line_artifacts(img, max_lines=4)
	# Advanced: partial occlusion (rectangle or ellipse)
	if random.random() < 0.7:
		img = partial_occlusion(img)
	return img

def distort_dataset(input_root="dataset", output_root="distorted_dataset"):
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
			distorted = strong_distort(img)
			cv2.imwrite(out_path, distorted)
			print(f"Distorted and saved: {out_path}")

if __name__ == "__main__":
	distort_dataset()
