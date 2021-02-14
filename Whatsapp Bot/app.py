from flask import Flask, render_template, url_for, request, jsonify

import requests
from twilio.twiml.messaging_response import MessagingResponse
import json
import numpy as np
app = Flask(__name__)


@app.route("/")
def home():

    return jsonify({"message": "Hello World"})


@app.route("/message", methods=['POST'])
def determine():

    symp = []
    p = ['hi', 'hey', 'hola', 'heya', 'howdy', 'hello', 'heyy', 'hey', 'hi']
    x = request.form.get('Body')
    if x.lower() in p:
        txt = "Hello There!😁"
        resp = MessagingResponse()
        resp.message(txt)
        return str(resp)

    else:
        l = x.split(" ")

        print(l)

        url = "https://spit-hack.herokuapp.com/api/analytics/getLatestAnalytics"
        s = ' '.join(l[2:])
        print(s)
        payload = {
            "companyName": l[1],
            "outlets": s
        }
        payload = json.dumps(payload)
        payload = str(payload)
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        res = json.loads(response.text)
        mcc = res['mycompanyCount']
        occ = res['othercompanyCount']
        image = res['video']

        Final = f'{l[1]} -- Count ---> {mcc}\n Other Company -- Count --->{occ}\n Latest Image --->{image}'
        print(Final)
        resp = MessagingResponse()
        resp.message(Final)

        return str(resp)


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
