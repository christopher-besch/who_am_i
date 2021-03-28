from jinja2 import Template, StrictUndefined
import os
import csv
from random import shuffle


class Person:
    def __init__(self, name, img_name, class_name, gender):
        self.name = name
        self.img_name = img_name
        self.id = class_name
        self.gender = gender


def write_template(file_name, **variables):
    with open(f"src/{file_name}", "r", encoding="utf-8") as file:
        template = Template(file.read(), undefined=StrictUndefined)
    out = template.render(**variables)
    with open(f"out_int/{file_name}", "w+", encoding="utf-8") as file:
        file.write(out)


def main():
    if not os.path.isdir("out_int"):
        os.mkdir("out_int")

    people = []

    with open("people.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.DictReader(file, delimiter=";",
                                    skipinitialspace=True, quoting=csv.QUOTE_NONE)
        for row in csv_reader:
            people.append(
                Person(row["name"], row["img_name"], f"person-{row['name'].lower()}", row["gender"]))
    shuffle(people)

    glares = [
        "images/glares/glare0.png",
        "images/glares/glare1.png",
        "images/glares/glare2.png",
        "images/glares/glare3.png"
    ]
    borders = [
        "images/borders/border0.png"
    ]

    # html
    write_template("index.html", people=people, glares=glares,
                   borders=borders, navbar_img="images/navbar.png")
    # css
    write_template("style.css")


if __name__ == "__main__":
    main()
