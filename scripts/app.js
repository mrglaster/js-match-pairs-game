

/**Maximal pairs amount */
const MAXIMAL_PAIRS = 12;

/**Amount of cards on the game field. Must be <=24 */
let FIELD_SIZE = 16; 

/** Custom attribute for card's image*/
const data_idx_key = 'data-idx';

/**Cards pairs */
let cards = [];

/**Indexes of clicked cards */
let selected = [];

/** How much time will user see the opened card? Time in ms */
const CARD_SHOWTIME = 500;

/** Opened pairs */
let opened_pairs = 0; 

/** Time after game starts (s) */
let current_time = 0;

let may_update = 0;

var updater;

/** Two selected cards check*/ 
function check(){
    const card_1 = document.querySelector(`[${data_idx_key}="${selected[0]}"]`);
    const card_2 = document.querySelector(`[${data_idx_key}="${selected[1]}"]`);
    if (selected[0] != selected[1]){
        if (cards[selected[0]] === cards[selected[1]]){
            card_1.classList.add('checked');
            card_2.classList.add('checked');
            opened_pairs++;
            if (opened_pairs == FIELD_SIZE / 2) {
                alert(`Congratulations! You won! You've spend on it ${current_time} seconds. Can you do it faster?`);
                may_update = 0;
                current_time = 0;
                opened_pairs = 0;
                clearInterval(updater);
                start();
            }
        }else{
            card_1.setAttribute('src', './images/blank.png');
            card_2.setAttribute('src', './images/blank.png');
        }
        selected = [];    
    }
    
}




/**Flip the card on click on it */
function flip(){
    const card_index = this.getAttribute(data_idx_key);
    selected.push(card_index);
    this.setAttribute('src', `./images/${cards[card_index]}.png`);

    if (selected.length == 2) {
        setTimeout(check, CARD_SHOWTIME);
    }
    else if(selected.length > 2){
        for(let i = 0; i < selected.length; i++){
            const ccard = document.querySelector(`[${data_idx_key}="${selected[i]}"]`);
            ccard.setAttribute('src', './images/blank.png');
        }
        selected = [];
    }

}

/**Shuffles array*/
function shuffle_array(array){
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/** Generates the set of cards. Returns array*/
function generate_cards(){
    if(FIELD_SIZE %2 != 0) return
    let indices = Array.from(
        Array(MAXIMAL_PAIRS + 1).keys()
    ).slice(1); //slice [1 : end]
    shuffle_array(indices);
    const pairs = FIELD_SIZE / 2;
    indices = indices.slice(0, pairs);
    indices = indices.concat(indices);
    shuffle_array(indices);
    cards = indices;
}

/**Creates game field */
function create_board(grid){
    if(!grid) return
    for(let i = 0; i < FIELD_SIZE; i++){
        const card = document.createElement('img');
        card.setAttribute('src', './images/blank.png');
        card.setAttribute(data_idx_key, i);
        card.addEventListener('click', flip);
        grid.appendChild(card);
    }
    generate_cards();
}

/** Function updating in-game timer */
function update_timer(){
    if (may_update){
        current_time++;
        let ctimer = document.getElementById("time_counter");
        ctimer.innerText = "Time: "+ current_time.toString();
        console.log(current_time);
        if(current_time == 999){
            alert("Your game is over! You thought too logng!");
            exit();
        }
        
    }
}


/** Start and restart function*/
function start(){
    let timer = document.getElementsByClassName('time_counter');
    timer.innerText = "Time: 0";
    current_time = 0;
    may_update = 0;
    read_cardsamount();
    const grid = document.querySelector('.grid');
    grid.replaceChildren();
    opened_pairs = 0;
    create_board(grid);
    updater = setInterval(update_timer, 1000); 
    may_update = 1;
}

/** How many cards will be on the field */
function read_cardsamount(){
    console.log(FIELD_SIZE)
    let input = prompt("How many cards we'll have on the field");
    FIELD_SIZE = (input + input%2)/10;
    if (FIELD_SIZE > 24) FIELD_SIZE =24;
}

/** The main function */
function main(){
    start();
}

main();