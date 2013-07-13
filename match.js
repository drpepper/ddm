var LIFE_POINTS = 3;


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

// Returns an object representing fitness, like { attack: 3, defense: 4, reproduction: 7 }
function fitness(championGenes) {

}

function complement(leftOrRight) { return leftOrRight === "left" ? "right" : "left" }