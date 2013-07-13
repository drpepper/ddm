var GENOME_LENGHT = 10;
var GENE_WIDTH = 40; 

$(document).ready(function() {
  var paper = new Raphael("game", 900, 600);

    var m1 = genMonster();
    var m2 = genMonster();

    var result = fight(m1, m2);


    console.log(m1.name);
    console.log(m2.name);

    console.log(result);

    console.log(m1.score);    
    console.log(m2.score);

  var genomes = [
      m1.gene,
      m2.gene
  ];

  

  var playerName = paper.text(20, 100, "Player");
  var playerPoints = paper.text(20, 110, String(13));

  var enemyName = paper.text(20, 150, "Enemy");
  var enemyPoints = paper.text(20, 160, String(11));

  var sequences = [
    drawSequence(paper, genomes[0], 70, 100),
    drawSequence(paper, genomes[1], 70, 150)
  ];

  sequences[0][0].animate({ "r": GENE_WIDTH * 1.2 }, 500);
});


function drawSequence(paper, sequence, x, y) {
  var circles = []
  for(var i in sequence)
  {
    var circle = paper.circle(x + 1.5 * i * GENE_WIDTH, y, GENE_WIDTH / 2);
    switch(sequence[i]) {
      case "A": circle.attr("fill", "#f00"); break;
      case "D": circle.attr("fill", "#0f0"); break;
      case "R": circle.attr("fill", "#00f"); break;
    }
    circle.attr("stroke", "#000");

    circles.push(circle);
  }
  return circles;
}
