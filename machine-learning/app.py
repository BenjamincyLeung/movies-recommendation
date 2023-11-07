from flask import Flask, jsonify
from numpy import number
from recommendation_models import get_movie_recommendation

app = Flask(__name__)


@app.route('/api/recommendation/<int:fid>', methods=["GET"])
def api(fid=number):
    print(fid)
    target = get_movie_recommendation(fid)
    print("Step 3: ", jsonify(target))
    return jsonify(target)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
