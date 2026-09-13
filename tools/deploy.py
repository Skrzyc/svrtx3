import os
import sys
import ftplib

# deployment script
# - loads configuration from .env file or default settings
# - removes all files and directories in remote_dir recursively
# - uploads all files and directories from local_dir (./dist) to remote_dir recursively

def load_env(env_path):
    """Loads key-value pairs from a .env file into os.environ."""
    if os.path.exists(env_path):
        print(f"Loading environment variables from {env_path}...")
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    os.environ[key] = val

# Determine paths relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
ENV_PATH = os.path.join(BASE_DIR, ".env")

# Load variables
load_env(ENV_PATH)

# Retrieve configuration from .env
HOST = os.environ.get("FTP_HOST")
USER = os.environ.get("FTP_USER")
PASS = os.environ.get("FTP_PASS")
REMOTE_DIR = os.environ.get("FTP_REMOTE_DIR")

# other configs
LOCAL_DIR = './dist'
PORT = 21

def delete_ftp_dir_contents(ftp):
    """Recursively deletes all files and directories inside the current remote directory."""
    try:
        # Use mlsd (Machine Directory Listing) if supported by the server
        items = list(ftp.mlsd())
        for name, facts in items:
            if name in (".", ".."):
                continue
            item_type = facts.get("type")
            if item_type == "dir":
                ftp.cwd(name)
                delete_ftp_dir_contents(ftp)
                ftp.cwd("..")
                try:
                    ftp.rmd(name)
                    print(f"Removed remote directory: {name}")
                except Exception as e:
                    print(f"Warning: Could not remove directory {name}: {e}")
            else:
                try:
                    ftp.delete(name)
                    print(f"Deleted remote file: {name}")
                except Exception as e:
                    print(f"Warning: Could not delete file {name}: {e}")
    except Exception as e:
        print(f"mlsd failed or not supported ({e}), using fallback listing...")
        try:
            names = ftp.nlst()
        except Exception as nlst_err:
            print(f"Error listing directory: {nlst_err}")
            return

        for item in names:
            # Extract basic file name in case listing returns relative/absolute paths
            name = item.split('/')[-1]
            if not name or name in (".", ".."):
                continue
            
            # Check if directory by attempting to cwd into it
            is_dir = False
            try:
                ftp.cwd(name)
                is_dir = True
                ftp.cwd("..")
            except Exception:
                is_dir = False

            if is_dir:
                ftp.cwd(name)
                delete_ftp_dir_contents(ftp)
                ftp.cwd("..")
                try:
                    ftp.rmd(name)
                    print(f"Removed remote directory (fallback): {name}")
                except Exception as err:
                    print(f"Warning: Could not remove directory {name} (fallback): {err}")
            else:
                try:
                    ftp.delete(name)
                    print(f"Deleted remote file (fallback): {name}")
                except Exception as err:
                    print(f"Warning: Could not delete file {name} (fallback): {err}")

def upload_dir_contents(ftp, local_path):
    """Recursively uploads all contents of local_path to the current remote directory."""
    for entry in os.scandir(local_path):
        if entry.is_dir():
            name = entry.name
            try:
                ftp.mkd(name)
                print(f"Created remote directory: {name}")
            except Exception:
                # Directory may already exist
                pass
            ftp.cwd(name)
            upload_dir_contents(ftp, entry.path)
            ftp.cwd("..")
        elif entry.is_file():
            name = entry.name
            print(f"Uploading {name}...")
            try:
                with open(entry.path, "rb") as f:
                    ftp.storbinary(f"STOR {name}", f)
            except Exception as e:
                print(f"Error uploading {entry.path}: {e}")
                raise e

def main():
    if not os.path.exists(LOCAL_DIR):
        print(f"Error: Local directory '{LOCAL_DIR}' does not exist. Please build the site first.")
        sys.exit(1)

    print(f"Deployment configuration:")
    print(f"  Host: {HOST}")
    print(f"  Port: {PORT}")
    print(f"  User: {USER}")
    print(f"  Remote Dir: {REMOTE_DIR}")
    print(f"  Local Dir: {LOCAL_DIR}")
    print("-" * 40)

    # Connect to the FTP server
    print(f"Connecting to {HOST}:{PORT}...")
    ftp = None
    
    # Try FTPS (FTP over TLS) first for security
    try:
        print("Attempting secure connection (FTPS)...")
        ftp = ftplib.FTP_TLS()
        ftp.connect(HOST, PORT, timeout=30)
        ftp.login(USER, PASS)
        ftp.prot_p()  # Switch to secure data channel
        print("Connected securely via FTPS.")
    except Exception as e:
        print(f"FTPS connection failed or not supported: {e}")
        print("Attempting plain FTP connection...")
        try:
            ftp = ftplib.FTP()
            ftp.connect(HOST, PORT, timeout=30)
            ftp.login(USER, PASS)
            print("Connected via plain FTP.")
        except Exception as conn_err:
            print(f"Error: Connection failed: {conn_err}")
            sys.exit(1)

    # Enable passive mode
    ftp.set_pasv(True)

    try:
        # Navigate to the remote directory
        print(f"Changing to remote directory: {REMOTE_DIR}")
        try:
            ftp.cwd(REMOTE_DIR)
        except Exception as e:
            print(f"Error: Could not change directory to {REMOTE_DIR}: {e}")
            sys.exit(1)

        # Clear existing files and directories
        print("Cleaning up remote directory contents...")
        delete_ftp_dir_contents(ftp)
        print("Remote directory cleared.")

        # Upload local files
        print(f"Uploading files from {LOCAL_DIR}...")
        upload_dir_contents(ftp, LOCAL_DIR)
        
        print("Deployment complete successfully.")

    finally:
        if ftp:
            try:
                ftp.quit()
                print("Disconnected from FTP server.")
            except Exception:
                pass

if __name__ == "__main__":
    main()