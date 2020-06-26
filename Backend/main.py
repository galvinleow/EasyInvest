# Initializing elasticseach

from datetime import datetime

from elasticsearch import Elasticsearch

from method import esMethod

# Connect to elasticseach
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# Flask Playground
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = 'secret'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Create Database Indices upon first app launch
try:
    es.indices.create('user')
    print("[user] indices created")
except:
    if es.indices.exists('user'):
        print("[user] mapping already exists")
    else:
        print("Error - Failed to create indices")

try:
    es.indices.create('asset')
    print("[asset] indices created")
except:
    if es.indices.exists('asset'):
        print("[asset] mapping already exists")
    else:
        print("Error - Failed to create indices")


# Read file from path with filename and return string
def open_file(path):
    with open(path, 'r') as file:
        string_file = file.read()
        return string_file


# Start up of the flask backend
@app.route("/", methods=["GET", "POST"])
def start_up():
    print("Backend up and running")
    return "Backend up and running"


# Create indices with input string index, ?index={value}
@app.route("/createIndices/<index>", methods=["POST"])
def create_indices(index):
    # index = request.args.get("index")
    return esMethod.create_new_indices(client=es, index=index)


# Delete indices with input string index, ?index={value}
@app.route("/deleteIndices/<index>", methods=["POST"])
def delete_indices(index):
    # index = request.args.get("index")
    return esMethod.delete_indices(client=es, index=index)


# Register user
@app.route('/register', methods=['POST'])
def register():
    user_name = request.get_json()["username"]
    email = request.get_json()["email"]
    password = bcrypt.generate_password_hash(request.get_json()["password"]).decode("utf-8")
    created = datetime.now()
    arg_dict = {"username": user_name}
    hit = esMethod.search_exact_docs(client=es, index="user", arg_dict=arg_dict)
    if len(hit) == 0:
        json_data = {
            "email": email,
            "password": password,
            "created": created
        }
        json_data.update(arg_dict)
        return esMethod.create_without_uuid(client=es, index="user", json_data=json_data)
    else:
        return "Username already exist"


# Login user
@app.route('/login', methods=['POST'])
def login():
    user_name = request.get_json()["username"]
    password = request.get_json()["password"]
    result = ""
    arg_dict = {
        "username": user_name
    }
    hits = esMethod.search_exact_docs(client=es, index="user", arg_dict=arg_dict)
    if (len(hits) == 0):
        return("Error - Username not found")
    else:
        body = hits[0]["body"]
        to_check_password = body["password"]
        if bcrypt.check_password_hash(to_check_password, password):
            access_token = create_access_token(identity={"email": body["email"], "uuid": hits[0]["uuid"]})
            result = jsonify({"token": access_token})
            return result
        else:
            return "Error - Invalid username and password"


# # Insert data for input json into indices, single entry json ?index={value}
# @app.route('/createUser', methods=['POST'])
# def create_user():
#     json_data = request.json
#     return esMethod.create_without_uuid(client=es, index="user", json_data=json_data)


# Get all data from indices
@app.route('/getAllFromIndices/<index>', methods=['GET'])
def match_all_from_indices(index):
    # index = request.args.get("index")
    return jsonify(esMethod.match_all_from_indices(client=es, index=index))


# Get all data using UUID
@app.route('/getDataFromUUID/<index>/<uuid>', methods=['GET'])
def get_data_from_uuid(index, uuid):
    # index = request.args.get("index")
    # uuid = request.args.get("uuid")
    try:
        return es.get(index=index, doc_type="_doc", id=uuid)["_source"]
    except:
        return ("Error - No data found")


# Insert asset into database, with json body
@app.route('/addAsset/<user_uuid>', methods=['POST'])
def add_asset(user_uuid):
    # user_uuid = request.args.get("user_uuid")
    json_data = request.json
    return esMethod.add_asset(client=es, index="asset", json_data=json_data, user_uuid=user_uuid)


# Insert asset from database, with json body
@app.route('/deleteAsset/<user_uuid>', methods=['POST'])
def delete_asset(user_uuid):
    # user_uuid = request.args.get("user_uuid")
    json_data = request.json
    return esMethod.delete_asset(client=es, index="asset", json_data=json_data, user_uuid=user_uuid)


# Update asset from database, with json body
@app.route('/updateAsset/<user_uuid>', methods=['POST'])
def update_asset(user_uuid):
    # user_uuid = request.args.get("user_uuid")
    json_data = request.json
    return esMethod.update_asset(client=es, index="asset", json_data=json_data, user_uuid=user_uuid)


# Retrieve 1 year of history, does not update in database
@app.route('/displayHistoryData/<user_uuid>', methods=['GET'])
def display_history_data(user_uuid):
    # user_uuid = request.args.get("user_uuid")
    return esMethod.display_history_data(client=es, index="asset", user_uuid=user_uuid)


# Retrieve 1 year of history and 4 year of project value
@app.route('/calculateProjected/<user_uuid>', methods=['GET'])
def calculate_projected(user_uuid):
    # user_uuid = request.args.get("user_uuid")
    return esMethod.calculate_projected(client=es, user_uuid=user_uuid)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5200)
