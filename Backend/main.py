# Initializing elasticseach
from elasticsearch import Elasticsearch

from method import esMethod

# Connect to elasticseach
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# Flask Playground
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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
@app.route("/createIndices", methods=["POST"])
def create_indices():
    index = request.args.get("index")
    return esMethod.create_new_indices(client=es, index=index)


# Delete indices with input string index, ?index={value}
@app.route("/deleteIndices", methods=["POST"])
def delete_indices():
    index = request.args.get("index")
    return esMethod.delete_indice(client=es, index=index)


# Insert data for input json into indices, single entry json ?index={value}
@app.route('/createUser', methods=['POST'])
def create_user():
    json_data = request.json
    return esMethod.create_without_uuid(client=es, index="user", json_data=json_data)


# Get all data from indices
@app.route('/getAllFromIndices', methods=['GET'])
def match_all_from_indices():
    index = request.args.get("index")
    return jsonify(esMethod.match_all_from_indices(client=es, index=index))


# Get all data using UUID
@app.route('/getDataFromUUID', methods=['GET'])
def get_data_from_uuid():
    index = request.args.get("index")
    uuid = request.args.get("uuid")
    try:
        return es.get(index=index, doc_type="_doc", id=uuid)["_source"]
    except:
        return ("Error - No data found")

# Insert asset into database, ?uuid={value} with json body
@app.route('/addAsset', methods=['POST'])
def add_asset():
    uuid = request.args.get("uuid")
    json_data = request.json
    return esMethod.add_asset(client=es, index="asset", json_data=json_data,uuid=uuid)

# Insert asset from database, ?uuid={value} with json body
@app.route('/deleteAsset', methods=['POST'])
def delete_asset():
    uuid = request.args.get("uuid")
    json_data = request.json
    return esMethod.delete_asset(client=es, index="asset", json_data=json_data,uuid=uuid)

# @app.route('/calculateProjected', methods=['GET'])
# def calculate_projected():
#     uuid = request.args.get("uuid")
#     requested_asset = request.args.get("asset")
#     asset_list = es.get(index="asset", doc_type="_doc", id=uuid)["_source"]["asset"]
#     projected_list = []
#     for asset in asset_list:
#         if asset["name"] == requested_asset:
#             rate = float(asset["rate"])
#             amount = float(asset["amount"])
#             for x in range (1, 13):
#                 projected = amount * pow((1 +  ((rate / 100) / 12)), 12 * (x/12))
#                 print(projected)
            
            
#     return "ok"




# Put mapping for indices with input string index 
# @app.route("/putMapping", methods=["POST"])
# def putMapping():
#     index = request.args.get("index")
#     mapping = openFile("mapping/mapping" + index + ".json")
#     return esMethod.addMapping(es, index, json.dumps(mapping))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5200)