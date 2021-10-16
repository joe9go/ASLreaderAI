from flask import Flask
from markupsafe import escape

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Main page</p>"

@app.route("/camera")
def cam():
    with open("static/cam.html") as x:
        return x.read()
