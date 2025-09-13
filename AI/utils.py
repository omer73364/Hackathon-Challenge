# Utility functions for file handling, logging, etc.
import os

def list_images(folder, ext='.bmp'):
    """List all image files in a folder with a given extension."""
    return [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith(ext)]
  