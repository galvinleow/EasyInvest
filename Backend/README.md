README

Installation
    - Install Elasticsearch 7.8.0
    - pip install requirements.txt file in [Backend] folder

To Run
    Elasticsearch: Run bin/elasticsearch (or bin\elasticsearch.bat on Windows)
    Python: python main.py
    Python python bot.py
Ensure that the crawler have run it course for backend to be online.

Summary Notes on Backend design
    - Registering user
        - Password will be jwt encrypted before storing in the database
        - Elasticsearch will automatically create a uuid that inserted data
    - Login
        - Jwt encrypt incoming password to compare with database value
        - Return token for frontend to decode to retreive information
    - Add Asset
        - Asset will be added to different indics for user
        - Overall asset will use user uuid to create to create a "relation" 
        - Backend will generate uuid for the asset (not Elasticsearch)
    - Update Asset
        - Will only take in (current period - 1 year) values to update
        - Will only keep 12 period data here, latest value of month
    - Display History Data
        - Will not store anything in the database
        - Derive past 1 year data
    - Calculate Projected Value
        - Will not store anything in database
        - Derive past 1 year data
        - Calculate 4 year of projected data
    - Individual Share score
        - Each ratio analyse differently
        - Each ratio have their own optimal value
        - Score is only adjusted to differentiate the banking industry (further enhancement is possible)
        - Score is only adjusted for 2 different kind of financial market (further enhancement is possible)
    - Telegram bot
        - Only created to handle user with account already
        - It is hard to have login feature hence login feature wiwll created first (further enhancement is possible)
