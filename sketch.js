var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameover=loadImage("gameOver.png");
  restartimg=loadImage("restart.png");
  jump=loadSound("jump.mp3");
  checkpoint=loadSound("checkpoint.mp3");
  die=loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-170,20,50);
  trex.addAnimation("runimg", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.7;
  trex.debug=false;
  trex.setCollider("circle",0,0,50);
  
  ground = createSprite(width/2,height-100,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-90,width,10);
  invisibleGround.visible = false;

  gameOver=createSprite(width/2,height/2)
  gameOver.addImage(gameover);
  gameOver.scale=1;
  restart=createSprite(width/2,height/2+70);
  restart.addImage(restartimg);
  restart.scale=0.5;
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  textSize(25);
  text("Score: "+ score, 50,50);
 
  
  if(gameState === PLAY){
    gameOver.visible=false;
    restart.visible=false;
    //move the ground
    ground.velocityX = -(4+score/100);
    score = score + Math.round(getFrameRate()/60);
    if(touches.length>0||keyDown("space")&& trex.y >= height-150) {
      trex.velocityY = -13;
      jump.play()
      touches=[]
    }
    
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 400){
      ground.x = width/2;
    }
    if(score%500===0&&score>0){
      checkpoint.play()
    }
    //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
  spawnObstacles();
    if(trex.isTouching(obstaclesGroup)){
      die.play()
        gameState=END;
    }
  }
  else if(gameState === END){
    gameOver.visible=true;
    restart.visible=true;
    //stop the ground
    ground.velocityX = 0;
    trex.velocityY=0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    trex.changeAnimation("collided")
    if(mousePressedOver(restart)){
      reset () 
    }
  }
  
  
  trex.collide(invisibleGround);
 
  
  console.log(getFrameRate())
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(width,height-120,10,40);
   obstacle.velocityX = -(4+score/100);

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 500;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(10,height/2-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}
function reset() {
  gameState=PLAY
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  score=0;
  trex.changeAnimation("runimg")
}