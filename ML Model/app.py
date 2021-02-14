from flask import Flask, request, jsonify

import json as json
from flask_cors import CORS, cross_origin

import warnings
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
from collections import Counter
from array import array
import os
from PIL import Image
import sys
import time
from decouple import config

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route('/uploader', methods=['POST'])
def upload():

    subscription_key = config('COMPUTER_VISION_SUBSCRIPTION_KEY')
    endpoint = config('COMPUTER_VISION_ENDPOINT')
    l = []
    computervision_client = ComputerVisionClient(
        endpoint, CognitiveServicesCredentials(subscription_key))

    print("===== Detect Brands - remote =====")
    # Get a URL with a brand logo
    remote_image_url = request.form.get('query')
    # Select the visual feature(s) you want
    remote_image_features = ["brands"]
    # Call API with URL and features
    detect_brands_results_remote = computervision_client.analyze_image(
        remote_image_url, remote_image_features)

    print("Detecting brands in remote image: ")
    if len(detect_brands_results_remote.brands) == 0:
        print("No brands detected.")
    else:
        for brand in detect_brands_results_remote.brands:
            l.append(brand.name)

    print(l)
    print(len(l))
    total_items = len(l)
    item_count = dict(Counter(l))
    count_item = item_count.copy()

    for k, v in item_count.items():
        item_count[k] = (v/len(l))*100

    print(item_count)
    return {
        "Percentage": item_count,
        "Total Count": count_item
    }


if __name__ == '__main__':
    app.run(debug=True)
