from flask import Flask, jsonify, request, abort
import json
from utils import add_datapoint, get_user_from_finger, check_email_exist, delete_email, reset_database, get_alldata

application = Flask(__name__)

@application.route('/')
def homepage():
    return "RESTFUL API for FingerVein Running ver-003"

@application.route('/enroll', methods=['POST'])
def enroll():
    if not request.json or "first" not in request.json \
                        or "last" not in request.json \
                        or "email" not in request.json \
                        or "fingertemplate" not in request.json \
                        or "fingerverificationtemplate" not in request.json:
        return jsonify({"statuscode" : 400,
                        "description" : "No / Incomplete data given for enrollment"}), 400
    
    new_user = {
        "first" : request.json["first"],
        "last" : request.json["last"],
        "email" : request.json["email"],
        "fingertemplate" : request.json["fingertemplate"],
        "fingerverificationtemplate" : request.json["fingerverificationtemplate"]
    }
    if not add_datapoint(new_user):
        return jsonify({"statuscode" : -1,
                        "description" : "User already exists"}), 200
    return jsonify({"statuscode" : 0,
                    "description" : "User successfully added"}), 200

@application.route('/authenticate', methods=['POST'])
def authentication():
    if not request.json or "fingertemplate" not in request.json:
        return jsonify({"statuscode" : 400,
                        "description" : "No finger template provided"}), 400
    
    fingercode = request.json["fingertemplate"]
    response, responsedata = get_user_from_finger(fingercode)
    if response == -1:
        return jsonify({"statuscode" : -1,
                        "description" : "Finger template not authenticated"}), 200
    return jsonify({"statuscode" : 0,
                    "description" : "User authenticated",
                    "data" : responsedata}), 200

@application.route('/checkexists', methods=['POST'])
def checkexists():
    if not request.json or "email" not in request.json:
        return jsonify({"statuscode" : 400,
                        "description" : "No email provided"}), 400

    email = request.json["email"]
    response = check_email_exist(email)
    if response:
        return jsonify({"statuscode" : 0,
                        "description" : "User with this email exists"}), 200
    return jsonify({"statuscode" : -1,
                    "description" : "User with this email does not exist"}), 200

@application.route('/delete', methods=['POST'])
def delete():
    if not request.json or "email" not in request.json:
        return jsonify({"statuscode" : 400,
                        "description" : "No email provided"}), 400

    email = request.json["email"]
    response = delete_email(email)
    if response:
        return jsonify({"statuscode" : 0,
                        "description" : str(response) + " record(s) deleted"}), 200
    return jsonify({"statuscode" : -1,
                    "description" : "No entry found with the given email"}), 200

@application.route('/reset', methods=['GET'])
def reset():
    response = reset_database()
    return jsonify({"statuscode" : 0,
                    "description" : str(response) + " (ALL) record(s) deleted"}), 200

@application.route('/returndata', methods=['GET'])
def returndata():
    data = get_alldata()
    return jsonify({"statuscode" : 0,
                    "description" : "All data returned",
                    "data" : data}), 200

if __name__ == '__main__':
    application.run(host="0.0.0.0", port=80)