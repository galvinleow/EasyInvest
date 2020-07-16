import json
import platform
from datetime import *

# Max score for the formula
max_score = 5.0
# Today month/year datetime
today = date.today()
str_today = str(today.year) + "_" + today.strftime("%m") + "_" + str(today.day)
if platform.system() != "Windows":
    data_shares_path = "../Crawler/data/final/Final_" + str_today + ".json"
else:
    data_shares_path = "..\\Crawler\\data\\final\\Final_" + str_today + ".json"


# Get data from crawler file
def read_financial_data_file(path):
    try:
        with open(path) as f:
            data = json.load(f)
        return data
    except:
        return "Error - Could not find file"


def if_ticker_exist(ticker):
    exist = True
    data = read_financial_data_file(data_shares_path)
    if not (ticker.upper() in data):
        exist = False
    return exist


def get_individual_stock_score(ticker):
    data = read_financial_data_file(data_shares_path)
    if if_ticker_exist(ticker):
        ticker = ticker.upper()
        ticker_data = data[ticker]
        industry = ticker_data["INDUSTRY"]
        result = {}
        current_ratio_score = get_score_with_range(share=ticker_data, indicator="CURRENT RATIO"
                                                   , upper_bound=2.0, lower_bound=1.2, max_value=2.0)
        dividend_score = get_score_with_range(share=ticker_data, indicator="DIVIDENDS YIELD"
                                              , upper_bound=0.07, lower_bound=0.04, max_value=0.05)
        roe_score = get_score_roe(ticker_data)
        pe_score = get_score_pe_ratio(ticker_data)

        result["TICKER"] = ticker
        result["CURRENT RATIO"] = current_ratio_score
        result["DIVIDENDS YIELD"] = dividend_score
        result["RETURN ON EQUITY %"] = roe_score
        result["PE RATIO"] = pe_score
        result["INDUSTRY"] = industry
        return result
    else:
        return "Error - Currently do not support this ticker: " + ticker


def get_score_with_range(share, indicator, upper_bound, lower_bound, max_value):
    indicator_value = share[indicator]
    if indicator_value <= 0:
        return 0.0
    elif upper_bound >= indicator_value >= lower_bound:
        return max_score
    elif indicator_value < lower_bound:
        return (indicator_value / lower_bound) * max_score
    else:
        minus = ((indicator_value - upper_bound) / max_value) * max_score
        value = max_score - minus
        if value < 0:
            return 0.0
        else:
            return value


def get_score_roe(share):
    indicator_value = share["RETURN ON EQUITY %"]
    # Future capabilities can be making these value flexible for admin to edit
    low = 10
    mid = 14
    high = 20
    mid_score = 3
    if indicator_value < low:
        return 0.0
    elif indicator_value <= 14:
        return ((indicator_value - low) / (mid - low)) * mid_score
    else:
        value = (((indicator_value - mid) / (high - mid)) * (5 - mid_score)) + mid_score
        if value > max_score:
            return max_score
        else:
            return value


def get_score_pe_ratio(share):
    # Future capabilities can change to fit industry as well
    indicator_value = share["PE RATIO"]
    if indicator_value <= 0:
        return 0
    else:
        if share["MIC"] == "XNAS":
            # Future capabilities can change this to crawl industry average
            # Currently average S&P 500 PE ratio
            average_pe = 15.79
        elif share["MIC"] == "XSES":
            # Future capabilities can change this to crawl industry average
            # Currently SPDR Straits Times Index ETF (ES3) PE ratio
            average_pe = 11.95
        else:
            return "Do not handle this finanical market yet"

        # This is to lower the standard, can be taken out. 
        # Added as the average pe that we take are using the finanical top 500 company index
        performance_goal = average_pe * 0.8
        value = (indicator_value / performance_goal) * max_score
        if value > max_score:
            return max_score
        else:
            return value
