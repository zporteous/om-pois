import csv

cats={}

with open('overture_categories.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        l = list(row["Overture Taxonomy"].replace("[","").replace("]","").split(","))
        if len(l) == 1:
            cats[l[0]]={}
            continue
        else:
            i=1
            while i < len(l):
                # if the current item is in the previous list items dictionary, move to the next
                current=l[i]
                previous = l[i-1]
                if current in cats.keys():
                    i+=1
                else:
                    # if it is not, add it to the list
                    cats[l[i-1]]={current:{}}
                    i+=1



