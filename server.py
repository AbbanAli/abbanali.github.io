from flask import Flask, send_from_directory
from log_specs import get_specs, save_to_txt

app = Flask(__name__, static_folder="website")

@app.route("/")
def serve_index():
    save_to_txt(get_specs())
    return send_from_directory("website", "index.html")

if __name__ == "__main__":
    app.run(port=5000)
