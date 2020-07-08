import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.json.JSONArray;
import org.json.JSONObject;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Main {
    // Change path to whatever directory you want
    private static final String path = "C:\\Users\\galvi\\Galvin\\NUS Notes\\Orbital\\EasyInvest\\Crawler\\data\\";
    private static ArrayList<String> info = new ArrayList<>();
    private static final String authCodeSohGalvin = "33038b227dmsh4e44edf84b14d47p1e5400jsn859fb81ac0ae";
    private static final String authCodeGalvinNus = "7a26119401msh1d91946acab6401p141e1bjsn6d72c64726fa";
    private static final JSONObject database = new JSONObject();

    static {
        info.add("RETURN ON EQUITY %");
        info.add("EPS %");
        info.add("CURRENT RATIO");
        info.add("DIVIDENDS");
    }

    public static void main(String[] args) {
        //Current only XNAS is okay, XSES not done
        Map<String, ArrayList<String>> micTickMap = new HashMap<>();
        ArrayList<String> tickerArr = new ArrayList<>();
        tickerArr.add("AAPL");
        tickerArr.add("AMZN");
        tickerArr.add("BMRC");
        micTickMap.put("XNAS", tickerArr);


        tickerArr = new ArrayList<>();
        tickerArr.add("D05");
        tickerArr.add("O39");
        tickerArr.add("S59");
        micTickMap.put("XSES", tickerArr);

        // Hit API to get data
        // Write to file, cause do not want too keep hitting API else costly
        micTickMap.forEach((mic, arr) -> {
            for (String ticker : arr) {
                System.out.println("Started crawling: " + ticker);
                JSONObject individualData = new JSONObject();
                individualData.put("MIC", mic);

                Response responseStat = hitAPI(
                        "https://morningstar1.p.rapidapi.com/keyratios/statistics?Ticker=" + ticker + "&Mic=" + mic);
                writeResponseToFile(responseStat, path + ticker + "Stat.txt");

                Response responseFinance = hitAPI(
                        "https://morningstar1.p.rapidapi.com/keyratios/financials?Ticker=" + ticker + "&Mic=" + mic);
                writeResponseToFile(responseFinance, path + ticker + "Finance.txt");

                // Have to add waiting due to using Free API with call limit
                wait(1000);

                Response responseDividend = hitAPI("https://morningstar1.p.rapidapi.com/dividends?Ticker=" +
                        ticker + "&Mic=" + mic);
                writeResponseToFile(responseDividend, path + ticker + "Dividends.txt");

                // Have to add waiting due to using Free API with call limit
                wait(1000);

                Response responseProfile = hitAPI(
                        "https://morningstar1.p.rapidapi.com/companies/get-company-profile?Ticker=" +
                                ticker + "&Mic=" + mic);
                writeResponseToFile(responseProfile, path + ticker + "Profile.txt");

                if (mic.equals("XSES")) {
                    try {
                        Stock stock = YahooFinance.get(ticker + ".SI");
                        double price = stock.getQuote().getPrice().doubleValue();
                        individualData.put("LATEST SHARE PRICE", price);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    Response responseEODQ = hitAPI(
                            "https://morningstar1.p.rapidapi.com/endofdayquotes/history?Mic=" + mic +
                                    "&EndOfDayQuoteTicker=126.1." + ticker);
                    writeResponseToFile(responseEODQ, path + ticker + "EODQ.txt");
                    txtToDataEODQ(path + ticker + "EODQ.txt", individualData);
                }

                txtToDataKeyRatio(path + ticker + "Stat.txt", individualData);
                txtToDataKeyRatio(path + ticker + "Finance.txt", individualData);
                txtToDataDividend(path + ticker + "Dividends.txt", individualData);
                txtToDataProfile(path + ticker + "Profile.txt", individualData);

                // Calculate Dividend Yield based on "live" data
                double dividendYield = (individualData.getDouble("DIVIDENDS") * 4)
                        / individualData.getDouble("LATEST SHARE PRICE");
                individualData.put("DIVIDENDS YIELD", dividendYield);
                double peRatio = individualData.getDouble("LATEST SHARE PRICE")
                        / individualData.getDouble("EPS %");
                individualData.put("PE RATIO", peRatio);
                database.put(ticker, individualData);
                wait(2000);
            }
        });
//        System.out.println(database);
//        database.entrySet().forEach(System.out::println);
//        JSONObject jsonData = new JSONObject(database);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy_MM_dd");
        LocalDate localDate = LocalDate.now();
        writeJsonToFile(database, path + "final\\" + "Final_" + dtf.format(localDate) + ".json");
    }

    private static void wait(int time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static Response hitAPI(String url) {
        Response response = null;
        try {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("x-rapidapi-host", "morningstar1.p.rapidapi.com")
                    .addHeader("x-rapidapi-key", authCodeSohGalvin)
                    .addHeader("accept", "string")
                    .build();
            response = client.newCall(request).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    private static void writeResponseToFile(Response response, String path) {
        File file = new File(path);
        try {
            if (file.createNewFile()) {
                System.out.println("File is created");
            } else {
                System.out.println("File already exist: " + path);
            }
            FileWriter writer = new FileWriter(file);
            writer.write(response.body().string());
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void writeJsonToFile(JSONObject content, String path) {
        File file = new File(path);
        try {
            if (file.createNewFile()) {
                System.out.println("File is created");
            } else {
                System.out.println("File already exist");
            }
            FileWriter writer = new FileWriter(file);
            content.write(writer);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String fileToString(String path) {
        String content = null;
        try {
            File file = new File(path);
            BufferedReader br = new BufferedReader(new FileReader(file));
            String st;
            while ((st = br.readLine()) != null)
                content = st;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return content;
    }

    private static void txtToDataProfile(String path, JSONObject individualData) {
        String content = fileToString(path);

        assert content != null;
        JSONObject jsonObject = new JSONObject(content);
        JSONObject jsonResult = jsonObject.getJSONObject("result");
        JSONObject jsonIndustry = jsonResult.getJSONObject("industry");
        individualData.put("INDUSTRY", jsonIndustry.getString("value"));
        System.out.println(individualData);

//        JSONArray jsonArray = jsonObject.getJSONArray("results");
//        if (jsonArray.length() > 0) {
//            JSONObject details = jsonArray.getJSONObject(0);
//            if (individualData.containsKey("DIVIDENDS")) {
//                individualData.replace("DIVIDENDS", details.getDouble("amount"));
//            } else {
//                individualData.put("DIVIDENDS", details.getDouble("amount"));
//            }
//        }
    }

    private static void txtToDataDividend(String path, JSONObject individualData) {
        String content = fileToString(path);

        assert content != null;
        JSONObject jsonObject = new JSONObject(content);
        JSONArray jsonArray = jsonObject.getJSONArray("results");
        if (jsonArray.length() > 0) {
            JSONObject details = jsonArray.getJSONObject(0);
            if (individualData.has("DIVIDENDS")) {
                individualData.remove("DIVIDENDS");
            }
            individualData.put("DIVIDENDS", details.getDouble("amount"));
        }
    }

    private static void txtToDataEODQ(String path, JSONObject individualData) {
        String content = fileToString(path);

        assert content != null;
        JSONObject jsonObject = new JSONObject(content);
        JSONArray jsonArray = jsonObject.getJSONArray("results");
        // extract the latest period item
        JSONObject details = jsonArray.getJSONObject(jsonArray.length() - 1);
        if (!details.get("last").toString().equals("null")) {
            individualData.put("LATEST SHARE PRICE", details.getDouble("last"));
        } else {
            individualData.put("LATEST SHARE PRICE", 0.0);
        }
    }

    private static void txtToDataKeyRatio(String path, JSONObject individualData) {
        String content = fileToString(path);

        assert content != null;
        JSONObject jsonObject = new JSONObject(content);
        JSONArray jsonArray = jsonObject.getJSONArray("results");
        // Get the latest period
        JSONObject jsonLatest = jsonArray.getJSONObject(jsonArray.length() - 1);
        JSONArray jsonArrayLatest = jsonLatest.getJSONArray("sections");
        for (int i = 0; i < jsonArrayLatest.length(); i++) {
            JSONObject line = jsonArrayLatest.getJSONObject(i);
            extractLineItem(line.getJSONArray("lineItems"), individualData);
            extractSubItem(line.getJSONArray("subsections"), individualData);
        }
    }

    private static void extractLineItem(JSONArray arr, JSONObject individualData) {
        if (arr.length() > 0) {
            for (int j = 0; j < arr.length(); j++) {
                JSONObject item = arr.getJSONObject(j);
                if (info.contains(item.get("label").toString())) {
                    if (!item.get("value").toString().equals("null")) {
                        individualData.put(item.get("label").toString(), item.getDouble("value"));
                    } else {
                        individualData.put(item.get("label").toString(), 0.0);
                    }
                }
            }
        }
    }

    private static void extractSubItem(JSONArray subsection, JSONObject individualData) {
        if (subsection.length() > 0) {
            for (int i = 0; i < subsection.length(); i++) {
                JSONObject subLine = subsection.getJSONObject(i);
                if (info.contains(subLine.get("sectionHeader").toString())) {
                    JSONArray period = subLine.getJSONArray("lineItems");
                    JSONObject periodData = period.getJSONObject(3);
                    if (!periodData.get("value").toString().equals("null")) {
                        individualData.put(subLine.get("sectionHeader").toString(), periodData.getDouble("value"));
                    } else {
                        individualData.put(subLine.get("sectionHeader").toString(), 0.0);
                    }
                }
            }
        }
    }
}
