//Hey, me. What you need to do now is set up the mechanism for EARNING money.
//You also need to work on displaying the balance on the page.
//Once you get that shit done, you need to deal with destinations, including
//asking every player with more than 10 coins if they want to buy.

var game = {
  // player object; start each player with 4 cat coins
  player1: {
    id: 'Player 1',
    balance: 4,
    color: '#448888'},
  player2: {
    id: 'Player 2',
    balance: 4,
    color: '#b1d46a'},

    // button variables
    start: $('#start'),
    reset: $('#reset'),
    roll: $('#roll'),

    //DOM variables.
    $h1: $('<h1>'),
    activeProperty: null,
    player1BalanceDisplay: $('.player1BalanceDisplay'),
    player2BalanceDisplay: $('.player2BalanceDisplay'),
    player1Announce: $('#player1Announce'),
    player2Announce: $('#player2Announce'),

    //gameplay variables
    currentPlayer: null,
    currentRoll: null,

    //dialog string variables
    strings: ["The Veterinary Offices of Katz & Nuzzle for ξ1",
      "Tuna 'R' Us for ξ2",
      "Purrfect Coif Groomer for ξ3",
      "Clawsitive Reinforcement Training Academy for ξ4",
      "Pawsplay Costume Rentals for ξ5",
      "Flea Strasburg Acting School for ξ6"],
}
//display balances at start of game
game.player1BalanceDisplay.html('ξ' + game.player1.balance);
game.player2BalanceDisplay.html('ξ' + game.player2.balance);

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
  game.currentRoll = (Math.floor(Math.random() * 5));

  //console.log the real roll
  console.log(game.currentPlayer.id + " rolled a " + game.currentRoll);
  $(".modal-title").html('');

  //give the user a normalized 1 through 6 die roll
  $(".modal-title").html(game.currentPlayer.id + ' rolled a ' +
    (game.currentRoll + 1));

  //strip the body and footer html out of the modal
  $(".modal-body").html('');
  $(".modal-footer").html('');

  //define the active property
  game.activeProperty = $('[data-number=' + game.currentRoll +']')
  console.log(game.activeProperty[0] + ' is the active property')

  // if the establishment is unpurchased and the player has enough money, give
  //them the option to buy
  if (game.currentPlayer.balance >= (game.currentRoll + 1)) {
    if (((game.activeProperty.first()).hasClass('unpurchased'))
      || ((game.activeProperty.last()).hasClass('unpurchased'))) {
        $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
          ' in the bank.<br />' + 'Would you like to buy ' +
          game.strings[game.currentRoll] + '?');

        //Can this be done better with a toggle class?
        $(".modal-footer").html("<button type='button' class='btn btn-default' data-dismiss='modal'>No</button><button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Yes</button>");

        //Take the steps for the player to buy the property
        $('#yes').click(function() {
          game.currentPlayer.balance -= (game.currentRoll + 1);

          //Use the classes to mark properties as purchased and which player owns it
          //This code seems really chunky. There must be a better way.
          if ((game.activeProperty.first()).hasClass('purchased')) {
              (game.activeProperty.last()).css("background-color", game.currentPlayer.color);
              (game.activeProperty.last()).removeClass('unpurchased');
              (game.activeProperty.last()).toggleClass('purchased' + "'" + game.currentPlayer + "'");
          } else {
              (game.activeProperty.first()).css("background-color", game.currentPlayer.color);
              (game.activeProperty.first()).removeClass('unpurchased');
              (game.activeProperty.first()).toggleClass('purchased' + "'" + game.currentPlayer + "'");
          }
        })
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

    //display updated balances
    //I'd really like the balances to flash yellow when changed
    game.player1BalanceDisplay.html('ξ' + game.player1.balance);
    game.player2BalanceDisplay.html('ξ' + game.player2.balance);

    console.log(game.currentPlayer.id + ' has ξ' + game.currentPlayer.balance + ' in the bank.')
    switchTurns ();
})


// Switch players, switch active player to yellow
var switchTurns = function () {
  if (game.currentPlayer == game.player1) {
    game.currentPlayer = game.player2;
    game.player2Announce.css('color', 'yellow');
    game.player1Announce.css('color', 'black');
  } else {
    game.currentPlayer = game.player1;
    game.player1Announce.css('color', 'yellow');
    game.player2Announce.css('color', '#121212');
  }
}

//Activate the reset button
game.reset.click(function() {
  console.log("reset")
  currentPlayer = null;
})
