# generate sample json files

import json
import random
import datetime
import numpy as np

data = {}
keywords = {}
with open('./source.json') as source:
    data = json.load(source)["dataType"]
with open('./keywords.json') as keys:
    keywords = json.load(keys)

topics = ["eco", "for", "fed", "equ", "hea", "imm", "env", "gun"]
times = ["day", "week", "month"]

indices = {}
for time in times:
    indices[time] = random.sample(range(15), 5)

for count in range(0, 3):
    file = {}
    now = datetime.datetime.now()
    file['time'] = now.strftime("%m/%d/%Y")
    for item in data[count]["data"]:
        items = {}
        for topic in topics:
            to = {}
            for time in times:
                ti = {}
                begin = now
                if(time == "week"):
                    begin = now - datetime.timedelta(days=7)
                if(time == "month"):
                    today = datetime.date.today()
                    first = datetime.date(
                        day=1, month=today.month, year=today.year)
                    lastMonth = first - datetime.timedelta(days=1)
                    numOfDay = int(lastMonth.strftime("%d"))
                    begin = now - datetime.timedelta(days=numOfDay)
                ti['begin_time'] = begin.strftime("%m/%d/%Y")
                terms = []
                term_set = {}
                for ran in indices[time]:
                    term_set[keywords[topic][ran]] = (np.random.random_sample(31) * 2 - 1).tolist()
                ti["term_set"] = term_set
                to[time] = ti
            items[topic] = to
        file[item] = items
    fileName = data[count]["type"] + ".json"
    print fileName
    with open(("./" + fileName), "w+") as f:
        f.write(json.dumps(file))
