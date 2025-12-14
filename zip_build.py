import shutil
import os

DIST_DIR = 'dist'
RELEASE_DIR = 'release'
VERSION = '1.0.4'
ZIP_NAME = f'gravity-wallet-v{VERSION}'
ZIP_PATH = os.path.join(RELEASE_DIR, ZIP_NAME)

if os.path.exists(DIST_DIR):
    shutil.make_archive(ZIP_PATH, 'zip', DIST_DIR)
    print(f"Created {ZIP_PATH}.zip")
else:
    print("dist directory not found!")
