let blobs = [], numBlobs = 6, t = 0;
let lampX, lampY, lampH, glassH, lampW, STEPS = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,360,100,100,100);
  noStroke();

  lampX=width/2;
  lampY=height/2;
  lampH=min(height*0.7,500);
  glassH=lampH*0.8;
  lampW=min(width*0.25,220);

  for (let i=0;i<numBlobs;i++) blobs.push(new BlobShape());
}

function draw() {
  background(220,60,5);
  drawLampBaseCap();
  drawLampGlass();
  drawBlobs();
  t+=0.01;
}

function lampTopY(){return lampY-glassH/2;}
function lampBottomY(){return lampY+glassH/2;}

function lampRadius(t){
  if(t<0.15)      return lerp(0.20,0.30,t/0.15);
  else if(t<0.5)  return lerp(0.30,0.50,(t-0.15)/0.35);
  else if(t<0.85) return lerp(0.50,0.32,(t-0.5)/0.35);
  else            return lerp(0.32,0.22,(t-0.85)/0.15);
}

// clipping
function applyClip(){
  let top=lampTopY(), bot=lampBottomY();
  drawingContext.save(); drawingContext.beginPath();
  for(let i=0;i<=STEPS;i++){
    let h=i/STEPS, y=lerp(top,bot,h), r=lampRadius(h)*lampW;
    let x=lampX-r;
    if(i===0)drawingContext.moveTo(x,y); else drawingContext.lineTo(x,y);
  }
  for(let i=STEPS;i>=0;i--){
    let h=i/STEPS, y=lerp(top,bot,h), r=lampRadius(h)*lampW;
    drawingContext.lineTo(lampX+r,y);
  }
  drawingContext.closePath(); drawingContext.clip();
}

function unclip(){ drawingContext.restore(); }

// blobs
class BlobShape{
  constructor(){ this.reset(true); }

  reset(rnd=false){
    let top=lampTopY(), bot=lampBottomY();
    this.y = rnd? random(lerp(top,bot,.3), lerp(top,bot,.9)) : bot+random(10,40);
    this.x = lampX + random(-lampW*.15, lampW*.15);
    this.baseR = random(lampW*.18, lampW*.32);
    this.wobble = this.baseR*.4;
    this.speed = random(.4,1.1);
    this.seed = random(1000);
    this.hue = random(10,30);
  }

  update(){
    this.y -= this.speed;
    if(this.y < lampTopY()-this.baseR) this.reset(false);
  }

  show(){
    fill(this.hue,90,100,90);
    beginShape();
    for(let i=0;i<STEPS;i++){
      let a = map(i,0,STEPS,0,TWO_PI);
      let n = noise(this.seed+cos(a)*.7, this.seed+sin(a)*.7, t);
      let r = this.baseR + map(n,0,1,-this.wobble,this.wobble);

      let px = this.x + cos(a)*r;
      let py = this.y + sin(a)*r;

      let h = constrain((py-lampTopY())/(lampBottomY()-lampTopY()),0,1);
      let maxR = lampRadius(h)*lampW;
      px = lampX + constrain(px-lampX,-maxR,maxR);

      vertex(px,py);
    }
    endShape(CLOSE);
  }
}

function drawBlobs(){
  applyClip();
  for (let b of blobs){ b.update(); b.show(); }
  unclip();
}
// glass shape 
function drawLampGlass(){
  fill(220,40,30,70);
  beginShape();
  for(let i=0;i<=STEPS;i++){
    let h=i/STEPS, y=lerp(lampTopY(),lampBottomY(),h), r=lampRadius(h)*lampW;
    vertex(lampX-r, y);
  }
  for(let i=STEPS;i>=0;i--){
    let h=i/STEPS, y=lerp(lampTopY(),lampBottomY(),h), r=lampRadius(h)*lampW;
    vertex(lampX+r, y);
  }
  endShape(CLOSE);
}
function drawLampBaseCap(){
  rectMode(CENTER);
  fill(0,0,25);
  let baseH = lampH*.12;
  rect(lampX, lampBottomY()+baseH*.7, lampW*1.2, baseH, 10);
  
  fill(0,0,30);
  let capH = lampH*.1;
  rect(lampX, lampTopY()-capH*.7, lampW*.7, capH, 10);
}
