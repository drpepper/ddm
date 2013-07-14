var GENOME_LENGHT = 10;
var GENE_WIDTH = 20; 
var GENE_COLOR = {
  "A": "#f00",
  "D": "#0f0",
  "R": "#00f"
};

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
    //drawSequence(layer, m1, 300, 100), //.draggable.enable(), // drag(dragStart, dragMove),
    //drawSequence(layer, m2, 500, 100) // .draggable.enable() // drag(dragStart, dragMove)
  //];

    for(var i = 0; i < 10; i++) {
	sequences.push(drawSequence(layer, genMonster(), 250+(i*45), 100));
    }
    
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

  circles.monster = monster;
  monster.circles = circles;

  circles.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
  circles.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  circles.on('dragend', function() {
    console.log("dragend", circles.getX() + layer.getX(), circles.getY() + layer.getY());
    if(circles.getX() < 200) {

	if (mateList.indexOf(monster) !== -1) {
	    mateList.splice(fightList.indexOf(monster), 1);
	}

      fightList.push(monster)
      console.log("fightList", fightList); 

      if(fightList.length == 2) {
        var result = fight(fightList[0], fightList[1]);

        console.log(fightList[0].name);
        console.log(fightList[1].name);

        console.log(result);

        console.log(fightList[0].score);    
        console.log(fightList[1].score);

        if(fightList[0].score > fightList[1].score) {
          fightList[1].circles.remove();
          fightList = [ fightList[0] ];
        } else if(fightList[0].score < fightList[1].score) {
          fightList[0].circles.remove();
          fightList = [ fightList[1] ];
        }
        layer.draw();


      }
    } else if(circles.getX() > stage.getWidth() - 200) {

	if (fightList.indexOf(monster) !== -1) {
	    fightList.splice(fightList.indexOf(monster), 1);
	}

      mateList.push(monster)
      console.log("mateList", mateList); 

      if(mateList.length == 2) {
        var crosses = cross(mateList[0], mateList[1]);

        console.log(crosses[0].name);
        console.log(crosses[1].name);

        drawSequence(layer, crosses[0], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.33), 100);
        drawSequence(layer, crosses[1], interpolate(mateList[0].circles.getX(), mateList[1].circles.getX(), 0.66), 100);
        layer.draw();

        mateList = [];
      }
    } else {

	if (mateList.indexOf(monster) !== -1) {
	    mateList.splice(fightList.indexOf(monster), 1);
	}

	if (fightList.indexOf(monster) !== -1) {
	    fightList.splice(fightList.indexOf(monster), 1);
	}

    }
  });

  layer.add(circles);
  return circles;
}

function interpolate(a, b, p) { return a + (b - a) * p; }

function fadeOut(obj) {
  var anim = new Kinetic.Animation(function(frame) {
    var time = frame.time,
      timeDiff = frame.timeDiff,
      frameRate = frame.frameRate;
    // update stuff

    if(frame.time >= 1000) {
      obj.setOpacity(0);
      anim.stop();
    }
    else {
      obj.setOpacity(1 - frame.time / 1000);
    }
    console.log("opacity", obj.getOpacity());
  }, obj);

  anim.start();
  console.log("start");
}
