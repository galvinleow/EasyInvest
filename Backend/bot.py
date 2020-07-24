import json
import logging

import jwt
import requests
import telegram
from telegram import (ReplyKeyboardMarkup, ReplyKeyboardRemove)
from telegram.ext import (Updater, CommandHandler,
                          MessageHandler, Filters, ConversationHandler)

from method import shares

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

logger = logging.getLogger(__name__)
TOKEN = '1334812224:AAH4FVVKxyFKVNkPkU_0HoLRt6bX0clbFpg'
bot = telegram.Bot(token=TOKEN)

USERNAME, PASSWORD, LOGIN, FEATURE, SHAREDATA, ANALYSIS, END = range(7)

login_keyboard = [['CONFIRM LOGIN', 'RESTART LOGIN']]
login_markup = ReplyKeyboardMarkup(
    login_keyboard, resize_keyboard=True, one_time_keyboard=True)
login_error_keyboard = [['RESTART LOGIN', 'END SESSION']]
login_error_markup = ReplyKeyboardMarkup(
    login_error_keyboard, resize_keyboard=True, one_time_keyboard=True)
feature_keyboard = [
    ['GET SHARE DATA', 'GET ASSET DETAILS', "INVESTMENT ANALYSIS"]]
feature_markup = ReplyKeyboardMarkup(
    feature_keyboard, resize_keyboard=True, one_time_keyboard=True)
end_keyboard = [['RESTART', 'END SESSION']]
end_markup = ReplyKeyboardMarkup(
    end_keyboard, resize_keyboard=True, one_time_keyboard=True)


def facts_to_str(user_data):
    facts = list()
    for key, value in user_data.items():
        facts.append('{} - {}'.format(key, value))

    return "\n".join(facts).join(['\n', '\n'])


def start(update, context):
    update.message.reply_text("Hi! Welcome to EasyInvest! It is nice having you here."
                              + "\nPlease enter username to begin")
    return USERNAME


def username(update, context):
    user = update.message.from_user
    user_data = context.user_data
    category = 'username'
    text = update.message.text
    user_data[category] = text
    logger.info("Username of %s: %s", user.first_name, update.message.text)
    update.message.reply_text('Please enter your password')
    return PASSWORD


def password(update, context):
    user = update.message.from_user
    user_data = context.user_data
    category = 'password'
    text = update.message.text
    user_data[category] = text
    logger.info("Password of %s: %s", user.first_name, update.message.text)
    update.message.reply_text("Thank you for providing the information. Please confirm login!",
                              reply_markup=login_markup)
    return LOGIN


def login(update, context):
    user = update.message.from_user
    user_data = context.user_data
    logger.info("Confirm login? of %s: %s",
                user.first_name, update.message.text)
    # POST requests to backend endpoint for login
    newHeaders = {'Content-type': 'application/json', 'Accept': '*/*'}
    url = "http://localhost:5200/login"
    response = requests.post(url, json=user_data, headers=newHeaders)
    if "Error" in response.text:
        update.message.reply_text("Failed Login: " + response.text,
                                  reply_markup=ReplyKeyboardRemove())
        update.message.reply_text("Do you wish to restart login or end session?",
                                  reply_markup=login_error_markup)
        return END
    else:
        token = json.loads(response.text)["token"]
        user_uuid = jwt.decode(token, 'secret')["identity"]["uuid"]
        user_data['uuid'] = user_uuid
        update.message.reply_text("Login Successful")
        update.message.reply_text(
            "What can we do for you today? :)", reply_markup=feature_markup)
        return FEATURE


def feature_share_data(update, context):
    user = update.message.from_user
    logger.info("Get Share Data of %s: %s",
                user.first_name, update.message.text)
    update.message.reply_text('Please key in the ticker code for data',
                              reply_markup=ReplyKeyboardRemove())
    return SHAREDATA


def share_data(update, context):
    text = update.message.text
    logger.info("Share Data: %s", update.message.text)
    if shares.if_ticker_exist(text.upper()):
        update.message.reply_text(facts_to_str(shares.get_individual_stock_data(text.upper())),
                                  reply_markup=end_markup)
    else:
        update.message.reply_text("Does not exist", reply_markup=end_markup)
    return END


def feature_asset(update, context):
    user = update.message.from_user
    user_data = context.user_data
    logger.info("Assert Overview of %s: %s",
                user.first_name, update.message.text)
    # GET requests to backend endpoint for getting asset
    url = "http://localhost:5200/getDataFromUUID/asset/" + user_data['uuid']
    response = requests.get(url)
    if "Error" in response.text:
        update.message.reply_text("Feature Failed to Execute: " + response.text,
                                  reply_markup=ReplyKeyboardRemove())
        update.message.reply_text("Do you wish to restart or end session?",
                                  reply_markup=end_markup)
    else:
        asset = json.loads(response.text)

        def format_asset_response(element):
            print(element)
            return "Asset Name: {} \nAsset Rate: {} \nAsset Amount: {}".format(element["name"],
                                                                               element["rate"],
                                                                               element["amount"][0]["value"])

        reply = "<b>Asset Overview</b>\n"
        for elem in asset["asset"]:
            reply = reply + "\n" + format_asset_response(elem) + "\n"
        update.message.reply_text(reply,
                                  reply_markup=end_markup, parse_mode=telegram.ParseMode.HTML)
    return END


def feature_weightage(update, context):
    user = update.message.from_user
    user_data = context.user_data
    logger.info("Investment Analysis of %s: %s",
                user.first_name, update.message.text)
    # GET requests to backend endpoint for getting rank
    url = "http://localhost:5200/getDataFromUUID/rank/" + user_data['uuid']
    response = requests.get(url)
    if "Error" in response.text:
        update.message.reply_text("Feature Failed to Execute: " + response.text,
                                  reply_markup=ReplyKeyboardRemove())
        update.message.reply_text("Do you wish to restart or end session?",
                                  reply_markup=end_markup)
        return END
    else:
        update.message.reply_text("Input ticker code for analysis",
                                  reply_markup=ReplyKeyboardRemove())
        user_data["rank"] = json.loads(response.text)["rank"][0]
        return ANALYSIS


def analysis(update, context):
    user = update.message.from_user
    user_data = context.user_data
    logger.info("Investment Analysis Ticker of %s: %s",
                user.first_name, update.message.text)
    # GET requests to backend endpoint for shares score
    url = "http://localhost:5200/getShareInformation/" + update.message.text
    response = requests.get(url)
    if "Error" in response.text:
        update.message.reply_text("Feature Failed to Execute: " + response.text,
                                  reply_markup=ReplyKeyboardRemove())
        update.message.reply_text("Do you wish to restart or end session?",
                                  reply_markup=end_markup)
    else:
        ranking = user_data["rank"]
        res = json.loads(response.text)
        result = {}
        total_score = 0
        total_weight = 0
        for elem in ranking:
            if elem == "CURRENT RATIO":
                if "bank" in res["INDUSTRY"].lower():
                    continue
            score = res[elem] * ranking[elem]
            total_score = total_score + score
            total_weight = total_weight + ranking[elem]
            result[elem + " SCORE"] = score
        result["TOTAL SCORE %"] = total_score / (total_weight * 5) * 100
        update.message.reply_text("<b> TICKER: {}</b>\n{}".format(update.message.text, facts_to_str(result)),
                                  reply_markup=end_markup, parse_mode=telegram.ParseMode.HTML)
        update.message.reply_text("*Do take note that if the selected company is in the banking industry, " +
                                  "its current ratio will not be taken into the calculcation.")
    return END


def end(update, context):
    user = update.message.from_user
    user_data = context.user_data
    logger.info("End: %s", update.message.text)
    update.message.reply_text("The session have ended \nBye! Hope to see you again next time ",
                              reply_markup=ReplyKeyboardRemove())
    return ConversationHandler.END


def cancel(update, context):
    user = update.message.from_user
    logger.info("User %s canceled the conversation.", user.first_name)
    update.message.reply_text('Bye! Hope to see you again next time.',
                              reply_markup=ReplyKeyboardRemove())
    return ConversationHandler.END


def error(update, context):
    """Log Errors caused by Updates."""
    logger.warning('Update "%s" caused error "%s"', update, context.error)


def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            USERNAME: [MessageHandler(Filters.text, username)],

            PASSWORD: [MessageHandler(Filters.text, password)],

            LOGIN: [MessageHandler(Filters.regex('^CONFIRM LOGIN$'), login),
                    MessageHandler(Filters.regex('^RESTART LOGIN$'), start)],

            FEATURE: [CommandHandler('start', start),
                      MessageHandler(Filters.regex(
                          '^GET SHARE DATA$'), feature_share_data),
                      MessageHandler(Filters.regex(
                          '^GET ASSET DETAILS$'), feature_asset),
                      MessageHandler(Filters.regex('^INVESTMENT ANALYSIS$'), feature_weightage)],

            SHAREDATA: [CommandHandler('start', start), MessageHandler(Filters.text, share_data)],

            ANALYSIS: [CommandHandler('start', start), MessageHandler(Filters.text, analysis)],

            END: [MessageHandler(Filters.regex('^RESTART$'), login),
                  MessageHandler(Filters.regex('^END SESSION$'), end),
                  MessageHandler(Filters.regex('^RESTART LOGIN$'), start)]

        },

        fallbacks=[CommandHandler('cancel', cancel)]
    )

    dp.add_handler(conv_handler)

    # log all errors
    dp.add_error_handler(error)

    updater.start_polling()

    updater.idle()


if __name__ == '__main__':
    main()
