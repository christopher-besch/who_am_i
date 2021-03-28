"use strict";
// represents a single person
class Person {
    // create object from anchor
    constructor(anchor) {
        this.anchor = anchor;
        this.id = this.anchor.id;
        this.data = this.anchor.getElementsByTagName("person_data")[0];
        this.image = this.anchor.getElementsByTagName("img")[0];
        // get random backgrounds
        this.random_glare_idx = Math.floor(Math.random() * glares.length);
        this.random_border_idx = Math.floor(Math.random() * borders.length);
    }
    get_id() {
        return this.id;
    }
    get_name() {
        return this.data.getAttribute("name");
    }
    get_gender() {
        return this.data.getAttribute("gender");
    }
    is_male() {
        return this.get_gender() == "m";
    }
    is_female() {
        return this.get_gender() == "w";
    }
    is_divers() {
        return this.get_gender() == "d";
    }
    is_removed() {
        if (this.data.getAttribute("removed") == "true")
            return true;
        return false;
    }
    is_selected() {
        if (this.data.getAttribute("selected") == "true")
            return true;
        return false;
    }
    set_removed_status(new_status) {
        let old_status = this.is_removed();
        if (new_status)
            this.data.setAttribute("removed", "true");
        else
            this.data.setAttribute("removed", "false");
        if (old_status != new_status)
            this.update();
    }
    set_selected_status(new_status) {
        let old_status = this.is_selected();
        if (new_status)
            this.data.setAttribute("selected", "true");
        else
            this.data.setAttribute("selected", "false");
        if (old_status != new_status)
            this.update();
    }
    toggle_removed_status() {
        this.set_removed_status(!this.is_removed());
    }
    toggle_selected_status() {
        this.set_selected_status(!this.is_removed());
    }
    // remove all backgrounds and apply only the required ones
    update() {
        let backgrounds = [];
        // add border
        if (this.data.getAttribute("selected") == "true") {
            backgrounds.push("url(" + borders[this.random_border_idx] + ")");
        }
        // add glare
        if (this.data.getAttribute("removed") == "true") {
            backgrounds.push("url(" + glares[this.random_glare_idx] + ")");
        }
        // store new borders and overwrite old
        this.image.style.backgroundImage = backgrounds.toString();
    }
}
// change message of some paragraph
function set_message(id, msg) {
    let message_box = document.getElementById(id);
    message_box.innerHTML = msg;
}
function block_end() {
    end_blocked = true;
    set_message("warning-box", "Das Spiel muss zurückgesetzt werden.");
}
function lift_block_end() {
    end_blocked = false;
    set_message("warning-box", "");
}
function update_players() {
    people_left = 0;
    let last_person_id = "";
    for (let id in people) {
        // add border for selected player
        people[id].set_selected_status(people[id].get_id() == selected_player_id);
        // count people that are left
        if (!people[id].is_removed()) {
            last_person_id = id;
            people_left += 1;
        }
    }
    // is the game over?
    switch (people_left) {
        case 1: {
            set_message("left-box", `Es ist ${people[last_person_id].get_name()}!</br>
                        &#8222;Ich wusste es!&#8220;"</br>
                        &mdash;Motivationscoach Kiri`);
            // can't end in this case
            if (end_blocked)
                break;
            block_end();
            // unhide a certain button under certain condition
            if (selected_player_id == "person-pascal")
                document.getElementById("pascal-button").hidden = false;
            let win_modal_text = "";
            if (last_person_id == selected_player_id)
                win_modal_text = `Hahaha, ${people[last_person_id].get_name()} hat euch alle verarscht!`;
            else {
                // use correct gender
                let gender_str = "";
                switch (people[last_person_id].get_gender()) {
                    case "m": {
                        gender_str = `vom`;
                        break;
                    }
                    case "w": {
                        gender_str = `von der`;
                        break;
                    }
                    case "d": {
                        gender_str = `von der/dem`;
                        break;
                    }
                }
                // build string for winner
                win_modal_text = `${people[selected_player_id].get_name()} hat es mit deiner Hilfe geschafft, ${gender_str} bösen ${people[last_person_id].get_name()} nicht entdeckt zu werden!</br>
                            Good Job!`;
            }
            // write text
            document.getElementById("win-modal-text").innerHTML = win_modal_text;
            // unhide modal
            open_modal("win-modal");
            break;
        }
        case 2: {
            set_message("left-box", `Es muss nur noch eine Leut ausgeschlossen werden!</br>
                                &#8222;Fast geschafft!&#8220;</br>
                                &mdash;Motivationscoach Kiri`);
            break;
        }
        default: {
            set_message("left-box", `${people_left} Leute sind noch nicht ausgeschlossen.</br>
                                    &#8222;Du schaffst das!&#8220;</br>
                                    &mdash;Motivationscoach Kiri`);
            break;
        }
    }
}
////////////////////
// game functions //
////////////////////
// must be executed at the start of each game, including the first one
function reset_game() {
    // the lockdown has been lifted
    lift_block_end();
    // reset people
    people = get_people();
    people_left = Object.keys(people).length;
    for (let id in people) {
        people[id].set_selected_status(false);
        people[id].set_removed_status(false);
    }
    // ask user to select a (new) player
    update_selection();
}
// allow and ask player to select a (new) person as their player
function update_selection() {
    select_new_player = true;
    selected_player_id = "";
    let message_str = "Wähle einen Spieler.</br>";
    // disable button used to change the current player selection
    set_message("status-box", message_str);
    document.getElementById("change-player-button").disabled = true;
    update_players();
}
// person image click callback
function click_person(id) {
    let person = people[id];
    // when the player is currently selecting a new player
    if (select_new_player) {
        selected_player_id = person.get_id();
        select_new_player = false;
        let message_str = `Aktueller Spieler: ${person.get_name()}`;
        if (selected_player_id == "person-julchen")
            message_str += ", gute Wahl";
        message_str +=
            "</br>Klicke auf Personen, bei denen du sicher bist, dass sie nicht von deinem Gegner als Spielfigur gewählt wurden.";
        set_message("status-box", message_str);
        // the currently selected player can now be changed again
        document.getElementById("change-player-button").disabled = false;
    }
    // when the player is removing or adding people
    else
        person.toggle_removed_status();
    update_players();
}
///////////
// setup //
///////////
// load all images from a specific store
function get_store_images(store_name) {
    const store = document.getElementById(store_name);
    const store_images = store.getElementsByTagName("img");
    // extract urls
    let images = [];
    for (let idx = 0; idx < store_images.length; idx++)
        images.push(store_images[idx].src);
    return images;
}
function get_people() {
    let people = {};
    // get all people anchors
    let people_div = document.getElementById("people");
    let people_anchors = people_div.getElementsByTagName("a");
    // create Person objects
    for (let idx = 0; idx < people_anchors.length; idx++)
        people[people_anchors[idx].id] = new Person(people_anchors[idx]);
    return people;
}
// global variables
const borders = get_store_images("border-store");
const glares = get_store_images("glare-store");
let people;
let select_new_player;
let selected_player_id;
let people_left;
// when true, the game can't end
let end_blocked;
///////////////////
// modal control //
///////////////////
function open_modal(modal_id) {
    let modal = document.getElementById(modal_id);
    // add backdrop
    document.getElementById("backdrop").style.display = "block";
    modal.style.display = "block";
    modal.className += "show";
}
function close_modal(modal_id) {
    let modal = document.getElementById(modal_id);
    // remove backdrop
    document.getElementById("backdrop").style.display = "none";
    modal.style.display = "none";
    modal.className += document
        .getElementById(modal_id)
        .className.replace("show", "");
    // hide buttons that shall be hidden
    let buttons = modal.getElementsByTagName("button");
    for (let idx = 0; idx < buttons.length; idx++)
        if (buttons[idx].classList.contains("modal-default-hide"))
            buttons[idx].hidden = true;
}
// get the modal
let win_modal = document.getElementById("win-modal");
// when the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == win_modal) {
        close_modal("win-modal");
    }
};
