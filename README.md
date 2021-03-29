# Who Am I?

<img align="center" src="who_am_i.png">

This is a web version of the game Who Am I.
It gets compiled into a single file so that the entire game can easily be sent to other players without publishing sensitive data/images to the internet.
An example can be found [here](https://christopher-besch.github.io/who_am_i/out/index.html).

Custom images can be added into [resources/people](https://github.com/christopher-besch/who_am_i/tree/main/resources/images).
Each person needs to be added to [people.csv](people.csv).
To create the web page one has to execute the build script with `./build.sh`.

## Requirements

-   TypeScript Compiler
-   Python3
-   Jinja2
-   inliner
    -   can be installed with `pip3 install inliner`
