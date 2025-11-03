# log_specs.py
import platform, psutil, datetime

def get_specs():
    return {
        "Timestamp": datetime.datetime.now().isoformat(),
        "OS": platform.system(),
        "OS Version": platform.version(),
        "Release": platform.release(),
        "Machine": platform.machine(),
        "Processor": platform.processor(),
        "CPU Cores": psutil.cpu_count(logical=True),
        "RAM": f"{round(psutil.virtual_memory().total / (1024**3), 2)} GB",
        "Disk Total": f"{round(psutil.disk_usage('/').total / (1024**3), 2)} GB",
        "Disk Free": f"{round(psutil.disk_usage('/').free / (1024**3), 2)} GB"
    }

def save_to_txt(data, filename="visitor_specs.txt"):
    with open(filename, "a") as f:
        for k, v in data.items():
            f.write(f"{k}: {v}\n")
        f.write("-" * 40 + "\n")

if __name__ == "__main__":
    save_to_txt(get_specs())
