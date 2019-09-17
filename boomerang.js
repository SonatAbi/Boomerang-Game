var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

var points = [];
var tPoints = [];
var images = [];
var keyArray = [];
var numTPoints = 200;
var computed = 0;
var gameState = 0;
var customCharMade = 0;
var spin = 0;
var score = 4;

var keyPressed = function() {
    keyArray[keyCode] = 1;
};
var keyReleased = function() {
    keyArray[keyCode] = 0;
};
var mousePressed = function() {
    if(gameState === 0){
        gameState = 1;
    }
};

points.push(new PVector(120, 380));  
points.push(new PVector(200, -350));
points.push(new PVector(250, 420));
//Hero Character
var throwerObj = function(x) {
    this.x = x;
    this.y = 364;
};
var customChar = function() {
	//custom character design
    customCharMade = 1;
    noStroke();
    background(255, 255, 255);
    fill(255,224,189);
    rect(280,190,20,30);
    rect(115,190,20,30);
    rect(135,50,150,125);
    fill(181, 104, 16);
    rect(135,20,150,50);
    rect(285,40,20,20);
    rect(135,70,20,20);
    fill(0, 0, 0);
    rect(180,90,10,10);
    rect(260,90,10,10);
    rect(200,130,40,10);
    fill(235, 9, 58);
    rect(135,173,80,80);
    rect(245,173,40,80);
    fill(255, 255, 255);
    rect(220,173,25,80);
    fill(102, 62, 6);
    rect(135,253,150,30);
    rect(155,283,30,40);
    rect(235,283,30,40);
    images.push(get(0,0,width,height));
};
throwerObj.prototype.draw = function() {
     image(images[0], this.x, this.y, 40, 40);
};

var hero = new throwerObj(50);
//Boomerang Object
var path;
var pos = 0;
var bgObj = function(x,y){
    this.x = x;
    this.y = y;
    this.thrown = 0;
    this.currCurve = 0;
    this.scr = 0;
};
bgObj.prototype.draw = function(){
    //drawing boomerang
     if(this.thrown === 0){
        fill(186, 136, 20);
        triangle(hero.x + 50,hero.y + 20, hero.x + 50,hero.y + 10,hero.x + 32,hero.y + 30);
        triangle(hero.x + 50,hero.y + 20, hero.x + 50,hero.y + 10,hero.x + 68,hero.y + 30);
        this.x = hero.x + 50;
        this.y = hero.y + 20;
     }
     else if(this.thrown === 1){
        if(this.currCurve === 0 ){
            path = tPoints;
            this.currCurve = 1;
        }
        pushMatrix();
        translate(this.x, this.y);
        rotate(spin);
        fill(186, 136, 20);
        triangle(0,0, 0,-10,-18,10);
        triangle(0,0, 0,-10,18,10);
        popMatrix();
     }
};
bgObj.prototype.move = function(){
    //throwing boomerang
    if(this.thrown === 1){
        if(pos < 200){
            this.x = path[pos].x;
            this.y = path[pos].y;
        }
        pos++;
    }
    if(pos > 200){
        this.thrown = 0; 
        pos = 0;
        this.currCurve = 0;
        this.scr = 0;
        this.x = hero.x + 50;
        this.y = hero.y + 20;
        spin = 0;
    }
};
var boomerang = new bgObj(0,0);
throwerObj.prototype.move = function(){
	//moving hero using arrows
    if (keyArray[LEFT] === 1) {
        if(this.x > -10){
            this.x = this.x - 2;
        }
    }
    if (keyArray[RIGHT] === 1) {
        if(this.x < 367){
            this.x = this.x + 2;
        }
    }
    if (keyArray[UP] === 1) {
        boomerang.thrown = 1;
        if(boomerang.scr === 0){
            score--;
            boomerang.scr = 1;
        }
        if(score === 0){
            gameState = 2;
        }
    }
    
};
//npc
var npc = function(x,y,dir){
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.fin = 0;
};
//drawing npc
npc.prototype.draw = function(){
    fill(0, 255, 0);
    triangle(this.x, this.y, this.x-10,this.y, this.x-12, this.y-5);
    triangle(this.x, this.y, this.x-10,this.y+2, this.x-8, this.y+5);
    triangle(this.x, this.y, this.x+10,this.y, this.x+12, this.y-5);
    triangle(this.x, this.y, this.x+10,this.y+2, this.x+8, this.y+5);
    fill(255, 0, 0);
    ellipse(this.x, this.y, 6, 4);
};
//npc movement
npc.prototype.move = function(){
    if(dist(boomerang.x, boomerang.y, this.x, this.y) < 80){
        if(boomerang.x > this.x && this.y > boomerang.y){//right top
            this.x--;
            this.y++;
        }
        else if(boomerang.x < this.x && this.y > boomerang.y){//left top
            this.x++;
            this.y++;
        }
        else if(boomerang.x < this.x && this.y < boomerang.y){//left bot
            this.x++;
            this.y--;
        }
        else if(boomerang.x > this.x && this.y > boomerang.y){//right bot
            this.x--;
            this.y--;
        }
    }
    else{
        if(this.dir === 0 && this.x > -15 && this.x < 415){
            this.x--;
        }
        else if(this.dir === 1 && this.x > -15 && this.x < 415){
            this.x++;
        }
        else{
            this.fin = 1;
        }

    }
};
var npc1 = new npc(20,200,1);
var npc2 = new npc(20,50,1);
var npc3 = new npc(380,300,0);
var npc4 = new npc(380,100,0);
//checking collisions
var checkCollision = function(){
    if(dist(hero.x+25, hero.y+20, boomerang.x, boomerang.y) < 25 && boomerang.scr === 1) {
        score++;
        boomerang.scr = 2;
    }
    if(dist(npc1.x, npc1.y, boomerang.x, boomerang.y) < 25) {
        npc1.x =  20;
    }
    if(dist(npc2.x, npc2.y, boomerang.x, boomerang.y) < 25) {
        npc2.x =  20;
    }
    if(dist(npc3.x, npc3.y, boomerang.x, boomerang.y) < 25) {
        npc3.x =  380;
    }
    if(dist(npc4.x, npc4.y, boomerang.x, boomerang.y) < 25) {
        npc4.x =  380;
    }
};
//calculating path for boomerang
var computeTPoints = function() {
    var t = 0;
    var stepSize = 1/numTPoints;
    var q = new PVector(0, 0);
    var r = new PVector(0, 0);
    for (var i = 0; i < numTPoints + 1; i++) {
        q.set(t*points[1].x+(1-t)*points[0].x, t*points[1].y+(1-t)*points[0].y); 
        r.set(t*points[2].x+(1-t)*points[1].x, t*points[2].y+(1-t)*points[1].y); 
        tPoints.push(new PVector(t*r.x+(1-t)*q.x, t*r.y+(1-t)*q.y));
        t += stepSize;
    }    
}; 
var drawArc = function() {
    stroke(0, 112, 0);
    fill(255, 0, 0);
    for (var i = 0; i < numTPoints; i++) {
        line(tPoints[i].x, tPoints[i].y, tPoints[i+1].x, tPoints[i+1].y);    
    }    
};    
//main draw function
var draw = function() {
    if(gameState === 0){
        if( customCharMade === 0){
            customChar();
        }
        background(134, 176, 67);
        fill(0, 0, 0);
        textSize(50);
        text("Boomerang", 65, 80);
        
        textSize(15);
        fill(255, 255, 255);
        text("Click mouse to begin", 130, 260);
        textSize(25);
        text("Instructions", 135, 150);
        textSize(15);
        text("Use arrow keys to move the hero", 85, 180);
        text("Up arrow key throw the boomerang", 75, 200);
    }
    else if(gameState === 1){
        background(255, 255, 255);
        hero.draw();
        hero.move();
        points[0].set(hero.x + 50,hero.y + 20);
        points[1].set(hero.x + 120,-350);
        points[2].set(hero.x + 170,420);
        computeTPoints();
        drawArc(); 
        npc1.draw();
        npc1.move();
        npc2.draw();
        npc2.move();
        npc3.draw();
        npc3.move();
        npc4.draw();
        npc4.move();
        boomerang.draw();
        boomerang.move();
        checkCollision();
        if(npc1.fin === 1 && npc2.fin === 1 && npc3.fin === 1 && npc4.fin === 1){
            gameState = 2;
        }
        if(boomerang.thrown === 1){
            spin = spin + Math.PI;
        }
        tPoints = [];
        text(score, 380, 15);
    }
    else if(gameState === 2){
        background(0, 0, 0);
        fill(255, 0, 0);
        textSize(50);
        text("GAME OVER", 45, 210);
    }
};


}};
