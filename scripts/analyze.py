from pathlib import Path
import os

import pandas as pd
import psycopg2
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = ROOT_DIR / ".env"

load_dotenv(ENV_PATH)

database_url = os.getenv("POSTGRES_URL")

if not database_url:
    raise ValueError("Missing POSTGRES_URL in .env")

query = """
SELECT
  source,
  title,
  company,
  location,
  "technologiesRaw",
  "publishedAt"
FROM "JobOffer"
"""

connection = psycopg2.connect(database_url)

try:
    dataframe = pd.read_sql_query(query, connection)

    print("\n=== TOTAL OFFERS ===")
    print(len(dataframe))

    print("\n=== OFFERS BY SOURCE ===")
    print(dataframe["source"].value_counts())

    print("\n=== OFFERS BY LOCATION ===")
    print(dataframe["location"].fillna("Unknown").value_counts().head(10))

    print("\n=== TOP JOB TITLES ===")
    print(dataframe["title"].value_counts().head(10))


finally:
    connection.close()
