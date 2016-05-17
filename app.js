//Hey, me. What you need to do now is fix the mechanism for EARNING money.
//Once you get that shit done, you need to deal with destinations, including
//asking every player with more than 10 coins if they want to buy.

var game = {
  // player object; start each player with 10 cat coins
  player1: {
    id: 'Player 1',
    balance: 10,
    color: '#448888',
    balanceDisplay: $('.player1BalanceDisplay'),
    announce: $('#player1Announce'),
  },
  player2: {
    id: 'Player 2',
    balance: 10,
    color: '#b1d46a',
    balanceDisplay: $('.player2BalanceDisplay'),
    announce: $('#player2Announce'),
  },

    // button variables
    start: $('#start'),
    reset: $('#reset'),
    roll: $('#roll'),

    //DOM variables.
    $h1: $('<h1>'),

    // player1BalanceDisplay: $('.player1BalanceDisplay'),
    // player2BalanceDisplay: $('.player2BalanceDisplay'),
    // player1Announce: $('#player1Announce'), // turns yellow when it's player 1's turn
    // player2Announce: $('#player2Announce'), // turns yellow when it's player 2's turn

    //gameplay variables
    currentPlayer: null,
    currentRoll: null,
    activeProperty: null,

    //dialog string variables
    strings: ["The Veterinary Offices of Katz & Nuzzle for ξ1",
      "Tuna 'R' Us for ξ2",
      "Purrfect Coif Groomer for ξ3",
      "Clawsitive Reinforcement Training Academy for ξ4",
      "Pawsplay Costume Rentals for ξ5",
      "Flea Strasburg Acting School for ξ6"],
}
//display balances at start of game
function  updateBalances() {
  game.player1.balanceDisplay.html('ξ' + game.player1.balance);
  game.player2.balanceDisplay.html('ξ' + game.player2.balance);
}
updateBalances();

//Activate the start button and randomize a starting player
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

//activate the roll button and play a turn
//WHEN THE BUTTON IS CLICKED THE ENTIRE FUNCTION RUNS AND DOESN'T WAIT FOR FEEDBACK
//because this code runs all at once, the switchTurns causes the wrong accounts to be charged
//is setInterval an option?
//https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
game.roll.click(function(){
  //make the roll button work if start hasn't been pushed
  if (game.currentPlayer == null) {
    game.currentPlayer = game.player1
  }
  //create a die roll from 0 to 5
  game.currentRoll = (Math.floor(Math.random() * 6));

  //give the user a normalized 1 through 6 die roll
  $(".modal-title").html(game.currentPlayer.id + ' rolled a ' +
    (game.currentRoll + 1));

  //define the active property
  game.activeProperty = $('[data-number=' + game.currentRoll +']')
  console.log(game.activeProperty[0] + ' is the active property')

  // if the establishment is unpurchased and the player has enough money, give
  //them the option to buy
  if (game.currentPlayer.balance >= (game.currentRoll + 1)) {
    if (((game.activeProperty.first()).hasClass('unpurchased'))
      || ((game.activeProperty.last()).hasClass('unpurchased'))) {
        purchaseOption(game.currentPlayer);
      } else {
          $(".modal-body").html('Both of the properties for this roll have been purchased.')
      }
    } else {
      $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
        ' in the bank.<br />' + 'Sorry, that is not enough to buy ' +
        game.strings[game.currentRoll]);
    }

    //this is where people are supposed to be earning rent, but it's not working
    if ((game.activeProperty.first()).hasClass('player1') ||
        (game.activeProperty.last()).hasClass('player1')) {
      game.player1.balance += game.currentRoll + 1;
      console.log('Player 1 now has ξ' + game.player1.balance)
    } else if ((game.activeProperty.first()).hasClass('player2') ||
        (game.activeProperty.last()).hasClass('player2')) {
      game.player2.balance += game.currentRoll + 1;
      console.log('Player 2 now has ξ' + game.player2.balance)
    }

    updateBalances();
    console.log(switchTurns)
    switchTurns ();
})

// Switch players, switch active player to yellow
function  switchTurns () {
  if (game.currentPlayer == game.player1) {
    game.currentPlayer = game.player2;
    game.player2.announce.css('color', 'yellow');
    game.player1.announce.css('color', 'black');
  } else {
    game.currentPlayer = game.player1;
    game.player1.announce.css('color', 'yellow');
    game.player2.announce.css('color', '#121212');
  }
}

function purchaseOption(player) {
  $(".modal-body").html('You have ξ' + player.balance +
    ' in the bank.<br />' + 'Would you like to buy ' +
    game.strings[game.currentRoll] + '?');

  //Can this be done better with a toggle class?
  // $(".modal-footer").html("<button type='button' class='btn btn-default' data-dismiss='modal'>No</button><button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Yes</button>");

  //Take the steps for the player to buy the property
  $('#yes').on('click', {player: player} ,function(evt) {
    console.log(evt.data);
    console.log("Entering yes function. Current player is " + evt.data.player.id)

    evt.data.player.balance -= (game.currentRoll + 1);

    //Use the classes to mark properties as purchased and which player owns it
    //This code seems really chunky. There must be a better way.
    if ((game.activeProperty.first()).hasClass('purchased')) {
        (game.activeProperty.last()).css("background-color", evt.data.player.color);
        (game.activeProperty.last()).removeClass('unpurchased');
        (game.activeProperty.last()).addClass('purchased' + "'" + evt.data.player + "'");
    } else {
        (game.activeProperty.first()).css("background-color", evt.data.player.color);
        (game.activeProperty.first()).removeClass('unpurchased');
        (game.activeProperty.first()).addClass('purchased' + "'" + evt.data.player + "'");
    }
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);

  });
}
//Activate the reset button
game.reset.click(function() {
  console.log("reset")
  currentPlayer = null;
})
