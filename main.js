var GENOME_LENGHT = 10;
var GENE_WIDTH = 40; 
var GENE_COLOR = {
  "A": "#f00",
  "D": "#0f0",
  "R": "#00f"
};

$(document).ready(function() {
   var stage = new Kinetic.Stage({
      container: 'game',
      width: 900,
      height: 600
    });

  var layer = new Kinetic.Layer();

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
    
  var playerName = new Kinetic.Text({ 
    x: 20,
    y: 100,
    text: "Player",
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green'
  });
  /*var playerPoints = Kinetic.Text({ 
    x: 20, 
    y: 110, 
    text: String(13)
  });

  var enemyName = Kinetic.Text({ 
    x: 20, 
    y: 150, 
    text: "Enemy"
  });
  var enemyPoints = Kinetic.Text({ 
    x: 20, 
    y: 160, 
    text: String(11)
  });*/

  var sequences = [
    drawSequence(layer, genomes[0], 70, 100), //.draggable.enable(), // drag(dragStart, dragMove),
    drawSequence(layer, genomes[1], 70, 150) // .draggable.enable() // drag(dragStart, dragMove)
  ];

  // sequences[0][0].animate({ "r": GENE_WIDTH * 1.2 }, 500);

  stage.add(layer);

});


function drawSequence(layer, sequence, x, y) {
  var circles = new Kinetic.Group({
    draggable: true
  });
  for(var i in sequence)
  {
    var circle = new Kinetic.Circle({
        x: x + 1.5 * i * GENE_WIDTH,
        y: y,
        radius: GENE_WIDTH / 2,
        fill: GENE_COLOR[sequence[i]],
        stroke: 'black',
        strokeWidth: 4
      });

    circles.add(circle);

    circles.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
    circles.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
  }
  layer.add(circles);
  return circles;
}
