from flask import Flask
from markupsafe import escape

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Yo we're at the main page you can click things here!</p>"

@app.route("/thing1")
def firstthing():
    return "<p>You found a thing.<p>"

@app.route("/camera")
def cam():
    with open("static/cam.html") as x:
        return x.read()
