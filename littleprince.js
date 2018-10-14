var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    pink:0xF5986E,
    brown:0x59332e,
    brownDark:0x23190f,
    blue:0x68c3c0,
    darkgreen:0x128764, 
    green:0x0a9153,
    lightgreen:0x55ab48,
    yellow:0xffff00,
    orange:0xffa500,
    lightBrown:0x895e39,
	lightGrey:0xe3e3e3,
};

var start = false;
var finito = false;
var princee;
var rosa;
var controller = {

  left:false,
  right:false,
  up:false,
  // find the button clicked
  keyListener:function(event){
    var key_state = (event.type == "keydown")?true:false;
    

    switch(event.keyCode){
      case 37:// left key
      //console.log("I'm going left ", key_state );
        controller.left = key_state;
        if (event.type == "keydown") changedirection = true;
      break;
      case 38:// up key
      //console.log("I'm jumping");
        controller.up = key_state;
        if (event.type == "keydown") changedirection = true;
      break;
      case 39:// right key
		//console.log("I'm going right ", key_state);
        controller.right = key_state;
        if (event.type == "keydown") changedirection = true;
      break;
      case 32:
      if (event.type == "keydown") change_position_camera = true;

      break;

    }

  }

};
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
	
window.addEventListener('load', init, false);

//var controller;
function prepara(){
	dom = document.getElementById('world');
	dom.style.backgroundImage = "url('sfondogioco.png')"
	dom.style.backgroundSize = "cover";
	//dom.style.backgroundColor = "white";
	start = true;

	var z_position_relative = -terra.rotation.x+4;

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('petite/');
	mtlLoader.load('petite.mtl', function(materials) {
  		materials.preload();
  		var objLoader = new THREE.OBJLoader();
  		objLoader.setMaterials(materials);
  		objLoader.setPath('petite/');
  		objLoader.load('petite.obj', function(prince) {
    		//prince.position.y = -95;
    		prince.scale.set(5, 5, 5);
    		prince.rotation.x += 80;
            prince.rotation.y += 1.5;
			prince.name = "petitprince";
			prince.visible=false;
		    //prince.position.x = -0.5;	
            
            //prince.position.z = 7;
            
           	sphericalHelper.set( worldRadius-2.0, pathAngleValues[1], z_position_relative);
           	console.log("PRINCE ", worldRadius-2.0, pathAngleValues[1], z_position_relative);

			prince.position.setFromSpherical( sphericalHelper);
			//prince.position.set(-9.92, 0.03, -21.85);


	
			//prince.position.x = 20;
			terra.add(prince);
			princee = prince;
  		});
	});

	var corollaGeometry = new THREE.TorusKnotGeometry( 0.05, 0.5, 50, 4,5,3);
	var flowerMaterial = new THREE.MeshStandardMaterial( { color: Colors.red,flatShading:THREE.FlatShading  });
	var flowerTop = new THREE.Mesh( corollaGeometry, flowerMaterial);
	flowerTop.castShadow=true;
	flowerTop.receiveShadow=false;
	flowerTop.position.y=1.5;
	flowerTop.rotation.x=2.0;
	var flowerStemGeometry = new THREE.CylinderGeometry( 0.05, 0.05,2);
	var stemMaterial = new THREE.MeshStandardMaterial( { color: Colors.green,flatShading:THREE.FlatShading  });
	var flowerStem = new THREE.Mesh( flowerStemGeometry, stemMaterial);
	flowerStem.position.y=0.25;
	var rose =new THREE.Object3D();
	rose.add(flowerStem);
	rose.add(flowerTop);
	rose.name = "rose";
	rose.visible=false;
	rose.rotation.x += 11;

	sphericalHelper.set(worldRadius+0.3, pathAngleValues[2], z_position_relative);
	console.log("ROSE" , worldRadius+0.3, pathAngleValues[2], z_position_relative);
	rose.position.setFromSpherical( sphericalHelper);
	rosa = rose;
	//rose.position.set(1.6169035291709493,-1.2935345163426855,-26.218359815831054);
	//rose.position.set(worldRadius+0.3,1.2935345163426855,-21.85);
	// capire perchè sono inverite x e y
	rose.scale.set(0.5,0.5,0.5);
	
	//rose.position.set(14.5,1,21.85);
	terra.add(rose);

	scene.add(particles);
	scene.add(fox.mesh);
	scene.add(particlesBad);
	scene.add(terra);

	scene.add(hemisphereLight);
	scene.add(sun);
	addTerraTrees();
	infoText = document.getElementById('score');
  	infoText.innerHTML = "0";


}

var changedirection = false;
var scene,camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,renderer, container, clock, controls;
var hemisphereLight, shadowLight;
var dom;
var sun;
var ground;
var stella;
var objLoader;
var caricato = false;
var monete_raccolte = 0, score1 = 20;
var terra;
var planet;
var heroSphere;
var rollingSpeed=0.008;
var heroRollingSpeed;
var worldRadius=26;
var heroRadius=0.2;
var sphericalHelper;
var pathAngleValues;
var gravity=0.005;
var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane;
var clock;
var jumping = false, velocity;
var treeReleaseInterval=0.5;
var lastTreeReleaseTime=0;
var treesInPathTerra;
var particleGeometry;
var particleGeometryBad;
var particleCount=10;
var explosionPower =1.06;
var particles;
var particlesBad;
var position_camera;
var position_planet= false;
var scoreText;
var score;
var hasCollided;

var alberisaltati = 0;
var infoText;
var ind = 1;
var init_position_camera = [0,2.0,15.5];
var other_position_camera = [100,2.0,15.5];
var init_position_hero = [0,2.0,10.5];
var change_position_camera = false;
var position_space = [];
var gameover = false;
var f = null;
var game;


var Fox = function(foxColor){
	this.mesh = new THREE.Object3D();
	var redFurMat = new THREE.MeshPhongMaterial({color:foxColor, flatShading:THREE.FlatShading});
	var whiteFurMat = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	// Create the Body
	var geomBody = new THREE.BoxBufferGeometry(10,5,5,1,1,1);
	var material = new THREE.MeshBasicMaterial( { color: redFurMat });
	var body = new THREE.Mesh(geomBody, redFurMat);
	this.mesh.add(body)	
	// Create the Chest
	var geomChest = new THREE.BoxBufferGeometry(5,6,7,1,1,1);
	var chest = new THREE.Mesh(geomChest, redFurMat);
	chest.position.x = 6;
	chest.castShadow = true;
	chest.receiveShadow = true;
	this.mesh.add(chest);
	// Create the Head
	var geomHead = new THREE.BoxBufferGeometry(4,5,5,1,1,1);
	this.head = new THREE.Mesh(geomHead, redFurMat);
	this.head.position.set(8.5, 4, 0);
	this.head.castShadow = true;
	this.head.receiveShadow = true;
	// Create the Snout
	var geomSnout = new THREE.CylinderGeometry(0.10,2.5,2.5,4,1,1);
	var snout = new THREE.Mesh(geomSnout, whiteFurMat);
	snout.castShadow = true;
	snout.receiveShadow = true;
	snout.position.set(1.5,-0.8,0);
	this.head.add(snout);
	// Create the Nose
	var geomNose = new THREE.BoxBufferGeometry(.5,.5,.5,1,1,1);
	var matNose = new THREE.MeshPhongMaterial({color:Colors.brown, flatShading:THREE.FlatShading});
	var nose = new THREE.Mesh(geomNose, matNose);
	nose.position.set(4.2,-2,0);
	this.head.add(nose);
	// Create the Ears
	var geomEar = new THREE.CylinderGeometry(0.01,1.5,4,3,1,1);
	var earL = new THREE.Mesh(geomEar, redFurMat);
	earL.position.set(-0,3.6,-1.8);
	this.head.add(earL);
	earL.rotation.x=-Math.PI/10;
	// Create the Ear Tips
	var geomEarTipL = new THREE.CylinderGeometry(0.01,.6,2,3,1,1);
	var matEarTip = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	var earTipL = new THREE.Mesh(geomEarTipL, matEarTip);
	earTipL.position.set(0,1.5,0);
	earL.add(earTipL);
	var earR = earL.clone();
	earR.position.z = -earL.position.z;
	earR.rotation.x = -	earL.rotation.x;
	this.head.add(earR);
	this.mesh.add(this.head);	
	// Create the tail
	var geomTail = new THREE.BoxGeometry(8,4,4,2,1,1);
	geomTail.vertices[4].y-=1;
	geomTail.vertices[4].z+=1;
	geomTail.vertices[5].y-=1;
	geomTail.vertices[5].z-=1;
	geomTail.vertices[6].y+=1;
	geomTail.vertices[6].z+=1;
	geomTail.vertices[7].y+=1;
	geomTail.vertices[7].z-=1;
	this.tail = new THREE.Mesh(geomTail, redFurMat);
	this.tail.castShadow = true;
	this.tail.receiveShadow = true;
	// Create the tail tip
	var geomTailTip = new THREE.CylinderGeometry(0.01,2.85,4,4,1,1);
	var matTailTip = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	var tailTip = new THREE.Mesh(geomTailTip, matTailTip);
	tailTip.position.set(11,0,0);
	tailTip.castShadow = true;
	tailTip.receiveShadow = true;
	this.tail.add(tailTip);
	this.tail.position.set(-4,0,0);
	geomTail.translate(4,0,0);
	geomTailTip.translate(0,-1.1,0);
	tailTip.rotation.z = -0.5*Math.PI;
	tailTip.rotation.x = Math.PI/1.35;
	this.mesh.add(this.tail);
	// Create the legs
	var geomLeg = new THREE.BoxBufferGeometry(2,6,1,1,1,1);
	this.legFR = new THREE.Mesh(geomLeg, redFurMat);
	this.legFR.castShadow = true;
	this.legFR.receiveShadow = true;
	// Create the feet
	var geomFeet = new THREE.BoxBufferGeometry(2,3,1,1,1,1);
	var matFeet = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	this.feetFR = new THREE.Mesh(geomFeet, matFeet);
	this.feetFR.castShadow = true;
	this.feetFR.receiveShadow = true;
	geomFeet.translate(0,0,0);
	this.legFR.add(this.feetFR);
	this.legFR.position.set(7,-1.2,2.5);
	geomLeg.translate(0,-4,0);
	geomFeet.translate(0,-8,0);
	this.mesh.add(this.legFR);
	this.legFL = this.legFR.clone();
	this.legFL.position.z = -this.legFR.position.z;
	this.mesh.add(this.legFL);
	this.legBR = this.legFR.clone();
	this.legBR.position.x = -(this.legFR.position.x)+5;
	this.mesh.add(this.legBR);
	this.legBL = this.legFL.clone();
	this.legBL.position.x = -(this.legFL.position.x)+5;
	this.mesh.add(this.legBL);
	this.velocity = 0;
};

var fox;
function createFox(){ 
	this.jumping = false;
	fox = new Fox(Colors.red);
	fox.mesh.scale.set(.05,.05,.05);
	this.currentLane = middleLane;
	fox.mesh.position.x = this.currentLane;
	fox.mesh.rotation.y = Math.PI * 0.5;
	fox.mesh.position.y=-50;
	fox.mesh.position.z=12;
	//scene.add(fox.mesh);
}

function animFox(object, duration, offset){
	    object.mesh.rotation.z = Math.sin(Date.now()* duration + offset)* Math.PI * 0.08 ;
        object.tail.rotation.z = Math.sin(Date.now()* duration + offset)* (Math.PI * 0.08)+ Math.PI/1.2 ;
        object.tail.rotation.x = Math.sin(Date.now()* duration + offset)* Math.PI * 0.08;
        object.tail.rotation.y = Math.sin(Date.now()* duration + offset)* Math.PI * 0.2;
        object.head.rotation.z = Math.sin(Date.now()* duration + offset)* -Math.PI * 0.05 ;
        object.head.rotation.x = Math.sin(Date.now()* duration + offset)* -Math.PI * 0.05 ;
        object.legFR.rotation.z = Math.sin(Date.now()* duration + offset)* Math.PI * 0.3 ;
        object.legBR.rotation.z = Math.sin(Date.now()* duration - offset)* -(Math.PI * 0.3);
        object.legFL.rotation.z = Math.sin(Date.now()* duration + offset)* (Math.PI * 0.3);
        object.legBL.rotation.z = Math.sin(Date.now()* duration - offset)* -(Math.PI * 0.3);       
}

function init(){
	// set up the scene
	createScene(); // questo crea la scena
	createFox(); // questo crea la volpe
	//call game loop
	loop();
}

function loop(){
	if (!gameover){
		animFox(fox,0.009, 0);
		updateFox(fox);
		update();
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}
}

function createScene(){
	dom = document.getElementById('world');
	//dom.style.backgroundImage = "url('sfondogioco.png')"
	//dom.style.backgroundSize = "cover";

	hasCollided=false;
	score=0;
	collinePool = [];
	treesInPathTerra=[];
	clock=new THREE.Clock();
	clock.start();
	sphericalHelper = new THREE.Spherical();
	pathAngleValues=[1.52,1.57,1.62];
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
    renderer = new THREE.CanvasRenderer( { alpha: true });
	camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000);//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    
    renderer.setSize( sceneWidth, sceneHeight);

	game = document.getElementById('gameover');
	dom.appendChild(renderer.domElement);
	createCollinePool(); // crea le monete che si trovano sul cammino
	addTerra(0,-24,2);
	addLight();
	addExplosionCoin();
	addExplosionBad();

	camera.position.z = init_position_camera[2];
	camera.position.y = init_position_camera[1];
	position_camera = false;
	
	window.addEventListener('resize', onWindowResize, false);//resize callback

}

function createCollinePool(){
	var maxCoinInPool=120;
	var moneta;
	for(var i=0; i<maxCoinInPool;i++){
		if(i%3== 0)
		collinePool.push(createVulcani());
		if (i%5== 0)
		collinePool.push(createBad());
		collinePool.push(createMonete());
	}
}

function createVulcani(){
	var geometry = new THREE.ConeGeometry( 0.5, 1.2, 10 );
	var material = new THREE.MeshBasicMaterial();
	material.map = new THREE.TextureLoader().load('vulcano.jpg')
	material.bumpScale = 0.05;
	var vulcano = new THREE.Mesh( geometry, material);
	vulcano.position.x = 2;
	vulcano.position.y = 10;
	vulcano.name = "vulcano";
	return vulcano
}
function addExplosionCoin(){
	particleGeometry = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++){
		var vertex = new THREE.Vector3();
		particleGeometry.vertices.push( vertex);
	}
	var pMaterial = new THREE.PointsMaterial({
	  color: Colors.yellow,
	  map: new THREE.TextureLoader().load('goldcoin.jpg'),
	  size: 0.05
	});
	particles = new THREE.Points( particleGeometry, pMaterial);
	//scene.add( particles);
	particles.visible=false;
}

function addExplosionBad(){
	particleGeometryBad = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++){
		var vertex = new THREE.Vector3();
		particleGeometryBad.vertices.push( vertex);
	}
	var pMaterial = new THREE.PointsMaterial({
	  color: Colors.red,
	   map: new THREE.TextureLoader().load('redcoin.jpg'),
	  size: 0.05
	});
	particlesBad = new THREE.Points( particleGeometryBad, pMaterial);
	//scene.add( particlesBad);
	particlesBad.visible=false;
}
function updateFox(object){

	
	if(controller.up && object.jumping == false){
		if(changedirection){
			//console.log(object.mesh.position.y+ " :fox.mesh.position.y");
			//console.log(object.velocity+ " :fox.velocity");

	    	object.velocity -= 5;
	    	object.jumping = true;
	    	changedirection = false;
		}
	}
	if (change_position_camera){
		camera.position.z = 100.5;
		camera.position.y = -12.5;
		
	} else {
		camera.position.z = init_position_camera[2];
		camera.position.y = init_position_camera[1];
		camera.position.x = init_position_camera[0];

	}

  if(controller.left){
  		if(changedirection){
  			if(currentLane==middleLane){
				currentLane=leftLane;
				console.log(currentLane + " :currentLane ifleft");
			}else if(currentLane==rightLane){
				currentLane=middleLane;
				console.log(currentLane+ " :currentLane ifleft");
			}
			changedirection = false;
		}
  }
  if(controller.right){
  	if(changedirection){
		if(currentLane==middleLane){
			currentLane=rightLane;
			console.log(currentLane+ " :currentLane ifright");
			
		}else if(currentLane==leftLane){
			currentLane=middleLane;
			console.log(currentLane+ " :currentLane ifright");
		}
		changedirection = false;
	}
  }
  object.mesh.position.x = currentLane;
  object.velocity += 0.4;// gravity
  object.mesh.position.y -= object.velocity/4;
  object.velocity *= 0.4;// friction
  if(object.mesh.position.y < camera.position.y-1){
    object.jumping = false;
    object.mesh.position.y = camera.position.y-1;
    object.velocity = 0.1;
  }
}

function addTerra( pos_x, pos_y, pos_z){
	var sides=40;
	var tiers=40;
	
	var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial()
	sphereMaterial.map    = new THREE.TextureLoader().load('https://i.imgur.com/vhn2saG.jpg');
	sphereMaterial.bumpScale = 0.05;
	
	
	terra = new THREE.Mesh( sphereGeometry, sphereMaterial);
	terra.receiveShadow = true;
	terra.castShadow=false;
	terra.rotation.z=-Math.PI/2;
	//scene.add(terra);
	terra.position.x= pos_x;
	terra.position.y= pos_y;
	terra.position.z= pos_z;
	//addTerraTrees();
}

function addLight(){
	var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .75)
	scene.add(hemisphereLight);
	sun = new THREE.DirectionalLight( 0xcdc1c5, 0.9);
	sun.position.set( 30,10,0);
	sun.castShadow = true;
	scene.add(sun);
	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
}

function addTerraTrees(){
	var numTrees=40;
	var gap=6.28/36;
	for(var i=0;i<numTrees;i++){
		addTreeTerra(false,(i*1.5)+gap, true);
		addTreeTerra(false,(i*1.5)+gap, false);
	}
}

function addTreeTerra(inPath, row, isLeft){
	var newTree;
	if(inPath){
		if(collinePool.length==0)return;
		newTree=collinePool.pop();
		newTree.visible=true;
		treesInPathTerra.push(newTree);

		sphericalHelper.set( worldRadius+0.3, pathAngleValues[row], -terra.rotation.x+4);
		
		/*newTree.position.setFromSpherical( sphericalHelper);
		var rollingGroundVector=terra.position.clone().normalize();
		var treeVector=newTree.position.clone().normalize();
		newTree.quaternion.setFromUnitVectors(treeVector,rollingGroundVector);
		
		newTree.rotation.x+=Math.PI;*/
	}else{
		newTree=createTreeTerra();
		var forestAreaAngle=0;//[1.52,1.57,1.62];
		if(isLeft){
			forestAreaAngle=1.68+Math.random()*0.1;
		}else{
			forestAreaAngle=1.46-Math.random()*0.1;
		}
		sphericalHelper.set( worldRadius-0.3, forestAreaAngle, row);
	}
	newTree.position.setFromSpherical( sphericalHelper);
	var rollingGroundVector=terra.position.clone().normalize();
	var treeVector=newTree.position.clone().normalize();
	newTree.quaternion.setFromUnitVectors(treeVector,rollingGroundVector);
	newTree.rotation.x+=(Math.random()*(2*Math.PI/10))+-Math.PI/10;
		
	terra.add(newTree);
}

function addPathTreeTerra(){
	if(monete_raccolte < score1){
		var options=[0,1,2];
		var lane= Math.floor(Math.random()*3);
		addTreeTerra(true,lane);
		options.splice(lane,1);
		if(Math.random()>0.5){
			lane= Math.floor(Math.random()*2);
			addTreeTerra(true,options[lane]);
		} 
	} else {
		finito = true;
		console.log("PRINCE", princee.position, "ROSE", rosa.position, "FOX", fox.mesh.position);
	}
}

function createTreeTerra(){
	var sides=8;
	var tiers=6;
	var scalarMultiplier=(Math.random()*(0.25-0.1))+0.05;
	var midPointVector= new THREE.Vector3();
	var vertexVector= new THREE.Vector3();
	var treeGeometry = new THREE.TorusKnotGeometry( 0.4, 0.3, 50, 5);
	var treeMaterial = new THREE.MeshStandardMaterial( { color: Colors.green,flatShading:THREE.FlatShading  });
	var treeTop = new THREE.Mesh( treeGeometry, treeMaterial);
	treeTop.castShadow=true;
	treeTop.receiveShadow=false;
	treeTop.position.y=2.2;
	treeTop.rotation.y=(Math.random()*(Math.PI));
	var treeTrunkGeometry = new THREE.CylinderGeometry( 0.2, 0.5,3);
	var trunkMaterial = new THREE.MeshStandardMaterial( { color: 0x886633,flatShading:THREE.FlatShading  });
	var treeTrunk = new THREE.Mesh( treeTrunkGeometry, trunkMaterial);
	treeTrunk.position.y=0.25;
	var tree =new THREE.Object3D();
	tree.add(treeTrunk);
	tree.add(treeTop);
	tree.name = "baobab";
	return tree;
}

function createRose(){
	
	var corollaGeometry = new THREE.TorusKnotGeometry( 0.05, 0.5, 50, 4,5,3);
	var flowerMaterial = new THREE.MeshStandardMaterial( { color: Colors.red,flatShading:THREE.FlatShading  });
	var flowerTop = new THREE.Mesh( corollaGeometry, flowerMaterial);
	flowerTop.castShadow=true;
	flowerTop.receiveShadow=false;
	flowerTop.position.y=1.5;
	flowerTop.rotation.x=2.0;
	var flowerStemGeometry = new THREE.CylinderGeometry( 0.05, 0.05,2);
	var stemMaterial = new THREE.MeshStandardMaterial( { color: Colors.green,flatShading:THREE.FlatShading  });
	var flowerStem = new THREE.Mesh( flowerStemGeometry, stemMaterial);
	flowerStem.position.y=0.25;
	var rose =new THREE.Object3D();
	rose.add(flowerStem);
	rose.add(flowerTop);
	rose.name = "rose";
	rose.visible=false;
	return rose;
}
function createMonete(){
	var geometry = new THREE.CylinderGeometry( 0.3, 0.3, 0.05, 8);
	var material = new THREE.MeshBasicMaterial( {color: Colors.yellow});
	material.map = new THREE.TextureLoader().load('goldcoin.jpg')
	material.bumpScale = 0.05;

	var coin = new THREE.Mesh( geometry, material);
	coin.position.x = 2;
	coin.position.y = 10;
	coin.name = "coin";
	return coin;
	
}

function createBad(){
	var geometry = new THREE.CylinderGeometry( 0.3, 0.3, 0.05, 8);
	var material = new THREE.MeshBasicMaterial( {color: Colors.red});
	material.map  = new THREE.TextureLoader().load('redcoin.jpg'),
	material.bumpScale = 0.05;
	
	var badcoin = new THREE.Mesh( geometry, material);
	
	badcoin.position.x = 2;
	badcoin.position.y = 10;
	badcoin.name = "badcoin";
	return badcoin;
	
}
function onWindowResize(){
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}
function doTreeTerraLogic(){
	var oneTree;
	var treePos = new THREE.Vector3();
	var treesToRemove=[];
	var coll = 0;

	treesInPathTerra.forEach( function ( element, index){
	oneTree=treesInPathTerra[ index ];
	treePos.setFromMatrixPosition(oneTree.matrixWorld);
	if(treePos.z>12 && oneTree.visible){//gone out of our view zone
		treesToRemove.push(oneTree);
	}else{//check collision
		if (finito){
			console.log("prince" , princee.position, "\n fox", fox.mesh.position,
				princee.position.x - fox.mesh.position.x, princee.position.y - fox.mesh.position.y, princee.position.z - fox.mesh.position.z)

		} else {
			if( treePos.distanceTo(fox.mesh.position)<= 2.0){
				switch(currentLane){
				case 0:
					if(treePos.x - fox.mesh.position.x < 0.3 & treePos.x - fox.mesh.position.x > 0 & fox.mesh.position.y <= camera.position.y){
						//console.log(currentLane, "TREE" , treePos , "HERO" , fox.mesh.position);
					
					if (oneTree.name == 'coin' ){
						monete_raccolte = monete_raccolte + 1;
					}
					if (oneTree.name == 'badcoin' ){
						monete_raccolte = monete_raccolte -1;
					}

					hasCollided=true;
					treesToRemove.push(oneTree);
					explode(oneTree.name);}
					
					break;

				case 1:
					if(treePos.x - fox.mesh.position.x > 0.3 & treePos.x - fox.mesh.position.x < 0.5 & fox.mesh.position.y <= camera.position.y){
						//console.log(currentLane, treePos , fox.mesh.position);
						if (oneTree.name == 'coin' ){
							monete_raccolte = monete_raccolte + 1;
						} 
						if (oneTree.name == 'badcoin' ){
							monete_raccolte = monete_raccolte -1;
						}

						hasCollided=true;
						treesToRemove.push(oneTree);
						explode(oneTree.name);
					
					}
					break;

				case -1:		
					if(treePos.x - fox.mesh.position.x < 0 & fox.mesh.position.y <= camera.position.y){
						//console.log(currentLane, treePos , fox.mesh.position);
					
						if (oneTree.name == 'coin' ){
							monete_raccolte = monete_raccolte + 1;
						}	 
						if (oneTree.name == 'badcoin' ){
							monete_raccolte = monete_raccolte -1;
						}
					
						hasCollided=true;
						treesToRemove.push(oneTree);
						explode(oneTree.name);
					
				
					} 
					break;
				}
			} 
		}
	}
	});
	if (start){
	scoreText = document.getElementById('score');
	scoreText.innerHTML = monete_raccolte;
	if(monete_raccolte == score1){
		/*var uccello = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random()* 0xffffff, side: THREE.DoubleSide }));
		uccello.position.x = 1;
		uccello.position.y = 4
		uccello.position.z = 30;*/
	}//addUccelli();
	var fromWhere;
	treesToRemove.forEach( function ( element, index){
		oneTree=treesToRemove[ index ];
		fromWhere=treesInPathTerra.indexOf(oneTree);
		treesInPathTerra.splice(fromWhere,1);
		collinePool.push(oneTree);
		oneTree.visible=false;
		//console.log("remove tree");
	});
}
}
function explode(name){
	if (name == 'coin'){
	particles.position.y=2;
	particles.position.z=11.5;
	particles.position.x=fox.mesh.position.x;
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = -0.2+Math.random() * 0.4;
		vertex.y = -0.2+Math.random() * 0.4 ;
		vertex.z = -0.2+Math.random() * 0.4;
		particleGeometry.vertices[i]=vertex;
	}
	explosionPower=1.07;
	particles.visible=true;
	}
	if (name == 'badcoin'){
		particlesBad.position.y=2;
		particlesBad.position.z=11.5;
		particlesBad.position.x=fox.mesh.position.x;
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = -0.2+Math.random() * 0.4;
		vertex.y = -0.2+Math.random() * 0.4 ;
		vertex.z = -0.2+Math.random() * 0.4;
		particleGeometryBad.vertices[i]=vertex;
	}
	explosionPower=1.07;
	particlesBad.visible=true;
	}
	if (name == "vulcano"){
    	gameover = true;
    	game.style.visibility = "visible";
    }
}

function piccoloprincipe(){
	//this.mesh = new THREE.Object3D();

	 objLoader = new THREE.OBJLoader();
    	var material = new THREE.MeshBasicMaterial({color: 0xFFFF80, side: THREE.DoubleSide});
    	//objLoader.setMaterials(material);
    //objLoader.setPath('/examples/3d-obj-loader/assets/');
    objLoader.load('./Petit/petit.obj', function (object) {
    	object.traverse(function (child){
    		if (child instanceof THREE.Mesh){	
    			//child.material.ambient.setHex(0xffffff);
    			console.log("sono figlio");
    			child.material.color.setHex(0xffff00);
    		}
    	}) 

    	object.position.x =i+0.5;
		object.position.y = Math.random()*10 +50;
		object.position.z = Math.random()*10-200;
		object.rotation.x += 1.76;
		object.name = "petitprince";
		
		scene.add(object);
		//this.mesh.add(object);
    });
}

function doExplosionLogicCoin(){
	if(!particles.visible)return;
	
	for (var i = 0; i < particleCount; i ++){
		particleGeometry.vertices[i].multiplyScalar(explosionPower);
	}
	if(explosionPower>1.005){
		explosionPower-=0.001;
	}else{
		particles.visible=false;
	}
	particleGeometry.verticesNeedUpdate = true;
}
function doExplosionLogicBad(){
	if(!particlesBad.visible)return;
	
	for (var i = 0; i < particleCount; i ++){
		particleGeometryBad.vertices[i].multiplyScalar(explosionPower);
	}
	if(explosionPower>1.005){
		explosionPower-=0.001;
	}else{
		particlesBad.visible=false;
	}
	particleGeometryBad.verticesNeedUpdate = true;
}
function update(){

   if (finito) console.log("prince" , princee.position, "\n fox", fox.mesh.position,
				princee.position.x - fox.mesh.position.x, princee.position.y - fox.mesh.position.y, princee.position.z - fox.mesh.position.z);

    		terra.rotation.x += rollingSpeed;
    		terra.children.forEach(function(child){
    			if (child.name == "coin"){
    				child.rotation.z += 0.1;
    			}
    			if (child.name == "badcoin"){
    				child.rotation.z += 0.1;
    			}
    			if (finito){
    				if (child.name == "petitprince"){
    					child.visible = true;
    				}
    				if (child.name == "rose")
    					child.visible = true;
    			}
    			
    		})

    if(clock.getElapsedTime()>treeReleaseInterval){
    	clock.start();
    	addPathTreeTerra();
    }
    doTreeTerraLogic();
    doExplosionLogicCoin();
    doExplosionLogicBad();
	
	
}