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
var layer;

$(document).ready(function() {
  stage = new Kinetic.Stage({
    container: 'game',
    width: 900,
    height: 600
  });

  layer = new Kinetic.Layer();

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
    
    /* global anim no more 
  var anim = new Kinetic.Animation(function(frame) {
    monsterList.forEach(function(m) {
      m.circles.getChildren().forEach(function(circle) {
        circle.setX(10 * Math.sin((circle.getY()/10) + frame.time/1000));
      });
    });
  }, layer);
  anim.start();
  */
  stage.add(layer);
});


function drawSequence(layer, monster, x, y, addToList) {
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
      
      var anim = new Kinetic.Animation(function(frame) {
          circle.setX(10 * Math.sin((circle.getY()/10) + frame.time/1000));
      }, layer);
      anim.start();
      circles.add(circle);
  };
  createCircle();
    }

    if (addToList !== false) {
	circles.monster = monster;
	monster.circles = circles;
	monsterList.push(monster);
    } else {
	console.log("not adding circles to monster list...");
    }
  layer.add(circles);

  circles.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
  circles.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  circles.on('dragend', function() {
    console.log("dragend", circles.getX() + layer.getX(), circles.getY() + layer.getY());
    snapMonsters();

    if(circles.getX() < 200) {
      console.log("fightList", fightList); 

      if(fightList.length == 2) {
	  var fightLayer = new Kinetic.Layer();
	  fightLayer.add(new Kinetic.Rect({
	      x: 100,
	      y: 100,
	      width: stage.getWidth()-200,
	      height: stage.getHeight()-200,
	      fill: 'white',
	      stroke: 'black',
	      strokeWidth: 2,
	      opacity: 1.0
	  }));
	  stage.add(fightLayer);

          var result = fight(fightList[0], fightList[1]);

	  fightLayer.add(drawSequence(fightLayer, JSON.parse(JSON.stringify(fightList[0])), 
				      150, 150, false));
	  fightLayer.add(drawSequence(fightLayer, JSON.parse(JSON.stringify(fightList[1])), 
				      stage.getWidth()-150, 150, false));

	  fightLayer.draw();

	  var fightY = 35;
	  function nextAction(cb) {
	      action = result.shift();
	      if (action === undefined) {
		  console.log("fight finished");
		  console.log(fightList[0].score);
		  console.log(fightList[1].score);
		  cb();
		  return;
	      }
	      var text = action.attacker+" attacks "+action.defender; 
	      console.log(text);
	      fightLayer.add(new Kinetic.Text({ 
		  x: 100+20,
		  y: 100+fightY,
		  text: text,
		  fontSize: 10,
		  fontFamily: 'Calibri',
		  fill: 'black'
	      }));
	      fightLayer.draw();
	      fightY += 15;
	      setTimeout(function(){
		  nextAction(cb);
	      }, 250);
	  }
	  
	  setTimeout(function() {
	      nextAction(function() {
		  console.log("I'm here!");
		  fightLayer.remove();
		  stage.draw();

		  var toRemove = null; 
		  if(fightList[0].score > fightList[1].score) {
		      toRemove = fightList[1];
		  } else if(fightList[0].score < fightList[1].score) {
		      toRemove = fightList[0];
		  }
		  
		  if(toRemove != null) {
		      monsterList = _.without(monsterList, toRemove);
		      
		      new Kinetic.Tween({
			  node: toRemove.circles, 
			  duration: 0.25,
			  opacity: 0,
			  onFinish: function() { toRemove.circles.remove(); }
		      }).play();
		  }
		  
		  snapMonsters();
		 
	      });
	  }, 1000);
      }
    } else if(circles.getX() > stage.getWidth() - 200) {
      if(mateList.length == 2) {
        var crosses = cross(mateList[0], mateList[1]);

        console.log(crosses[0].name);
        console.log(crosses[1].name);

        drawSequence(layer, crosses[0], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.33), interpolate(mateList[0].circles.getY(), mateList[1].circles.getY(), 0.33));
        drawSequence(layer, crosses[1], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.66), interpolate(mateList[0].circles.getY(), mateList[1].circles.getY(), 0.66));
        snapMonsters();
      }
    }
  });

  return circles;
}

function interpolate(a, b, p) { return a + (b - a) * p; }

function updateMonsterLists() { 
  fightList = [];
  mateList = [];
  for(var i in monsterList) {
    if(monsterList[i].circles.getX() < 200) {
      fightList.push(monsterList[i]);
    } else if(monsterList[i].circles.getX() > stage.getWidth() - 200) {
      mateList.push(monsterList[i]);
    }
  }
}

function snapMonsters() {
  updateMonsterLists();
  snapList(fightList, 0, 200);
  snapList(mateList, stage.getWidth() - 200, stage.getWidth());
  snapList(_.difference(monsterList, fightList, mateList), 200, stage.getWidth() - 200);
}

function snapList(list, xMin, xMax) {
  var sorted = _.sortBy(list, function(monster) { return monster.circles.getX(); });
  for(var i = 0; i < sorted.length; i++) {
    new Kinetic.Tween({
      node: list[i].circles, 
      duration: 0.25,
      x: interpolate(xMin, xMax, (i + 1) / (sorted.length + 1)),
      y: 100,
    }).play();
  }
  layer.draw();
}
