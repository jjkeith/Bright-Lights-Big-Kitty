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

    //DOM variables. Need to add a bunch!
    $h1: $('<h1>'),
    estA1: $('#estA1'),

    establishmentCardsFront: ['', $('#estA1'), $('#estA2'), $('#estA3'), $('#estA4'), $('#estA5') $('#estA6')],

    //gameplay variables
    currentPlayer: null,
    currentRoll: null,

    //dialog string variables
    strings: ['', "The Veterinary Offices of Katz & Nuzzle for ξ1",
      "Tuna 'R' Us for ξ2",
      "Purrfect Coif Groomer for ξ3",
      "Clawsitive Reinforcement Training Academy for ξ4",
      "Pawsplay Costume Rentals for ξ5",
      "Flea Strasburg Acting School for ξ6"],
}


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

//activate the roll button
game.roll.click(function(){
  //make the roll button work if start hasn't been pushed
  if (game.currentPlayer == null) {
    game.currentPlayer = game.player1
  }
  game.currentRoll = (Math.ceil(Math.random() * 6));
  console.log(game.currentPlayer.id + " rolled a " + game.currentRoll);
  $(".modal-title").html('');
  $(".modal-title").html(game.currentPlayer.id + ' rolled a ' + game.currentRoll);
  $(".modal-body").html('');
  $(".modal-footer").html('');
  if (game.currentPlayer.balance >= game.currentRoll) {
    $(".modal-body").html('You have ' + game.currentPlayer.balance +
      'ξ in the bank.<br />' + 'Would you like to buy ' +
      game.strings[game.currentRoll] + '?');
    $(".modal-footer").html('');
//Can this be done better with a toggle class?
    $(".modal-footer").html("<button type='button' class='btn btn-default' data-dismiss='modal'>No</button><button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Yes</button>");
    $('#yes').click(function() {
      game.currentPlayer.balance -= game.currentRoll;
      if estA[game.currentRoll].hasClass('unpurchased')) {
        estA[game.currentRoll].toggleClass('purchased');
        estA[game.currentRoll].css("color", game.currentPlayer.color)
    }
      console.log(game.currentPlayer.id + ' has ξ' + game.currentPlayer.balance + ' in the bank.')

      })
  } else {
      // $(".modal-title").html('');
      // $(".modal-title").html('You rolled a ' + game.currentRoll);
      $(".modal-body").html('You have ' + game.currentPlayer.balance + 'ξ in the bank.<br />' + 'Sorry, that is not enough to buy ' + game.strings[game.currentRoll]);
      console.log(game.currentPlayer.id + ' has ξ' + game.currentPlayer.balance + ' in the bank.')
    }
    switchTurns ();
  })



//switch statement
//associate the rolls with cards
// var assignEstablishments = function () {
//   if (game.currentRoll == 1) {
//     alert("Would you like to buy The Veterinary Offices of Katz & Nuzzle for ξ1?");
//       if
//   }

// }

// Switch players
var switchTurns = function () {
if (game.currentPlayer == game.player1) {
  game.currentPlayer = game.player2;
} else {
  game.currentPlayer = game.player1;
}
}

//Activate the reset button
game.reset.click(function() {
  console.log("reset")
  currentPlayer = null;
})
