import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = Flask(__name__)
CORS(app)

BASE_URL = os.getenv("NEXT_PUBLIC_API_BASE_URL")


def forward(path, method, params=None, json=None):
    url = f"{BASE_URL}/{path}"
    resp = requests.request(method, url, params=params, json=json)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/Login", methods=["POST"])
def login():
    return forward("Login", "POST", json=request.get_json())


@app.route("/GetAllUsers", methods=["GET"])
def get_all_users():
    return forward("GetAllUsers", "GET", params=request.args)


@app.route("/users/create", methods=["POST"])
def create_user():
    return forward("users/create", "POST", json=request.get_json())


if __name__ == "__main__":
    app.run(port=5001, debug=True, use_reloader=False)
