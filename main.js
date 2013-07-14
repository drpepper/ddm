var GENOME_LENGHT = 10;
var GENE_WIDTH = 20; 
var GENE_COLOR = {
  "A": "#f00",
  "D": "#0f0",
  "R": "#00f"
};

var monsterList = [];
var fightList = [];
var mateList = [];

var stage = {};

$(document).ready(function() {
  stage = new Kinetic.Stage({
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
    text: "FIGHT",
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

  var sequences = [];

  for(var i = 0; i < 10; i++) {
    sequences.push(drawSequence(layer, genMonster(), 250+(i*45), 100));
  }
    
    var anim = new Kinetic.Animation(function(frame) {
	monsterList.forEach(function(m) {
	    m.circles.getChildren().forEach(function(circle) {
		circle.setX(10 * Math.sin((circle.getY()/10) + frame.time/1000));
	    });
	});
    }, layer);
    anim.start();
  
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
	function createCircle() {
	    var circle = new Kinetic.Circle({
		x: 0, 
		y: 0.75 * i * GENE_WIDTH,
		radius: GENE_WIDTH / 2,
		fill: GENE_COLOR[monster.gene[i]],
		stroke: 'black',
		strokeWidth: 2
	    });
	    
	    circles.add(circle);
	};
	createCircle();
    }

  circles.monster = monster;
  monster.circles = circles;
  monsterList.push(monster);
  layer.add(circles);

  circles.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
  circles.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  circles.on('dragend', function() {
    console.log("dragend", circles.getX() + layer.getX(), circles.getY() + layer.getY());
    updateMonsterLists();

    if(circles.getX() < 200) {
      console.log("fightList", fightList); 

      if(fightList.length == 2) {
        var result = fight(fightList[0], fightList[1]);

        console.log(fightList[0].name);
        console.log(fightList[1].name);

        console.log(result);

        console.log(fightList[0].score);
        console.log(fightList[1].score);

        if(fightList[0].score > fightList[1].score) {
          monsterList = _.without(monsterList, fightList[1]);
          fightList[1].circles.remove();
        } else if(fightList[0].score < fightList[1].score) {
          monsterList = _.without(monsterList, fightList[0]);
          fightList[0].circles.remove();
        }
        updateMonsterLists();
        layer.draw();
      }
    } else if(circles.getX() > stage.getWidth() - 200) {
      if(mateList.length == 2) {
        var crosses = cross(mateList[0], mateList[1]);

        console.log(crosses[0].name);
        console.log(crosses[1].name);

          drawSequence(layer, crosses[0], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.33), interpolate(mateList[0].circles.getY(), mateList[1].circles.getY(), 0.33));
        drawSequence(layer, crosses[1], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.66), interpolate(mateList[0].circles.getY(), mateList[1].circles.getY(), 0.66));
        layer.draw();
      }
    }
  });

  return circles;
}

function interpolate(a, b, p) { return a + (b - a) * p; }

function updateMonsterLists() { 
  fightList = [];
  mateList = [];
  for(i in monsterList) {
    if(monsterList[i].circles.getX() < 200) {
      fightList.push(monsterList[i]);
    } else if(monsterList[i].circles.getX() > stage.getWidth() - 200) {
      mateList.push(monsterList[i]);
    }
  }
}
