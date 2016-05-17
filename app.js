//Hey, me. What you need to do now is fix the mechanism for EARNING money.
//Once you get that shit done, you need to deal with destinations, including
//asking every player with more than 10 coins if they want to buy.

var game = {
  // player object; start each player with 10 cat coins
  player1: {
    name: 'Player 1',
    id: 'player1',
    balance: 12,
    color: '#448888',
    balanceDisplay: $('#player1BalanceDisplay'),
    announce: $('#player1Announce'),
    destinationProgress: 0
  },
  player2: {
    name: 'Player 2',
    id: 'player2',
    balance: 10,
    color: '#b1d46a',
    balanceDisplay: $('#player2BalanceDisplay'),
    announce: $('#player2Announce'),
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
      'Tuna Cannery for ξ15',
      'Catapult Magazine Headquarters for ξ20',
      'Paw-trait Studio for ξ25',
      'CatCon Venue for ξ30',
      'WCAT Television Station for ξ35']
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
      (game.currentPlayer.balance < ((game.currentPlayer.destinationProgress * 5) + 11))) {
    if (((game.activeEstablishment.first()).hasClass('unpurchased'))
      || ((game.activeEstablishment.last()).hasClass('unpurchased'))) {
        buyEstablishments(game.currentPlayer);
      } else {
          $(".modal-footer").html('');
          $(".modal-body").html('Both of the properties for this roll have been purchased.')
      }
    } else if (game.currentPlayer.balance < (game.currentRoll + 1)) {
      $(".modal-footer").html('');
      $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
        ' in the bank.<br />' + 'Sorry, that is not enough to buy ' +
        game.establishmentStrings[game.currentRoll]);
    } else if  ((game.currentPlayer.balance) > (game.currentPlayer.destinationProgress * 5) + 11) {
      console.log("this is where we do some bidness");
      buyDestinations(game.currentPlayer);
    }

    //players collect rent on owned properties
    if ((game.activeEstablishment.first()).hasClass('player1') ||
        (game.activeEstablishment.last()).hasClass('player1')) {
      game.player1.balance += game.currentRoll + 1;
      console.log('Player 1 now has ξ' + game.player1.balance)
    } else if ((game.activeEstablishment.first()).hasClass('player2') ||
        (game.activeEstablishment.last()).hasClass('player2')) {
      game.player2.balance += game.currentRoll + 1;
      console.log('Player 2 now has ξ' + game.player2.balance)
    }

    updateBalances();
    console.log('switchTurns')
    switchTurns ();
})

// Switch players, switch active player to yellow
function  switchTurns () {
  if (game.currentPlayer == game.player1) {
    game.currentPlayer = game.player2;
    game.player1.announce.css({'color': 'yellow', 'border': '2px solid yellow'}); // this is some ugly styling. pleaes fix later.
    game.player2.announce.css({'color': '#121212', 'border': 'none'});
  } else {
    game.currentPlayer = game.player1;
    game.player2.announce.css({'color': 'yellow', 'border': '2px solid yellow'});
    game.player1.announce.css({'color': '#121212', 'border': 'none'});
  }
}

//populate the modal footer with yes/no buttons
function insertModalButtons() {
  $(".modal-footer").html("<button type='button' class='btn btn-default'" +
  " data-dismiss='modal' id = 'no'>No</button>" +
    "<button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Yes</button>");
}

//gudie the player through buying a destination
function buyDestinations(player) {
  console.log("launching buyDestinations");
  $(".modal-body").html('You have ξ' + game.currentPlayer.balance + ' in the bank.<br />'
    + "That's enough to buy your next destination!<br />"
    + 'Would you like to buy ' + game.destinationStrings[player.destinationProgress] + '?');

  //Take the steps for the player to buy the property if click yes
  //else take the player to buy establishment
  $('#yes').on('click', {player: player} ,function(evt) {
    console.log("Entering yes DESTINATION function. Current player is " + evt.data.player.name)
    evt.data.player.balance -= ((evt.data.player.destinationProgress * 5) + 10);

    if ((game.activeDestination.first()).hasClass('purchased')) {
        (game.activeDestination.last()).css("background-color", evt.data.player.color);
        (game.activeDestination.last()).removeClass('unpurchased');
        (game.activeDestination.last()).addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeDestination.first()).css("background-color", evt.data.player.color);
        (game.activeDestination.first()).removeClass('unpurchased');
        (game.activeDestination.first()).addClass('purchased' + " " + evt.data.player.id);
    }
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);
  });
  $('#no').on('click', {player: player} ,function(evt) {
    buyEstablishments(game.currentPlayer);
});
}


function buyEstablishments(player) {
  $(".modal-body").html('You have ξ' + player.balance +
    ' in the bank.<br />' + 'Would you like to buy ' +
    game.establishmentStrings[game.currentRoll] + '?');

  //Take the steps for the player to buy the property
  $('#yes').on('click', {player: player} ,function(evt) {
    console.log("Entering yes function. Current player is " + evt.data.player.name)
    evt.data.player.balance -= (game.currentRoll + 1);

    //Use the classes to mark properties as purchased and which player owns it
    //This code seems really chunky. There must be a better way.
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
  game.player2.balance = 10
})
