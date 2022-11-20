import os
import json
import csv
import readchar
import shutil
import hashlib

COUNTRIES = ["United States", "United Kingdom", "World"]
MIN_YEAR_RANGE = 25

if not os.path.exists("out"):
    os.mkdir("out")
else:
    shutil.rmtree("out")
    os.mkdir("out")

for dataset in os.listdir("datasets"):
    print(dataset)

    f_meta = open("datasets/" + dataset + "/datapackage.json")
    f_data =  open("datasets/" + dataset + "/" + dataset + ".csv")

    metadata = json.load(f_meta)
    data = list(csv.DictReader(f_data))

    f_meta.close()
    f_data.close()

    name = metadata["name"]
    id_ = metadata["id"]

    entities = [row["Entity"] for row in data]

    countries = []
    for country in COUNTRIES:
        if country in entities:
            years = [int(row["Year"]) for row in data if row["Entity"] == country]
            year_range = 0 if len(years) == 0 else max(years) - min(years)
            year_range = max(years) - min(years)

            if year_range >= MIN_YEAR_RANGE and year_range == len(years) - 1:
                countries.append(country)

                print(f"  INFO: {year_range} for {country}")

    if len(countries) == 0:
        print(f"  IGNORE (no country) {dataset}")
        continue

    interestedFields = []

    for field in metadata["resources"][0]["schema"]["fields"]:
        if field["name"] == "Entity" or field["name"] == "Year":
            continue

        interestedFields.append(field["name"])

        #print(f"  PROMPT {field['name']}?")
        #c = readchar.readchar()

        #if c == "y":
        #    interestedFields.append(field["name"])
        #elif c == "q":
        #    import sys
        #    sys.exit(0)

    if len(interestedFields) > 5 or len(interestedFields) == 0:
        print(f"  IGNORE (too many fields) {dataset}")
        continue

    for country in countries:
        for interestedField in interestedFields:
            rows = [(row["Year"], row[interestedField]) for row in data if row["Entity"] == country and row[interestedField] != ""]

            if len(rows) < 10:
                print(f"  IGNORE (last minute length check) {dataset}")
                continue

            name = f"{dataset} ({country})"
            id_ = f"{dataset}_{country}_{interestedField}"

            try:
                os.mkdir(f"out/{id_}")

                with open(f"out/{id_}/data.csv", "w") as f:
                    for row in rows:
                        f.write(f"{row[0]},{row[1]}\n")

                with open(f"out/{id_}/meta.json", "w") as f:
                    json.dump({
                        "name": name,
                        "yAxisName": interestedField,
                        "start": min([int(row[0]) for row in rows]),
                        "end": max([int(row[0]) for row in rows])
                    }, f)
        
                print(f"  DONE {name}")
            except:
                print(f"  ERROR {name}")

    f_meta.close()
    f_data.close()