import shutil
import datetime
import os

timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
backup_name = f"Gravity_Wallet_v1.0.4_Backup_{timestamp}"
source_dir = "."
target_dir = "../Gravity_Backups"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

# Create a clean backup excluding heavy/git folders
def make_backup():
    print(f"Backing up to {os.path.abspath(target_dir)} ...")
    
    # Using shutil.make_archive with base_dir to avoid full path structure if possible, 
    # but here we use root_dir=source_dir
    
    # We can't easily use 'exclude' filters with simple shutil.make_archive in Python 3.8 (if old).
    # But checking environment... we can walk and zip manually or use a temp dir.
    # Simpler: Just zip relevant folders.
    
    import zipfile
    
    zip_path = os.path.join(target_dir, f"{backup_name}.zip")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Exclude filtering
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'release']]
            
            for file in files:
                if file.endswith('.zip'): continue
                
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arc_name)
                
    print(f"Backup created: {zip_path}")

if __name__ == "__main__":
    make_backup()
