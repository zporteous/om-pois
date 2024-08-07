import csv, json

def remove_duplicate_lists(nested_dict):
    def has_duplicates(lst):
        return len(lst) != len(set(lst))
    
    def clean_dict(d):
        keys_to_remove = []
        for key, value in d.items():
            if isinstance(value, dict):
                clean_dict(value)
            elif isinstance(value, list) and has_duplicates(value):
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del d[key]

    clean_dict(nested_dict)
    return nested_dict

with open('config\overture_categories.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    nested_dict={}
    for row in reader:
        l = list(row["Overture Taxonomy"].replace("[","").replace("]","").split(","))
        current_dict = nested_dict
        for i, key in enumerate(l):
            if i == len(row) - 1:
                if isinstance(current_dict, dict):
                    if key not in current_dict:
                        current_dict[key] = []
                    current_dict[key].append(key)
            else:
                current_dict = current_dict.setdefault(key, {})

    new = remove_duplicate_lists(nested_dict)
    with open("categories.json", "w+") as j:
        json.dump(new,j)
    



