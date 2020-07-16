import platform
import uuid
from datetime import *
from itertools import chain

from elasticsearch_dsl import Search

from method import shares


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
def delete_indices(client, index):
    try:
        client.indices.delete(index)
        return "Deleted Indices: [" + index + "]"
    except:
        if client.indices.exists(index):
            return "Error - Fail to create indices: [" + index + "]"
        else:
            return "Error - Indices does not exisit: [" + index + "]"


# Index single entry json without defining UUID, must be in a list
def create_without_uuid(client, index, json_data):
    client.index(index=index, doc_type="_doc", body=json_data, refresh=True)
    return "Index jsonArray for Indices: [" + index + "]"


def format_response(response):
    response_list = []
    for hit in response.hits:
        hits_dict = {}
        hit_uuid = hit.meta.id
        hit_body = hit.to_dict()
        hits_dict['uuid'] = hit_uuid
        hits_dict['body'] = hit_body
        response_list.append(hits_dict)
    return response_list


# Get all data from indices
def match_all_from_indices(client, index):
    try:
        s = Search()[0:9999].using(client).index(index).query("match_all")
        response = s.execute()
        response_list = format_response(response)

        if len(response_list) == 0:
            return "Error - SearchError: No match found"
        else:
            return response_list
    except:
        raise Exception('Error - SearchError: Invalid Syntax / Indices')


def search_exact_docs(client, index, arg_dict):
    try:
        s = Search()[0:9999].using(client).index(index).filter('term', **arg_dict)
        response = s.execute()
        hits_list = format_response(response)

        if len(hits_list) == 0:
            print('SearchError: No match found ')
            return hits_list
        else:
            return hits_list

    except:
        raise Exception('SearchError: Invalid Search')


# Index single entry json with defining UUID
def create_with_uuid(client, index, json_data, uuid):
    client.index(index=index, doc_type="_doc", id=uuid, body=json_data, refresh=True)
    return "Index jsonArray using UUID for Indices: [" + index + "] & [" + uuid + "]"


def get_days_in_a_month(month, year):
    if month == 9 or month == 4 or month == 6 or month == 11:  # 30 day months
        return 30
    elif month == 2 and year % 4 == 0:  # leap year
        return 29
    elif month == 2:
        return 28
    else:
        return 31


def convert_full_date_to_month_year(date):
    str_month_year = str(date.month) + "/" + str(date.year)
    return datetime.strptime(str_month_year, "%m/%Y")


def json_key_upper_case(json):
    upper_case = {}
    for element in json:
        upper_case[element] = json[element].upper()
    return upper_case


################################### Start of Asset Overview Method #####################################

# Add asset to existing user with asset by using the UUID
def add_asset(client, index, json_data, user_uuid):
    s = Search().using(client).index(index).query("match", _id=user_uuid)
    response = s.execute()
    if len(response.hits) > 0:
        # Should only be 1 result cause search by UUID
        for hit in response.hits:
            # Get the asset list
            asset_list = hit.to_dict()["asset"]

        to_insert = json_data["asset"]
        for element in to_insert:
            # Create UUID for asset
            asset_uuid = {"uuid": str(uuid.uuid1())}
            # Append uuid to asset
            element.update(asset_uuid)
            # Add the asset to be stored in new list
            asset_list.append(element)

        doc_update = {
            "doc": {
            }
        }
        doc_update['doc']['asset'] = asset_list
        client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
        return "Added Asset with UUID tag: [" + index + "] & [" + user_uuid + "]"
    else:
        to_insert = json_data["asset"]
        update_list = []
        for element in to_insert:
            # Create UUID for asset
            asset_uuid = {"uuid": str(uuid.uuid1())}
            # Append uuid to asset
            element.update(asset_uuid)
            # Add the asset to be stored in new list
            update_list.append(element)
        json_data["asset"] = update_list
        create_with_uuid(client=client, index=index, json_data=json_data, uuid=user_uuid)
        # create_with_uuid(client=client, index=index, json_data=e, uuid)
        return "Created and Added Asset with UUID tag: [" + index + "] & [" + user_uuid + "]"


# Delete asset to existing user with asset by using the UUID
def delete_asset(client, index, json_data, user_uuid):
    # Get the doc that store the asset data using UUID
    data = client.get(index=index, doc_type="_doc", id=user_uuid)["_source"]
    # Get the asset list
    asset_list = data["asset"]

    to_delete = json_data["asset"]

    # Delete asset using uuid
    for element in to_delete:
        for asset in asset_list:
            if asset["uuid"] == element["uuid"]:
                asset_list.remove(asset)
                to_delete.pop()

    if len(to_delete) > 0:
        return "Error - Fail Delete Asset UUID (Asset does not exist): [" + index + "] index of UUID [" + user_uuid + "]"

    doc_update = {
        "doc": {
        }
    }
    doc_update['doc']['asset'] = asset_list
    print(doc_update)
    client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
    return "Delete Asset with UUID: [" + index + "] index of UUID [" + user_uuid + "]"


# Update asset, amount field can only be updated with 1 element.
def update_asset(client, index, json_data, user_uuid):
    today = date.today()
    # Today month/year datetime
    str_today_month_year = str(today.month) + "/" + str(today.year)
    today_month_year = datetime.strptime(str_today_month_year, "%m/%Y")
    # 1 year ago Today month/year datetime
    str_today_minus1year_month_year = str(today.month) + "/" + str(today.year - 1)
    today_minus1year_month_year = datetime.strptime(str_today_minus1year_month_year, "%m/%Y")

    # Get the doc that store the asset data using UUID
    data = client.get(index=index, doc_type="_doc", id=user_uuid)["_source"]
    # Get the asset list
    asset_list = data["asset"]
    # Get asset to be updated
    to_update = json_data["asset"][0]
    to_update_uuid = to_update["uuid"]
    to_update_amount = to_update["amount"][0]

    # Get datetime in need to update to compare with today datetime
    to_update_amount_date = datetime.strptime(to_update_amount["date"], "%d/%m/%Y").date()
    str_update_date_month_year = str(to_update_amount_date.month) + "/" + str(to_update_amount_date.year)
    to_update_amount_date_month_year = datetime.strptime(str_update_date_month_year, "%m/%Y")
    isUpdated = False

    def myFunc(e):
        return e["date"]

    # Check if within 1 year from today
    if today_minus1year_month_year <= to_update_amount_date_month_year <= today_month_year:
        for element in asset_list:
            # Get the correct element to update
            if element["uuid"] == to_update_uuid:
                element_amount = element["amount"]
                isUpdated = True
                new_list = []
                for amount in element_amount:
                    # Get datetime in database to compare with today datetime
                    amount_date = datetime.strptime(amount["date"], "%d/%m/%Y").date()
                    str_date_month_year = str(amount_date.month) + "/" + str(amount_date.year)
                    date_month_year = datetime.strptime(str_date_month_year, "%m/%Y")

                    if today_minus1year_month_year <= date_month_year <= today_month_year:
                        if date_month_year == to_update_amount_date_month_year:
                            new_list.append(to_update["amount"].pop())
                        else:
                            new_list.append(amount)
                    else:
                        print("Error - Invalid update as Datetime is out of range")
                if len(to_update["amount"]) > 0:
                    for item in to_update["amount"]:
                        new_list.append(item)
                        to_update["amount"].pop()
                new_list.sort(reverse=True, key=myFunc)
                to_update["amount"] = new_list
                asset_list.remove(element)
                asset_list.append(json_data["asset"][0])
        if isUpdated:
            doc_update = {
                "doc": {
                }
            }
            doc_update['doc']['asset'] = asset_list
            client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
            return "Updated Asset with UUID: [" + index + "] index of UUID [" + user_uuid + "]"
        else:
            return "Error - Asset Not Found"
    else:
        return "Error - Invalid update as Datetime is out of range"


# Get 1 year of history, does not update database
def display_history_data(client, index, user_uuid):
    try:
        response = client.get(index=index, doc_type="_doc", id=user_uuid)["_source"]
    except:
        return "Error - No data found"

    asset_list = response["asset"]
    for asset in asset_list:
        amount_list = asset["amount"]
        amount_list.sort(key=lambda element: datetime.strptime(element["date"], "%d/%m/%Y").date())
        asset["amount"] = display_history_helper(amount_list)

    return response


def display_history_helper(amount_list):
    today = date.today()
    # Today month/year datetime
    str_today_month_year = str(today.month) + "/" + str(today.year)
    today_month_year = datetime.strptime(str_today_month_year, "%m/%Y")
    # 1 year ago Today month/year datetime
    one_year_ago = today - timedelta(days=334)
    str_one_year_ago_month_date = str(one_year_ago.month) + "/" + str(one_year_ago.year)
    one_year_ago_month_date = datetime.strptime(str_one_year_ago_month_date, "%m/%Y")

    last_item_date = datetime.strptime(amount_list[len(amount_list) - 1]['date'], "%d/%m/%Y").date()

    result = []
    if convert_full_date_to_month_year(last_item_date) < one_year_ago_month_date:
        month = one_year_ago_month_date.month
        year = one_year_ago_month_date.year
        value = amount_list[len(amount_list) - 1]["value"]
        for i in range(0, 12):
            curr = "01/" + month + "/" + year
            json = {
                "value": value,
                "date": curr
            }
            result.append(json)
            if month == 12:
                month = 1
                year = year + 1
            else:
                month = month + 1
        return result
    else:
        position_arr = 0
        element = amount_list[position_arr]
        position_date = one_year_ago_month_date
        value = "0"
        for i in range(0, 12):
            element_date = datetime.strptime(element["date"], "%d/%m/%Y").date()
            element_date_month_year = convert_full_date_to_month_year(element_date)
            if position_date < element_date_month_year:
                json = {
                    "date": datetime.strftime(position_date, "%d/%m/%Y"),
                    "value": value
                }
                result.append(json)
                next_period = get_days_in_a_month(position_date.month, position_date.year)
                position_date = position_date + timedelta(days=next_period)
            elif position_date == element_date_month_year:
                result.append(element)
                value = element["value"]
                position_arr = position_arr + 1
                if position_arr < len(amount_list):
                    element = amount_list[position_arr]
                next_period = get_days_in_a_month(position_date.month, position_date.year)
                position_date = position_date + timedelta(days=next_period)
            else:
                json = {
                    "date": datetime.strftime(position_date, "%d/%m/%Y"),
                    "value": value
                }
                result.append(json)
                next_period = get_days_in_a_month(position_date.month, position_date.year)
                position_date = position_date + timedelta(days=next_period)
    return result


# Get 1 year of history and 4 years of projected value, does not update database
def calculate_projected(client, user_uuid):
    history_data = display_history_data(client=client, index="asset", user_uuid=user_uuid)
    asset_list = history_data["asset"]
    for asset in asset_list:
        amount_list = asset["amount"]
        amount_list.sort(key=lambda element: datetime.strptime(element["date"], "%d/%m/%Y").date())
        latest = amount_list[len(amount_list) - 1]
        curr = convert_full_date_to_month_year(datetime.strptime(latest["date"], "%d/%m/%Y").date())
        four_year_later = curr + timedelta(days=365 * 4)
        project_list = []
        period = 1
        while curr <= four_year_later:
            days_to_add = get_days_in_a_month(curr.month, curr.year)
            curr = curr + timedelta(days_to_add)
            value = format(float(latest["value"]) * pow((1 + ((float(asset["rate"]) / 100) / 12)), 12 * (period / 12)),
                           '.2f')
            json = {
                "date": datetime.strftime(curr, "%d/%m/%Y"),
                "value": value
            }
            project_list.append(json)
            period = period + 1
        result = list(chain(amount_list, project_list))
        asset["amount"] = result
    return history_data


################################### Start of Investment Analysis Method #####################################
def add_edit_rank(client, index, json_data, user_uuid):
    s = Search().using(client).index(index).query("match", _id=user_uuid)
    response = s.execute()
    if len(response.hits) > 0:
        doc_update = {"doc": {
        }, 'doc': json_data}
        client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
        return "Added/Edited Rank with UUID tag: [" + index + "] & [" + user_uuid + "]"
    else:
        create_with_uuid(client=client, index=index, json_data=json_data, uuid=user_uuid)
        return "Created and Added Rank with UUID tag: [" + index + "] & [" + user_uuid + "]"


def add_watchlist(client, index, ticker, user_uuid):
    if shares.if_ticker_exist(ticker.upper()):
        s = Search().using(client).index(index).query("match", _id=user_uuid)
        response = s.execute()
        if len(response.hits) > 0:
            for hit in response.hits:
                watchlist_arr = hit.to_dict()[index]
            if ticker.upper() in watchlist_arr:
                return "Error - Ticker already exist in watchlist: [" + index + "] & [" + user_uuid + "]"
            else:
                watchlist_arr.append(ticker.upper())
                doc_update = {
                    "doc": {
                    }
                }
                doc_update['doc'][index] = watchlist_arr
                client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
                return "Added Watchlist with UUID tag: [" + index + "] & [" + user_uuid + "]"
        else:
            json_data = {index: [ticker]}
            create_with_uuid(client=client, index=index, json_data=json_data, uuid=user_uuid)
            return "Created Watchlist with UUID tag: [" + index + "] & [" + user_uuid + "]"
    else:
        return "Error - Currently do not support this ticker"


def delete_watchlist(client, index, ticker, user_uuid):
    s = Search().using(client).index(index).query("match", _id=user_uuid)
    response = s.execute()
    if len(response.hits) > 0:
        for hit in response.hits:
            watchlist_arr = hit.to_dict()[index]
        if ticker.upper() in watchlist_arr:
            watchlist_arr.remove(ticker.upper())
        else:
            return "Error - Fail Delete Ticker UUID: [" + index + "] index of UUID [" + user_uuid + "]"
        doc_update = {
            "doc": {
            }
        }
        doc_update['doc'][index] = watchlist_arr
        client.update(index=index, doc_type='_doc', id=user_uuid, body=doc_update, refresh=True)
        return "Delete Watchlist with UUID tag: [" + index + "] & [" + user_uuid + "]"
    else:
        return "Error - Fail Delete Watchlist UUID (Watchlist does not exist): [" + index + "] index of UUID [" + user_uuid + "]"


def helper(client, index, user_uuid):
    s = Search().using(client).index(index).query("match", _id=user_uuid)
    response = s.execute()
    if len(response.hits) > 0:
        for hit in response.hits:
            result = hit.to_dict()
        return result
    else:
        return "Error - Fail to retrieve data"


def get_score_with_rank(client, user_uuid):
    rank_result = helper(client, "rank", user_uuid)
    watchlist_result = helper(client, "watchlist", user_uuid)
    if type(rank_result) == str:
        return "Error - Fail to Get Score (rank) UUID: index of UUID [" + user_uuid + "]"
    elif type(watchlist_result) == str:
        return "Error - Fail to Get Score (watchlist) UUID: index of UUID [" + user_uuid + "]"
    else:
        rank_data = rank_result["rank"][0]
        watchlist_arr = watchlist_result["watchlist"]
        result = {"watchlist": []}
        for ticker in watchlist_arr:
            indiv_score = shares.get_individual_stock_score(ticker)
            if indiv_score == "Error - Currently do not support this ticker: " + ticker:
                return indiv_score
            else:
                result_score = {}
                total_score = 0
                total_weightage = 0
                for (k, v) in rank_data.items():
                    if k == "CURRENT RATIO":
                        if "bank" in indiv_score["INDUSTRY"].lower():
                            continue
                    print(indiv_score)
                    share_score = indiv_score[k]
                    calculated = float(v) * share_score
                    indiv_score[k + " SCORE"] = calculated
                    total_score += calculated
                    total_weightage += float(v)
                indiv_score["TOTAL SCORE %"] = total_score / (total_weightage * 5) * 100
                indiv_score["SCORE LIMIT"] = total_weightage * 5
                result["watchlist"].append(indiv_score)
        return result


def get_financial_data(client, user_uuid):
    watchlist_result = helper(client, "watchlist", user_uuid)
    if type(watchlist_result) == str:
        return "Error - Fail to Get Score (watchlist) UUID: index of UUID [" + user_uuid + "]"
    else:
        today = date.today()
        # Today month/year datetime
        str_today = str(today.year) + "_" + today.strftime("%m") + "_" + str(today.day)
        if platform.system() != "Windows":
            data = shares.read_financial_data_file("../Crawler/data/final/Final_" + str_today + ".json")
        else:
            data = shares.read_financial_data_file("..\\Crawler\\data\\final\\Final_" + str_today + ".json")
        if data == "Error - Could not find file":
            return data
        else:
            watchlist_arr = watchlist_result["watchlist"]
            result_arr = []
            for ticker in watchlist_arr:
                result = data[ticker.upper()]
                result["TICKER"] = ticker.upper()
                result_arr.append(result)
    return {"data": (result_arr)}
