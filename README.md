# Who Am I?

This is a web version of the game Who Am I.
It gets compiled into a single file so that the entire game can easily be sent to other players without publishing sensitive data/images to the internet.
An example can be found [here]().

Custom images can be added into [resources/people](resources/people).
Each person needs to be added to [people.csv](people.csv).
To create the web page one has to execute the build script with `./build.sh`.

## Requirements

-   Python3
-   TypeScript Compiler
-   inliner
    -   can be installed with `pip3 install inliner`
