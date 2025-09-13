
# Feature extraction for fingerprint images using fingerprint_feature_extractor
import cv2
import fingerprint_feature_extractor

def extract_minutiae_features(image_path, spuriousMinutiaeThresh=10, invertImage=False, showResult=True, saveResult=True):
    """
    Extracts minutiae features (terminations and bifurcations) from a fingerprint image using fingerprint_feature_extractor.
    Args:
        image_path (str): Path to the fingerprint image file.
        spuriousMinutiaeThresh (int): Threshold for removing spurious minutiae.
        invertImage (bool): Whether to invert the image before processing.
        showResult (bool): Whether to display the result.
        saveResult (bool): Whether to save the result image.
    Returns:
        tuple: (FeaturesTerminations, FeaturesBifurcations)
    """
    img = cv2.imread(image_path, 0)
    FeaturesTerminations, FeaturesBifurcations = fingerprint_feature_extractor.extract_minutiae_features(
        img,
        spuriousMinutiaeThresh=spuriousMinutiaeThresh,
        invertImage=invertImage,
        showResult=showResult,
        saveResult=saveResult
    )
    return FeaturesTerminations, FeaturesBifurcations
