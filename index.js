
window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1050;
    canvas.height = 500;

//input
class InputHandler{
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown',e=>{
if((e.key === 'ArrowDown'
||e.key === 'ArrowUp'|| e.key=== 'ArrowLeft'|| e.key === 'ArrowRight' || e.key === ' ')
 && this.keys.indexOf(e.key) === -1){
    this.keys.push(e.key);
}else if(e.key === 'd') this.game.debug = !this.game.debug;
        });
        window.addEventListener('keyup',e=>{
            if(e.key === 'ArrowDown' ||
             e.key === 'ArrowUp'||
              e.key=== 'ArrowLeft'|| 
              e.key === 'ArrowRight' ||
               e.key === ' '){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }else if(e.key === 's'){
                this.game.player.shoot()
            }
       
        })
    }
}
//---------------------------------------------------
    class Game{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 5;
            this.background = new Background(this);
            this.player = new player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.particles = [];
            this.maxParticles = 50;
            this.lives = 3;
            this.floatingMassege = []
      this.enemies = [];
      this.collision = [];
      this.enemyTime = 0;
      this.enemyInterval = 3000;
      this.debug = false;
   this.Projectilepool=[];
  this. numOfprojecttiel=10;;
      this.time = 0;
      this.winningScore = 10;
      this.maxTime = 30000;
      this.gameOver = false;
      this.score = 0;
      this.fontColor = 'white';
this.player.currenState = this.player.states[0];
this.player.currenState.enter()
        }

        update(deltaTime){
          
    
  
        
    
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true
            this.background.update();
this.player.update(this.input.keys,deltaTime);
if(this.enemyTime > this.enemyInterval){
    this.addEnemy();
    this.enemyTime = 0;
}else{
    this.enemyTime += deltaTime;

}
    if(this.enemyTime > this.enemyInterval && !this.gameOver){
this.addEnemy();
this.enemyTime = 0
    }else{
        this.enemyTime += deltaTime;
    }

   
this.floatingMassege.forEach(masseg =>{
    masseg.update()
})
this.particles.forEach((partical,index) =>{
partical.update();
if(partical.markForDeletion) this.particles.splice(index,1);

});
if(this.particles.length > this.maxParticles) {
    this.particles.length =this.maxParticles
}

this.enemies.forEach(enemy=>{
    enemy.update(deltaTime);
    if (enemy.markForDeletion) this.enemies.splice(this.enemies.indexOf(enemy),1);
    


this.collision.forEach((collision,index) =>{
    collision.update(deltaTime);
    if(collision.markForDeletion) this.collision.splice(index,1);
   
})

});
        }
        draw(context){
            this.background.draw(context);
this.player.draw(context);

this.enemies.forEach(enemy=>{
    enemy.draw(context);

});
this.floatingMassege.forEach(masseg =>{
    masseg.draw(context)
})
this.particles.forEach(partical=>{
    partical.draw(context);

});


this.collision.forEach(collision=>{
    collision.draw(context);

});


this.UI.draw(context)

        }
        addEnemy(){
            if(this.speed >0 && Math.random()<0.5) this.enemies.push(new GroundEnemy(this));
           else if(this.speed >0) this.enemies.push(new ClimbingEnemy(this));
this.enemies.push(new FlyingEnemy(this));

        }
    }



//projectiles
class Projecttil {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = 3;
        this.free=true
        this.image = document.getElementById('proctlin');

    }

    update() {
      if(!this.free){
        this.y-=this.speed
      }
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);


    }
    start(){
        this.free=false
    }
    reset(){
        this.free=true
    }
}
//--------------

//player------------------------------------------------------------------------------------
class player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height-this.height-this.game.groundMargin;
        this.vy = 0;
        this.weigh = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame ;
        this.Projectiles = [];
        this.fps = 22;
        this.frameInteerval=1000/this.fps;
        this.frameTime = 0;
this.speed = 0;
this.maxSpeed = 10;
this.states = [new Siting(this.game),new RUNNING(this.game),new JUMPING(this.game),new FALLING(this.game),new Rolling(this.game),new Diving(this.game),new Hit(this.game)];
    }
    update(input,deltaTime){ 
        this.checkCollision();
        this.currenState.handelInput(input)
        this.x += this.speed;
        if(input.includes('ArrowRight') && this.currenState !== this.states[6]) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')&& this.currenState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if(this.x <0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        this.Projectiles.forEach(Projectile => {
            Projectile.update()
         
        });
 
        this.Projectiles = this.Projectiles.filter(Projectile => !Projectile.markedForDeletion);
       // this.x++;
       if(input.includes('ArrowUp') && this.onGround()) this.vy -= 20;
       this.y += this.vy;
       if(!this.onGround()) this.vy += this.weigh;
       else this.vy = 0;
       if(this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin
       if(this.frameTime > this.frameInteerval){
        this.frameTime = 0;
if(this.frameX < this.maxFrame) this.frameX++;
else this.frameX = 0;
       }else{
        this.frameTime += deltaTime;
       }
    }
    draw(context){
        this.Projectiles.forEach(Projectile => {
            Projectile.draw(context)
        });
if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height)
context.drawImage(this.image,this.frameX * this.width,this.frameY *this.height,this.width,this.height,this.x,this.y,this.width,this.height)
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state,speed){
        this.currenState = this.states[state];
        this.game.speed =this.game.maxSpeed*speed;
        this.currenState.enter()
    }
  
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
               enemy.markForDeletion = true;
               this.game.collision.push(new collisionAnimate(this.game,enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
               if(this.currenState === this.states[4] || this.currenState === this.states[5]){

                this.game.score++;
               this.game.floatingMassege.push(new FlotingMasseg('+1',enemy.x,enemy.y,150,50));
               }else{
                //
              
                this.game.score-=5
this.setState(4, 0);
this.game.lives--;
if(this.game.lives <= 0) this.game.gameOver = true;
               }
            }
        });
    }
    shoot(){
        if(this.game.ammo > 0){
            this.Projectiles.push(new Projecttil(this.game,this.x+80,this.y+10));
            this.game.ammo--;
        }

    }
    
}


//enemy
class Enemy{
    constructor(){
   
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTime = 0;
this.markForDeletion = false;
this.lives = 3;
this.score = this.lives
    }
    update(deltaTime){
this.x -= this.speedX + this.game.speed;
this.y += this.speedY;
if(this.frameTime > this.frameInterval){
    this.frameTime = 0;
    if(this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = 0;
}else{
    this.frameTime += deltaTime;

}
if(this.x + this.width <0) this.markForDeletion = true;
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height);
context.drawImage(this.image,this.frameX * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height)
    }
}
 class FlyingEnemy extends Enemy{
     constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random()*this.game.width;
        this.y =Math.random()*this.game.height *0.5;
        this.speedX= Math.random() +1;
        this.speedY = 0;
        this.maxFrame = 5;
this.image = document.getElementById('enemy_fly');
this.anglar = 0;
this.va = Math.random() * 0.1*0.1;

     }
     update(deltaTime){
        super.update(deltaTime);
this.anglar +=this.va;
this.y += Math.sin(this.anglar);
     }
}
 class GroundEnemy extends Enemy{
constructor(game){
    super();
this.game = game;
this.width = 60;
this.height = 87;
this.x = this.game.width;
this.y = this.game.height-this.height-this.game.groundMargin;
this.image = document.getElementById('enemy_plant');
this.speedX = 0;
this.speedY = 0;
this.maxFrame = 1;

}

}

 class ClimbingEnemy extends Enemy{
constructor(game){

    super();
    this.game = game;
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height *0.5;
    this.image = document.getElementById('enemy_spider');
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1: -1;
    this.maxFrame = 1;
}
update(deltaTime){
super.update(deltaTime);
}
draw(context){
super.draw(context);
//context.moveTo(this.x,0);
//context.lineTo(this.x+this.width/2,this.y+50);
//context.stroke()
}
}
//backaground
class Layer{
    constructor(game,width,height,speedModfire,image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModfire = speedModfire;
        this.image = image
        this.x = 0;
        this.y = 0;

    }
    update(){
if(this.x < -this.width) this.x = 0;
else this.x -= this.game.speed * this.speedModfire;

    }
    draw(context){
context.drawImage(this.image , this.x,this.y,this.width,this.height);
context.drawImage(this.image , this.x+ this.width,this.y,this.width,this.height);
    }
}

 class Background{
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1image = document.getElementById("layer1");
        this.layer2image = document.getElementById("layer2");
       // this.layer3image = document.getElementById("layer3");
        this.layer4image = document.getElementById("layer4");
        this.layer5image = document.getElementById("layer5");
        this.layer1 = new Layer(this.game,this.width,this.height,0,this.layer1image);
        this.layer2 = new Layer(this.game,this.width,this.height,0.2,this.layer2image);
        //this.layer3 = new Layer(this.game,this.width,this.height,1,this.layer3image);
        this.layer4 = new Layer(this.game,this.width,this.height,0.5,this.layer4image);
        this.layer5 = new Layer(this.game,this.width,this.height,1.9,this.layer5image);
        this.backgroundLayers = [this.layer1,this.layer2,/*this.layer3*/,this.layer4,this.layer5];
    }
    update(){
        this.backgroundLayers.forEach(layer=>{
            layer.update()
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer=>{
            layer.draw(context)
        })
    }
}
//collisinaniamtion
class collisionAnimate{
    constructor(game,x,y){
this.game = game;
this.image = document.getElementById('collisionanimate');
this.spriteWidth = 100;
this.spriteHeight = 90;
this.sizeModifire = Math.random() + 0.5;
this.width = this.spriteWidth * this.sizeModifire;
this.height = this.spriteHeight  * this.sizeModifire;
this.x = x - this.width * 0.5;
this.y = y - this.height * 0.5;
this.frameX = 0;
this.maxFrame = 4;
this.markForDeletion = false;
this.fps = 3;
this.frameInterval = 1000/this.fps;
this.frameTime = 0;
    }
    draw(context){
        context.drawImage(this.image,this.frameX * this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);

    }
    update(deltaTime){
        this.x -= this.game.speed;
        if(this.frameTime > this.frameInterval){
            this.frameX++;
            this.frameTime = 0;
        }else{
            this.frameTime += deltaTime
        }
     
        if(this.frameX > this.maxFrame) this.markForDeletion = true;
      
    }
}
//flotingmasseg
class FlotingMasseg{
    constructor(value,x,y,targetX,targetY){
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markForDeletion = false;
        this.timer =0; 
    }
    update(){
this.x +=(this.targetX-this.x) * 0.03;
this.y +=(this.targetY - this.y) * 0.03;
this.timer++
if(this.timer > 100) this.markForDeletion = true; 
    }
    draw(context){
        context.font ='20px  Creepster';
        context.fillStyle = 'black';
        context.fillText(this.value,this.x,this.y)

    }
}
//playerstat

const states = {
    SITTING: 2,
    RUNNING: 1,
JUMPING:2,
FALLING:3,
ROLLING:4,
DIVING:5,
HIT:6,
}

class State{
    constructor(state,game){
        this.state = state;
        this.game = game;
    }
}

 class Siting extends State{

    constructor(game){
        super('SITTING',game);
        
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame =4;
        this.game.player.frameY = 5;

    }
    handelInput(input){
if(input.includes('ArrowLet')|| input.includes('ArrowRight')){
    this.game.player.setState(states.RUNNING,1);
}else if(input.includes(' ')){
    this.game.player.setState(states.ROLLING,2)
}
    }
}



 class RUNNING extends State{
    constructor(game){
        super('RUNNING',game);
        
    }
    enter(){

        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
this.game.player.frameY = 3;
    }
    handelInput(input){
        this.game.particles.unshift(new Dust(this.game,this.game.player.x + this.game.player.width * 0.6,this.game.player.y+this.game.player.height))
if(input.includes('ArrowDown')){
    this.game.player.setState(states.SITTING,0)
}else if (input.includes('ArrowUp')){
    this.game.player.setState(states.JUMPING,1)
}else if(input.includes(' ')){
    this.game.player.setState(states.ROLLING,2)
}
    }
}




 class JUMPING extends State{
    constructor(game){
        super('JUMPING',game);
      
    }
    enter(){
        if(this.game.player.onGround()) this.vy -=27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
this.game.player.frameY = 1;
    }
    handelInput(input){
if(this.game.player.vy > this.game.player.weigh){
    this.game.player.setState(states.FALLING,1)
}else if(input.includes(' ')){
    this.game.player.setState(states.ROLLING,2)
} else if(input.includes('ArrowDown')){
    this.game.player.setState(states.DIVING,0)
}
    }
}





 class FALLING extends State{
    constructor(game){
        super('FALLING',game);
        
    }
    enter(){
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;

this.game.player.frameY = 2;
    }
    handelInput(input){
if(this.game.player.onGround()){
    this.game.player.setState(states.RUNNING,1)
}else if(input.includes('ArrowDown')){
    this.game.player.setState(states.DIVING,0)
}
    }
}





 class Rolling extends State{
    constructor(game){
        super('ROLLING',game);
        
    }
    enter(){
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 0;
this.game.player.frameY = 6;
this.game.player.vy = 15;
    }
    handelInput(input){
        this.game.particles.unshift(new Fire(this.game,this.game.player.x + this.game.player.width * 0.5,this.game.player.y+this.game.player.height*0.5))
if(!input.includes(' ') && this.game.player.onGround()){
    this.game.player.setState(states.RUNNING,1)
}
else if(!input.includes(' ') && !this.game.player.onGround()){
    this.game.player.setState(states.FALLING,1)
} else if(input.includes(' ') && input.includes('ArrowUp') && this.game.player.onGround()){
    this.game.player.vy -= 7;
}else if(input.includes('ArrowDown')&& !this.game.player.onGround()){
    this.game.player.setState(states.DIVING,0)
}
    }
}


class Diving  extends State{
    constructor(game){
        super('DIVING',game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.vy = 15;
    }
    handelInput(input){
        this.game.particles.unshift(new Fire(this.game,this.game.player.x + this.game.player.width * 0.5 ,this.game.player.height * 0.5));
        if(this.game.player.onGround()){
            this.game.player.setState(states.RUNNING,1);
            for(let i = 0; i < 30;i++){
                this.game.particles.unshift(new Splash(this.game,this.game.player.x,this.game.player.y))
            }
        
        }else if(input.includes(' ') && this.game.player.onGround()){
            this.game.player.setState(states.ROLLING,2)
        }
    }
}



 class Hit extends State{
    constructor(game){
        super('HIT',game);
        
    }
    enter(){
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 10;
this.game.player.frameY = 5;
    }
    handelInput(input){
      
if(this.game.player.frameX >= 10 && this.game.player.onGround()){
    this.game.player.setState(states.RUNNING,1);
   
}
else if(this.game.player.frameX >= 10 && !this.game.player.onGround()){
    this.game.player.setState(states,FALLING,1)
}
}
}


//ui
class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 50;
        this.fontFamily = 'Helvetica';
        this.livesImage = document.getElementById('lives')
    }
    draw(context){
        context.save()
context.font = this.fontSize = 'px ' + this.fontFamily;
context.textAlign = 'left';
context.fillStyle = this.game.fontColor;
context.fillText('Score:' + this.game.score,20,50);
context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
context.fillText('TIME:' +( this.game.time * 0.001).toFixed(1),20,80);
for(let i = 0;i < this.game.lives; i++ ){
    context.drawImage(this.livesImage,25*i+20,95,25,25);
}

if(this.game.gameOver){
    context.textAlign = 'center';
    
context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
//score ned to win 
if(this.game.score > this.game.winningScore){

    context.fillText('GO TO WIN',this.game.width *0.5,this.game.height * 0.5-20);
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
    context.fillText('DUMBY ',this.game.width *0.5,this.game.height * 0.5+20)
    }else{
        
    context.fillText('ALWAYS DUMBY',this.game.width *0.5,this.game.height * 0.5-20);
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
    context.fillText('YOU ARE BROCKEN ❌',this.game.width *0.5,this.game.height * 0.5+20)
    }
        }
    }
}
//partical
class Partical {
    constructor(game){
this.game = game;
this.markForDeletion = false;
    }
    update(){
        this.x -= this.speedX +  this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if(this.size < 0.5) this.markForDeletion = true; 
    }
 }

 class Dust extends Partical {
constructor(game,x,y){
super(game);
this.size = Math.random() * 10+10;
this.x = x;
this.y = y;
this.speedX  =Math.random();
this.speedY = Math.random();
this.color = 'gray'
};
draw(context){
context.beginPath();
context.arc(this.x,this.y,this.size,0,Math.PI * 2);
context.fillStyle = this.color;
context.fill() 
}
 }

 
 class Splash extends Partical {
    constructor(game,x,y){
        super(game);
        this.size = Math.random() * 100 + 100;
        this.x = x;
        this.speedX = Math.random() * 6 -5;
        this.speedY = Math.random() * 2+2;
        this.gravity = 0;
        this.image = document.getElementById('fire');
    }
    update(){
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity
    }
    draw(context){
context.drawImage(this.image,this.x,this.y,this.size,this.size)
    }
 }

 
 class Fire extends Partical {
    constructor(game,x,y){
        super(game)
this.image = document.getElementById('fire');
this.size = Math.random() * 70 + 40;
this.x = x;
this.y = y;
this.speedX = 1;
this.speedY = 1;
this.angel = 0;
this.va = Math.random()  *0.2 - 0.1;
    }
    update(){
        super.update();
        this.angel += this.va;
        this.x += Math.sin(this.angel * 5)
    }
    draw(context){
        context.save();
        context.translate(this.x,this.y);
        context.rotate(this.angel);
    context.drawImage(this.image,-this.size * 0.5,-this.size * 0.5,this.size,this.size);
        context.restore();
    }
 }
//---------------------------------------------------------------------------------------

const game = new Game(canvas.width,canvas.height);
let lastTime = 5;
function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    //console.log(deltaTime);
    lastTime = timeStamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
   if(!game.gameOver) requestAnimationFrame(animate);
}
animate(0);

});




























