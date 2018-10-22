var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    green:0x0a9153,
    yellow:0xffff00,
};

var start = false;
var finished = false;
var princePool;
var elementPool;

var controller = {
  left:false,
  right:false,
  up:false,
  // find the button clicked
  keyListener:function(event){
    var key_state = (event.type == "keydown")?true:false;
    
    switch(event.keyCode){
      case 37:// left key
        controller.left = key_state;
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

function setup(){
	dom = document.getElementById('b612');
	dom.style.backgroundImage = "url('sfondogioco.png')"
	dom.style.backgroundSize = "cover";
	start = true;

	scene.add(particles);
	scene.add(fox.mesh);
	scene.add(particlesBad);
	scene.add(b612);
	scene.add(sun);
	insertBaobab();

	scoreText = document.getElementById('score');
  	scoreText.innerHTML = "0";
}

/* for the movement of the fox */
var changedirection = false;

/* for the html page */
var dom;

/* elements and scene variables */
var ground;
var hemisphereLight, shadowLight;
var objLoader;
var collected_coins = 0, score1 = 20;
var b612;
var planetSpeed=0.008;
var planetRadius=26;
var sphericalHelper;
var pathAngleValues;
var gravity=0.005;
var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane;

var clock;
var velocity;
var intervalElements=0.4;
var elementsInPath;
var particleGeometry;
var particleGeometryBad;
var particleCount=10;
var explosionPower =1.06;
var particles;
var particlesBad;
var position_camera;
var score;
var hasCollided;
var scoreText;

var ind = 1;
var init_position_camera = [0,2.0,15.5];
var other_position_camera = [100,2.0,15.5];

var change_position_camera = false;

var gameover = false; // boolean for the gameover event
var gamefinished = false;

var game;


var Fox = function(foxColor){
	this.mesh = new THREE.Object3D();
	var redFurMat = new THREE.MeshPhongMaterial({color:foxColor, flatShading:THREE.FlatShading});
	var whiteFurMat = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	// Create the Body
	var geomBody = new THREE.BoxBufferGeometry(10,5,5,1,1,1);
	//var material = new THREE.MeshBasicMaterial( { color: redFurMat });
	var body = new THREE.Mesh(geomBody, redFurMat);
	body.name = "body";
	this.mesh.add(body)	
	// Create the Chest
	var geomChest = new THREE.BoxBufferGeometry(5,6,7,1,1,1);
	var chest = new THREE.Mesh(geomChest, redFurMat);
	chest.position.x = 6;
	chest.castShadow = true;
	chest.receiveShadow = true;
	chest.name = "chest";
	this.mesh.add(chest);
	// Create the Head
	var geomHead = new THREE.BoxBufferGeometry(4,5,5,1,1,1);
	this.head = new THREE.Mesh(geomHead, redFurMat);
	this.head.position.set(8.5, 4, 0);
	this.head.castShadow = true;
	this.head.receiveShadow = true;
	this.head.name = "head";
	// Create the Snout
	var geomSnout = new THREE.CylinderGeometry(0.10,2.5,2.5,4,1,1);
	var snout = new THREE.Mesh(geomSnout, whiteFurMat);
	snout.castShadow = true;
	snout.receiveShadow = true;
	snout.position.set(1.5,-0.8,0);
	snout.name = "snout";
	this.head.add(snout);
	// Create the Nose
	var geomNose = new THREE.BoxBufferGeometry(.5,.5,.5,1,1,1);
	var matNose = new THREE.MeshPhongMaterial({color:Colors.brown, flatShading:THREE.FlatShading});
	var nose = new THREE.Mesh(geomNose, matNose);
	nose.position.set(4.2,-2,0);
	nose.name = "nose";
	this.head.add(nose);
	// Create the Ears
	var geomEar = new THREE.CylinderGeometry(0.01,1.5,4,3,1,1);
	var earL = new THREE.Mesh(geomEar, redFurMat);
	earL.position.set(-0,3.6,-1.8);
	earL.name = "easrL";
	this.head.add(earL);
	earL.rotation.x=-Math.PI/10;
	// Create the Ear Tips
	var geomEarTipL = new THREE.CylinderGeometry(0.01,.6,2,3,1,1);
	var matEarTip = new THREE.MeshPhongMaterial({color:Colors.white, flatShading:THREE.FlatShading});
	var earTipL = new THREE.Mesh(geomEarTipL, matEarTip);
	earTipL.position.set(0,1.5,0);
	earTipL.name = "earTipL";
	earL.add(earTipL);
	var earR = earL.clone();
	earR.position.z = -earL.position.z;
	earR.rotation.x = -	earL.rotation.x;
	earR.name = "earR";
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
	tailTip.name = "tailTip";
	this.tail.add(tailTip);
	this.tail.position.set(-4,0,0);
	geomTail.translate(4,0,0);
	geomTailTip.translate(0,-1.1,0);
	tailTip.rotation.z = -0.5*Math.PI;
	tailTip.rotation.x = Math.PI/1.35;
	this.tail.name = "tail";
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
	this.feetFR.name = "feetFR";
	this.legFR.add(this.feetFR);
	this.legFR.position.set(7,-1.2,2.5);
	geomLeg.translate(0,-4,0);
	geomFeet.translate(0,-8,0);
	this.legFR.name = "legFR";
	this.mesh.add(this.legFR);
	this.legFL = this.legFR.clone();
	this.legFL.position.z = -this.legFR.position.z;
	this.legFL.name = "legFL";
	this.mesh.add(this.legFL);
	this.legBR = this.legFR.clone();
	this.legBR.position.x = -(this.legFR.position.x)+5;
	this.legBR.name = "legBR";
	this.mesh.add(this.legBR);
	this.legBL = this.legFL.clone();
	this.legBL.position.x = -(this.legFL.position.x)+5;
	this.legBL.name = "legBL";
	this.mesh.add(this.legBL);
	this.velocity = 0;
};

var fox;
function createFox(){ 
	fox = new Fox(Colors.red);
	fox.mesh.scale.set(.05,.05,.05);
	this.currentLane = middleLane;
	fox.mesh.position.x = this.currentLane;
	fox.mesh.rotation.y = Math.PI * 0.5;
	fox.mesh.position.y=-50;
	fox.mesh.position.z=12;
}

function loadPrince(){
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('petit/');
	mtlLoader.load('petit.mtl', function(materials) {
  		materials.preload();
  		var objLoader = new THREE.OBJLoader();
  		objLoader.setMaterials(materials);
  		objLoader.setPath('petit/');
  		objLoader.load('petit.obj', function(prince) {
    		prince.scale.set(4.5, 4.5, 4.5);
    		prince.rotation.x -= 90 * (Math.PI/180); // la x deve essere a -110 altrimenti decade. 
            prince.rotation.z -= 5 * (Math.PI/180);
           	prince.rotation.y -= 275* (Math.PI/180);
			prince.name = "petitprince";
			prince.visible=false;
			princePool.push(prince);
  		});
	});
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
		if (!gamefinished){
		animFox(fox,0.009, 0);}
		updateFox(fox);
		update();
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}
}

function createScene(){
	dom = document.getElementById('b612');

	hasCollided=false;
	score=0;
	elementPool = [];
	princePool = [];
	elementsInPath=[];
	clock=new THREE.Clock();
	clock.start();
	sphericalHelper = new THREE.Spherical();
	pathAngleValues=[1.52,1.57,1.62];
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
	camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000);//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    
    renderer.setSize( sceneWidth, sceneHeight);

	game = document.getElementById('game');
	game.style.width = sceneWidth;
	dom.appendChild(renderer.domElement);
	//dom.appendChild(renderer.domElement);
	insertElement(); // crea le monete che si trovano sul cammino
	insertPrinceAndRose(); 
	addB612(0,-24,2);
	addLight();
	addExplosionCoin();
	addExplosionBad();

	camera.position.z = init_position_camera[2];
	camera.position.y = init_position_camera[1];
	position_camera = false;
	
	window.addEventListener('resize', onWindowResize, false);//resize callback

}

function insertElement(){ // insertElement
	var maxCoinInPool=30;
	var moneta;
	for(var i=0; i<maxCoinInPool;i++){
		elementPool.push(createCoin());
		if(i%5== 0)
			elementPool.push(createVulcano());
		if (i%3== 0)
			elementPool.push(createBad());
	}
}

function insertPrinceAndRose(){
	// inseriamo il piccolo principe e la rosa nella pool.
	loadPrince();
	princePool.push(createRose());
		
}

function createVulcano(){
	var geometry = new THREE.ConeGeometry( 0.5, 1.2, 10 );
	var material = new THREE.MeshBasicMaterial();
	material.map = new THREE.TextureLoader().load('vulcano.png')
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
	var particleMaterial = new THREE.PointsMaterial({
	  color: Colors.yellow,
	  map: new THREE.TextureLoader().load('goldcoin.png'),
	  size: 0.05
	});
	particles = new THREE.Points( particleGeometry, particleMaterial);
	//scene.add( particles);
	particles.visible=false;
}

function addExplosionBad(){
	particleGeometryBad = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++){
		var vertex = new THREE.Vector3();
		particleGeometryBad.vertices.push( vertex);
	}
	var particleMaterial = new THREE.PointsMaterial({
	  color: Colors.red,
	   map: new THREE.TextureLoader().load('redcoin.png'),
	  size: 0.05
	});
	particlesBad = new THREE.Points( particleGeometryBad, particleMaterial);
	//scene.add( particlesBad);
	particlesBad.visible=false;
}

function updateFox(object){

	if (!gamefinished){

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
					
				}else if(currentLane==rightLane){
					currentLane=middleLane;
					
				}
				changedirection = false;
			}
  		}
  
  		if(controller.right){
  			if(changedirection){
				if(currentLane==middleLane){
					currentLane=rightLane;
					
			
				}else if(currentLane==leftLane){
					currentLane=middleLane;
					
				}
				changedirection = false;
			}
  		}
  		object.mesh.position.x = currentLane;
  		object.velocity += 0.4;// gravity
  		object.mesh.position.y -= object.velocity/4;
  		object.velocity *= 0.4;// friction
  		
  		if(object.mesh.position.y < camera.position.y-1){
    		object.mesh.position.y = camera.position.y-1;
    		object.velocity = 0.1;
  		}
	} else {
		Object.entries(fox).forEach(function([key,value]){
			if(key == 'mesh'){
				fox.mesh.children.forEach(function(d){
					if (d.name == 'legFR' ||d.name == 'legFL' ||d.name == 'legBR' || d.name == 'legBL' || d.name == 'body') d.rotation.set(0,0,0);
				});
			}
		});
		fox.mesh.rotation.y = Math.PI * 1.5;
		fox.mesh.position.x = rightLane;
		fox.mesh.position.z = 9;
		fox.mesh.position.y = 1.5;


    	game.style.visibility = "visible";	
    	game.innerHTML = "YOU WIN";
    	
    	var x = document.createElement("P");
    	var t = document.createTextNode("If you tame me, then we shall need each other. To me, you will be unique in all the world. To you, I shall be unique in all the world . . .");
		x.appendChild(t);
		game.appendChild(x);

	}
}

function addB612( pos_x, pos_y, pos_z){
	var sides=40;
	var tiers=40;
	
	var sphereGeometry = new THREE.SphereGeometry( planetRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial()
	sphereMaterial.map    = new THREE.TextureLoader().load('https://i.imgur.com/A9dmI0U.jpg');
	sphereMaterial.bumpScale = 0.05;
	
	
	b612 = new THREE.Mesh( sphereGeometry, sphereMaterial);
	b612.receiveShadow = true;
	b612.castShadow=false;
	b612.rotation.z=-Math.PI/2;
	b612.position.x= pos_x;
	b612.position.y= pos_y;
	b612.position.z= pos_z;
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

function insertBaobab(){
	var numTrees=40;
	var gap=6.28/36;
	for(var i=0;i<numTrees;i++){
		addObject(false,(i*1.5)+gap, true);
		addObject(false,(i*1.5)+gap, false);
	}
}

function addObject(inPath, row, isLeft){
	var element;
		
	if (finished){
		if(princePool.length==0)return;
			element=princePool.pop();

			element.visible=true;
			if (element.name == 'petitprince'){
				sphericalHelper.set( planetRadius-2.2, pathAngleValues[1], 9);
				element.position.setFromSpherical( sphericalHelper);
			}
			if (element.name == 'rose'){
				sphericalHelper.set(planetRadius+0.3, pathAngleValues[2], 9);
				element.position.setFromSpherical(sphericalHelper);
				element.scale.set(0.5,0.5,0.5);
			}
			elementsInPath.push(element);

			
	} else {

	    if(inPath){
		    if(elementPool.length==0)return;
		    element=elementPool.pop();
		    element.visible=true;
		    elementsInPath.push(element);
		    sphericalHelper.set( planetRadius+0.3, pathAngleValues[row], -b612.rotation.x+4);
	    }else{
		    element=createBaobab();
		    var forestAreaAngle=0;//[1.52,1.57,1.62];
		    if(isLeft){
			    forestAreaAngle=1.68+Math.random()*0.01;
		    }else{
			    forestAreaAngle=1.46-Math.random()*0.01;
		    }
		    sphericalHelper.set( planetRadius-0.3, forestAreaAngle, row);
	}
	element.position.setFromSpherical( sphericalHelper);
	var rollingGroundVector=b612.position.clone().normalize();
	var treeVector=element.position.clone().normalize();
	element.quaternion.setFromUnitVectors(treeVector,rollingGroundVector);
	element.rotation.x+=(Math.random()*(2*Math.PI/10))+-Math.PI/10;
	
	}
	b612.add(element);
}

function addInPath(){
	if(collected_coins < score1){
		var options=[0,1,2];
		var lane= Math.floor(Math.random()*3);
		addObject(true,lane);
		options.splice(lane,1);
		if(Math.random()>0.5){
			lane= Math.floor(Math.random()*2);
			addObject(true,options[lane]);
		} 
	} else {
		finished = true;
		addObject(true);
		addObject(true);
		
	}
}

function createBaobab(){
	var baobabGeometry = new THREE.TorusKnotGeometry( 0.4, 0.3, 50, 5);
	var baobabMaterial = new THREE.MeshStandardMaterial( { color: Colors.green,flatShading:THREE.FlatShading  });
	var baobabTop = new THREE.Mesh( baobabGeometry, baobabMaterial);
	baobabTop.castShadow=true;
	baobabTop.receiveShadow=false;
	baobabTop.position.y=2.6;
	baobabTop.rotation.y=(Math.random()*(Math.PI));
	var baobabTrunkGeometry = new THREE.CylinderGeometry( 0.18, 0.45,4);
	var trunkMaterial = new THREE.MeshStandardMaterial( { color: 0x886633,flatShading:THREE.FlatShading  });
	var baobabTrunk = new THREE.Mesh( baobabTrunkGeometry, trunkMaterial);
	baobabTrunk.position.y=0.25;
	var baobab =new THREE.Object3D();
	baobab.add(baobabTrunk);
	baobab.add(baobabTop);
	baobab.name = "baobab";	
	return baobab;
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
	rose.rotation.x += 11;
	rose.scale.set(0.5,0.5,0.5);
	return rose;
}

function createCoin(){
	var geometry = new THREE.CylinderGeometry( 0.3, 0.3, 0.05, 8);
	var material = new THREE.MeshBasicMaterial( {color: Colors.yellow});
	material.map = new THREE.TextureLoader().load('goldcoin.png')
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
	material.map  = new THREE.TextureLoader().load('redcoin.png'),
	material.bumpScale = 0.05;
	var badcoin = new THREE.Mesh( geometry, material);
	badcoin.position.x = 2;
	badcoin.position.y = 10;
	badcoin.name = "badcoin";
	return badcoin;
}

function onWindowResize(){
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function checkCollision(){
	var oneElement;
	var elementPosition = new THREE.Vector3();
	var elementsToRemove=[];
	elementsInPath.forEach( function ( element, index){
	oneElement=elementsInPath[ index ];
	elementPosition.setFromMatrixPosition(oneElement.matrixWorld);
	if(elementPosition.z>12 && oneElement.visible || collected_coins >= score1){//gone out of our view zone
		if (oneElement.name != 'petitprince' && oneElement.name!= 'rose')
			elementsToRemove.push(oneElement);
		else {
			if (oneElement.name == 'petitprince' || oneElement.name!= 'rose'){
				console.log("SONO STATO BECCATO", elementPosition.distanceTo(fox.mesh.position));
				if ((elementPosition.distanceTo(fox.mesh.position)) <= 4.45)
					gamefinished = true;
				}
		    }
	} else {	
		if( elementPosition.distanceTo(fox.mesh.position)<= 2.0){
			switch(currentLane){
			case 0:
				if(elementPosition.x - fox.mesh.position.x < 0.3 & elementPosition.x - fox.mesh.position.x > 0 & fox.mesh.position.y <= camera.position.y){
					
					if (oneElement.name == 'coin' ){
						collected_coins ++;
					}
					if (oneElement.name == 'badcoin' ){
						collected_coins --;
					}

					hasCollided=true;
					elementsToRemove.push(oneElement);
					explode(oneElement.name);}
					
					break;

				case 1:
					if(elementPosition.x - fox.mesh.position.x > 0.3 & elementPosition.x - fox.mesh.position.x < 0.5 & fox.mesh.position.y <= camera.position.y){
						//console.log(currentLane, elementPosition , fox.mesh.position);
						if (oneElement.name == 'coin' ){
							collected_coins ++;
							console.log("CASE 1 raccolgo!");
						} 
						if (oneElement.name == 'badcoin' ){
							collected_coins --;
						}

						hasCollided=true;
						elementsToRemove.push(oneElement);
						explode(oneElement.name);
					
					}
					break;

				case -1:		
					if(elementPosition.x - fox.mesh.position.x < 0 & fox.mesh.position.y <= camera.position.y){
						//console.log(currentLane, elementPosition , fox.mesh.position);
					
						if (oneElement.name == 'coin' ){
							collected_coins ++;
							console.log("CASE -1 raccolgo!");
						}	 
						if (oneElement.name == 'badcoin' ){
							collected_coins --;
						}
					
						hasCollided=true;
						elementsToRemove.push(oneElement);
						explode(oneElement.name);
					
				
					} 
					break;
				}
			} 
		}
	});
	if (start){
	scoreText = document.getElementById('score');
	scoreText.innerHTML = collected_coins;
	
	var fromWhere;
	elementsToRemove.forEach( function ( element, index){
		oneElement=elementsToRemove[ index ];
		fromWhere=elementsInPath.indexOf(oneElement);
		elementsInPath.splice(fromWhere,1);
		elementPool.push(oneElement);
		oneElement.visible=false;
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
    	game.innerHTML = "GAME OVER";
    }
}


function ExplosionCoin(){
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

function ExplosionBad(){
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

    if (!gamefinished){
    	b612.rotation.x += planetSpeed;
    	b612.children.forEach(function(child){
    		if (child.name == "coin" || child.name == "badcoin"){
    			child.rotation.z += 0.1;
    		}
    			
    		if (finished){ // faccio diventare visibili il piccolo principe e la volpe, cosi per concludere. 
    			if (child.name == "petitprince" || child.name == "rose"){
    				child.visible = true;
    			}
            }
        })
   }

    if(clock.getElapsedTime()>intervalElements){
    	clock.start();
    	if (!finished) addInPath();
    }
    checkCollision();
    ExplosionCoin();
    ExplosionBad();
}