var LIFE_POINTS = 3;
var GENOME_LENGHT = 10;


// Left and right are player structures, like { defense: 5, attack: 4, reproduction: 9 }
// Returns an object like { winner: "left", rounds: [ { attacker: "right", "winner": "left" }, ... ] }
function battle(left, right) {
  var players = { left: left, right: right };
  var lifePoints = { left: LIFE_POINTS, right: LIFE_POINTS };
  var history = [];
  var attacker = Math.random() > 0.5 ? "left" : "right";
  while(lifePoints.left > 0 && lifePoints.right > 0) {
    var attackValue = players[attacker].attack * Math.random();
    var defenseValue = players[complement(attacker)].defense * Math.random();
    var round = { attacker: attacker };

    if(attackValue > defenseValue) {
      lifePoints[complement(attacker)]--;
      round.winner = attacker;
    } else {
      round.winner = complement(attacker);
    }

    history.push(round);

    attacker = complement(attacker);
  }
  var winner = lifePoints.left > 0 ? "left" : "right";
  return { winner: winner, history: history };
}

// takes two gene codes and produces a clone
function cross(left, right) {
  var players = { left: left, right : right };
  var newPlayer = [];
  for(var i in left)
  {
    var giver = Math.random() > 0.5 ? "left" : "right";
    newPlayer.push(players[giver][i]);
  }
  return newPlayer;
}


// Returns a list like [ {"attack": 3 }, { "defense": 2 }, ... ]
function findGroups(genome) {
  var groups = [];
  var currentGroup = {};
  for(var i in genome)
  {
    if(!currentGroup) { 
      currentGroup = {};
      currentGroup[genome[i]] = 1;
    }
    else if(currentGroup[genome[i]]) {
      c
    }


  }
}

function complement(leftOrRight) { return leftOrRight === "left" ? "right" : "left" }