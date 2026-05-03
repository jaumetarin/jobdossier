from pathlib import Path
import os
import re

import pandas as pd
import psycopg2
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = ROOT_DIR / ".env"

load_dotenv(ENV_PATH)

database_url = os.getenv("POSTGRES_URL")

if not database_url:
    raise ValueError("Missing POSTGRES_URL in .env")


def print_section(title: str) -> None:
    print(f"\n=== {title} ===")


def parse_average_salary(salary_text) -> float | None:
    if pd.isna(salary_text):
        return None

    salary_text = str(salary_text).strip()

    if not salary_text:
        return None

    numbers = re.findall(r"\d+(?:\.\d+)?", salary_text)

    if not numbers:
        return None

    numeric_values = [float(value) for value in numbers]

    if len(numeric_values) == 1:
        return numeric_values[0]

    return sum(numeric_values) / len(numeric_values)


query = """
SELECT
  source,
  title,
  company,
  location,
  technologies,
  "salaryText",
  "publishedAt"
FROM "JobOffer"
"""

connection = psycopg2.connect(database_url)

try:
    dataframe = pd.read_sql_query(query, connection)

    dataframe["publishedAt"] = pd.to_datetime(dataframe["publishedAt"], errors="coerce")
    dataframe["averageSalary"] = dataframe["salaryText"].apply(parse_average_salary)

    print_section("TOTAL OFFERS")
    print(len(dataframe))

    print_section("OFFERS BY SOURCE")
    print(dataframe["source"].value_counts())

    print_section("TOP LOCATIONS")
    print(dataframe["location"].fillna("Unknown").value_counts().head(10))

    print_section("TOP COMPANIES")
    print(dataframe["company"].fillna("Unknown").value_counts().head(10))

    print_section("TOP JOB TITLES")
    print(dataframe["title"].fillna("Unknown").value_counts().head(10))

    technology_series = (
        dataframe["technologies"]
        .explode()
        .dropna()
    )

    print_section("TOP TECHNOLOGIES")
    if not technology_series.empty:
        print(technology_series.value_counts().head(10))
    else:
        print("No technology data available")


    salary_series = dataframe["averageSalary"].dropna()

    print_section("SALARY STATS")
    print(f"Offers with parseable salary: {len(salary_series)}")

    if not salary_series.empty:
        print(f"Average salary: {salary_series.mean():.2f}")
        print(f"Median salary: {salary_series.median():.2f}")
    else:
        print("No parseable salary data found")

    weekly_offers = (
        dataframe.dropna(subset=["publishedAt"])
        .assign(week=dataframe["publishedAt"].dt.to_period("W").astype(str))
        ["week"]
        .value_counts()
        .sort_index()
    )

    print_section("WEEKLY EVOLUTION")
    if not weekly_offers.empty:
        print(weekly_offers)
    else:
        print("No publishedAt data available")

finally:
    connection.close()
