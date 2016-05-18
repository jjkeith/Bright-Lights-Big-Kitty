/*\ primary issues:
|*| • The rent is not being paid properly
|*| • Can't buy destination three or higher
|*| • The winner checker in switchTurns is working as a console.log, but the modal is wonky.
|*| • If a player owns two properties, they are only getting rent for one.
|*| • I have the JS to recognize some keycommands, but I don't know how to hook it up to interacting with the modal.
|*| • Prompt players to enter their names and replace "player1" and "player2" with names?
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

    allCards: $('.card'),

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



//Activate the start button and randomize a starting player
game.start.click(function() {
  console.log("start")
  updateBalances();
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

///////////////*Major Roll Function*\\\\\\\\\\\\\\\\\\\\\\\\

//roll the die and buy properties
game.roll.click(function(){
  //make the roll button work if start hasn't been pushed
  if (game.currentPlayer == null) {
    game.currentPlayer = game.player1
    $(".modal-header").css('background-color', game.currentPlayer.color);
  }
  //create a die roll from 0 to 5 that coordinates with array indeces.
  game.currentRoll = (Math.floor(Math.random() * 6));
  console.warn(game.currentPlayer.name + ' rolled a ' + (game.currentRoll + 1));

  //give the user a normalized 1 through 6 die roll
  $(".modal-title").html(game.currentPlayer.name + ' rolled a ' +
    (game.currentRoll + 1));

  //populate the modal footer with yes/no buttons
  $(".modal-footer").html("<button type='button' class='btn btn-default'" +
    " data-dismiss='null' id = 'no'>Nah</button>" +
      "<button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Totally!</button>");

  //define the active property, of which there are two copies
  game.activeEstablishment = $('[data-number=' + game.currentRoll +']')
  game.activeDestination = $('[data-number=' + (game.currentPlayer.destinationProgress + 9) +']')

  // if player doesn't have enough money to buy the property associated with roll.
  if (game.currentPlayer.balance < (game.currentRoll + 1)) {
    $(".modal-footer").html("<button type='button' class='btn btn-default' data-dismiss='modal' id = 'oh'>Oh, well</button>");
    $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
      ' in the bank.<br />' + 'Sorry, that is not enough to buy ' +
      game.establishmentStrings[game.currentRoll]);
      console.log('sale is not going to happen')
      $('#oh').on('click', function(evt) {
        console.log('switchTurns')
        switchTurns ();
    });

    //Pay rent to the players
    payRent(game.currentPlayer);

  // if the player has enough money to buy establishments, but not enough to buy destinations
  } else if (((game.currentRoll + 1) <= (game.currentPlayer.balance)) &&
      (game.currentPlayer.balance < ((game.currentPlayer.destinationProgress * 4) + 11))) {

    // ensure that the top card is purchased first
    if (((game.activeEstablishment.first()).hasClass('unpurchased'))
      || ((game.activeEstablishment.last()).hasClass('unpurchased'))) {
        $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
          ' in the bank.<br />' + 'Would you like to buy ' +
          game.establishmentStrings[game.currentRoll] + '?');
          buyEstablishments(game.currentPlayer);

      // if this limitation isn't placed, under some circumstances it will run switchTurns x2
      } else if (((game.activeEstablishment.first()).hasClass('purchased'))
        && ((game.activeEstablishment.last()).hasClass('purchased'))) {
          $(".modal-footer").html("<button type='button' class='btn btn-default' data-dismiss='modal' id = 'oh'>Oh, well</button>");
          $(".modal-body").html('Both of the properties for this roll have been purchased.')

          $('#oh').on('click', function(evt) {
            console.log('switchTurns')
            switchTurns ();
          });
          }

    //if the player has enough money to buy the next destination property
    } else if  ((game.currentPlayer.balance) > (game.currentPlayer.destinationProgress * 4) + 11) {
      buyDestinations(game.currentPlayer);
    }
    updateBalances();
})

///////////////*Helper Functions*\\\\\\\\\\\\\\\\\\\\\\\\

// Switch players, highlight active players
//make the modal header match the player's color
function  switchTurns () {
  if (game.currentPlayer.destinationProgress == 6) {
    console.log(game.currentPlayer.name + ' WON!!!! OMG!!')
    //winGame not currently launching
    winGame();
  } else if (game.currentPlayer == game.player1) {
    game.currentPlayer = game.player2;
    game.player2.announce.css({'color': '#E1BC29', 'border': '2px solid #E1BC29'});
    game.player1.announce.css({'color': '#121212', 'border': '2px solid #121212'});
  } else {
    game.currentPlayer = game.player1;
    game.player1.announce.css({'color': '#E1BC29', 'border': '2px solid #E1BC29'});
    game.player2.announce.css({'color': '#121212', 'border': '2px solid #121212'});
  }
  $(".modal-header").css('background-color', game.currentPlayer.color);
}


//display balances at start of game
function updateBalances() {
  game.player1.balanceDisplay.html('ξ' + game.player1.balance);
  game.player2.balanceDisplay.html('ξ' + game.player2.balance);
}


function winGame () {
  $('#myModal').modal('show');
  // $(".modal-body").html("Do you want to play again?<br /><iframe width='560' height='315' src='https://www.youtube.com/embed/gVQWxlRE52Q' frameborder='0' allowfullscreen></iframe>");
  // $(".modal-header").html('<h4>' + game.currentPlayer.name + ' WON!!!! OMG!!</h4>');

  $('#yes').on('click', function(evt) {
    game.reset.click()
  });
}

//Pay rent to the player on every roll
payRent = function(player) {
//Player 1 rent
  if ((game.activeEstablishment.first()).hasClass('player1') &&
      (game.activeEstablishment.last()).hasClass('player1')) {
      game.player1.balance += ((game.currentRoll + 1) * 2);
      var player1rent = ((game.currentRoll + 1) * 2)
  } else if ((game.activeEstablishment.first()).hasClass('player1') ||
      (game.activeEstablishment.last()).hasClass('player1')) {

        //Because a player can only get rent bonuses for the destinationProgress they already have
      if (game.player1.destinationProgress > game.currentRoll) {
          game.player1.balance += (game.currentRoll + 2);
          var player1rent = (game.currentRoll + 2);
      } else {
          game.player1.balance += (game.currentRoll + 1);
          var player1rent = (game.currentRoll + 1);
      }
  console.warn(">>>>>>Player 1 earnings = " + player1rent)

//Player 2 rent
  } else if ((game.activeEstablishment.first()).hasClass('player2') &&
      (game.activeEstablishment.last()).hasClass('player2')) {
      game.player2.balance += ((game.currentRoll + 1) * 2);
      var player2rent = ((game.currentRoll + 1) * 2);
  } else if ((game.activeEstablishment.first()).hasClass('player2') ||
      (game.activeEstablishment.last()).hasClass('player2')) {
        if (game.player2.destinationProgress > game.currentRoll) {
            game.player2.balance += (game.currentRoll + 2);
            var player2rent = (game.currentRoll + 2);
        } else {
            game.player2.balance += (game.currentRoll + 1);
            var player2rent = (game.currentRoll + 1);
        }
  console.warn(">>>>>>Player 2 earnings = " + player2rent)
  }
}

//guide the player through buying a destination
function buyDestinations(player) {
//Populate the modal
  $(".modal-footer").html("<button type='button' class='btn btn-default'" +
    " data-dismiss='modal' id = 'nope'>Nope</button>" +  //////REGARD THE DATA DISMISS
    "<button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Let's build a catpire!</button>");
  $(".modal-body").html('You have ξ' + game.currentPlayer.balance + ' in the bank.<br />'
    + "That's enough to buy a destination!<br />"
    + 'Would you like to buy ' + game.destinationStrings[player.destinationProgress] + '?');

  //Take the steps for the player to buy the property or not
  $('#yes').on('click', {player: player} ,function(evt) {
        console.log('Before' + evt.data.player.balance)
        evt.data.player.balance -= ((evt.data.player.destinationProgress * 4) + 10);
        console.log('After' + evt.data.player.balance)
    evt.data.player.destinationProgress += 1;
        console.log("Destination progress = " + game.player2.destinationProgress + " for player2")
        console.log("Destination progress = " + game.player1.destinationProgress + " for player1")
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);
    if ((game.activeDestination.first()).hasClass('purchased')) {
        (game.activeDestination.last()).css("background-color", evt.data.player.color);
        (game.activeDestination.last()).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeDestination.first()).css("background-color", evt.data.player.color);
        (game.activeDestination.first()).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    }
    console.log('switchTurns')
    switchTurns ();
    });

  $('#nope').on('click', {player: player} ,function(evt) {
    $(".modal-footer").html("<button type='button' class='btn btn-default'" +
      " data-dismiss='modal' id = 'no'>Nah</button>" +
        "<button type='button' class='btn btn-primary' data-dismiss='modal' id = 'yes'>Totally!</button>");

//HELPHELPHELPHELP
    // make a condition that allows the modal if you have already clicked no once
    $(".modal-body").html('Okay then. You have ξ' + player.balance +
      ' in the bank.<br />' + 'Would you like to buy ' +
      game.establishmentStrings[game.currentRoll] + '?');
      buyEstablishments(game.currentPlayer);
    })
}


function buyEstablishments(player) {
  //Take the steps for the player to buy the property
  $('#yes').on('click', {player: player} ,function(evt) {
    // console.log("Entering yes function. Current player is " + evt.data.player.name)
    evt.data.player.balance -= (game.currentRoll + 1);
    // Use the classes to mark properties as purchased and which player owns it
    // This code seems really chunky. There must be a better way.
    if ((game.activeEstablishment.first()).hasClass('purchased')) {
        (game.activeEstablishment.last()).css("background-color", evt.data.player.color);
        (game.activeEstablishment.last()).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeEstablishment.first()).css("background-color", evt.data.player.color);
        (game.activeEstablishment.first()).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    }
    console.log('switchTurns')
    switchTurns ();
    evt.data.player.balanceDisplay.html('ξ' + evt.data.player.balance);
  });
  $('#no').on('click', {player: player} ,function(evt) {
    console.log(evt);
    evt.data.player.balance += 0
    evt.data.player.destinationProgress += 0
});
}


//Activate the reset button
game.reset.click (function() {
  console.log("reset")

  //reset values
  game.currentPlayer = null;
  game.player1.balance = 10;
  game.player2.balance = 10;
  game.player1.destinationProgress = 0;
  game.player2.destinationProgress = 0;
  updateBalances();

  //reset css and classes of the cards
  game.allCards.removeClass('purchased player1 player2').addClass('unpurchased');
  $('.behind-destination').css("background-color", "#655893");
  $('.behind-establishment').css("background-color", "#438BC6");
  $('.establishment').css("background-color", "#4D9DE0");
  $('.destination').css("background-color", "#7768AE");

  //Reset the player announce bars
  game.announce.css({'color': '#121212', 'border': '2px solid #121212'});
  // game.player2.announce.css({'color': '#121212', 'border': '2px solid #121212'});
})

///////////////*Debugging Helpers*\\\\\\\\\\\\\\\\\\\\\\\\

//temp function for checking if winGame is working
function forceWin () {
  game.player1.balance=33;
  game.player1.destinationProgress = 5;
}

function forceLose () {
  game.player1.balance = 0;
  game.player1.destinationProgress = 0;
}


///////////////*Experimental Functions*\\\\\\\\\\\\\\\\\\\\\\\\

//templates for adding key commands to the modal

$(document).keydown(function(e){
    if (e.keyCode == 78) {
       console.log( "n" );
    }
});

$(document).keydown(function(e){
    if (e.keyCode == 13) {
       console.log( "enter" );
    }
});

$(document).keydown(function(e){
    if (e.keyCode == 27) {
       console.log( "esc" );
      //  /main modal look for documentatin about closing/hide
    }
});

// want to add hitting the Y key to also act as #yes on click. How to have to event listeners doing the same thing?
  $(document).keydown(function(e){
      if (e.keyCode == 89) {
         console.log( "y" );
      }
  });

  $(document).ready(function(){
      /* Get iframe src attribute value i.e. YouTube video url
      and store it in a variable */
      var url = $("#cartoonVideo").attr('https://www.youtube.com/watch?v=gVQWxlRE52Q');

      /* Assign empty url value to the iframe src attribute when
      modal hide, which stop the video playing */
      $("#myModal").on('hide.bs.modal', function(){
          $("#cartoonVideo").attr('src', '');
      });
  });

  $("#prompt form").submit(function(e) {

      // close the overlay
      triggers.eq(1).overlay().close();

      // get user input
      var input = $("input", this).val();

      // do something with the answer
      // triggers.eq(1).html(input);
      console.log(input)
  });
