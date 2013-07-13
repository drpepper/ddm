var GENOME_LENGHT = 10;
var GENE_WIDTH = 20; 
var GENE_COLOR = {
  "A": "#f00",
  "D": "#0f0",
  "R": "#00f"
};

var fightList = [];

$(document).ready(function() {
 var stage = new Kinetic.Stage({
    container: 'game',
    width: 900,
    height: 600
  });

  var layer = new Kinetic.Layer();

  var m1 = genMonster();
  var m2 = genMonster();

  layer.add(new Kinetic.Text({ 
    x: 0,
    y: 00,
    text: "MATCH",
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'black'
  }));

  layer.add(new Kinetic.Text({ 
    x: stage.getWidth() - 100,
    y: 0,
    text: "MATE",
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'black'
  }));

  layer.add(new Kinetic.Rect({
    x: 0,
    y: 0,
    width: 200,
    height: stage.getHeight(),
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    opacity: 0.2
  }));

  layer.add(new Kinetic.Rect({
    x: stage.getWidth() - 200,
    y: 0,
    width: 200,
    height: stage.getHeight(),
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    opacity: 0.2
  }));

  var sequences = [
    drawSequence(layer, m1, 300, 100), //.draggable.enable(), // drag(dragStart, dragMove),
    drawSequence(layer, m2, 500, 100) // .draggable.enable() // drag(dragStart, dragMove)
  ];

  // sequences[0][0].animate({ "r": GENE_WIDTH * 1.2 }, 500);

  stage.add(layer);

});


function drawSequence(layer, monster, x, y) {
  var circles = new Kinetic.Group({
    x: x,
    y: y,
    draggable: true
  });
  for(var i in monster.gene)
  {
    var circle = new Kinetic.Circle({
      x: 0,
      y: 0.75 * i * GENE_WIDTH,
      radius: GENE_WIDTH / 2,
      fill: GENE_COLOR[monster.gene[i]],
      stroke: 'black',
      strokeWidth: 2
    });
    circles.add(circle);
  }

  circles.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
  circles.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  circles.on('dragend', function() {
    console.log("dragend", circles.getX() + layer.getX(), circles.getY() + layer.getY());
    if(circles.getX() < 200) {
      fightList.push(monster)
      console.log("fightList", fightList); 
    }
    if(fightList.length == 2) {
      var result = fight(fightList[0], fightList[1]);

      console.log(fightList[0].name);
      console.log(fightList[1].name);

      console.log(result);

      console.log(fightList[0].score);    
      console.log(fightList[1].score);
    }
  });

  layer.add(circles);
  return circles;
}
