var gene_size = 20;

var A = 'A'; // Attack
var D = 'D'; // Defense
var R = 'R'; // Reproduction

var geneList = [ A, D, R ]

function genMonster() {
  var gene = [];
  for(var i = 0; i < gene_size; i++) {
    var g = Math.floor(Math.random()*geneList.length);
    gene.push(geneList[g]);
  }
  return makeMonster(gene);
}

function makeMonster(gene) {
    var monster = { attack:[], defense:[], reproduction: 0 };

    monster.gene = gene;
    monster.name = gene.join('');

    var lastAttack = 0;
    var lastDefense = 0;
    gene.forEach(function(e) {
  if (e == A) {
      if (lastAttack == 0) {
    monster.attack.push(0);
      }
      lastAttack += 1;
      monster.attack[monster.attack.length-1] = lastAttack;
      lastDefense = 0;
  } else if (e == D) {
      if (lastDefense == 0) {
    monster.defense.push(0);
      }
      lastDefense += 1;
      monster.defense[monster.defense.length-1] = lastDefense;
      lastAttack = 0;
  } else if (e == R) {
      lastAttack = 0;
      lastDefense = 0;
      monster.reproduction += 1;
  }
    });
  return monster;
}

function cross(m1, m2) {
  var crossPoint = Math.random() * m1.gene.length;
  var crossA = [], crossB = [];
  for(var i in m1.gene)
  {
    crossA.push(i < crossPoint ? m1.gene[i] : m2.gene[i]);
    crossB.push(i < crossPoint ? m2.gene[i] : m1.gene[i]);
  }

  crossA = mutate(crossA);
  crossB = mutate(crossB);

  return [makeMonster(crossA), makeMonster(crossB)];
}

function mutate(genes) {
  var pos = Math.floor(Math.random() * genes.length);
  var oldGeneIndex = geneList.indexOf(genes[pos]);
  var mixFactor = Math.floor(Math.random() * 2) + 1;
  var newGeneIndex = (oldGeneIndex + mixFactor) % geneList.length;
  genes[pos] = geneList[newGeneIndex];
  return genes;
}

function fight(m1, m2) {
    var lst;
    m1.score = 0;
    m2.score = 0;
    lst = [ { monster:m1, attack:m1.attack.slice(0), defense:m1.defense.slice(0) }, 
	    { monster:m2, attack:m2.attack.slice(0), defense:m2.defense.slice(0) } ]
	    
    
    //console.log(m1.name);
    //console.log(m2.name);

    var results = [];

    var i = 0;
    while(true) {
	i++;
	//console.log("round "+i);
	if (lst[0].attack.length === 0 && lst[0].defense.length === 0 &&
	    lst[1].attack.length === 0 && lst[1].defense.length === 0) {
	    break;
	}
	var a1 = lst[0].attack.shift();
	var d1 = lst[1].defense.shift();

	if (a1 === undefined) {
	    a1 = 0;
	}
	if (d1 === undefined) {
	    d1 = 0;
	}
	//console.log(a1+" -> "+d1);
	if (a1 > d1) {
	    lst[0].monster.score += 1;
	    //console.log(lst[0].name + " attacks and win: +1 point");
	    results.push({attacker: lst[0].monster.name, defender: lst[1].monster.name, 
			  winner:lst[0].monster.name});
	} else if (a1 < d1) {
	    lst[1].monster.score += 1;
	    //console.log(lst[0].name + " attacks and loose, +1 point to opponant");
	    results.push({attacker: lst[0].monster.name, defender: lst[1].monster.name, 
			  winner:lst[1].monster.name});
	    //console.log(lst[0].gene + " attacks and is esquived, 0");
	} else {
	    //console.log(lst[0].name + " attacks and is esquived, 0");
	    results.push({attacker: lst[0].monster.name, defender: lst[1].monster.name});
	}

	lst = [ lst[1], lst[0] ];
    }
	
    //console.log(m1.name + " : "+m1.score);
    //console.log(m2.name + " : "+m2.score);
    
    return results;
}
