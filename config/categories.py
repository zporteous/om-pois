import csv

def set_value_from_keys(nested_dict, keys, value):
    d = nested_dict
    for key in keys[:-1]:
        d = d.setdefault(key, {})
    d[keys[-1]] = value

def find_key_position(nested_dict, target_key, path=[]):
    for key, value in nested_dict.items():
        current_path = path + [key]
        if key == target_key:
            return current_path
        if isinstance(value, dict):
            result = find_key_position(value, target_key, current_path)
            if result:
                return result
    return None

def get_all_keys(nested_dict, keys=set()):
    for key, value in nested_dict.items():
        keys.add(key)
        if isinstance(value, dict):
            get_all_keys(value, keys)
    return keys

with open('config\overture_categories.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    cats={}
    for row in reader:
        l = list(row["Overture Taxonomy"].replace("[","").replace("]","").split(","))
        if len(l) == 1:
            cats[l[0]]={}
            continue
        else:
            i=1
            nest_count=0
            while i < len(l):
                # if the current item is in the previous list items dictionary, move to the next
                current=l[i]
                previous = l[i-1]
                if previous in get_all_keys(cats):
                    # find the key position of previous to place current in it
                    path = find_key_position(cats,previous,path=[])
                    if path is not None:
                        set_value_from_keys(cats,path,{current:{}})
                    i+=1
                    nest_count+=1
                else:
                    # if it is not, add it to the list
                    cats[l[nest_count]]={current:{}}
                    nest_count+=1
                    i+=1



