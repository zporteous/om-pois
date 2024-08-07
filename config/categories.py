import csv, json

def assign_value_by_path(d, path, value):
    """
    Assigns a value in a nested dictionary using a path list.

    :param d: The dictionary to update.
    :param path: A list representing the path to the key.
    :param value: The value to assign.
    """
    current = d
    for key in path[:-1]:
        current = current.setdefault(key, {})
    try:
        current[path[-1]]={}
    except:
        current[path[-1]] = value


with open('config\overture_categories.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    cats={}
    for row in reader:
        path = list(row["Overture Taxonomy"].replace("[","").replace("]","").split(","))
        if len(path) == 1:
            cats[path[0]]={}
            continue

        assign_value_by_path(cats, path, {path[-1]:{}})


    with open("categories.json","w+") as j:
        json.dump(cats, j)



