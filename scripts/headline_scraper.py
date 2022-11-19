import requests
import bs4

URL = "http://news.bbc.co.uk/onthisday/low/years/{year}/default.stm"
START_YEAR = 1950
END_YEAR = 2005

def get_headlines(year):
    url = URL.format(year=year)
    res = requests.get(url).text
    soup = bs4.BeautifulSoup(res, "html.parser")
    headlines = []

    for headline in soup.find_all("div", class_="bulletheadline"):
        link = headline.find("a").get("href")
        date = headline.previous_sibling.text.strip()
        headline = headline.text.strip()

        headlines.append({
            "date": date,
            "headline": headline,
            "link": link
        })

    return headlines

headlines = {}

for year in range(START_YEAR, END_YEAR + 1):
    print(f"Scraping {year}...", end="\r")
    headlines[year] = get_headlines(year)

with open("headlines.json", "w") as f:
    import json
    json.dump(headlines, f)