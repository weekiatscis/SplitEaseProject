import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = Flask(__name__)
CORS(app)

BASE_URL = os.getenv("NEXT_PUBLIC_GROUP_API_BASE_URL")


def forward(path, method, params=None, json=None):
    url = f"{BASE_URL}/{path}"
    resp = requests.request(method, url, params=params, json=json)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/GetGroupsByUser", methods=["GET"])
def get_groups_by_user():
    return forward("GetGroupsByUser", "GET", params=request.args)


@app.route("/GetGroup", methods=["GET"])
def get_group():
    return forward("GetGroup", "GET", params=request.args)


@app.route("/GetGroupMember", methods=["GET"])
def get_group_member():
    return forward("GetGroupMember", "GET", params=request.args)


@app.route("/groups/create", methods=["POST"])
def create_group():
    return forward("groups/create", "POST", json=request.get_json())


@app.route("/groups/addMember", methods=["POST"])
def add_member():
    return forward("groups/addMember", "POST", json=request.get_json())


@app.route("/UpdateGroup", methods=["PUT"])
def update_group():
    return forward("UpdateGroup", "PUT", json=request.get_json())


@app.route("/DeleteGroup", methods=["DELETE"])
def delete_group():
    return forward("DeleteGroup", "DELETE", params=request.args)


@app.route("/DeleteGroupMember", methods=["DELETE"])
def delete_group_member():
    return forward("DeleteGroupMember", "DELETE", json=request.get_json())


if __name__ == "__main__":
    app.run(port=5002, debug=True)
