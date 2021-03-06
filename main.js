var GENOME_LENGHT = 10;
var GENE_WIDTH = 20; 
var GENE_COLOR = {
  "A": "rgba(251, 100, 2, 1)",
  "D": "rgba(40, 209, 250, 1)",
  "R": "rgba(249, 213, 8, 1)"
};
var FADE_TIME = 50;

var BOSS = makeMonster("AADDDDDDAADDDDDDDAAA".split(""));

var images = {};

var monsterList = [];
var fightList = [];
var mateList = [];

var stage = {};
var layer;
var sounds = {
  mate: [],
  fight: [],
}; 
var music = {
  main: null,
  fight: null
};

function loadImage(lst, cb) {
    var src = lst.shift();
    if (src === undefined) {
	cb();
	return;
    }
    var img = new Image();
    img.onload = function() {
	console.log(src+" loaded");
	images[src] = img;
	loadImage(lst, cb);
    };
    img.src = src;
}

$(document).ready(function() {
  loadSounds();

  var spriteList = [ "images/Attack.png", "images/Defense.png", "images/Reproduction.png"];
  loadImage(spriteList, function() {
    console.log("all images loaded");
  });

  stage = new Kinetic.Stage({
    container: 'game',
    width: 900,
    height: 600
  });

  layer = new Kinetic.Layer();

  var m1 = genMonster();
  var m2 = genMonster();

  layer.add(new Kinetic.Text({ 
    x: 50,
    y: 0,
    text: "FIGHT",
    fontSize: 30,
    fontFamily: 'Helvetica',
    fill: 'black'
  }));

  layer.add(new Kinetic.Text({ 
    x: stage.getWidth() - 140,
    y: 0,
    text: "MATE",
    fontSize: 30,
    fontFamily: 'Helvetica',
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
    opacity: 0.1
  }));

  layer.add(new Kinetic.Rect({
    x: stage.getWidth() - 200,
    y: 0,
    width: 200,
    height: stage.getHeight(),
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    opacity: 0.1
  }));

  layer.add(makeButton(50, stage.getHeight() - 70, "rgba(251, 100, 2, 1)", "BOSS!", fightBoss)); 

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

  circles.add(new Kinetic.Text({
    x: 0,
    y: 0,
    text: "0",
    align: "center",
    fontSize: 20,
    fontFamily: 'Helvetica',
    fill: 'black',
    opacity: 0
  }));

  for(var i in monster.gene)
    {
  function createCircle() {
      var circle = new Kinetic.Circle({
    x: 0, 
    y: 40 + 0.75 * i * GENE_WIDTH,
    radius: GENE_WIDTH / 2,
    fill: GENE_COLOR[monster.gene[i]],
    stroke: 'black',
    strokeWidth: 2
      });
      
      var anim = new Kinetic.Animation(function(frame) {
          circle.setX(10 * Math.sin((circle.getY()/10) + (monster.seed*(frame.time/1000))));
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
	monster.seed *= 3;
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
        runFight(); 
      }
    } else if(circles.getX() > stage.getWidth() - 200) {
      if(mateList.length == 2) {
        var crosses = cross(mateList[0], mateList[1]);
        playRandomSoundInList(sounds.mate);

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

function playRandomSoundInList(list) {
  list[Math.floor(Math.random() * list.length)].play();
}

function loadSounds() {
  loadSoundIntoList(sounds.mate, "sounds/mate/16440.ogg");
  loadSoundIntoList(sounds.mate, "sounds/mate/16442.ogg");
  loadSoundIntoList(sounds.mate, "sounds/mate/16443.ogg");
  loadSoundIntoList(sounds.fight, "sounds/fight/13883.ogg");
  loadSoundIntoList(sounds.fight, "sounds/fight/21305.ogg");

  music.main = new buzz.sound("sounds/172561__djgriffin__video-game-7.ogg", { preload: true, loop: true, autoplay: true });
  music.fight = new buzz.sound("sounds/8-Bit Ninjas - Demos - 03 - Fight in a Bus Stop.ogg", { preload: true, loop: true });
}

function loadSoundIntoList(list, url)
{
  list.push(new buzz.sound(url, { preload: true }));  
}

function makeButton(x, y, color, text, callback) {
  var button = new Kinetic.Group({
    x: x,
    y: y
  });

  button.add(new Kinetic.Rect({
    width: 100,
    height: 50,
    cornerRadius: 5,
    fill: color,
    stroke: 'black',
    strokeWidth: 4
  }));

  button.add(new Kinetic.Text({ 
    x: 15,
    y: 20,
    text: text,
    fontSize: 20,
    fontFamily: 'Helvetica',
    fill: 'black'
  }));

  button.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
  button.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  button.on('click', fightBoss);
  return button;
}

function fightBoss() {
  console.log("BOSS");

  fightList.push(BOSS);
  runFight();

}

function runFight() {
      music.main.stop();
      music.fight.setVolume(100).play();

      var fightLayer = new Kinetic.Layer();
      fightLayer.add(new Kinetic.Rect({
      x: 100,
      y: 100,
      width: stage.getWidth()-200,
      height: stage.getHeight()-100,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
      opacity: 1.0
  }));
  stage.add(fightLayer);

        var result = fight(fightList[0], fightList[1]);

  fightLayer.add(drawSequence(fightLayer, JSON.parse(JSON.stringify(fightList[0])), 
            150, 175, false));
  fightLayer.add(drawSequence(fightLayer, JSON.parse(JSON.stringify(fightList[1])), 
            stage.getWidth()-150, 175, false));

  var score1 = 0;
  var score1Txt = new Kinetic.Text({ 
      x: 150,
      y: 525,
      text: "0",
      fontSize: 30,
      fontFamily: 'Helvetica',
      fill: 'black'
  });
  var score2 = 0;
  var score2Txt = new Kinetic.Text({ 
      x: stage.getWidth()-150,
      y: 525,
      text: "0",
      fontSize: 30,
      fontFamily: 'Helvetica',
      fill: 'black'
  });
  fightLayer.add(score1Txt);
  fightLayer.add(score2Txt);
  fightLayer.draw();

      var attackSprite = new Kinetic.Image({
    x: -250,
    y: 150+fightY,
    image: images["images/Attack.png"],
    width: 1, //10*action.attackV,
    height: 1, //10*action.attackV
      });
      fightLayer.add(attackSprite);
      
      var defenseSprite = new Kinetic.Image({
    x: -250,
    y: 150+fightY,
    image: images["images/Defense.png"],
    width: 1, //10*action.attackV,
    height: 1, //10*action.attackV
      });
      fightLayer.add(defenseSprite);



  var fightY = 0;
  function nextAction(cb) {
      action = result.shift();
      if (action === undefined) {
	  console.log("fight finished");
	  console.log(fightList[0].score);
	  console.log(fightList[1].score);

	  var X;
	  var txt = "Wins!";
	  if (fightList[0].score > fightList[1].score) {
	      X = 150;
	  } else if (fightList[0].score < fightList[1].score) {
	      X = stage.getWidth()-250;
	  } else {
	      X = (stage.getWidth()/2)-100;
	      txt = "Draw!";
	  }
	  fightLayer.add(new Kinetic.Text({ 
              x: X,
              y: 200,
              text: txt,
              fontSize: 100,
              fontFamily: 'Helvetica',
              fill: 'black'
	  }));	  
	  fightLayer.draw();
	  setTimeout(cb, 1000);
	  return;
      }

      attackSprite.setWidth(20 + (20*action.attackV));
      attackSprite.setHeight(20 + (20*action.attackV));
      
      if (action.attacker == fightList[0].name) {
    attackSprite.setX(250 - (attackSprite.getWidth()/2));
    attackSprite.setY(175+fightY - (attackSprite.getWidth()/2));
      } else {
    attackSprite.setX(stage.getWidth()-(250 + (attackSprite.getWidth()/2)));
    attackSprite.setY(175+fightY - (attackSprite.getWidth()/2));
      }

      defenseSprite.setWidth(20 + (20*action.defenseV));
      defenseSprite.setHeight(20 + (20*action.defenseV));
      
      if (action.defender == fightList[0].name) {
    defenseSprite.setX(250 - (defenseSprite.getWidth()/2));
    defenseSprite.setY(175+fightY - (defenseSprite.getWidth()/2));
      } else {
    defenseSprite.setX(stage.getWidth()-(250 + (defenseSprite.getWidth()/2)));
    defenseSprite.setY(175+fightY - (defenseSprite.getWidth()/2));
      }

      /*
      var text = action.attacker+" attacks "+action.defender; 
      console.log(text);
      fightLayer.add(new Kinetic.Text({ 
    x: 200+20,
    y: 150+fightY,
    text: text,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fill: 'black'
      }));
      */
      if (action.winner == fightList[0].name) {
    score1++;
    score1Txt.setText(""+score1);
    
    fightLayer.add(new Kinetic.Text({ 
        x: 350,
        y: 175+fightY,
        text: "+1",
        fontSize: 15,
        fontFamily: 'Helvetica',
        fill: 'black'
    }));
    
    
      } else if (action.winner == fightList[1].name) {
    score2++;
    score2Txt.setText(""+score2);
    
    fightLayer.add(new Kinetic.Text({ 
        x: stage.getWidth()-350,
        y: 175+fightY,
        text: "+1",
        fontSize: 15,
        fontFamily: 'Helvetica',
        fill: 'black'
    }));

      }
      
      fightLayer.draw();
      fightY += 25;
      console.log(fightY);
      setTimeout(function(){
    nextAction(cb);
      }, 250);
  }
  
  setTimeout(function() {
      nextAction(function() {
    fightLayer.remove();
    stage.draw();

    var toRemove = null; 
    var won = null;
    if(fightList[0].score > fightList[1].score) {
        won = fightList[0];
        toRemove = fightList[1];
    } else if(fightList[0].score < fightList[1].score) {
        won = fightList[1];
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

    if(won != null) {
      won.fightsWon++;
      if(won.circles) {
        won.circles.get("Text")[0].setText(won.fightsWon);
        won.circles.get("Text")[0].setOpacity(1);
      }
    }
    
    music.fight.fadeOut(FADE_TIME, function() { music.fight.stop(); });
    music.main.fadeIn(FADE_TIME).play();

    snapMonsters();
   
      });
  }, 1000);
}
