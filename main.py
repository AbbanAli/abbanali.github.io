from flask import Flask, request, jsonify
from datetime import datetime
import hashlib
import json
import os

app = Flask(__name__)

LOG_FILE = "visitors.json"

# Load previous visitors
if os.path.exists(LOG_FILE):
    with open(LOG_FILE, "r") as f:
        visitors = json.load(f)
else:
    visitors = {}

def anonymize_ip(ip):
    # Hash the IP for privacy
    return hashlib.sha256(ip.encode()).hexdigest()

@app.route("/")
def index():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    ua = request.headers.get("User-Agent", "Unknown")

    visitor_id = anonymize_ip(ip)
    timestamp = datetime.utcnow().isoformat()

    # Update log
    visitors[visitor_id] = {
        "user_agent": ua,
        "last_seen": timestamp
    }

    with open(LOG_FILE, "w") as f:
        json.dump(visitors, f, indent=2)

    return "Welcome back, traveler. The stars remember you."

@app.route("/")
def index():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    ua = request.headers.get("User-Agent", "Unknown")
    timestamp = datetime.now().isoformat()

    visitor = {
        "id": anonymize_ip(ip),
        "timestamp": timestamp,
        "user_agent": ua
    }

    visitors.append(visitor)

    # 💾 Save to file!
    with open(LOG_FILE, "w") as f:
        json.dump(visitors, f, indent=2)

    return "Welcome, traveler. Your echo has been logged."
