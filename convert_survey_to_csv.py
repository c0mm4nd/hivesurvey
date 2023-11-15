# %%
import json
import csv

# Open the JSON file and load the data
with open('surveys_ts_clean_list.json') as f:
    the_list = json.load(f)

columns = set()
rows = []

def parse_json_value(column_name, json_value, row):
    if type(json_value) == list:
        columns.add(column_name)
        row[column_name] = ", ".join(json_value)
    if type(json_value) == str:
        columns.add(column_name)
        row[column_name] = json_value
    if type(json_value) == int:
        columns.add(column_name)
        row[column_name] = json_value
    if type(json_value) == float:
        columns.add(column_name)
        row[column_name] = json_value
    if type(json_value) == bool:
        columns.add(column_name)
        row[column_name] = json_value
    if type(json_value) == dict:
        for key in json_value:
            parse_json_value(column_name + "_" + key, json_value[key], row)


for obj in the_list:
    row = {}
    for key in obj:
        parse_json_value(key, obj[key], row)

    rows.append(row)
# %%
column_list = list(columns)
column_list.sort()
w = csv.DictWriter(open("surveys_ts_clean.csv", "w"), fieldnames=column_list)
w.writeheader()
w.writerows(rows)
# %%
