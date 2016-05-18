/*\ primary issues:
|*| • Can't bring back a modal without hitting the roll button again
|*|      (or if the modal gets a preventDefault then it can never be shut)
|*| • The destination purchasing is super wonky. It skips five, let's one player buy two, etc.
|*|      I can't see what's wrong with the destination code. It's a simple counter. 5 = win.
|*| • Sometimes the buttons show up when there is no property to buy. Usually on a roll of five?
|*| • The winner checker in switchTurns is working as a console.log, but I don't know how to get a modal for it.
|*| • Winning isn't ending the game.
|*|******** • Rent needs to be added before a player decides to buy
|*| • The yellow highlighting on the active player is opposite (unless I flip it, but that seems sloppy)
|*| • I want the modal-header to change color when the active player changes. I have a add/remove class setup, but it's not working.
|*| • Bootstrap buttons are sub cute.
|*| • The CSS could be more succinct.
\*/

var game = {
  // player object; start each player with 10 cat coins
  player1: {
    name: 'Player 1',
    id: 'player1',
    balance: 14,
    color: '#E15554',
    balanceDisplay: $('#player1BalanceDisplay'),
    announce: $('.console-info#player1'),
    destinationProgress: 0
  },
  player2: {
    name: 'Player 2',
    id: 'player2',
    balance: 10,
    color: '#3BB273',
    balanceDisplay: $('#player2BalanceDisplay'),
    announce: $('.console-info#player2'),
    destinationProgress: 0
  },

    // button variables
    start: $('#start'),
    reset: $('#reset'),
    roll: $('#roll'),

    //gameplay variables
    currentPlayer: null,
    currentRoll: null,
    activeEstablishment: null,
    activeDestination: null,

    //dialog string variables
    establishmentStrings: ["The Veterinary Offices of Katz & Nuzzle for ξ1",
      "Tuna 'R' Us for ξ2",
      "Purrfect Coif Groomer for ξ3",
      "Clawsitive Reinforcement Training Academy for ξ4",
      "Pawsplay Costume Rentals for ξ5",
      "Flea Strasburg Acting School for ξ6"],
    destinationStrings: ['Catnip Dispensary  for ξ10',
      'Tuna Cannery for ξ14',
      'Catapult Magazine Headquarters for ξ18',
      'Paw-trait Studio for ξ22',
      'CatCon Venue for ξ26',
      'WCAT Television Station for ξ30']
}

//display balances at start of game
function  updateBalances() {
  game.player1.balanceDisplay.html('ξ' + game.player1.balance);
  game.player2.balanceDisplay.html('ξ' + game.player2.balance);
}
updateBalances();

//Activate the start button and randomize a starting player
//come back to this and find a more elegant way of announcing turns
game.start.click(function() {
  console.log("start")
  var random = Math.random();
  if (random < .5) {
    game.currentPlayer = game.player1;
    console.log("Player 1's turn");
  } else {
    game.currentPlayer = game.player2;
    console.log("Player 2's turn");
  }
  return game.currentPlayer
})

//roll the die and buy properties
game.roll.click(function(){
  //make the roll button work if start hasn't been pushed
  if (game.currentPlayer == null) {
    game.currentPlayer = game.player1
  }
  //create a die roll from 0 to 5 that coordinates with array indeces.
  game.currentRoll = (Math.floor(Math.random() * 6));

  //give the user a normalized 1 through 6 die roll
  $(".modal-title").html(game.currentPlayer.name + ' rolled a ' +
    (game.currentRoll + 1));

  //ensure that the footer is populated
  insertModalButtons();

  //define the active property, of which there are two copies
  game.activeEstablishment = $('[data-number=' + game.currentRoll +']')
  game.activeDestination = $('[data-number=' + (game.currentPlayer.destinationProgress + 10) +']')

  // if the player has enough money to buy establishments, but not enough to buy destinations
  if (((game.currentRoll + 1) <= (game.currentPlayer.balance)) &&

  //
      (game.currentPlayer.balance < ((game.currentPlayer.destinationProgress * 4) + 11))) {
    if (((game.activeEstablishment.first()).hasClass('unpurchased'))
      || ((game.activeEstablishment.last()).hasClass('unpurchased'))) {
        $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
          ' in the bank.<br />' + 'Would you like to buy ' +
          game.establishmentStrings[game.currentRoll] + '?');
        console.log('asking player if they want to buy an establishment')
        buyEstablishments(game.currentPlayer);
      } else {
          $(".modal-footer").html('');
          $(".modal-body").html('Both of the properties for this roll have been purchased.')
      }

    //would prefer it if this didn't display if both properties are purchased
    } else if (game.currentPlayer.balance < (game.currentRoll + 1)) {
      $(".modal-footer").html('');
      $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
        ' in the bank.<br />' + 'Sorry, that is not enough to buy ' +
        game.establishmentStrings[game.currentRoll]);
        console.log('sale is not going to happen')
    } else if  ((game.currentPlayer.balance) > (game.currentPlayer.destinationProgress * 4) + 11) {
      console.log("this is where we do some bidness");
      buyDestinations(game.currentPlayer);
    }

    //players collect rent on owned properties
    if ((game.activeEstablishment.first()).hasClass('player1') ||
        (game.activeEstablishment.last()).hasClass('player1')) {

          //Because a player can only get rent bonuses for the destinationProgress they already have
        if (game.player1.destinationProgress > game.currentRoll) {
            game.player1.balance += game.currentRoll + 2;
        } else {
            game.player1.balance += game.currentRoll + 1;
        }
    } else if ((game.activeEstablishment.first()).hasClass('player2') ||
        (game.activeEstablishment.last()).hasClass('player2')) {
          if (game.player2.destinationProgress > game.currentRoll) {
              game.player2.balance += game.currentRoll + 2;
          } else {
              game.player2.balance += game.currentRoll + 1;
          }
        }
    updateBalances();
    console.log('switchTurns')
    switchTurns ();
})

// Switch players, highlight active players
//make the modal header match the player's color
function  switchTurns () {
  if (game.currentPlayer.destinationProgress == 5) {
    console.log(game.currentPlayer.name + ' WON!!!! OMG!!')
  } else if (game.currentPlayer == game.player1) {
    game.currentPlayer = game.player2;

    //The add and remove classes are not working. CSS injections didn't work either.
    $("modal-header").removeClass('.player1-modal')
    game.player2.announce.css({'color': '#E1BC29', 'border': '2px solid #E1BC29'});
    game.player1.announce.css({'color': '#121212', 'border': '2px solid #121212'});
  } else {
    game.currentPlayer = game.player1;
    $("modal-header").addClass('.player1-modal')
    game.player1.announce.css({'color': '#E1BC29', 'border': '2px solid #E1BC29'});
    game.player2.announce.css({'color': '#121212', 'border': '2px solid #121212'});
  }
}

//populate the modal footer with yes/no buttons
function insertModalButtons() {
  $(".modal-footer").html("<button type='button' class='btn btn-default'" +
  " data-dismiss='null' id = 'no'>No</button>" +
    "<button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Yes</button>");
}


//guide the player through buying a destination
function buyDestinations(player) {
  console.log("launching buyDestinations a.k.a. bidness");
  $(".modal-body").html('You have ξ' + game.currentPlayer.balance + ' in the bank.<br />'
    + "That's enough to buy a destination!<br />"
    + 'Would you like to buy ' + game.destinationStrings[player.destinationProgress] + '?');

  //Take the steps for the player to buy the property if click yes
  //else take the player to buy establishment
  $('#yes').on('click', {player: player} ,function(evt) {
    evt.data.player.balance -= ((evt.data.player.destinationProgress * 4) + 10);

    //This is adding to the wrong player's score, but it is giving the property to the right person
    //The counter seems to go only once and the property that is offered to the player is tied to it so it shouldn't skip.
    evt.data.player.destinationProgress += 1;
    console.log("Destination progress = " + game.player2.destinationProgress + " for player2")
    console.log("Destination progress = " + game.player1.destinationProgress + " for player1")
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);
    if ((game.activeDestination.first()).hasClass('purchased')) {
        (game.activeDestination.last()).css("background-color", evt.data.player.color);
        (game.activeDestination.last()).removeClass('unpurchased');
        (game.activeDestination.last()).addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeDestination.first()).css("background-color", evt.data.player.color);
        (game.activeDestination.first()).removeClass('unpurchased');
        (game.activeDestination.first()).addClass('purchased' + " " + evt.data.player.id);
      }
    });

  $('#no').on('click', {player: player} ,function(evt) {
    console.log("no click, preventing default")
    event.preventDefault(); // this mofo is breaking a lot of stuff
    $(".modal-body").html('Okay then. You have ξ' + player.balance +
      ' in the bank.<br />' + 'Would you like to buy ' +
      game.establishmentStrings[game.currentRoll] + '?');
      event.preventDefault();
      buyEstablishments(game.currentPlayer);
    })
}


function buyEstablishments(player) {
  console.log("buyEstablishments is running");
  //Take the steps for the player to buy the property
  $('#yes').on('click', {player: player} ,function(evt) {
    console.log("Entering yes function. Current player is " + evt.data.player.name)
    evt.data.player.balance -= (game.currentRoll + 1);
    // Use the classes to mark properties as purchased and which player owns it
    // This code seems really chunky. There must be a better way.
    if ((game.activeEstablishment.first()).hasClass('purchased')) {
        (game.activeEstablishment.last()).css("background-color", evt.data.player.color);
        (game.activeEstablishment.last()).removeClass('unpurchased');
        (game.activeEstablishment.last()).addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeEstablishment.first()).css("background-color", evt.data.player.color);
        (game.activeEstablishment.first()).removeClass('unpurchased');
        (game.activeEstablishment.first()).addClass('purchased' + " " + evt.data.player.id);
    }
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);
  });
}


//Activate the reset button
game.reset.click(function() {
  console.log("reset")
  game.currentPlayer = null;
  game.player1.balance = 10;
  game.player2.balance = 10;
  game.player1.destinationProgress = 0;
  game.player2.destinationProgress = 0;
  //will need to strip all the player1 and player2 from the classes
  //also change classes from purchased to unpurchased
})

//template for adding key commands to the modal
$(document).keydown(function(e){
    if (e.keyCode == 39) {
       console.log( "right arrow pressed" );
       return false;
    }
});
