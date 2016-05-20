/*\ primary issues:
|*| • currentPlayer highlighting is not looking it's best
|*| • Reset button is not 100%
|*| • Attempts to make money flash yellow when it changs are not going well
|*| • I have the JS to recognize some keycommands, but I don't know how to hook it up to interacting with the modal.
\*/

var game = {
  // player object; start each player with 9 cat coins
  player1: {
    name: 'Player 1',
    id: 'player1',
    balance: 9,
    color: '#E15554',
    balanceDisplay: $('#player1BalanceDisplay'),
    announce: $('#player1Announce'),
    destinationProgress: 0
  },
  player2: {
    name: 'Player 2',
    id: 'player2',
    balance: 9,
    color: '#3BB273',
    balanceDisplay: $('#player2BalanceDisplay'),
    announce: $('#player2Announce'),
    destinationProgress: 0
  },

    // button variables
    start: $('#start'),
    reset: $('#reset'),
    roll: $('#roll'),
    submit: $('#submit'),

    //gameplay variables
    currentPlayer: null,
    currentRoll: null,
    activeEstablishment: null,
    activeDestination: null,

    allCards: $('.card'),

    //Methods

    //This function is meant to flash the balance in yellow when it changes. Not working.
    updateBalances: function () {
      var p1BalBefore = game.player1.balance;
      var p2BalBefore = game.player2.balance;
      game.player1.balanceDisplay.html('ξ' + game.player1.balance);
      game.player2.balanceDisplay.html('ξ' + game.player2.balance);
      var p1BalAfter = game.player1.balance;
      var p2BalAfter = game.player2.balance;
      if (p1BalBefore != p1BalAfter) {
        setTimeout(function(){
            game.player1.balanceDisplay.css({'color': '#E1BC29'});
          }, 1000);
      } else if (p2BalBefore != p2BalAfter) {
        setTimeout(function(){
            game.player1.balanceDisplay.css({'color': '#E1BC29'});
          }, 1000);
      }
    },
    activeConsole: function () {
      game.currentPlayer.announce.css({'color': '#E1BC29'}) },
    inactiveConsole: function () {
      game.currentPlayer.announce.css({'color': '#333'}) },
    countAvailableEstablishments: function () {
      if ( (game.activeEstablishment.first() ).hasClass('unpurchased')
        && (game.activeEstablishment.last() ).hasClass('unpurchased') ) {
          return 2
        } else if ( (game.activeEstablishment.first() ).hasClass('purchased')
                 && (game.activeEstablishment.last() ).hasClass('purchased') ) {
            return 0
        } else {
            return 1
        } },
      countPlayer1OwnedEstablishments: function () {
        if ( (game.activeEstablishment.first() ).hasClass('player1')
          && (game.activeEstablishment.last() ).hasClass('player1') ) {
            return 2;
          } else if ( (game.activeEstablishment.first() ).hasClass('player1')
                  || (game.activeEstablishment.last() ).hasClass('player1') ) {
            return 1;
          } else {
            return 0;
          }
        },
        countPlayer2OwnedEstablishments: function () {
          if ( (game.activeEstablishment.first() ).hasClass('player2')
            && (game.activeEstablishment.last() ).hasClass('player2') ) {
              return 2;
            } else if ( (game.activeEstablishment.first() ).hasClass('player2')
                    || (game.activeEstablishment.last() ).hasClass('player2') ) {
              return 1;
            } else {
              return 0;
            }
          }
        }

var modal = {
  header: function() { $(".modal-title").html('<h2>' + game.currentPlayer.name + ' rolled a <big>'
    + modal.rollArray[game.currentRoll] + '</big></h2>'); },
  headerPurge: function() { $(".modal-title").html(''); },
  headerColor: function () { $(".modal-header").css('background-color', game.currentPlayer.color); },
  headerWin: function () { $(".modal-header").html('<h4>' + game.currentPlayer.name + ' WON!!!! OMG!!</h4>'); },
  bodyGreeting: function () {$(".modal-body").html("<h4>Please enter your names.</h4><form role='form'><div class='form-group'>" +
    "<label for='player-1'>Player 1</label><input type='text' class='form-control' id='player1Input' placeholder='Player 1'>" +
    "<label for='player-2'>Player 2</label><input type='text' class='form-control' id='player2Input' placeholder='Player 2'>" +
    "</div><center><button type='submit' class='btn btn-neutral' id = 'submit'></span>Submit</button></center></form>" +
    "<br /><img src='greeting.gif' alt='greeting cat' height='200'>") },
  bodyGreetingPage2: function () {$(".modal-body").html("<p>The goal of Hairballerz is to collect establishments that " +
    "will earn rent for you. Once you start amassing some cat coinz (ξ), you can buy destinations that will increase " +
    "your establishments' rent and get you closer to winning the title of Chief Hairballerz.</p>" +
    "<br /><h3>" + game.currentPlayer.name + " goes first!<br /><img src='cat5.gif' alt='space cat' height='200'>") },
  bodyEstablishment: function () { $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
      ' in the bank.<br />' + 'Would you like to buy ' + modal.establishmentStrings[game.currentRoll] +
      "?<br /><img src='cat1.gif' alt='space cat' height='200'>"); },
  bodyDestination: function () { $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
    ' in the bank.<br />'  + "That's enough to buy a destination!<br />" + 'Would you like to buy the ' +
      modal.destinationStrings[game.currentPlayer.destinationProgress] + "?<br /><img src='cat4.gif' alt='space cat' height='200'>"); },
  bodyBothPurchased: function () { $(".modal-body").html('Both of the properties for this roll have been purchased.' +
      "<br /><img src='cat3.gif' alt='space cat' height='200'>") },
  bodyNotEnoughCash: function () { $(".modal-body").html('You have ξ' + game.currentPlayer.balance +
      ' in the bank.<br />' + 'Sorry, that is not enough to buy ' + modal.establishmentStrings[game.currentRoll] +
      "<br /><img src='cat2.gif' alt='space cat' height='200'>"); },
  bodyOkThen: function () { $(".modal-body").html('Okay then. You have ξ' + game.currentPlayer.balance +
      ' in the bank.<br />' + 'Would you like to buy ' + modal.establishmentStrings[game.currentRoll] + '?' +
      "<br /><img src='cat5.gif' alt='space cat' height='200'>"); },
  bodyWin: function() { $(".modal-body").html("Do you want to play again?<br /><img src='winner.gif' alt='winner cat' height='200'>"); },
  footerYay: function () {  $(".modal-footer").html("<button type='button'" +
      "class='btn btn-default' data-dismiss='modal' id = 'yay'>yay!</button>"); },
  footerOhWell: function () {  $(".modal-footer").html("<button type='button'" +
      "class='btn btn-default' data-dismiss='modal' id = 'oh'>Oh well</button>"); },
  footerNah: function () { $(".modal-footer").html("<button type='button' class='btn btn-default'" +
      " data-dismiss='null' id = 'nah'>Nah</button>" + "<button type='button' class='btn" +
      " btn-primary' data-dismiss='modal' id = 'yes'>Totally!</button>"); },
  footerNope: function() { $(".modal-footer").html("<button type='button' class='btn btn-default'" +
      " data-dismiss='modal' id = 'nope'>Nope</button><button type='button'" +
      " class='btn btn-primary' data-dismiss='modal' id = 'yes'>Let's build an empire!</button>"); },
  footerBlank: function() { $(".modal-footer").html(""); },
  ohClick: function () { console.log( "switchTurns" );
        switchTurns();
        $( "#oh" ).on( "click" ); },

  //dialog string variables
  rollArray: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
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
game.updateBalances();

greetingModal();

//Enable the start button
$('body').on("click", game.submit, function() {
});

//Bring up a form where users can input their names
function greetingModal() {
  game.start.click(function() {
  console.log("start")
  game.updateBalances();
  modal.bodyGreeting();
  modal.footerBlank();
  $('#myModal').modal('show');
  $('#submit').on('click', function(evt) {
  game.player1.name = $('#player1Input').val();
  game.player2.name = $('#player2Input').val();
  game.player1.announce.html('<h3>'+ game.player1.name + '</h3>');
  game.player2.announce.html('<h3>'+ game.player2.name + '</h3>');
  startGame()
  });
})
};

function startGame () {
  //update the game with the players' name
    game.updateBalances();

  //choose a first player
  var random = Math.random();
  if (random < .5) {
    game.currentPlayer = game.player1;
    console.log("Player 1's turn");
  } else  {
    game.currentPlayer = game.player2;
    console.log("Player 2's turn");
  }

  modal.headerColor();
  modal.bodyGreetingPage2();
  modal.footerYay()

  $('#yay').on('click', function(evt) {
    startGame()
    modal.header();
    $('#myModal').modal('hide');
  });
}






///////////////*Major Roll Function*\\\\\\\\\\\\\\\\\\\\\\\\

//roll the die and buy properties
game.roll.click(function() {
  //make the roll button work if start hasn't been pushed
  if ( game.currentPlayer == null ) {
    game.currentPlayer = game.player1;
  }

  //create a die roll from 0 to 5 that coordinates with array indeces.
  game.currentRoll =  Math.floor(Math.random() * modal.rollArray.length);
  console.log(game.currentPlayer.name + ' rolled a ' + (game.currentRoll + 1));

  //define the active property, of which there are multiple copies
  game.activeEstablishment = $('[data-number=' + game.currentRoll +']')
  game.activeDestination = $('[data-number=' + (game.currentPlayer.destinationProgress + 10) +']')

  //Pay rent to the players
  payRent(game.currentPlayer);
  game.updateBalances();

  //Populate the modal
  modal.headerColor();
  modal.header();
  modal.footerNah();
  modal.bodyEstablishment(); //make est the default message

  if ( game.currentPlayer.balance > (game.currentPlayer.destinationProgress * 4) + 10 )  {
      buyDestinations(game.currentPlayer);
  } else if ( game.countAvailableEstablishments() > 0 ) {
      if ( game.currentPlayer.balance >= (game.currentRoll + 1) ) {
        buyEstablishments(game.currentPlayer);
      } else {
        modal.header();
        modal.footerOhWell();
        modal.bodyNotEnoughCash();
        modal.ohClick(); // includes switchTurns
      }
  } else if ( game.countAvailableEstablishments() === 0 ){
    modal.header();
    modal.footerOhWell();
    modal.bodyBothPurchased();
    modal.ohClick(); // includes switchTurns
  }
  game.updateBalances();
});

///////////////*Helper Functions*\\\\\\\\\\\\\\\\\\\\\\\\

// Switch players, highlight active players
//make the modal header match the player's color
function  switchTurns () {
  game.inactiveConsole();
  if ( game.currentPlayer.destinationProgress == modal.rollArray.length ) {
    winGame();
  } else if ( game.currentPlayer == game.player1 ) {
    game.currentPlayer = game.player2;
  } else {
    game.currentPlayer = game.player1;
  }
  game.activeConsole();
}

function winGame () {
  $('#myModal').modal('show');
  modal.headerWin();
  modal.bodyWin();
  modal.footerNah();

  $('#yes').on('click', function(evt) {
    game.reset.click()
  });
  $('#nah').on('click', function(evt) {
    game.reset.click()
  });
}

//Pay rent to the player on every roll
payRent = function(player) {
//Player 1 rent
  console.warn('1 bal before: ' + game.player1.balance + ' ; 2 bal before: ' + game.player2.balance);
  if ( game.player1.destinationProgress <= game.currentRoll ) {
    game.player1.balance += ( game.currentRoll + 1 ) * (game.countPlayer1OwnedEstablishments () )
  } else {
    game.player1.balance += ( game.currentRoll + 2) * (game.countPlayer1OwnedEstablishments() )
  }

//Player2 rent
  if ( game.player2.destinationProgress <= game.currentRoll ) {
    game.player2.balance += ( game.currentRoll + 1 ) * (game.countPlayer2OwnedEstablishments () )
  } else {
    game.player2.balance += ( game.currentRoll + 2) * (game.countPlayer2OwnedEstablishments() )
  } console.warn('1 bal after : ' + game.player1.balance + ' ; 2 bal after : ' + game.player2.balance);
}

//guide the player through buying a destination
function buyDestinations(player) {

//Populate the modal
  modal.header();
  modal.bodyDestination();
  modal.footerNope();

  //Take the steps for the player to buy the property or not
  $('#yes').on('click', {player: player} ,function(evt) {
        evt.data.player.balance -= ((evt.data.player.destinationProgress * 4) + 10);
        game.updateBalances();
        evt.data.player.destinationProgress += 1;

    if ( game.activeDestination.first().hasClass('purchased') ) {
        (game.activeDestination.last() ).css("background-color", evt.data.player.color);
        (game.activeDestination.last() ).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeDestination.first() ).css("background-color", evt.data.player.color);
        (game.activeDestination.first() ).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    }
    console.log('switchTurns')
    switchTurns ();
    });

//if the player declines the destination, offer the establishment corresponding
//to the role (if available)
  $('#nope').on('click', {player: player} ,function(evt) {
    modal.footerNah();
    if ( game.countAvailableEstablishments() > 0 ) {
      modal.bodyOkThen();
      buyEstablishments(game.currentPlayer);
    }
    else {
      modal.bodyBothPurchased();
      modal.footerOhWell();
      modal.ohClick();
    }
    })
}

function buyEstablishments(player) {
  console.log('buying establishment');
  $('#yes').on('click', {player: player} ,function(evt) {
    evt.data.player.balance -= (game.currentRoll + 1);

    // Use the classes to mark properties as purchased and by whom
    if ( (game.activeEstablishment.first() ).hasClass('purchased') ) {
        (game.activeEstablishment.last() ).css("background-color", evt.data.player.color);
        (game.activeEstablishment.last() ).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    } else {
        (game.activeEstablishment.first() ).css("background-color", evt.data.player.color);
        (game.activeEstablishment.first() ).removeClass('unpurchased').addClass('purchased' + " " + evt.data.player.id);
    }
    console.log('switchTurns')
    switchTurns ();
    game.updateBalances();
  });

  $('#nah').on('click', {player: player} ,function(evt) {
    $('#myModal').modal('hide');
    switchTurns();
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
  game.updateBalances();

  //reset css and classes of the cards
  game.allCards.removeClass('purchased player1 player2').addClass('unpurchased');
  $('.behind-destination').css("background-color", "#655893");
  $('.behind-establishment').css("background-color", "#438BC6");
  $('.establishment').css("background-color", "#4D9DE0");
  $('.destination').css("background-color", "#7768AE");

  //Reset the player announce bars
  game.player1.annouce.style({'color': '#333', 'border': '2px solid #121212'});
  game.player2.annouce.style({'color': '#333', 'border': '2px solid #121212'});
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

//________________________END CODE____________________________

///////////////*Experimental Functions*\\\\\\\\\\\\\\\\\\\\\\\\

//templates for adding key commands to the modal
//
// $(document).keydown(function(e){
//     if (e.keyCode == 78) {
//        console.log( "n" );
//     }
// });
//
// $(document).keydown(function(e){
//     if (e.keyCode == 13) {
//        console.log( "enter" );
//     }
// });
//
// $(document).keydown(function(e){
//     if (e.keyCode == 27) {
//        console.log( "esc" );
//       //  /main modal look for documentatin about closing/hide
//     }
// });
//
// // want to add hitting the Y key to also act as #yes on click. How to have to event listeners doing the same thing?
//   $(document).keydown(function(e){
//       if (e.keyCode == 89) {
//          console.log( "y" );
//       }
//   });
//
//   $(document).ready(function(){
//       /* Get iframe src attribute value i.e. YouTube video url
//       and store it in a variable */
//       var url = $("#cartoonVideo").attr('https://www.youtube.com/watch?v=gVQWxlRE52Q');
//
//       /* Assign empty url value to the iframe src attribute when
//       modal hide, which stop the video playing */
//       $("#myModal").on('hide.bs.modal', function(){
//           $("#cartoonVideo").attr('src', '');
//       });
//   });
//
