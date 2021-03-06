from flask import Flask
from flask.json import jsonify
from model import Model
from flask import request

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Main page</p>"

@app.route("/mic")
def cam():
    with open("static/mic.html") as x:
        return x.read()

@app.route("/predict", methods = ['POST'])
def predict_emo():
    if request.method == 'POST':
        x = request.json['textdata']
        prd = model.predict(x)
        return jsonify(result = str(prd))

if __name__ == "__main__":
    model = Model()
    app.run(debug = True)



