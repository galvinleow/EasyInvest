from elasticsearch_dsl import Search


# Create new indices
def create_new_indices(client, index):
    try:
        client.indices.create(index)
        return "Create Indices: [" + index + "]"
    except:
        if client.indices.exists(index):
            return "Error - Already Created: [" + index + "]"
        else:
            return "Error - Fail to create indices: [" + index + "]"


# Delete indices
def delete_indice(client, index):
    try:
        client.indices.delete(index)
        return "Deleted Indices: [" + index + "]"
    except:
        if client.indices.exists(index):
            return "Error - Fail to create indices: [" + index + "]"
        else:
            return "Error - Indices does not exisit: [" + index + "]"


# Index jsonArray without defining UUID, must be in a list
def create_without_uuid(client, index, json_data):
    for element in json_data:
        client.index(index=index, doc_type="_doc", body=element, refresh=True)
    return "Index jsonArray for Indices: [" + index + "]"

# Index jsonArray with defining UUID
def create_with_uuid(client, index, json_data, uuid):
    client.index(index=index, doc_type="_doc",id=uuid, body=json_data, refresh=True)
    return "Index jsonArray using UUID for Indices: [" + index + "] & [" + uuid + "]"


# Get all data from indices
def match_all_from_indices(client, index):
    try:
        s = Search()[0:9999].using(client).index(index).query("match_all")
        response = s.execute()
        response_list = []

        for hit in response.hits:
            hits_dict = {}
            hit_uuid = hit.meta.id
            hit_body = hit.to_dict()
            hits_dict['uuid'] = hit_uuid
            hits_dict['body'] = hit_body
            response_list.append(hits_dict)

        if len(response_list) == 0:
            return "Error - SearchError: No match found"
        else:
            return response_list
    except:
        raise Exception('Error - SearchError: Invalid Syntax / Indices')

# Add asset to existing user with asset by using the UUID
def add_asset(client, index, json_data, uuid):
        # Get the doc that store the asset data using UUID
        data = client.get(index=index, doc_type="_doc", id=uuid)["_source"]
        # Get the asset list
        asset_list = data["asset"]
        # Get the list that is needed to insert
        to_insert = json_data["asset"]

        # Add the asset to be stored in new list
        for element in to_insert:
            asset_list.append(element)
        
        doc_update = {
            "doc": {
            }
        }
        doc_update['doc']['asset'] = asset_list
        client.update(index=index, doc_type='_doc', id=uuid, body=doc_update, refresh=True)
        return "Asset Added with UUID tag: [" + index + "] & [" + uuid + "]"

# Delete asset to existing user with asset by using the UUID
def delete_asset(client, index, json_data, uuid):
        # Get the doc that store the asset data using UUID
        data = client.get(index=index, doc_type="_doc", id=uuid)["_source"]
        # Get the asset list
        asset_list = data["asset"]
        # Get the list that is needed to insert
        to_delete = json_data["asset"]

        # Add the asset to be stored in new list
        for element in to_delete:
            if asset_list.count(element) > 0:
                asset_list.remove(element)
        
        doc_update = {
            "doc": {
            }
        }
        doc_update['doc']['asset'] = asset_list
        client.update(index=index, doc_type='_doc', id=uuid, body=doc_update, refresh=True)
        return "Delete Asset with UUID: [" + index + "] index of UUID [" + uuid + "]"

# Put mapping for indices
# def addMapping(client, indices, mapping):
#     try:
#         print(indices)
#         print(type(mapping))
#         resp=client.indices.put.mapping(
#             index=indices,
#             body=mapping,
#         )
#         print(resp)
#         return "[" + indices + "] mapping done"
#     except:
#         if client.indices.exists(indices):
#             return "Fail to put mapping at [" + indices + "] indices"
#         else: 
#             return "[" + indices + "] does not exist"
